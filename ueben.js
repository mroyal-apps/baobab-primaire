// Mode application : « S'entraîner à l'écran » (repris de Baobab Blätter, adapté au français).
// L'enfant répond directement à l'écran. Correction tout de suite, son, étoiles, personnage.
// Idée : on reprend la fiche AVEC solutions (f.rendu(true)) et chaque réponse rouge (.rep)
// devient une case à remplir, des boutons à toucher ou des mots à toucher.
// Les calculs restent faits par les générateurs (sans erreur).
// Le progrès est gardé seulement sur l'appareil (localStorage), pas de compte, pas de serveur.

// Thèmes qui restent seulement sur papier (dessin, découpage)
const PAPIER_SEUL = ['domino', 'spiegeln'];
const peutUeben = (k, id) => (THEMES[k] || []).some(x => x.id === id) && !PAPIER_SEUL.includes(id);

// Consignes adaptées à l'écran (sur papier : « schreibe, kreuze an », à l'écran : « tippe »)
const CONSIGNE_ECRAN = {
  comparer: 'Compare : touche <, = ou >. Pour encadrer, écris les deux nombres.',
  pairs: 'Le nombre est-il pair ou impair ? Touche la bonne réponse.',
  heure: 'Quelle heure est-il ? Écris par exemple 3 h 30 (ou 3:30).',
  monnaie: 'Combien d\'argent y a-t-il en tout ? Écris seulement le nombre.',
  posees: 'Calcule en colonnes. Commence à droite, par les unités !',
  lettres: 'Écris le nombre en lettres (en minuscules) ou en chiffres.',
  fractions: 'Quelle partie est coloriée ? Écris la fraction, par exemple 3/4.',
  preuve9: 'Fais la preuve par 9 : écris les 4 restes, puis touche « juste » ou « faux ».',
  ensembles: 'Touche ∈ ou ∉. Pour ∩ et ∪, écris les nombres séparés par des points-virgules, par exemple 2 ; 5 ; 9.',
  formes: 'Comment s\'appelle cette forme ? Touche la bonne réponse.',
  compter: 'Compte les objets. Écris le nombre.',
  durees: 'Écris la durée, par exemple 2 h 25.',
  problemes: 'Lis le problème. Écris l\'opération, par exemple 250 + 300 = 550. Complète ensuite la réponse.'
};

// ---------- Progrès (sur l'appareil) ----------
function progres() { try { return Object.assign({ etoiles: 0, themes: {} }, JSON.parse(localStorage.getItem('baobab-primaire.ueben') || '{}')); } catch (e) { return { etoiles: 0, themes: {} }; } }
function garderProgres(p) { try { localStorage.setItem('baobab-primaire.ueben', JSON.stringify(p)); } catch (e) {} }
function majEtoilesNav() { const n = progres().etoiles; const el = document.getElementById('nav-etoiles'); if (el) el.textContent = '⭐ ' + n; const o = document.getElementById('onglet-etoiles'); if (o) o.textContent = n; }
function modeKlasse() { try { return localStorage.getItem('baobab-primaire.mode') === 'ecran' ? 'ecran' : 'papier'; } catch (e) { return 'papier'; } }
function changerMode(m) { try { localStorage.setItem('baobab-primaire.mode', m); } catch (e) {} router(true); }

