// ===== Banner promozione: -10% con l'iscrizione alla newsletter =====
// Per usarlo in una pagina basta aggiungere prima di </body>:
//   <script src="promo.js"></script>
(function () {
  // ---- Impostazioni: modifica qui ----
  const SCONTO = '10%';
  const CODICE = 'BENVENUTO10';   // metti il codice sconto vero creato nel tuo e-commerce
  const RITARDO_SECONDI = 5;      // dopo quanto compare il banner
  const RIPROPONI_DOPO_GIORNI = 7; // se viene chiuso, quando riproporlo
  const FOTO = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80&auto=format&fit=crop';

  // ---- Memoria del browser (se è bloccata il banner funziona lo stesso) ----
  function leggi(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function scrivi(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  const iscritto = leggi('promo-iscritto') === '1';
  const chiusoIl = Number(leggi('promo-chiuso-il') || 0);
  const daPoco = Date.now() - chiusoIl < RIPROPONI_DOPO_GIORNI * 86400000;
  if (iscritto) return;

  // ---- Stile ----
  const css = `
  .promo { position: fixed; right: 24px; bottom: calc(24px + env(safe-area-inset-bottom, 0px)); z-index: 50; width: min(420px, calc(100vw - 32px)); background: #F4EFE6; color: #1E1B18; box-shadow: 0 24px 60px rgba(30,27,24,0.28); font-family: 'Jost', 'Futura', system-ui, sans-serif; opacity: 0; transform: translateY(40px); pointer-events: none; transition: opacity 500ms ease, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1); }
  .promo.aperto { opacity: 1; transform: none; pointer-events: auto; }
  .promo-foto { height: 150px; overflow: hidden; position: relative; }
  .promo-foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .promo-badge { position: absolute; left: 20px; bottom: -28px; width: 72px; height: 72px; border-radius: 50%; background: #8A3F25; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Bodoni Moda', Georgia, serif; font-size: 22px; }
  .promo-chiudi { position: absolute; top: 8px; right: 8px; width: 44px; height: 44px; border: 0; border-radius: 22px; background: rgba(244,239,230,0.9); color: #1E1B18; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .promo-chiudi:hover { background: #fff; }
  .promo-corpo { padding: 44px 28px 28px; display: flex; flex-direction: column; gap: 12px; }
  .promo-occhiello { font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; color: #8A3F25; }
  .promo h2 { margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-weight: 400; font-size: 32px; line-height: 1.1; }
  .promo p { margin: 0; font-size: 15px; line-height: 1.6; color: #4A443D; }
  .promo form { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
  .promo label { font-size: 13px; font-weight: 500; }
  .promo-campo { display: flex; gap: 8px; }
  .promo input { flex: 1; min-width: 0; height: 48px; padding: 0 14px; border: 1px solid #8C8174; background: #FBF8F2; font-size: 16px; font-family: inherit; border-radius: 2px; }
  .promo form button { height: 48px; padding: 0 20px; border: 0; background: #1E1B18; color: #F4EFE6; font-size: 15px; font-weight: 500; font-family: inherit; border-radius: 2px; cursor: pointer; }
  .promo form button:hover { background: #8A3F25; }
  .promo-nota { font-size: 12px; color: #5E574E; }
  .promo-codice { display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 1px dashed #8A3F25; padding: 14px 16px; margin-top: 4px; }
  .promo-codice strong { font-size: 20px; letter-spacing: 0.12em; }
  .promo-codice button { height: 40px; padding: 0 16px; border: 1px solid #1E1B18; background: transparent; font-family: inherit; font-size: 14px; cursor: pointer; border-radius: 2px; }
  .promo-linguetta { position: fixed; left: 20px; bottom: calc(20px + env(safe-area-inset-bottom, 0px)); z-index: 49; height: 48px; padding: 0 20px; border: 0; border-radius: 24px; background: #8A3F25; color: #fff; font-family: 'Jost', system-ui, sans-serif; font-size: 15px; font-weight: 500; box-shadow: 0 10px 30px rgba(30,27,24,0.25); cursor: pointer; opacity: 0; transform: translateY(20px); pointer-events: none; transition: opacity 400ms, transform 400ms; }
  .promo-linguetta.visibile { opacity: 1; transform: none; pointer-events: auto; }
  .promo-linguetta:hover { background: #6E3019; }
  @media (max-width: 520px) {
    .promo { right: 16px; bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
    .promo-foto { height: 110px; }
    .promo-corpo { padding: 40px 20px 20px; }
    .promo h2 { font-size: 27px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .promo, .promo-linguetta { transition: none; }
  }`;
  const stile = document.createElement('style');
  stile.textContent = css;
  document.head.appendChild(stile);

  // ---- Banner ----
  const banner = document.createElement('aside');
  banner.className = 'promo';
  banner.setAttribute('aria-label', 'Promozione newsletter');
  banner.setAttribute('aria-hidden', 'true');
  banner.innerHTML = `
    <div class="promo-foto">
      <img src="${FOTO}" alt="">
      <div class="promo-badge">-${SCONTO}</div>
      <button class="promo-chiudi" type="button" aria-label="Chiudi">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="promo-corpo">
      <div class="promo-occhiello">Benvenuta, benvenuto</div>
      <h2>${SCONTO} di sconto sul tuo primo ordine</h2>
      <p>Iscriviti alla newsletter: ricevi subito il codice e, una volta al mese, nuove collezioni e anteprime riservate.</p>
      <form novalidate>
        <label for="promo-email">Indirizzo email</label>
        <div class="promo-campo">
          <input id="promo-email" type="email" placeholder="nome@esempio.it" autocomplete="email" required>
          <button type="submit">Voglio lo sconto</button>
        </div>
        <div class="promo-nota" aria-live="polite">Niente spam. Puoi cancellarti quando vuoi.</div>
      </form>
    </div>`;
  document.body.appendChild(banner);

  const linguetta = document.createElement('button');
  linguetta.className = 'promo-linguetta';
  linguetta.type = 'button';
  linguetta.textContent = '-' + SCONTO + ' sul primo ordine';
  document.body.appendChild(linguetta);

  function apri() {
    banner.classList.add('aperto');
    banner.setAttribute('aria-hidden', 'false');
    linguetta.classList.remove('visibile');
  }
  function chiudi() {
    banner.classList.remove('aperto');
    banner.setAttribute('aria-hidden', 'true');
    if (leggi('promo-iscritto') !== '1') linguetta.classList.add('visibile');
    scrivi('promo-chiuso-il', String(Date.now()));
  }

  banner.querySelector('.promo-chiudi').addEventListener('click', chiudi);
  linguetta.addEventListener('click', apri);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && banner.classList.contains('aperto')) chiudi();
  });

  // ---- Iscrizione (da collegare al tuo servizio email, es. Mailchimp o Brevo) ----
  const form = banner.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = form.querySelector('input');
    const nota = form.querySelector('.promo-nota');
    if (!input.checkValidity() || !input.value) {
      nota.textContent = 'Controlla l’indirizzo email.';
      nota.style.color = '#8A3F25';
      input.focus();
      return;
    }
    scrivi('promo-iscritto', '1');
    const corpo = banner.querySelector('.promo-corpo');
    corpo.innerHTML = `
      <div class="promo-occhiello">Grazie!</div>
      <h2>Ecco il tuo codice</h2>
      <p>Inseriscilo al momento del pagamento per avere il ${SCONTO} di sconto sul primo ordine.</p>
      <div class="promo-codice"><strong>${CODICE}</strong><button type="button">Copia</button></div>`;
    const copia = corpo.querySelector('.promo-codice button');
    copia.addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(CODICE).then(function () { copia.textContent = 'Copiato ✓'; });
    });
  });

  // ---- Quando mostrarlo ----
  if (daPoco) {
    // chiuso di recente: mostra solo la linguetta
    setTimeout(function () { linguetta.classList.add('visibile'); }, 1500);
    return;
  }
  let mostrato = false;
  function mostraUnaVolta() {
    if (mostrato) return;
    mostrato = true;
    window.removeEventListener('scroll', alloScroll);
    apri();
  }
  function alloScroll() {
    const fatto = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (fatto > 0.35) mostraUnaVolta();
  }
  setTimeout(mostraUnaVolta, RITARDO_SECONDI * 1000);
  window.addEventListener('scroll', alloScroll, { passive: true });
})();
