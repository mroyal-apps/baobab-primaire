// Interface : accueil, choix de la classe, générateur de fiches, aide parents. Français seulement.
// Numéro de la version (à changer à chaque nouvelle version). Il s'affiche en bas de chaque page.
const VERSION_APP = { num: '0.4', date: '09/11/2026' };
const $app = document.getElementById('app');
const etat = { graine: nouvelleGraine(), sol: false, route: '', langue: langueDepart() };
function nouvelleGraine() { return Math.floor(Math.random() * 90000) + 10000; }
function langueDepart() { return 'fr'; }
const t = k => TEXTES[etat.langue][k];
const aide = id => AIDE[id] && AIDE[id][etat.langue];

function changerLangue(l) {
  etat.langue = l;
  try { localStorage.setItem('baobab-primaire.langue', l); } catch (e) {}
  document.documentElement.lang = l;
  dessinerEntete(); router(true);
}
function dessinerEntete() {
  document.getElementById('nav').innerHTML =
    `<a href="#/">${t('accueil')}</a>${ACTIVES.map(k => `<a href="#/classe/${k}" class="nav-k">${NOMCL(k)}</a>`).join('')}<a href="#/parents">${t('parents')}</a><span id="nav-etoiles" class="nav-etoiles" title="Étoiles">⭐ ${progres().etoiles}</span>
     <span class="langues" hidden></span>`;
  document.querySelectorAll('.langues button').forEach(b => b.onclick = () => changerLangue(b.dataset.l));
  document.getElementById('provisoire').textContent = t('provisoire');
  document.getElementById('pastille-version').textContent = 'v' + VERSION_APP.num;
  document.getElementById('pastille-version').title = 'Version ' + VERSION_APP.num + ' · ' + VERSION_APP.date;
  // Téléphone : barre d'onglets en bas (Accueil, Klasse 1-4, Aide, étoiles)
  document.getElementById('onglets').innerHTML =
    `<a href="#/" data-r=""><span class="ic">🏠</span><span>${t('accueil')}</span></a>` +
    ACTIVES.map(k => `<a href="#/classe/${k}" data-r="${k}"><span class="ic chiffre">${NOMCL(k)}</span><span>Classe</span></a>`).join('') +
    `<a href="#/parents" data-r="parents"><span class="ic">👪</span><span>${t('onglet_aide')}</span></a>` +
    `<span class="onglet-etoiles"><span class="ic">⭐</span><span id="onglet-etoiles">${progres().etoiles}</span></span>`;
  marquerOnglet();
  document.getElementById('pied-site').innerHTML = `${t('pied')}<br><span class="version-app" id="version-app">Version ${VERSION_APP.num} · ${VERSION_APP.date}</span>`;
}

