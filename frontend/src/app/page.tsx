export default function Page() {
  return (
    <main className="product-page">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">ShinonLLM</p>
          <h1>Ein lokales LLM-System, das planbar statt zufaellig arbeitet.</h1>
          <p className="lead">
            Wir bauen eine robuste KI-Laufzeit fuer echte Anwendungsfaelle: klare Antworten,
            nachvollziehbarer Ablauf und reproduzierbare Ergebnisse.
          </p>
          <div className="hero__actions">
            <a href="#plan">Unser Plan</a>
            <a href="https://github.com/Vannon0911/ShinonLLM/blob/main/docs/MANUAL.md">Zum Manual</a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <img src="/concept-vision.svg" alt="" />
        </div>
      </section>

      <section id="intro" className="section">
        <h2>Einfuehrung</h2>
        <p>
          ShinonLLM ist als produktiver Begleiter gedacht: lokal betreibbar, kontrollierbar und
          Schritt fuer Schritt erweiterbar. Fokus ist ein verlässlicher Kern statt schneller
          Showeffekte.
        </p>
        <p className="note">
          Hinweis: Das README dient nicht als Source of Truth. Verbindlich sind
          `LLM_ENTRY.md`, das Manual in `docs/` und die Validierungs-Gates.
        </p>
      </section>

      <section id="plan" className="section">
        <h2>Was wir planen</h2>
        <ul>
          <li>Ein konsistentes Produktverhalten ueber alle Eingaben hinweg.</li>
          <li>Eine klare Nutzerfuehrung von Anfrage bis Antwort.</li>
          <li>Ein Setup, das lokal stabil laeuft und sauber deploybar bleibt.</li>
        </ul>
      </section>

      <section id="have" className="section">
        <h2>Was wir haben</h2>
        <ul>
          <li>Deterministische Validierungs-Gates fuer Kernablaeufe.</li>
          <li>Backend-Routen fuer Health-Checks und Chat-Flows.</li>
          <li>Eine Frontend-Basis als Produktoberflaeche.</li>
        </ul>
      </section>

      <section id="missing" className="section">
        <h2>Was noch fehlt</h2>
        <ul>
          <li>Feinschliff fuer Live-Modellbetrieb mit echter Modell-Strategie.</li>
          <li>Produktisierte Nutzerpfade fuer Onboarding und Sessions.</li>
          <li>Klares Release-Ritual mit sichtbaren Qualitaetsmetriken.</li>
        </ul>
      </section>

      <section id="about" className="section section--about">
        <h2>Ueber mich</h2>
        <p>
          Ich baue ShinonLLM als lernendes Produkt mit hohem Anspruch an Struktur,
          Nachvollziehbarkeit und Qualitaet. Ziel ist kein Demo-Feuerwerk, sondern ein System,
          dem man im Alltag vertrauen kann.
        </p>
      </section>
    </main>
  );
}
