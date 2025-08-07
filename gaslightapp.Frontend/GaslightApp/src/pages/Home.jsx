import { CheckCircle, Zap, BookOpen } from "lucide-react";

// Reusable UI
function Button({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={`bg-white text-purple-700 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-purple-100 transition ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className }) {
  return (
    <div
      className={`rounded-xl bg-white shadow-md hover:shadow-xl transform hover:scale-[1.02] transition ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white flex flex-col">
      {/* Hero */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
          Gaslight App
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow">
          Erfinde überzeugende Fake-Artikel, um deine Freunde im Spaß zu
          verwirren – mit pseudowissenschaftlichem Glanz.
        </p>
        <Button className="mt-8">
          Fake-Artikel generieren
        </Button>
      </header>

      {/* Steps */}
      <section className="bg-white text-gray-900 py-20 px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          So funktioniert's
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardContent className="text-center">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">1. Fakt eingeben</h3>
              <p>Tippe irgendetwas ein – je absurder, desto besser.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <BookOpen className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">2. Template wählen</h3>
              <p>Wähle aus einem „seriösen“ Institut-Layout.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                3. Gaslight genießen
              </h3>
              <p>Teile den Link und sieh zu, wie Verwirrung entsteht.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Warum Gaslight App?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Täuschend echt",
              desc: "Unsere Artikel sehen aus, als kämen sie direkt von der Uni.",
            },
            {
              title: "Quellen aus dem Nichts",
              desc: "Wir erfinden Quellen, die keiner nachprüfen kann.",
            },
            {
              title: "Wissenschaftlich unhaltbar",
              desc: "Aber es klingt so überzeugend, dass du selbst zweifelst.",
            },
          ].map((f, i) => (
            <Card key={i}>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p>{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto text-sm">
        © {new Date().getFullYear()} Gaslight App – Alles nur Spaß.
      </footer>
    </div>
  );
}
