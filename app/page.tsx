export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Alex and Finn, home">
          Alex <span aria-hidden="true">&amp;</span> Finn
        </a>

        <p className="since">
          <span className="status-dot" aria-hidden="true" />
          Working together since 2014
        </p>
      </header>

      <section className="intro" id="top" aria-labelledby="intro-heading">
        <h1 id="intro-heading">
          We build
          <br />
          software.
        </h1>

        <div className="intro-copy">
          <p>
            We’re Alex and Finn, two software builders who design and develop
            thoughtful digital products—from first idea to finished thing.
          </p>

          <a className="contact-link" href="mailto:alexandfinn@karugamo.agency">
            <span>Work with us</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <p>Independent software studio</p>
        <a
          href="https://twitter.com/alex_and_finn"
          target="_blank"
          rel="noreferrer"
          aria-label="Alex and Finn on X (opens in a new tab)"
        >
          X / Twitter <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </main>
  );
}
