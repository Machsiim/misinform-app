# app.py
from __future__ import annotations

import os
import json
import time
from pathlib import Path
from typing import Optional, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from jinja2 import Environment, FileSystemLoader, select_autoescape, TemplateNotFound
from pydantic import BaseModel, Field
from openai import OpenAI
import uvicorn

# ========= Paths & Jinja =========
BASE_DIR = Path(__file__).resolve().parent
JINJA_DIR = BASE_DIR / "templates" / "empty"     # deine .jinja.html templates
STUBS_DIR = BASE_DIR / "templates" / "jsons"     # deine master-JSON stubs

env = Environment(
    loader=FileSystemLoader(str(JINJA_DIR)),
    autoescape=select_autoescape(["html", "xml"]),
    enable_async=False,
)

# ========= FastAPI =========
app = FastAPI(title="misinform.app – Article Generator & Renderer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in prod einschränken
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========= Template Mapping =========
TEMPLATES: Dict[int, Dict[str, str]] = {
    1: {"key": "buzzfeed", "jinja": "buzzfeed.jinja.html", "stub": "buzzfeed-master.json"},
    2: {"key": "journal",  "jinja": "journal.jinja.html",  "stub": "journal-master.json"},
    3: {"key": "modern",   "jinja": "modern.jinja.html",   "stub": "modern-master.json"},
}

# ========= OpenAI Client =========
def get_client() -> OpenAI:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set.")
    return OpenAI(api_key=api_key)

# ========= Prompt Template (LLM) =========
PROMPT_TMPL = """Fill out this JSON template completely. Keep all keys and their structure exactly the same — only replace the values.
Write realistic, science-like academic content in a formal scholarly tone.
The headline and the content should fit the topic: "{topic}".
The text must be in English.
Return only the pure JSON without explanations, comments, or Markdown formatting.

Return the JSON exactly in the same formatting, indentation, and multi-line layout as the example above.
Keep all line breaks and spaces exactly the same as in the template.
Do not output in a single line.
Output nothing except the JSON.

{json_template}
"""

# ========= Utilities =========
def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cannot read file {path.name}: {e}")

def _extract_first_json(text: str) -> str:
    """
    Find the first top-level balanced JSON object within text.
    Handles strings and escapes so braces inside strings won't break parsing.
    """
    in_string = False
    escape = False
    depth = 0
    start_idx = -1

    for i, ch in enumerate(text):
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue

        if ch == '"':
            in_string = True
            continue
        if ch == "{":
            if depth == 0:
                start_idx = i
            depth += 1
            continue
        if ch == "}":
            if depth > 0:
                depth -= 1
                if depth == 0 and start_idx != -1:
                    candidate = text[start_idx : i + 1]
                    # validate
                    json.loads(candidate)
                    return candidate
    # if whole text is pure JSON, try once more
    try:
        json.loads(text)
        return text
    except Exception:
        raise ValueError("No valid JSON object found in model output.")

def llm_fill_stub(
    *, topic: str, stub_text: str, model: Optional[str] = None, temperature: float = 0.7, retries: int = 2
) -> Dict[str, Any]:
    """
    Calls OpenAI to fill the given JSON stub with content.
    Returns a Python dict.
    """
    prompt = PROMPT_TMPL.format(topic=topic, json_template=stub_text)
    chosen_model = model or os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    client = get_client()

    last_err: Optional[Exception] = None
    for attempt in range(retries + 1):
        try:
            resp = client.responses.create(
                model=chosen_model,
                input=prompt,
                temperature=temperature,
            )
            raw = resp.output_text
            json_str = _extract_first_json(raw)
            return json.loads(json_str)
        except Exception as e:
            last_err = e
            if attempt < retries:
                # simple exponential backoff
                time.sleep(0.8 * (2 ** attempt))
            else:
                raise HTTPException(status_code=502, detail=f"Model error: {e}") from e
    # unreachable
    raise HTTPException(status_code=502, detail=f"Model error: {last_err}")

def render_html(tpl_name: str, context: Dict[str, Any]) -> str:
    try:
        tpl = env.get_template(tpl_name)
    except TemplateNotFound:
        raise HTTPException(status_code=500, detail=f"Template not found: {tpl_name}")
    try:
        return tpl.render(**context)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Render error: {e}")

# ========= Schemas =========
class AIGenerateRequest(BaseModel):
    template_id: int = Field(..., ge=1, le=3, description="1=buzzfeed, 2=journal, 3=modern")
    topic: str = Field(..., min_length=3, description="The headline/topic in English")
    model: Optional[str] = Field(default=None, description="Override default model (optional)")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)

# ========= Routes =========
@app.get("/", response_class=PlainTextResponse)
def root() -> str:
    return "OK – POST /ai/articles or /ai/render"

@app.post("/ai/articles", response_class=JSONResponse)
def ai_articles(req: AIGenerateRequest):
    t = TEMPLATES.get(req.template_id)
    if not t:
        raise HTTPException(status_code=400, detail="Unknown template_id")
    stub_text = read_text(STUBS_DIR / t["stub"])
    data = llm_fill_stub(topic=req.topic, stub_text=stub_text, model=req.model, temperature=req.temperature)

    return {
        "template": {
            "id": req.template_id,
            "key": t["key"],
            "jinja_template": t["jinja"],
            "render_endpoint": f"/ai/render",
        },
        "json": data,
    }

@app.post("/ai/render", response_class=HTMLResponse)
def ai_render(req: AIGenerateRequest):
    t = TEMPLATES.get(req.template_id)
    if not t:
        raise HTTPException(status_code=400, detail="Unknown template_id")
    stub_text = read_text(STUBS_DIR / t["stub"])
    data = llm_fill_stub(topic=req.topic, stub_text=stub_text, model=req.model, temperature=req.temperature)
    html = render_html(t["jinja"], data)
    return HTMLResponse(content=html, media_type="text/html")

# ========= Main =========
if __name__ == "__main__":
    # Start with:  export OPENAI_API_KEY="sk-..." ; python app.py
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