function marquerOnglet() {
  const p = location.hash.replace(/^#\/?/, '').split('/');
  const k = (p[0] === 'classe' || p[0] === 'fiche' || p[0] === 'ueben') ? p[1] : (p[0] === 'parents' ? 'parents' : '');
  document.querySelectorAll('#onglets a').forEach(a => a.classList.toggle('actif', a.dataset.r === k));
}
window.addEventListener('hashchange', marquerOnglet);

function OPTIONS() {
  const n = t('niv');
  return {
    zahlenraum: { label: t('zahlenraum'), type: 'select', choix: [['100', 'jusqu\'à 100'], ['1000', 'jusqu\'à 1 000'], ['10000', 'jusqu\'à 10 000']], def: '100' },
    operation: { label: t('operation'), type: 'select', choix: [['+', 'additions'], ['-', 'soustractions'], ['mix', 'mélangé']], def: 'mix' },
    uebergang: { label: t('uebergang'), type: 'select', choix: [['ohne', 'sans retenue'], ['mit', 'avec retenue'], ['egal', 'mélangé']], def: 'egal' },
    niveau: { label: t('niveau'), type: 'select', choix: [['1', n[0]], ['2', n[1]], ['3', n[2]]], def: '2' },
    nombre: { label: t('nombre'), type: 'select', choix: [['6', '6'], ['12', '12'], ['18', '18'], ['24', '24']], def: '18' },
    reihen: { label: t('reihen'), type: 'reihen', def: [2, 5, 10] },
    geteilt: { label: t('geteilt'), type: 'check', def: false },
  };
}

function lireOptions(theme) {
  const o = Object.assign({}, theme.fixe || {}), OP = OPTIONS();
  theme.options.forEach(k => {
    const d = OP[k], el = document.getElementById('opt-' + k);
    if (d.type === 'reihen') o[k] = el ? [...el.querySelectorAll('input:checked')].map(i => +i.value) : d.def;
    else if (d.type === 'check') o[k] = el ? el.checked : d.def;
    else o[k] = el ? el.value : d.def;
  });
  Object.assign(o, theme.fixe || {});
  o.nombre = +(o.nombre || 18); o.niveau = +(o.niveau || 2);
  if (o.reihen && !o.reihen.length) o.reihen = [2, 5, 10];
  return o;
}
function memoOptions() {   // garde les réglages quand on change de langue
  const m = {};
  document.querySelectorAll('.options select, .options input').forEach(el => { m[el.id + (el.value && el.type === 'checkbox' && el.closest('fieldset') ? el.value : '')] = el.type === 'checkbox' ? el.checked : el.value; });
  return m;
}
function remettreOptions(m) {
  if (!m) return;
  document.querySelectorAll('.options select, .options input').forEach(el => {
    const k = el.id + (el.value && el.type === 'checkbox' && el.closest('fieldset') ? el.value : '');
    if (!(k in m)) return;
    if (el.type === 'checkbox') el.checked = m[k]; else el.value = m[k];
  });
}

function champ(k, theme) {
  const d = Object.assign({}, OPTIONS()[k]);
  if (theme.defs && k in theme.defs) d.def = theme.defs[k];
  if (k === 'zahlenraum' && theme.zr) d.choix = d.choix.filter(c => theme.zr.includes(c[0]));
  if (k === 'uebung' && theme.uebungen) d.choix = d.choix.filter(c => theme.uebungen.includes(c[0]));
  if (d.type === 'select') return `<label>${d.label}<select id="opt-${k}">${d.choix.map(([v, x]) => `<option value="${v}"${v === d.def ? ' selected' : ''}>${x}</option>`).join('')}</select></label>`;
  if (d.type === 'check') return `<label class="check"><input type="checkbox" id="opt-${k}"${d.def ? ' checked' : ''}> ${d.label}</label>`;
  return `<fieldset id="opt-${k}"><legend>${d.label}</legend>${[1,2,3,4,5,6,7,8,9,10].map(n =>
    `<label class="puce"><input type="checkbox" value="${n}"${d.def.includes(n) ? ' checked' : ''}><span>${n}</span></label>`).join('')}</fieldset>`;
}

// ---------- Pages ----------

function pageAccueil() {
  $app.innerHTML = `
  <section class="hero"><h1>${t('hero_t')}</h1><p>${t('hero_p')}</p></section>
  <section class="classes">${Object.keys(CLASSES).map(Number).map(k => ACTIVES.includes(k) ? `
    <a class="carte-classe" href="#/classe/${k}">
      <span class="num">${NOMCL(k)}</span><span>${NIVEAUX[k]}</span>
      <small>Mathématiques · Français</small></a>` : `
    <div class="carte-classe bientot"><span class="num">${NOMCL(k)}</span><span>${NIVEAUX[k]}</span><small>${t('bientot')}</small></div>`).join('')}
  </section>
  <section class="atouts">${t('atouts').map(([a, b]) => `<div><b>${a}</b><p>${b}</p></div>`).join('')}</section>`;
}

function pageKlasse(k) {
  const themes = THEMES[k] || [], ecran = modeKlasse() === 'ecran', pr = progres().themes;
  const carte = x => {
    const jeu = ecran && peutUeben(k, x.id), m = pr[k + '/' + x.id];
    const sous = ecran ? (jeu ? (m ? `${t('u_progres')} : ${m.meilleur} %` : x.domaine) : t('u_papier_seul')) : x.domaine;
    return `<a class="carte-theme${ecran ? (jeu ? ' carte-jeu' : ' papier-seul') : ''}" href="#/${jeu ? 'ueben' : 'fiche'}/${k}/${x.id}"><b>${x.nom}</b><small>${sous}</small>${estGratuit(k, x.id) ? `<span class="badge gratis">${t('gratis')}</span>` : (estLibre(k, x.id) ? '' : '<span class="badge cadenas">🔒</span>')}</a>`;
  };
  const bloc = (fach, cls) => { const l = themes.filter(x => x.fach === fach); return `<h2 class="fach ${cls}">${fach}</h2>` + (l.length ? `<div class="themes">${l.map(carte).join('')}</div>` : `<p class="bientot-texte">${t('francais_bientot')}</p>`); };
  $app.innerHTML = `<section class="page"><div class="barre-retour"><a href="#/" class="retour">← ${t('accueil')}</a></div><h1>${NOMCL(k)} <small class="niveau-cl">${NIVEAUX[k]}</small></h1>
    <div class="modes" role="tablist"><button data-m="papier" class="${ecran ? '' : 'actif'}">${t('u_mode_papier')}</button><button data-m="ecran" class="${ecran ? 'actif' : ''}">${t('u_mode_ecran')}</button></div>
    <p>${ecran ? t('u_mode_p') : t('choisir')}</p>${bloc(t('maths'), 'mathe')}${bloc(t('francais'), 'deutsch')}</section>`;
  document.querySelectorAll('.modes button').forEach(b => b.onclick = () => changerMode(b.dataset.m));
}

function pageFiche(k, id, memo) {
  const theme = (THEMES[k] || []).find(x => x.id === id);
  if (!theme) return pageKlasse(k);
  const libre = estLibre(k, id);
  if (!libre) etat.sol = false;
  $app.innerHTML = `
  <section class="atelier">
    <aside class="panneau no-print">
      <a href="#/classe/${k}" class="retour">← ${NOMCL(k)}</a>
      <h2>${theme.nom}</h2><p class="domaine">${theme.fach} · ${theme.domaine}</p>
      ${estGratuit(k, id) ? `<p><span class="badge gratis">${t('gratis')}</span></p>` : ''}
      <div class="options">${theme.options.map(k => champ(k, theme)).join('')}</div>
      ${peutUeben(k, id) ? `<a class="btn jeu" href="#/ueben/${k}/${id}">${t('u_bouton')}</a>` : ''}
      <button class="btn principal" id="b-nouveau">${t('nouvelle')}</button>
      ${libre ? `<button class="btn" id="b-sol">${etat.sol ? t('voir_fiche') : t('voir_sol')}</button>` : ''}
      <button class="btn" id="b-lire">${t('ecouter')}</button>
      <button class="btn" id="b-texte" hidden>📖 ${t('voir_texte')}</button>
      ${libre ? `<fieldset class="impr"><legend>${t('impr_aussi')}</legend>
        <label class="check"><input type="checkbox" id="p-sol" checked> ${t('impr_sol')}</label>
        <label class="check"><input type="checkbox" id="p-aide" checked> ${t('impr_aide')}</label>
        <label class="check" id="l-vorl"><input type="checkbox" id="p-vorl" checked> ${t('impr_vorlesen')}</label>
        <label class="nb-fiches">${t('impr_nb')} <select id="p-nb">${[1, 2, 3, 4, 5, 10].map(n => `<option value="${n}">${n}</option>`).join('')}</select></label></fieldset>
      <button class="btn principal" id="b-print">${t('imprimer')}</button>`
      : `<p class="verrou">${t('verrou')}</p><button class="btn achat" id="b-acheter">${t('freischalten')}</button>`}
      <details class="aide-ecran"><summary>👪 ${t('aide_titre')}</summary><div id="aide-cote">${aideHTML(theme.aide || theme.id)}</div></details>
    </aside>
    <div class="feuilles ${libre ? '' : 'verrouille'}" id="feuilles"></div>
  </section>`;
  remettreOptions(memo);
  const coche = id => { const el = document.getElementById(id); return el ? el.checked : false; };
  const dessiner = () => {
    const f0 = theme.gen(rngDe(etat.graine), lireOptions(theme)), f = f0;
    etat.audio = f.audio || f.consigne;
    etat.lent = !!f.lent;
    const cleAide = f.aide || theme.aide || theme.id;
    document.getElementById('aide-cote').innerHTML = aideHTML(cleAide);
    const lv = document.getElementById('l-vorl'); if (lv) lv.hidden = !f.vorlesen;
    document.getElementById('b-texte').hidden = !f.vorlesen;
    document.getElementById('b-lire').textContent = f.vorlesen ? t('lire_dictee') : t('ecouter');
    const deco = (f.sur || '').split(' ')[0] || (theme.fach === 'Mathématiques' ? '🔢' : '✏️');
    const tete = (sol, titre, consigne, sansNom) => `${sansNom ? '' : '<div class="entete"><span>Nom : <i></i></span><span>Date : <i></i></span></div>'}
      <div class="bandeau"><span class="deco" aria-hidden="true">${deco}</span><div class="etiquette-titre">${f.sur ? `<small>${f.sur.split(' ').slice(1).join(' ')}</small>` : ''}<h1 class="titre-fiche">${titre}${sol ? ' – Solutions' : ''}</h1></div><span class="pastille">${NOMCL(k)}</span></div>
      ${consigne ? `<p class="consigne">${consigne}</p>` : ''}`;
    const nb = libre ? +((document.getElementById('p-nb') || {}).value || 1) : 1;
    let html = '';
    for (let i = 0; i < nb; i++) {
    const graine = etat.graine + i, f = i ? theme.gen(rngDe(graine), lireOptions(theme)) : f0;
    const pied = `<div class="pied"><span><b>Baobab Primaire</b> · ${theme.fach} – ${theme.domaine}</span><span>${NOMCL(k)} · Fiche n° ${graine}</span></div>`;
    const marque = libre ? '' : `<div class="filigrane" aria-hidden="true"><span>APERÇU</span></div>`;
    // Kontrollzahlen : les réponses mélangées en bas de la fiche, pour que l'enfant vérifie seul
    let ctrl = f.kontrolle;
    const kontrolle = ctrl && ctrl.length >= 3 ? `<div class="kontrolle"><span class="etiquette">Pour vérifier</span>${[...ctrl].sort((a, b) => a - b).map(x => `<span>${typeof fmtNb === 'function' ? fmtNb(x) : x}</span>`).join('')}</div>` : '';
    const art = (cls, contenu) => `<article class="a4 ${cls}">${marque}${contenu}${pied}</article>`;
    html +=
      (i ? `<p class="bandeau-texte no-print">${t('fiche_n')} ${i + 1} / ${nb}</p>` : '') +
      art(`${etat.sol ? 'ecran-cache' : ''} k${k}-fiche`, `${tete(false, f.titre, f.consigne)}<div class="corps">${f.rendu(false)}</div>${kontrolle}${f.vorlesen ? '<p class="renvoi">Le texte à lire est sur la page suivante (pour l\'adulte).</p>' : ''}`) +
      (f.vorlesen ? `<p class="bandeau-texte no-print" id="ancre-texte">📖 ${t('texte_ici')}</p>` + art(`vorlesen ${libre && !coche('p-vorl') ? 'pas-impr' : ''}`, `${tete(false, 'Texte à lire', 'Pour l\'adulte : ne pas montrer à l\'enfant.', true)}${f.vorlesen.html}`) : '') +
      (libre ? art(`solutions k${k}-fiche ${etat.sol ? '' : 'ecran-cache'} ${coche('p-sol') ? '' : 'pas-impr'}`, `${tete(true, f.titre, f.consigne)}<div class="corps">${f.rendu(true)}</div>`) : '');
    }
    const pied = `<div class="pied"><span><b>Baobab Primaire</b> · ${theme.fach} – ${theme.domaine}</span><span>${NOMCL(k)}</span></div>`;
    document.getElementById('feuilles').innerHTML = html +
      (libre ? `<article class="a4 aide-impr ecran-cache ${coche('p-aide') ? '' : 'pas-impr'}"><h1 class="titre-fiche simple">${t('aide_titre')}</h1>${aideHTML(cleAide)}${pied}</article>` : '');
  };
  document.querySelectorAll('.options select, .options input').forEach(el => el.addEventListener('change', dessiner));
  document.getElementById('b-nouveau').onclick = () => { etat.graine = nouvelleGraine(); dessiner(); };
  document.getElementById('b-lire').onclick = () => lire(etat.audio);
  document.getElementById('b-texte').onclick = () => { const a = document.getElementById('ancre-texte'); if (a) a.scrollIntoView({ behavior: 'smooth' }); };
  if (libre) {
    document.getElementById('b-sol').onclick = e => { etat.sol = !etat.sol; e.target.textContent = etat.sol ? t('voir_fiche') : t('voir_sol'); dessiner(); };
    ['p-sol', 'p-aide', 'p-vorl', 'p-nb'].forEach(i => document.getElementById(i).onchange = dessiner);
    document.getElementById('b-print').onclick = imprimer;
  }
  dessiner();
}
function imprimer() { window.print(); }

function aideHTML(id) {
  const a = aide(id); if (!a) return '';
  return `<div class="aide"><h3>${a.titre}</h3>
    <p><b>${t('apprend')}</b> ${a.apprend}</p>
    <p><b>${t('aider')}</b></p><ol>${a.aider.map(x => `<li>${x}</li>`).join('')}</ol>
    <p><b>${t('erreur')}</b> ${a.erreur}</p>
    <table class="mots"><tr><th>${t('col_de')}</th><th>${t('col_tr')}</th></tr>${a.mots.map(([d, f]) => `<tr><td>${d}</td><td>${f}</td></tr>`).join('')}</table></div>`;
}

const COMMENT = {
  fr: { titre: 'Comment ça marche', sujets: [
    ['📲 Installer l\'appli', 'Touche le bouton « Installer l\'appli » en haut. Il installe l\'appli tout de suite, ou il montre les gestes pour ton appareil (iPhone, Android, Mac, PC). Ensuite l\'icône est avec tes autres applis.'],
    ['🔄 Mises à jour', 'Quand une nouvelle version existe, un message « Nouvelle version disponible » apparaît. Touche « Mettre à jour ». Le numéro de version est écrit en haut (pastille « v… ») et en bas de chaque page.'],
    ['🖨️ / 🎮 Papier ou écran', 'Sur chaque page de classe (CE1, CE2…), choisis « Fiches à imprimer » (fiche A4 avec solutions) ou « S\'entraîner à l\'écran » (l\'enfant répond sur l\'écran et voit tout de suite si c\'est juste).'],
    ['⭐ Les étoiles', 'L\'enfant gagne des étoiles quand il réussit du premier coup. Elles restent sur cet appareil.'],
    ['🔊 Le son', 'Le bouton « Écouter » lit la consigne en français. La voix vient de l\'appareil. Si tu n\'entends rien, monte le volume.'],
    ['📴 Sans internet', 'Après la première ouverture avec internet, l\'appli marche aussi sans internet. Pratique quand la connexion est chère ou coupée.'],
    ['🖨️ Plusieurs fiches', 'Sur la page d\'une fiche, choisis « Nombre de fiches différentes » (1 à 10). Chaque fiche a d\'autres exercices et ses solutions. Puis touche « Imprimer / PDF ».'],
    ['📚 Le programme', 'Les exercices suivent le programme officiel du primaire au Cameroun (MINEDUB 2018). Version 0.4 : mathématiques et français de la SIL au CM2, vérifiés avec les 3 documents officiels (SIL-CP, CE1-CE2, CM1-CM2). Un enseignant doit encore tout relire.'],
    ['🔒 Les données', 'Pas de compte, pas de nom. Les étoiles restent seulement sur cet appareil.']] }
};
function commentHTML() {
  const c = COMMENT[etat.langue] || COMMENT.fr;
  return `<section class="comment-marche" id="comment"><h2>${c.titre}</h2>${c.sujets.map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join('')}
    <p class="version-aide">Version ${VERSION_APP.num} · ${VERSION_APP.date}</p></section>`;
}
function pageParents() {
  $app.innerHTML = `<section class="page"><h1>${t('aide_titre')}</h1>${commentHTML()}<p>${t('aide_intro')}</p>${Object.keys(AIDE).map(aideHTML).join('')}</section>`;
}

// ---------- Son : voix française du navigateur ----------
function lire(texte) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texte.replace(/×/g, ' fois ').replace(/·/g, ' fois ').replace(/−/g, ' moins ').replace(/\+/g, ' plus ').replace(/ : /g, ' divisé par ').replace(/\u00A0/g, ''));
  u.lang = 'fr-FR'; u.rate = etat.lent ? 0.6 : 0.85;
  const voix = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith('fr'));
  if (voix) u.voice = voix;
  speechSynthesis.speak(u);
}