// ---------- Personnages : Amara (fille) et Noah (garçon), couleurs d'origine (peau foncée, cheveux noirs) ----------
// Dessins originaux en SVG (pas d'image à télécharger, marche hors ligne).
const PERSOS = {
  amara: { nom: 'Amara', peau: '#8d5a3b', ombre: '#774a30', cheveux: '#2b1d16', cheveux2: '#4a3326', haut: '#2f9e55', haut2: '#25804a', fille: true },
  noah:  { nom: 'Noah',  peau: '#7e4f33', ombre: '#6a412a', cheveux: '#2b1d16', cheveux2: '#4a3326', haut: '#2a6fdb', haut2: '#1f58b3', fille: false }
};
function personnageSVG(qui, humeur) {
  const P = PERSOS[qui] || PERSOS.amara, h = humeur || '';
  const bouche = h === 'triste' ? '<path d="M52 83 Q60 77 68 83" fill="none" stroke="#6b2b1d" stroke-width="2.6" stroke-linecap="round"/>'
    : h === 'fete' ? '<path d="M49 77 Q60 93 71 77 Z" fill="#7a1f1f"/><path d="M53 79 Q60 82 67 79" fill="#fff"/><path d="M54 85 Q60 89 66 85" fill="#e86a6a"/>'
    : '<path d="M51 78 Q60 88 69 78" fill="none" stroke="#6b2b1d" stroke-width="2.6" stroke-linecap="round"/>';
  const sourcils = h === 'triste' ? '<path d="M41 52 Q47 48 53 51 M67 51 Q73 48 79 52" fill="none" stroke="' + P.cheveux2 + '" stroke-width="2.2" stroke-linecap="round"/>'
    : '<path d="M41 50 Q47 46 53 49 M67 49 Q73 46 79 50" fill="none" stroke="' + P.cheveux2 + '" stroke-width="2.2" stroke-linecap="round"/>';
  const yeux = h === 'fete'
    ? '<path d="M43 62 Q48 56 53 62 M67 62 Q72 56 77 62" fill="none" stroke="#1b1b1b" stroke-width="2.6" stroke-linecap="round"/>'
    : `<ellipse cx="48" cy="61" rx="4.6" ry="5.4" fill="#2a1a12"/><ellipse cx="72" cy="61" rx="4.6" ry="5.4" fill="#2a1a12"/>
       <circle cx="49.6" cy="59" r="1.7" fill="#fff"/><circle cx="73.6" cy="59" r="1.7" fill="#fff"/><circle cx="46.8" cy="63.2" r=".8" fill="#fff"/><circle cx="70.8" cy="63.2" r=".8" fill="#fff"/>
       ${P.fille ? '<path d="M42 57 l-2.5 -2 M44 55.5 l-1.6 -2.6 M78 57 l2.5 -2 M76 55.5 l1.6 -2.6" stroke="#2a1a12" stroke-width="1.2" stroke-linecap="round"/>' : ''}`;
  // boucles de cheveux : petits cercles pour donner une texture frisée
  const boucles = (cx, cy, r, n, rr) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="${rr}"/>`; }).join('');
  const cheveuxArriere = P.fille
    ? `<g fill="${P.cheveux}">${boucles(24, 34, 9, 9, 6)}<circle cx="24" cy="34" r="11"/>${boucles(96, 34, 9, 9, 6)}<circle cx="96" cy="34" r="11"/></g>
       <g fill="${P.cheveux2}" opacity=".35"><circle cx="20" cy="38" r="3"/><circle cx="27" cy="30" r="2.5"/><circle cx="92" cy="30" r="2.5"/><circle cx="99" cy="38" r="3"/></g>`
    : '';
  const cheveuxDessus = P.fille
    ? `<path d="M30 52 Q30 22 60 20 Q90 22 90 52 Q82 36 60 35 Q38 36 30 52Z" fill="${P.cheveux}"/>
       <path d="M40 30 Q60 24 80 30" fill="none" stroke="${P.cheveux2}" stroke-width="1.5" opacity=".5"/>
       <path d="M33 40 Q60 30 87 40" fill="none" stroke="#f4c542" stroke-width="3.5" stroke-linecap="round"/>`
    : `<g fill="${P.cheveux}">${Array.from({ length: 11 }, (_, i) => { const a = Math.PI + i / 10 * Math.PI; return `<circle cx="${(60 + Math.cos(a) * 29).toFixed(1)}" cy="${(46 + Math.sin(a) * 25).toFixed(1)}" r="6.5"/>`; }).join('')}
       <path d="M31 50 Q31 21 60 20 Q89 21 89 50 Q80 38 60 37 Q40 38 31 50Z"/></g>
       <g fill="${P.cheveux2}" opacity=".4"><circle cx="45" cy="27" r="2"/><circle cx="58" cy="24" r="2"/><circle cx="72" cy="27" r="2"/><circle cx="38" cy="35" r="1.8"/><circle cx="82" cy="35" r="1.8"/></g>`;
  return `<svg viewBox="0 0 120 120" class="amara perso-${qui} ${h}" aria-hidden="true">
    ${cheveuxArriere}
    <path d="M30 120 Q30 98 60 96 Q90 98 90 120Z" fill="${P.haut}"/>
    <path d="M50 97 Q60 106 70 97" fill="none" stroke="${P.haut2}" stroke-width="3"/>
    <rect x="53" y="86" width="14" height="13" rx="5" fill="${P.ombre}"/>
    <ellipse cx="31" cy="64" rx="5.5" ry="7" fill="${P.ombre}"/><ellipse cx="89" cy="64" rx="5.5" ry="7" fill="${P.ombre}"/>
    ${P.fille ? '<circle cx="31" cy="72" r="2.8" fill="#f4c542"/><circle cx="89" cy="72" r="2.8" fill="#f4c542"/>' : ''}
    <ellipse cx="60" cy="62" rx="29" ry="31" fill="${P.peau}"/>
    ${cheveuxDessus}
    ${sourcils}${yeux}
    <path d="M58 66 Q60 71 63 68" fill="none" stroke="${P.ombre}" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="42" cy="73" rx="5" ry="3.2" fill="#e8877a" opacity=".35"/><ellipse cx="78" cy="73" rx="5" ry="3.2" fill="#e8877a" opacity=".35"/>
    ${bouche}
  </svg>`;
}
const amaraSVG = humeur => personnageSVG('amara', humeur);

const BRAVO = ['Bravo !', 'Super !', 'C\'est juste !', 'Très bien !', 'Excellent !', 'Bien joué !', 'Continue comme ça !'];
const ENCORE = ['Presque ! Essaie encore.', 'Pas encore. Regarde bien.', 'Essaie encore une fois !'];

// ---------- Sons courts (sans fichier, fonctionnent hors ligne) ----------
let ctxAudio = null;
function bip(notes) {
  try {
    ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
    notes.forEach(([f, debut, duree]) => {
      const o = ctxAudio.createOscillator(), g = ctxAudio.createGain(), t0 = ctxAudio.currentTime + debut;
      o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(ctxAudio.destination);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
      o.start(t0); o.stop(t0 + duree + 0.05);
    });
  } catch (e) {}
}
const sonJuste = () => bip([[660, 0, .15], [880, .12, .25]]);
const sonFaux = () => bip([[260, 0, .3]]);
const sonFete = () => bip([[523, 0, .15], [659, .15, .15], [784, .3, .15], [1047, .45, .4]]);

// ---------- Vérifier une réponse ----------
const nettoyer = s => String(s).toLowerCase().replace(/[\s\u00A0\u202F]/g, '').replace(/^(\d{1,2})h(\d{2})?$/, (x, h, m) => h + ':' + (m || '00'));
const lettresNettes = s => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[-‐–]/g, ' ').replace(/\s+/g, ' ').trim();
const ensembleNet = s => String(s).replace(/[{}]/g, '').split(/[;,\s]+/).filter(Boolean).map(Number).sort((a, b) => a - b).join(';');
const RE_CALC = /^[\d\s .]+(\s*[+−\-·:x×]\s*[\d\s .]+)+\s*=\s*[\d\s .]+$/;
function valeurExpr(x) {                    // calcule « 12+5·3 » sans eval libre
  const e = x.replace(/[\s ]/g, '').replace(/(\d)\.(?=\d{3}(\D|$))/g, '$1').replace(/,/g, '.')
    .replace(/[x×*]/gi, '·').replace(/÷/g, ':').replace(/[−–]/g, '-').replace(/·/g, '*').replace(/:/g, '/');
  if (!/^[\d+\-*/.()]+$/.test(e) || !/\d/.test(e)) return NaN;
  try { const v = Function('"use strict";return (' + e + ')')(); return typeof v === 'number' && isFinite(v) ? v : NaN; } catch (er) { return NaN; }
}
function calcJuste(saisie, attendu) {       // « 30 − 12 = 18 » : toute rechnung juste qui donne le bon résultat
  const but = valeurExpr(attendu.split('=').pop());
  const etapes = saisie.split(/[;,\n]|\bund\b/).map(s => s.trim()).filter(Boolean);
  if (!etapes.length) return false;
  for (const et of etapes) {
    const parts = et.split('='); if (parts.length < 2) return false;
    const vals = parts.map(valeurExpr); if (vals.some(isNaN)) return false;
    if (vals.some(v => Math.abs(v - vals[0]) > 1e-9)) return false;
    if (!/[+\-−·x×*:÷/]/i.test(parts[0].replace(/^\s*-/, ''))) return false;
  }
  const fin = etapes[etapes.length - 1].split('=').pop();
  return Math.abs(valeurExpr(fin) - but) < 1e-9;
}
const phraseNette = s => String(s).replace(/[„“”"]/g, '"').replace(/[‚‘’']/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim();
function estJuste(saisie, attendu, mode) {
  if (!String(saisie).trim()) return false;
  if (mode === 'calc') return calcJuste(saisie, attendu);
  if (mode === 'phrase') return phraseNette(saisie) === phraseNette(attendu);
  if (mode === 'lettres') return lettresNettes(saisie) === lettresNettes(attendu);
  if (mode === 'ensemble') return ensembleNet(saisie) === ensembleNet(attendu);
  if (/^\d+\/\d+$/.test(nettoyer(attendu))) return nettoyer(saisie) === nettoyer(attendu);
  if (/^\d+,\d+$/.test(nettoyer(attendu))) return Math.abs(parseFloat(nettoyer(saisie).replace(',', '.')) - parseFloat(nettoyer(attendu).replace(',', '.'))) < 1e-9;
  const s = nettoyer(saisie), a = nettoyer(attendu);
  if (/^\d{1,2}:\d{2}$/.test(a)) {                    // Uhrzeit : 3:30, 03:30, 15:30, 3.30 ; 3 ou 15 pour une heure pile
    const [ha, ma] = a.split(':').map(Number);
    const m = s.match(/^(\d{1,2})(?:[:.,h](\d{2}))?$/); if (!m) return false;
    return (+m[1]) % 12 === ha % 12 && (+(m[2] || 0)) === ma;
  }
  if (/(€|ct)$/.test(a)) {                            // Geld : 12 €, 12,50 €, 50 ct
    const val = x => { const c = /ct$/.test(x), n = parseFloat(x.replace(/€|ct|euro/g, '').replace(',', '.')); return c ? n / 100 : n; };
    return Math.abs(val(s) - val(a)) < 0.001;
  }
  if (/^[\d.]+$/.test(a)) return s.replace(/\./g, '') === a.replace(/\./g, '');   // nombres (1.000 = 1 000 = 1000)
  if (/ - /.test(attendu)) return saisie.replace(/\s/g, '') === attendu.replace(/\s/g, '');   // Silben : Blu-me
  return saisie.trim().replace(/\s+/g, ' ') === String(attendu).trim();         // mots : majuscule exacte
}

// ---------- Page ----------
function pageUeben(k, id, memo) {
  const base = (THEMES[k] || []).find(x => x.id === id);
  if (!base || !peutUeben(k, id)) return pageKlasse(k);
  const theme = Object.assign({}, base, { defs: Object.assign({ nombre: '12' }, base.defs || {}) });
  const libre = estLibre(k, id);
  const optsVisibles = theme.options.filter(o => o === 'uebung'), optsCachees = theme.options.filter(o => o !== 'uebung');
  $app.innerHTML = `
  <section class="ueben">
    <div class="ueben-haut">
      <a href="#/classe/${k}" class="retour">← ${NOMCL(k)}</a>
      <a href="#/fiche/${k}/${id}" class="retour">🖨️ ${t('u_fiche')}</a>
    </div>
    <div class="ueben-tete">
      <div class="perso-col"><div class="perso" id="perso">${amaraSVG()}</div><button type="button" class="nom-perso" id="nom-perso"></button></div>
      <div class="bulle" id="bulle" aria-live="polite">Bonjour ! On y va !</div>
    </div>
    <form class="form-prenom" id="form-prenom" hidden>
      <label>${t('u_ton_prenom')} <input id="in-prenom" maxlength="20" autocomplete="off" placeholder="${t('u_prenom_ex')}"></label>
      <span class="choix-avatar"><b>${t('u_tu_es')}</b><label><input type="radio" name="genre" value="fille"> 👧 ${t('u_fille')}</label><label><input type="radio" name="genre" value="garcon"> 👦 ${t('u_garcon')}</label></span>
      <span class="choix-avatar choix-compagnon"><b>${t('u_compagnon')}</b><label><input type="radio" name="avatar" value="robot"> 🤖 Bip</label><label><input type="radio" name="avatar" value="amara"> 👧 Amara</label><label><input type="radio" name="avatar" value="noah"> 👦 Noah</label></span>
      <button class="btn principal" type="submit">${t('u_ok')}</button>
      <button class="btn" type="button" id="b-sans-prenom">${t('u_sans_prenom')}</button>
    </form>
    <h1 class="ueben-titre">${base.nom} <small>${NOMCL(k)}</small></h1>
    ${optsVisibles.length ? `<div class="options ueben-choix-ex">${optsVisibles.map(o => champ(o, theme)).join('')}</div>` : ''}
    <div class="ueben-barre">
      <div class="jauge"><span id="jauge"></span></div>
      <span id="compte">0 / 0</span><span class="etoiles-session" id="etoiles-session">⭐ 0</span>
    </div>
    ${optsCachees.length ? `<details class="ueben-reglages"><summary>⚙️ ${t('u_reglages')}</summary><div class="options">${optsCachees.map(o => champ(o, theme)).join('')}</div></details>` : ''}
    <div class="ueben-outils">
      <button class="btn" id="u-lire">🔊 ${t('u_ecouter')}</button>
      <button class="btn" id="u-neu">🔄 ${t('u_nouveau')}</button>
      <button class="btn" id="u-voix" aria-pressed="false"></button>
    </div>
    ${libre ? '' : `<p class="verrou">${t('u_verrou')}</p><button class="btn achat" id="u-acheter">${t('freischalten')}</button>`}
    <p class="consigne ueben-consigne" id="u-consigne"></p>
    <div class="ueben-zone ${libre ? '' : 'verrouille'}" id="u-zone"></div>
    <div class="ueben-fin" id="u-fin" hidden></div>
    <details class="aide-ecran"><summary>👪 ${t('aide_titre')}</summary><div id="u-aide">${aideHTML(base.aide || base.id)}</div></details>
  </section>`;
  remettreOptions(memo);
  let total = 0, faits = 0, etoiles = 0, f, uebung = null, qui = 'amara';
  const zone = () => document.getElementById('u-zone');
  // Le prénom de l'enfant (gardé sur cet appareil) : il remplace Amara / Noah
  // v0.6 : { prenom, fille, avatar } ; avatar = le compagnon (robot Bip par défaut, ou Amara, ou Noah)
  const enfant = () => { try { const e = JSON.parse(localStorage.getItem('baobab-primaire.enfant')); if (e && e.fille === undefined && e.avatar) e.fille = e.avatar === 'amara'; return e || null; } catch (e) { return null; } };
  let serie = 0;     // bonnes réponses de suite
  const nomQui = () => { const e = enfant(); return e && e.prenom ? e.prenom : PERSOS[qui].nom; };
  const majNom = () => { const b = document.getElementById('nom-perso'), e = enfant(); if (b) b.textContent = e && e.prenom ? '✏️ ' + e.prenom : '✏️ ' + t('u_mon_prenom'); };
  const dire = (txt, humeur, parler, cle) => {
    document.getElementById('bulle').textContent = txt;
    const pe = document.getElementById('perso'); pe.innerHTML = personnageSVG(qui, humeur);
    pe.classList.remove('bouge-content', 'bouge-triste', 'bouge-fete'); void pe.offsetWidth; if (humeur) pe.classList.add('bouge-' + humeur);
    if (parler !== false && bipParle() && typeof lire === 'function') { etat.lent = false; lire(txt.replace(/[🔥🏆🚀🎉⭐]/gu, '')); }
    if (typeof bipReagit === 'function') bipReagit(pe, humeur, txt, cle);   // v0.7 : Bip bouge
  };
  const bonjour = () => { const e = enfant(); return (e && e.prenom ? 'Bonjour ' + e.prenom + ' ! ' : 'Bonjour ! ') + (qui === 'robot' ? 'Je suis Bip, ton robot. On travaille ensemble ! ' : 'Je suis ' + PERSOS[qui].nom + '. ') + f.consigne; };
  const majVoix = () => { const b = document.getElementById('u-voix'); b.textContent = '🤖🔊 ' + t(bipParle() ? 'u_voix_oui' : 'u_voix_non'); b.setAttribute('aria-pressed', bipParle()); };
  const maj = () => {
    document.getElementById('compte').textContent = `${faits} / ${total}`;
    document.getElementById('jauge').style.width = (total ? 100 * faits / total : 0) + '%';
    document.getElementById('etoiles-session').textContent = '⭐ ' + etoiles;
  };
  const termine = c => c.classList.contains('ok') || c.classList.contains('vu');
  // Ordre des cases : ordre de lecture, mais de droite à gauche dans un calcul écrit (schriftlich)
  const ordre = () => {
    const groupes = [];
    zone().querySelectorAll('.u-case').forEach(c => {
      const kol = c.closest('.kolonne'), g = groupes[groupes.length - 1];
      if (kol && g && g.kol === kol) g.l.push(c); else groupes.push({ kol, l: [c] });
    });
    return groupes.flatMap(g => g.kol ? g.l.reverse() : g.l);
  };
  const suivant = depuis => {
    const l = ordre(), i = depuis ? l.indexOf(depuis) : -1;
    const c = l.slice(i + 1).find(x => !termine(x)) || l.find(x => !termine(x));
    if (c && c.matches('input')) c.focus();
  };
  const fini = () => {
    const p = progres(), cle = k + '/' + id;
    p.etoiles += etoiles;
    const th = p.themes[cle] || { fois: 0, meilleur: 0 };
    th.fois++; th.meilleur = Math.max(th.meilleur, Math.round(100 * etoiles / total));
    p.themes[cle] = th; garderProgres(p); majEtoilesNav();
    dire(parole(etoiles === total ? 'fin_parfait' : etoiles >= total / 2 ? 'fin_bien' : 'fin_courage', enfant()), 'fete');
    sonFete();
    const fin = document.getElementById('u-fin');
    fin.hidden = false;
    fin.innerHTML = `<div class="confettis" aria-hidden="true">🎉 ⭐ 🎉</div><h2>Terminé !</h2>
      <p class="score">⭐ ${etoiles} / ${total}</p><p>${t('u_fin_texte')}</p>
      <button class="btn principal" id="u-encore">🔄 ${t('u_nouveau')}</button> <a class="btn" href="#/classe/${k}">← ${NOMCL(k)}</a>`;
    document.getElementById('u-encore').onclick = () => { etat.graine = nouvelleGraine(); dessiner(); window.scrollTo(0, 0); };
    fin.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const reussi = c => {
    const premier = !c.essais;
    faits++; if (premier) etoiles++;
    c.classList.remove('faux'); c.classList.add('ok');
    serie = premier ? serie + 1 : 0;
    const cleSerie = serie === 5 || serie === 10 ? 'serie5' : serie === 3 ? 'serie3' : 'bravo';
    sonJuste(); dire(parole(cleSerie, enfant()) + (premier ? ' ⭐' : ''), 'content', undefined, cleSerie);
    maj(); if (faits === total) fini(); else suivant(c);
  };
  const rate = (c, attendu, indice) => {
    c.essais = (c.essais || 0) + 1;
    c.classList.remove('secoue'); void c.offsetWidth; c.classList.add('faux', 'secoue');
    sonFaux();
    if (c.essais >= 3) {        // après 3 essais : on montre la solution, sans étoile
      faits++; c.classList.remove('faux'); c.classList.add('vu');
      c.montrer();
      serie = 0; dire(parole('solution', enfant(), attendu), 'triste');
      maj(); if (faits === total) fini(); else suivant(c);
      return true;
    }
    serie = 0; dire(indice || parole(c.essais === 1 ? 'essai1' : 'essai2', enfant()), 'triste');
    return false;
  };

  // ----- Les types de cases -----
  const bouton = (txt, cls) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = txt; if (cls) b.className = cls; return b; };
  // 1. Case à remplir
  function caseSaisie(att, mode, opts = {}) {
    const c = document.createElement('input');
    c.className = 'u-case' + (mode === 'phrase' || mode === 'calc' ? ' u-long' : '');
    c.autocomplete = 'off'; c.spellcheck = false; c.setAttribute('autocapitalize', 'off'); c.setAttribute('autocorrect', 'off');
    const nombre = /^[\d.  ]+$/.test(att);
    c.inputMode = nombre ? 'numeric' : 'text';
    if (mode !== 'phrase' && mode !== 'calc') c.style.width = (nombre ? Math.max(3.6, Math.min(8, att.length * 0.75 + 1.4)) : Math.max(4, Math.min(11, att.length * 0.75 + 2))) + 'em';
    if (opts.valeur) c.value = opts.valeur;
    if (mode === 'calc') c.placeholder = 'opération … = …';
    c.setAttribute('aria-label', 'Réponse'); c._att = att;
    c.montrer = () => { c.value = att; c.disabled = true; };
    const verifier = () => {
      if (termine(c) || !c.value.trim() || c.value === c.dernier) return;
      c.dernier = c.value;
      if (estJuste(c.value, att, mode)) { c.disabled = true; if (opts.apres) opts.apres(true); reussi(c); return; }
      let indice = '';
      if (mode === 'calc' && /^[\d\s.]+$/.test(c.value.trim())) indice = 'Écris toute l\'opération, par exemple 250 + 300 = 550.';
      else if (mode !== 'calc' && c.value.trim().toLowerCase() === att.toLowerCase()) indice = 'Presque ! Fais attention aux majuscules et aux minuscules.';
      else if (mode === 'phrase' && phraseNette(c.value).toLowerCase() === phraseNette(att).toLowerCase()) indice = 'Presque ! Fais attention aux majuscules et aux minuscules.';
      const fin = rate(c, att, indice);
      if (fin && opts.apres) opts.apres(false);
      if (!fin) c.select();
    };
    c.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verifier(); } });
    // v0.7.2 : sur téléphone, le clavier ne doit pas cacher la case → on la remet au milieu de l'écran
    c.addEventListener('focus', () => { setTimeout(() => { try { const doux = !matchMedia('(prefers-reduced-motion: reduce)').matches; c.scrollIntoView({ block: 'center', behavior: doux ? 'smooth' : 'auto' }); } catch (e) {} }, 250); });
    c.addEventListener('change', verifier);
    if (!opts.audio) return c;
    const w = document.createElement('span'); w.className = 'u-audio';     // Diktat : 🔊 + case
    const b = bouton('🔊', 'u-haut-parleur'); b.title = 'Écouter';
    b.onclick = () => { etat.lent = true; lire(opts.audio); c.focus(); };
    w.append(b, c); return w;
  }
  // 2. Boutons à toucher (der/die/das, <, =, >, richtig/falsch, réponses au texte…)
  function caseChoix(choix, att, cls) {
    const c = document.createElement('span'); c.className = 'u-case u-choix ' + (cls || ''); c._att = att;
    choix.forEach(x => {
      const b = bouton(x, /^(der|die|das)$/.test(x) && cls === 'artikel' ? 'art-' + x : '');
      b.onclick = () => {
        if (termine(c)) return;
        if (x === att) { b.classList.add('bon'); c.querySelectorAll('button').forEach(y => y.disabled = true); reussi(c); }
        else { b.disabled = true; b.classList.add('non'); rate(c, att); }
      };
      c.appendChild(b);
    });
    c.montrer = () => c.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.toggle('bon', b.textContent === att); });
    return c;
  }
  // 3. Mots à toucher dans une phrase (Ein Wort zu viel)
  function casePhraseClic(mots, juste) {
    const c = document.createElement('p'); c.className = 'u-case u-clic'; c._att = juste;
    mots.forEach((m, i) => {
      const s = document.createElement('span'); s.className = 'u-mot'; s.textContent = m; s.tabIndex = 0;
      s.onclick = () => {
        if (termine(c)) return;
        if (i === juste) { s.classList.add('barre'); reussi(c); }
        else { s.classList.add('pas-ca'); rate(c, mots[juste]); }
      };
      c.append(s, ' ');
    });
    c.montrer = () => c.children[juste].classList.add('barre');
    return c;
  }
  // 4. Fehlertext : toucher le mot faux, puis l'écrire juste
  function texteFautes(motsFaux, motsJustes, fautes) {
    const cadre = document.createElement('div'); cadre.className = 'cadre lesetexte u-fehlertext';
    motsFaux.forEach((m, i) => {
      const s = document.createElement('span'); s.textContent = m; s.tabIndex = 0;
      if (fautes.has(i)) {
        s.className = 'u-case u-mot u-faute';
        const att = motsJustes[i]; s._att = att;
        s.montrer = () => { s.textContent = att; };
        s.onclick = () => {
          if (termine(s) || s.querySelector('input')) return;
          const inp = document.createElement('input');
          inp.className = 'u-fehler-input'; inp.value = m; inp.autocomplete = 'off'; inp.spellcheck = false;
          inp.setAttribute('autocapitalize', 'off'); inp.setAttribute('autocorrect', 'off');
          inp.style.width = Math.max(3, m.length * 0.8 + 1.5) + 'em';
          s.textContent = ''; s.appendChild(inp); inp.focus(); inp.select();
          const verif = () => {
            if (termine(s) || !inp.value.trim() || inp.value === inp.dernier) return; inp.dernier = inp.value;
            if (estJuste(inp.value, att, 'mot')) { s.textContent = att; reussi(s); }
            else if (rate(s, att, inp.value.trim().toLowerCase() === att.toLowerCase() ? 'Presque ! Fais attention aux majuscules et aux minuscules.' : '')) s.textContent = att;
            else inp.select();
          };
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verif(); } });
          inp.addEventListener('change', verif);
          inp.addEventListener('click', e => e.stopPropagation());
        };
      } else {
        s.className = 'u-mot';
        s.onclick = () => { s.classList.remove('secoue'); void s.offsetWidth; s.classList.add('secoue'); dire('Ce mot est bien écrit. Cherche encore !', 'content'); };
      }
      cadre.append(s, ' ');
    });
    return cadre;
  }
  // 5. Phrase réponse avec un nombre à compléter (Rechengeschichten : « Es sind __ Blätter. »)
  function phraseNombre(phrase, resultat) {
    const nums = [...phrase.matchAll(/\d[\d  .]*\d|\d/g)];
    const m = nums.find(x => x[0].replace(/[\s .]/g, '') === String(resultat).replace(/[\s .]/g, '')) || nums[0];
    if (!m) return null;
    const w = document.createElement('span'); w.className = 'u-phrase-nb';
    w.append(phrase.slice(0, m.index), caseSaisie(m[0].trim(), 'nombre'), phrase.slice(m.index + m[0].trim().length));
    return w;
  }

  // ----- Transformer la fiche en exercice à l'écran -----
  function transformer(z) {
    const rng = rngDe(etat.graine + 7);
    z.querySelectorAll('.kontrolle').forEach(e => e.remove());
    if (id === 'artikel') z.querySelectorAll('.maisons').forEach(e => e.remove());
    // Wortarten : chaque mot de la banque → Nomen / Verb / Adjektiv
    if (id === 'wortarten') {
      const type = {};
      z.querySelectorAll('.maison').forEach(m => { const w = m.querySelector('.toit').textContent.trim(); m.querySelectorAll('.rep').forEach(r => type[r.textContent.trim().toLowerCase()] = w); });
      const mots = z.querySelector('.banque').textContent.split('·').map(s => s.trim()).filter(Boolean);
      z.innerHTML = '<div class="u-liste"></div>';
      mots.forEach(m => { const l = document.createElement('div'); l.className = 'u-ligne'; const b = document.createElement('b'); b.textContent = m; l.append(b, caseChoix(['Nomen', 'Verb', 'Adjektiv'], type[m.toLowerCase()], 'wortart')); z.firstChild.appendChild(l); });
    }
    // Lesetext : réponses au choix (la bonne + 2 autres réponses du même texte) ; richtig / falsch
    const reponses = [...z.querySelectorAll('.bloc p.rep')];
    if (reponses.length) {
      const toutes = reponses.map(r => r.textContent.trim());
      reponses.forEach(r => {
        const att = r.textContent.trim();
        const autres = melanger(rng, [...new Set(toutes.filter(x => x !== att))]).slice(0, 2);
        r.replaceWith(caseChoix(melanger(rng, [att, ...autres]), att, 'long'));
      });
    }
    z.querySelectorAll('table.rf tr').forEach((tr, i) => {
      const td = tr.querySelectorAll('td'); if (td.length < 3) { if (i === 0) tr.remove(); return; }
      const att = td[1].querySelector('.rep') ? 'richtig' : 'falsch';
      td[1].replaceChildren(caseChoix(['richtig', 'falsch'], att, 'rf')); td[1].colSpan = 2; td[2].remove();
    });
    // Ein Wort zu viel : toucher l'intrus
    z.querySelectorAll('.item p').forEach(p => {
      const s = p.querySelector('s.rep'); if (!s) return;
      s.replaceWith('§§');
      const mots = p.textContent.trim().split(/\s+/), j = mots.indexOf('§§');
      mots[j] = s.textContent;
      p.replaceWith(casePhraseClic(mots, j));
    });
    // Fehlertext
    if (uebung === 'fehler') {
      const faux = (new DOMParser()).parseFromString(f.rendu(false), 'text/html').querySelector('.cadre').textContent.trim().split(' ');
      const toks = z.querySelector('.cadre').innerHTML.trim().match(/<b class="rep">[^<]*<\/b>|\S+/g);
      const justes = toks.map(x => x.replace(/<[^>]+>/g, '')), fautes = new Set(toks.map((x, i) => x.startsWith('<b') ? i : -1).filter(i => i >= 0));
      z.innerHTML = '';
      z.appendChild(texteFautes(faux, justes, fautes));
    }
    // Diktat (Klasse 2-4) : phrase par phrase, avec le son
    if (uebung === 'diktat' && !z.querySelector('.rep')) {
      const phrases = (f.audio.match(/[^.!?]+[.!?]+["“”]?/g) || [f.audio]).map(s => s.trim());
      z.innerHTML = '<div class="u-liste"></div>';
      phrases.forEach((p, i) => { const l = document.createElement('div'); l.className = 'u-ligne u-diktat'; const n = document.createElement('b'); n.textContent = (i + 1) + '.'; l.append(n, caseSaisie(p, 'phrase', { audio: p })); z.firstChild.appendChild(l); });
    }
    // Lückentext Klasse 3-4 : les phrases libres restent sur papier
    z.querySelectorAll('.petitnote').forEach(e => { const prec = e.previousElementSibling; if (prec && /eigene Sätze/.test(prec.textContent)) prec.remove(); e.remove(); });
    // Tout le reste : chaque réponse rouge devient une case
    let dernierCalc = null;
    z.querySelectorAll('.rep').forEach(el => {
      const att = el.textContent.trim();
      let c;
      if (el.dataset.audio) c = caseSaisie(att, att.split(' ').length > 2 ? 'phrase' : 'mot', { audio: el.dataset.audio });
      else if (el.dataset.choix) c = caseChoix(el.dataset.choix.split('|'), att, el.dataset.choix.length > 30 ? 'long' : '');
      else if (RE_CALC.test(att)) { c = caseSaisie(att, 'calc'); dernierCalc = att.split('=').pop().trim(); }
      else if (dernierCalc && /[a-zäöü]/i.test(att) && /\d/.test(att) && (c = phraseNombre(att, dernierCalc))) dernierCalc = null;
      else if (id === 'dassdas') c = caseChoix(/^D/.test(att) ? ['Das', 'Dass'] : ['das', 'dass'], att);
      else if (/^(der|die|das)$/.test(att)) c = caseChoix(['der', 'die', 'das'], att, 'artikel');
      else if (/^[<>=]$/.test(att)) c = caseChoix(['<', '=', '>'], att, 'signe');
      else if (/^[∈∉]$/.test(att)) c = caseChoix(['∈', '∉'], att, 'signe');
      else if (/^(juste|faux)$/.test(att)) c = caseChoix(['juste', 'faux'], att);
      else if (/^(pair|impair)$/.test(att)) c = caseChoix(['pair', 'impair'], att);
      else if (/^(carré|rectangle|triangle|rond|cercle)$/.test(att)) c = caseChoix(['carré', 'rectangle', 'triangle', 'rond'], att);
      else if (/^\{.*\}$/.test(att)) c = caseSaisie(att, 'ensemble');
      else if (/^[a-zéèêàùç' -]+$/.test(att) && !/\d/.test(att) && /^[a-z]/.test(att)) c = caseSaisie(att, 'lettres');
      else if (uebung === 'diktat') c = caseSaisie(att, att.split(' ').length > 2 ? 'phrase' : 'mot', { audio: att });
      else c = caseSaisie(att, att.split(/\s+/).length > 3 ? 'phrase' : 'mot');
      if (!c) c = caseSaisie(att, 'phrase');
      el.replaceWith(c);
    });
    // Ne compter que les vraies cases (une phrase-nombre contient sa case)
    return z.querySelectorAll('.u-case').length;
  }

  const dessiner = () => {
    const o = lireOptions(theme);
    uebung = o.uebung || null;
    f = base.gen(rngDe(etat.graine), o);
    if (CONSIGNE_ECRAN[id]) f.consigne = CONSIGNE_ECRAN[id];
    if (uebung && CONSIGNE_ECRAN['u:' + uebung]) f.consigne = CONSIGNE_ECRAN['u:' + uebung];
    if (uebung === 'fehler') f.consigne = f.consigne.replace(/Unterstreiche sie\..*/, 'Tippe auf ein falsches Wort und schreibe es richtig.');
    if (id === 'silben') f.consigne += ' Trenne die Silben mit einem Strich: Blu-me.';
    etat.audio = f.audio || f.consigne; etat.lent = false;
    document.getElementById('u-consigne').textContent = f.consigne;
    document.getElementById('u-fin').hidden = true;
    const ca = f.aide || base.aide || base.id; document.getElementById('u-aide').innerHTML = aideHTML(ca);
    const z = zone();
    z.innerHTML = f.rendu(true);
    total = transformer(z); faits = 0; etoiles = 0; maj();
    const e = enfant();
    qui = e && PERSOS[e.avatar] ? e.avatar : 'robot';   // v0.6 : Bip le robot par défaut ; l'enfant peut choisir Amara ou Noah
    majNom(); serie = 0;
    dire(bonjour(), 'content', false, 'bonjour');
    if (libre) setTimeout(() => { if (document.getElementById('u-zone')) suivant(null); }, 50);   // la page peut avoir été quittée entre-temps
  };
  document.querySelectorAll('.ueben .options select, .ueben .options input').forEach(el => el.addEventListener('change', dessiner));
  if (typeof bipVivant === 'function') bipVivant(document.getElementById('perso'), { dort: true });   // v0.7
  // Formulaire « mon prénom »
  const fp = document.getElementById('form-prenom');
  document.getElementById('nom-perso').onclick = () => {
    const e = enfant() || {}; fp.hidden = !fp.hidden;
    document.getElementById('in-prenom').value = e.prenom || '';
    fp.querySelectorAll('input[name=avatar]').forEach(r => r.checked = r.value === qui);
    fp.querySelectorAll('input[name=genre]').forEach(r => r.checked = e.fille === undefined ? false : r.value === (e.fille ? 'fille' : 'garcon'));
    if (!fp.hidden) document.getElementById('in-prenom').focus();
  };
  fp.onsubmit = ev => {
    ev.preventDefault();
    const prenom = document.getElementById('in-prenom').value.trim().replace(/\s+/g, ' ').slice(0, 20);
    const av = (fp.querySelector('input[name=avatar]:checked') || {}).value || 'robot';
    const g = (fp.querySelector('input[name=genre]:checked') || {}).value;
    const d = { avatar: av }; if (prenom) d.prenom = maj1(prenom); if (g) d.fille = g === 'fille';
    try { localStorage.setItem('baobab-primaire.enfant', JSON.stringify(d)); } catch (e) {}
    fp.hidden = true; qui = av; majNom();
    dire(bonjour(), 'content', undefined, 'bonjour');
  };
  document.getElementById('b-sans-prenom').onclick = () => { try { localStorage.removeItem('baobab-primaire.enfant'); } catch (e) {} fp.hidden = true; qui = 'robot'; majNom(); dire(bonjour(), 'content', undefined, 'bonjour'); };
  document.getElementById('u-voix').onclick = () => { changerBipParle(); majVoix(); if (bipParle()) dire(qui === 'robot' ? 'Bip bip ! Maintenant je parle.' : 'Maintenant je parle.', 'content'); else if ('speechSynthesis' in window) speechSynthesis.cancel(); };
  majVoix();
  document.getElementById('u-neu').onclick = () => { etat.graine = nouvelleGraine(); dessiner(); };
  document.getElementById('u-lire').onclick = () => { etat.lent = uebung === 'diktat' || !!f.dictee; lire(f.lireTexte || f.dictee || uebung === 'lesen' || uebung === 'geschichte' || uebung === 'diktat' ? f.audio : f.consigne); };
  if (!libre) document.getElementById('u-acheter').onclick = () => ouvrirBoutique(k, id, () => router(true));
  dessiner();
}

// ---------- Textes de l'interface ----------
Object.assign(TEXTES.fr, {
  u_bouton: '🎮 S\'entraîner à l\'écran', u_mode_papier: '🖨️ Fiches à imprimer', u_mode_ecran: '🎮 S\'entraîner à l\'écran',
  u_mode_p: 'L\'enfant répond directement sur le téléphone, la tablette ou l\'ordinateur. Correction tout de suite.', u_papier_seul: '🖨️ papier seulement',
  u_fiche: 'Version à imprimer', u_reglages: 'Réglages (pour le parent)', u_ecouter: 'Écouter', u_nouveau: 'Nouveaux exercices',
  u_mon_prenom: 'Mon prénom', u_ton_prenom: 'Ton prénom :', u_prenom_ex: 'par exemple Yohann', u_fille: 'fille', u_garcon: 'garçon', u_ok: 'OK', u_sans_prenom: 'Effacer',
  u_verrou: '', u_fin_texte: 'Les étoiles sont gardées sur cet appareil.', u_progres: 'Meilleur score'
});
