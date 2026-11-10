// Baobab Primaire – v0.6 : Bip, le petit robot compagnon (demande de Cedric, 10/11/2026)
// Bip est un avatar qui parle à l'enfant pendant les exercices à l'écran :
// il félicite quand la réponse est juste, il encourage quand elle est fausse, il fête la fin de la fiche.
// L'enfant peut garder Bip, ou choisir Amara ou Noah. Bip peut aussi parler à voix haute (bouton 🔊).
// Dessin original en SVG (marche hors ligne).

PERSOS.robot = { nom: 'Bip', robot: true };

function robotSVG(humeur) {
  const h = humeur || '';
  const corps = '#3d8bfd', fonce = '#2a6fdb', trait = '#23324a';
  const yeux = h === 'fete'
    ? '<path d="M42 40 l2.4 5 l5.4 .6 l-4 3.6 l1.2 5.4 l-5 -2.8 l-5 2.8 l1.2 -5.4 l-4 -3.6 l5.4 -.6z M78 40 l2.4 5 l5.4 .6 l-4 3.6 l1.2 5.4 l-5 -2.8 l-5 2.8 l1.2 -5.4 l-4 -3.6 l5.4 -.6z" fill="#f2c230" stroke="#c99a00" stroke-width="1"/>'
    : h === 'triste'                          // « courage » : yeux doux, sourcils décidés
      ? '<ellipse cx="42" cy="48" rx="7" ry="6" fill="#fff"/><ellipse cx="78" cy="48" rx="7" ry="6" fill="#fff"/><circle cx="42" cy="49" r="3.5" fill="' + trait + '"/><circle cx="78" cy="49" r="3.5" fill="' + trait + '"/><path d="M35 38 L48 40 M85 38 L72 40" stroke="' + trait + '" stroke-width="3" stroke-linecap="round"/>'
      : '<circle cx="42" cy="47" r="8" fill="#fff"/><circle cx="78" cy="47" r="8" fill="#fff"/><g class="bip-pupilles"><circle cx="43" cy="48" r="4" fill="' + trait + '"/><circle cx="79" cy="48" r="4" fill="' + trait + '"/><circle cx="44.5" cy="46" r="1.4" fill="#fff"/><circle cx="80.5" cy="46" r="1.4" fill="#fff"/></g>';
  const bouche = h === 'fete' ? '<path d="M46 60 Q60 76 74 60 Z" fill="' + trait + '"/><path d="M51 65 Q60 70 69 65" fill="#e86a6a"/>'
    : h === 'triste' ? '<path d="M49 64 Q60 69 71 64" fill="none" stroke="' + trait + '" stroke-width="3.2" stroke-linecap="round"/>'
    : '<path d="M47 60 Q60 71 73 60" fill="none" stroke="' + trait + '" stroke-width="3.2" stroke-linecap="round"/>';
  // bras : levés pour la fête, un bras levé (avec des petits éclats) pour encourager, normaux sinon
  const main = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="#fff" stroke="${trait}" stroke-width="2"/>`;
  const bras = h === 'fete'
    ? `<path d="M34 92 L14 74" stroke="${fonce}" stroke-width="7" stroke-linecap="round"/>${main(12, 71)}<path d="M86 92 L106 74" stroke="${fonce}" stroke-width="7" stroke-linecap="round"/>${main(108, 71)}`
    : h === 'triste'
      ? `<path d="M34 94 L18 108" stroke="${fonce}" stroke-width="7" stroke-linecap="round"/>${main(16, 109)}<path d="M86 94 L104 80" stroke="${fonce}" stroke-width="7" stroke-linecap="round"/>${main(106, 77)}
         <path d="M110 64 l2 -5 M115 70 l5 -2 M104 63 l-1 -5" stroke="#f2c230" stroke-width="2.4" stroke-linecap="round"/>`
      : `<path d="M34 94 L18 108" stroke="${fonce}" stroke-width="7" stroke-linecap="round"/>${main(16, 109)}<g class="bip-bras-d"><path d="M86 94 L102 108" stroke="${fonce}" stroke-width="7" stroke-linecap="round"/>${main(104, 109)}</g>`;
  return `<svg viewBox="0 0 120 120" class="amara perso-robot ${h}" aria-hidden="true"><g class="bip-tout">
    <g class="bip-antenne"><line x1="60" y1="9" x2="60" y2="22" stroke="${trait}" stroke-width="3"/>
    <circle cx="60" cy="8" r="6" fill="${h === 'fete' ? '#f2c230' : h === 'triste' ? '#ff9f43' : '#2fd17a'}" stroke="${trait}" stroke-width="2" class="lumiere"/></g>
    <rect x="17" y="40" width="9" height="18" rx="3" fill="${fonce}" stroke="${trait}" stroke-width="2"/><rect x="94" y="40" width="9" height="18" rx="3" fill="${fonce}" stroke="${trait}" stroke-width="2"/>
    ${bras}
    <rect x="34" y="84" width="52" height="34" rx="10" fill="${corps}" stroke="${trait}" stroke-width="2.5"/>
    <circle cx="60" cy="100" r="7" fill="#fff" stroke="${trait}" stroke-width="2"/><path d="M56 100 l3 3.5 l6 -7" fill="none" stroke="#2fa36b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="24" y="22" width="72" height="58" rx="18" fill="${corps}" stroke="${trait}" stroke-width="2.5"/>
    <rect x="30" y="29" width="60" height="45" rx="13" fill="#dcebff"/>
    <g class="bip-yeux">${yeux}</g>
    <g class="bip-yeux-fermes"><path d="M34 48 Q42 53 50 48 M70 48 Q78 53 86 48" fill="none" stroke="${trait}" stroke-width="3" stroke-linecap="round"/></g>
    <g class="bip-bouche">${bouche}</g>
    <ellipse cx="35" cy="62" rx="4" ry="2.6" fill="#ff8fa3" opacity=".6"/><ellipse cx="85" cy="62" rx="4" ry="2.6" fill="#ff8fa3" opacity=".6"/>
  </g></svg>`;
}
const _personnageHumain = personnageSVG;
personnageSVG = function (qui, humeur) { return qui === 'robot' ? robotSVG(humeur) : _personnageHumain(qui, humeur); };

// ---------- Ce que dit le compagnon ----------
// {p} = « , Yohann » si l'enfant a mis son prénom ; {e} = « e » pour une fille ; {s} = la solution
const PAROLES = {
  bravo: ['Bravo{p} !', 'Super{p} !', 'C\'est juste !', 'Très bien{p} !', 'Excellent !', 'Bien joué{p} !', 'Tu es fort{e}{p} !', 'Oui, c\'est ça !'],
  serie3: ['3 bonnes réponses de suite{p} ! 🔥', 'Waouh, 3 de suite ! Continue !'],
  serie5: ['5 de suite{p} ! Tu es un{e} champion{ne} ! 🏆', 'Incroyable, 5 bonnes réponses de suite ! 🚀'],
  essai1: ['Presque{p} ! Essaie encore.', 'Pas encore. Relis bien la question.', 'Ce n\'est pas grave, on apprend en essayant !', 'Respire, regarde bien, tu vas y arriver !'],
  essai2: ['Courage{p} ! Prends ton temps.', 'Encore un petit effort ! Tu peux le faire.', 'Je crois en toi{p} ! Essaie une dernière fois.'],
  solution: ['Regarde la solution : « {s} ». La prochaine fois, ça ira !', 'Ce n\'est pas grave{p}. La réponse est « {s} ». On continue ensemble !'],
  fin_parfait: ['Waouh{p} ! Tout juste du premier coup ! 🎉', 'Parfait ! Tu as tout réussi{p} ! 🏆'],
  fin_bien: ['Terminé ! Tu as très bien travaillé{p} !', 'Bravo{p}, la fiche est finie ! Tu progresses !'],
  fin_courage: ['Fiche finie ! Tu as essayé jusqu\'au bout{p}, c\'est très bien.', 'C\'est fini ! Refais une fiche : tu verras, ce sera plus facile.']
};
function parole(cle, enfant, sol) {
  const l = PAROLES[cle], x = l[Math.floor(Math.random() * l.length)];
  const p = enfant && enfant.prenom ? ', ' + enfant.prenom : '', fille = enfant && enfant.fille;
  return x.replace(/\{p\}/, p).replace(/\{p\}/g, '').replace(/\{e\}/g, fille ? 'e' : '').replace(/\{ne\}/g, fille ? 'ne' : '').replace(/\{s\}/g, sol || '');
}

// ---------- Bip parle à voix haute (choix gardé sur l'appareil) ----------
function bipParle() { try { return localStorage.getItem('baobab-primaire.voix') === 'oui'; } catch (e) { return false; } }
function changerBipParle() { try { localStorage.setItem('baobab-primaire.voix', bipParle() ? 'non' : 'oui'); } catch (e) {} }

// ---------- Bip sur la page d'accueil ----------
function accueilBip() {
  return `<a class="carte-bip" href="#/guide"><span class="bip-mini">${robotSVG('content')}</span>
    <span><b>${t('g_bonjour')}</b><br>${t('g_bonjour2')} <u>📖 ${t('g_ouvrir')}</u></span></a>`;
}

Object.assign(TEXTES.fr, {
  u_compagnon: 'Ton compagnon :', u_tu_es: 'Tu es :', u_robot: 'le robot Bip', u_voix_oui: 'Bip parle : oui', u_voix_non: 'Bip parle : non',
  g_bonjour: 'Bonjour ! Je suis Bip, le petit robot. 🤖', g_bonjour2: 'Je t\'aide pendant les exercices. Tu veux savoir comment marche l\'appli ?', g_ouvrir: 'Lire le guide'
});

// ======================================================================
// v0.7 : Bip bouge ! (demande de Cedric, 10/11/2026 : « est-il possible de faire que le robot bouge ? … encore plus »)
// - il se balance doucement, cligne des yeux, son antenne clignote
// - ses yeux suivent le doigt ou la souris
// - sa bouche bouge quand il parle
// - il fait coucou en arrivant, il danse et lance des confettis à la fin d'une fiche, il fait un salto après 5 bonnes réponses
// - si on le touche, il rit, saute ou tourne (avec un petit « bip bip »)
// - si l'enfant ne fait rien pendant 40 secondes, il s'endort (Z z z) ; il se réveille dès qu'on touche l'écran
// - après une fiche, un petit Bip traverse l'écran en roulant
// Tout est léger (dessin SVG + CSS). Si l'appareil demande « réduire les animations », Bip reste calme.
// ======================================================================
const BIP_CALME = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
const bipSon = notes => { if (typeof bip === 'function') bip(notes); };
const SONS_BIP = {
  toucher: [[880, 0, .07], [1175, .09, .09]],
  rire: [[988, 0, .06], [1175, .08, .06], [988, .16, .06], [1319, .24, .1]],
  dodo: [[392, 0, .25], [330, .25, .35]],
  reveil: [[523, 0, .08], [784, .1, .12]],
  vroum: [[300, 0, .12], [420, .1, .12], [560, .2, .2]]
};
const TOUCHERS = [
  { cl: 'bip-rit', txt: 'Hi hi, ça chatouille !', son: 'rire' },
  { cl: 'bip-saute-haut', txt: 'Hop !', son: 'toucher' },
  { cl: 'bip-tourne', txt: 'Wiiii !', son: 'rire' },
  { cl: 'bip-coucou', txt: 'Coucou !', son: 'toucher' },
  { cl: 'bip-antenne-folle', txt: 'Bip bip !', son: 'toucher' },
  { cl: 'bip-rit', txt: 'Encore ! 😄', son: 'rire' }
];
function bipPetiteBulle(el, txt) {
  if (!el) return;
  let b = el.querySelector('.bip-mini-bulle');
  if (!b) { b = document.createElement('span'); b.className = 'bip-mini-bulle'; b.setAttribute('aria-hidden', 'true'); el.appendChild(b); }
  b.textContent = txt; b.classList.remove('montre'); void b.offsetWidth; b.classList.add('montre');
  clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('montre'), 2300);
}
const BIP_GESTES = ['bip-coucou', 'bip-saute-haut', 'bip-rit', 'bip-tourne', 'bip-salto', 'bip-antenne-folle', 'bip-danse'];
function bipGeste(el, cl, duree) {
  if (!el || BIP_CALME()) return;
  el.classList.remove(...BIP_GESTES); void el.offsetWidth; el.classList.add(cl);
  clearTimeout(el['_t' + cl]); el['_t' + cl] = setTimeout(() => el.classList.remove(cl), duree || 1200);
}
// La bouche bouge pendant que Bip parle (pendant la voix si elle est active, sinon le temps de lire la bulle)
function bipParleBouche(el, txt) {
  if (!el) return;
  el.classList.add('bip-parle');
  clearTimeout(el._tParle);
  const fin = () => el.classList.remove('bip-parle');
  const duree = Math.min(4500, 600 + 55 * String(txt || '').length);
  const debut = Date.now();
  el._tParle = setTimeout(function attendre() {
    if (window.speechSynthesis && speechSynthesis.speaking && Date.now() - debut < 15000) el._tParle = setTimeout(attendre, 250); else fin();
  }, duree);
}
// Les yeux suivent le doigt / la souris (un seul écouteur pour toute la page)
let bipYeuxActifs = false;
function bipSuivreYeux() {
  if (bipYeuxActifs) return; bipYeuxActifs = true;
  let attente = false, dx = 0, dy = 0, px = 0, py = 0;
  const bouger = () => {
    attente = false;
    document.querySelectorAll('.perso-robot .bip-pupilles').forEach(g => {
      const r = g.ownerSVGElement.getBoundingClientRect(); if (!r.width) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height * .4;
      const a = Math.atan2(py - cy, px - cx), d = Math.min(1, Math.hypot(px - cx, py - cy) / 200);
      dx = Math.cos(a) * 3 * d; dy = Math.sin(a) * 2.5 * d;
      g.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
    });
  };
  const suivre = e => { const p = e.touches ? e.touches[0] : e; if (!p) return; px = p.clientX; py = p.clientY; if (!attente) { attente = true; requestAnimationFrame(bouger); } };
  window.addEventListener('pointermove', suivre, { passive: true });
  window.addEventListener('pointerdown', suivre, { passive: true });
  window.addEventListener('touchstart', suivre, { passive: true });
  // quand l'enfant écrit dans une case, Bip regarde la case
  document.addEventListener('focusin', e => { if (e.target.matches && e.target.matches('input')) { const r = e.target.getBoundingClientRect(); px = r.left + r.width / 2; py = r.top + r.height / 2; bouger(); } });
}
// Clignement des yeux au hasard (toutes les 2 à 6 secondes)
let bipClignote = null;
function bipCligner() {
  if (bipClignote) return;
  const un = () => {
    document.querySelectorAll('.perso-robot').forEach(svg => { if (!BIP_CALME()) { svg.classList.add('cligne'); setTimeout(() => svg.classList.remove('cligne'), 160); } });
    bipClignote = setTimeout(un, 2000 + Math.random() * 4000);
  };
  bipClignote = setTimeout(un, 1500);
}
// Bip s'endort si l'enfant ne fait rien pendant 40 secondes
function bipSommeil(el, dire) {
  if (!el) return;
  let minuteur = null;
  const dodo = () => {
    if (!document.body.contains(el) || !el.querySelector('.perso-robot') || el.classList.contains('bip-dort')) return;
    el.classList.add('bip-dort'); bipSon(SONS_BIP.dodo);
    if (!el.querySelector('.bip-zzz')) { const z = document.createElement('span'); z.className = 'bip-zzz'; z.setAttribute('aria-hidden', 'true'); z.innerHTML = '<i>Z</i><i>z</i><i>z</i>'; el.appendChild(z); }
  };
  const reveil = () => {
    if (!document.body.contains(el)) { ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.removeEventListener(ev, reveil)); return; }
    if (el.classList.contains('bip-dort')) {
      el.classList.remove('bip-dort'); bipSon(SONS_BIP.reveil);
      bipGeste(el, 'bip-saute-haut', 700);
      bipPetiteBulle(el, 'Oh ! Je me suis endormi… On continue ? 😊');
    }
    clearTimeout(minuteur); minuteur = setTimeout(dodo, 40000);
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, reveil, { passive: true }));
  reveil();
}
// Confettis qui tombent sur tout l'écran
function bipConfettis() {
  if (BIP_CALME()) return;
  const boite = document.createElement('div'); boite.className = 'bip-confettis'; boite.setAttribute('aria-hidden', 'true');
  const couleurs = ['#f2c230', '#3d8bfd', '#2fd17a', '#ff6b6b', '#ff9f43', '#b06cff'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('i');
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = couleurs[i % couleurs.length];
    c.style.animationDelay = (Math.random() * .8).toFixed(2) + 's';
    c.style.animationDuration = (2.2 + Math.random() * 1.6).toFixed(2) + 's';
    c.style.setProperty('--tour', (Math.random() * 720 - 360).toFixed(0) + 'deg');
    c.style.setProperty('--vent', (Math.random() * 30 - 15).toFixed(0) + 'vw');
    if (i % 3 === 0) c.style.borderRadius = '50%';
    boite.appendChild(c);
  }
  document.body.appendChild(boite);
  setTimeout(() => boite.remove(), 4800);
}
// Un petit Bip traverse l'écran en roulant
function bipPromenade() {
  if (BIP_CALME()) return;
  const p = document.createElement('div'); p.className = 'bip-promene'; p.setAttribute('aria-hidden', 'true');
  p.innerHTML = robotSVG('fete') + '<span class="bip-roue"></span>';
  document.body.appendChild(p); bipSon(SONS_BIP.vroum);
  setTimeout(() => p.remove(), 5200);
}
// Appelé par le mode écran à chaque fois que le compagnon parle
function bipReagit(el, humeur, txt, cle) {
  if (!el || !el.querySelector('.perso-robot')) return;
  bipParleBouche(el, txt);
  if (cle === 'bonjour') bipGeste(el, 'bip-coucou', 1800);
  else if (cle === 'serie5') bipGeste(el, 'bip-salto', 1100);
  else if (cle === 'serie3') bipGeste(el, 'bip-saute-haut', 900);
  else if (humeur === 'fete') { bipGeste(el, 'bip-danse', 2600); bipConfettis(); setTimeout(bipPromenade, 900); }
}
// Préparer Bip sur une page (mode écran ou accueil)
function bipVivant(el, opts) {
  if (!el) return;
  bipSuivreYeux(); bipCligner();
  if (!el._toucher) {
    el._toucher = true; let n = 0;
    el.addEventListener('click', e => {
      if (!el.querySelector('.perso-robot') || el.classList.contains('bip-dort')) return;
      if (opts && opts.lien) e.preventDefault();
      const x = TOUCHERS[n++ % TOUCHERS.length];
      bipGeste(el, x.cl, 1200); bipSon(SONS_BIP[x.son]); bipPetiteBulle(el, x.txt); bipParleBouche(el, x.txt);
    });
  }
  if (opts && opts.dort) bipSommeil(el);
  if (opts && opts.coucou) setTimeout(() => bipGeste(el, 'bip-coucou', 1800), 400);
}