// ---------- Navigation ----------
function lireRoute() { return location.hash; }
function router(garder) {
  const memo = garder ? memoOptions() : null;
  const bq = document.getElementById('boutique'); if (bq) bq.hidden = true;
  const p = lireRoute().replace(/^#\/?/, '').split('/');
  if (p[0] === 'classe') pageKlasse(+p[1]);
  else if (p[0] === 'fiche') { if (!garder) etat.sol = false; pageFiche(+p[1], p[2], memo); }
  else if (p[0] === 'ueben') pageUeben(+p[1], p[2], memo);
  else if (p[0] === 'parents') pageParents();
  else pageAccueil();
  if (!garder) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => router());
document.documentElement.lang = etat.langue;
dessinerEntete();
router();
// ---------- Mises à jour ----------
// 1) Au démarrage et toutes les 5 minutes, l'appli regarde sur internet le numéro de la dernière version (version.json).
//    Si elle est plus récente : bandeau « Nouvelle version disponible » + bouton « Mettre à jour ».
// 2) Après une mise à jour : petit message « Mise à jour faite : version X ».
const TEXTES_MAJ = {
  fr: { dispo: v => `✨ Nouvelle version ${v} disponible.`, bouton: 'Mettre à jour', fait: v => `✅ Mise à jour faite : version ${v}` },
  en: { dispo: v => `✨ New version ${v} available.`, bouton: 'Update', fait: v => `✅ Updated to version ${v}` },
  de: { dispo: v => `✨ Neue Version ${v} verfügbar.`, bouton: 'Aktualisieren', fait: v => `✅ Aktualisiert: Version ${v}` }
};
const tMaj = () => TEXTES_MAJ[etat.langue] || TEXTES_MAJ.fr;
function bandeauMaj(html, bouton) {
  let b = document.getElementById('bandeau-maj');
  if (!b) { b = document.createElement('div'); b.id = 'bandeau-maj'; b.className = 'bandeau-maj'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
  b.innerHTML = `<span>${html}</span>${bouton ? `<button class="btn principal" id="btn-maj">${bouton}</button>` : ''}<button class="fermer-maj" aria-label="×">×</button>`;
  b.hidden = false;
  b.querySelector('.fermer-maj').onclick = () => { b.hidden = true; };
  return b;
}
let canalMaj = null;
try { canalMaj = new BroadcastChannel('baobab-primaire'); canalMaj.onmessage = e => { if (e.data === 'maj') location.reload(); }; } catch (e) {}
async function mettreAJour() {
  try { canalMaj && canalMaj.postMessage('maj'); } catch (e) {}
  try { const ks = await caches.keys(); await Promise.all(ks.filter(k => k.startsWith('baobab-primaire-')).map(k => caches.delete(k))); } catch (e) {}
  try { const r = await navigator.serviceWorker.getRegistration(); if (r) await r.update(); } catch (e) {}
  location.reload();
}
async function verifierVersion() {
  if (!location.protocol.startsWith('http') || !navigator.onLine) return;
  try {
    const v = (await (await fetch('version.json?t=' + Date.now(), { cache: 'no-store' })).json()).num;
    if (v && v !== VERSION_APP.num) bandeauMaj(tMaj().dispo(v), tMaj().bouton).querySelector('#btn-maj').onclick = mettreAJour;
  } catch (e) {}
}
(function annoncerMiseAJour() {
  let avant = null;
  try { avant = localStorage.getItem('baobab-primaire.version'); localStorage.setItem('baobab-primaire.version', VERSION_APP.num); } catch (e) {}
  if (avant && avant !== VERSION_APP.num) { const b = bandeauMaj(tMaj().fait(VERSION_APP.num)); b.classList.add('ok'); setTimeout(() => { b.hidden = true; }, 6000); }
})();
verifierVersion();
setInterval(verifierVersion, 5 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) verifierVersion(); });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
}
