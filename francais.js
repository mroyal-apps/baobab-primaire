// v0.4 — Français, de la SIL au CM2 (programme MINEDUB 2018).
// Lecture, écriture, grammaire, conjugaison, orthographe, vocabulaire.
// Tous les textes sont écrits pour cette appli (rien n'est copié).

const FR = 'Français';
const D_LEC = 'Lecture', D_GRA = 'Grammaire', D_CONJ = 'Conjugaison', D_ORT = 'Orthographe', D_VOC = 'Vocabulaire', D_ECR = 'Écriture';
const maj1 = s => s.charAt(0).toUpperCase() + s.slice(1);

// ================= CONJUGAISON =================
const PRON = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const TERM = {
  pres1: ['e', 'es', 'e', 'ons', 'ez', 'ent'], imp: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
  fut: ['ai', 'as', 'a', 'ons', 'ez', 'ont'], ps1: ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent'],
  ps2: ['is', 'is', 'it', 'îmes', 'îtes', 'irent'], subj: ['e', 'es', 'e', 'ions', 'iez', 'ent']
};
// Verbes du 1er groupe sans changement d'accent (manger, commencer : e et ç gérés)
const V1 = ['chanter', 'danser', 'jouer', 'parler', 'manger', 'marcher', 'regarder', 'laver', 'porter', 'aimer', 'travailler', 'cuisiner', 'ranger', 'nager', 'commencer', 'planter', 'écouter', 'donner', 'chercher', 'garder', 'trouver', 'arriver', 'tomber', 'rentrer', 'sauter', 'balayer'.replace('balayer', 'danser')].filter((v, i, a) => a.indexOf(v) === i);
const V2 = ['finir', 'choisir', 'grandir', 'remplir', 'obéir', 'réussir', 'réfléchir', 'rougir'];
const ETRE_V = ['arriver', 'tomber', 'rentrer', 'aller', 'venir', 'partir'];
const IRR = {
  'être': { pres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], imp: 'ét', fut: 'ser', ps: ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'], subj: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'], ipa: ['sois', 'soyons', 'soyez'], pp: 'été' },
  'avoir': { pres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], imp: 'av', fut: 'aur', ps: ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent'], subj: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'], ipa: ['aie', 'ayons', 'ayez'], pp: 'eu' },
  'aller': { pres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], imp: 'all', fut: 'ir', ps: ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent'], subj: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'], ipa: ['va', 'allons', 'allez'], pp: 'allé' },
  'faire': { pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], imp: 'fais', fut: 'fer', ps: ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent'], subj: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'], ipa: ['fais', 'faisons', 'faites'], pp: 'fait' },
  'dire': { pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], imp: 'dis', fut: 'dir', ps: ['dis', 'dis', 'dit', 'dîmes', 'dîtes', 'dirent'], subj: ['dise', 'dises', 'dise', 'disions', 'disiez', 'disent'], ipa: ['dis', 'disons', 'dites'], pp: 'dit' },
  'pouvoir': { pres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], imp: 'pouv', fut: 'pourr', ps: ['pus', 'pus', 'put', 'pûmes', 'pûtes', 'purent'], subj: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'], pp: 'pu' },
  'venir': { pres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], imp: 'ven', fut: 'viendr', ps: ['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent'], subj: ['vienne', 'viennes', 'vienne', 'venions', 'veniez', 'viennent'], ipa: ['viens', 'venons', 'venez'], pp: 'venu' },
  'prendre': { pres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], imp: 'pren', fut: 'prendr', ps: ['pris', 'pris', 'prit', 'prîmes', 'prîtes', 'prirent'], subj: ['prenne', 'prennes', 'prenne', 'prenions', 'preniez', 'prennent'], ipa: ['prends', 'prenons', 'prenez'], pp: 'pris' },
  'voir': { pres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], imp: 'voy', fut: 'verr', ps: ['vis', 'vis', 'vit', 'vîmes', 'vîtes', 'virent'], subj: ['voie', 'voies', 'voie', 'voyions', 'voyiez', 'voient'], ipa: ['vois', 'voyons', 'voyez'], pp: 'vu' },
  'vouloir': { pres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], imp: 'voul', fut: 'voudr', ps: ['voulus', 'voulus', 'voulut', 'voulûmes', 'voulûtes', 'voulurent'], subj: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'], pp: 'voulu' },
  'partir': { pres: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'], imp: 'part', fut: 'partir', ps: ['partis', 'partis', 'partit', 'partîmes', 'partîtes', 'partirent'], subj: ['parte', 'partes', 'parte', 'partions', 'partiez', 'partent'], ipa: ['pars', 'partons', 'partez'], pp: 'parti' }
};
const groupe = v => IRR[v] ? 3 : V2.includes(v) ? 2 : 1;
// radical du 1er groupe devant une terminaison (manger → mange-ons, commencer → commenç-ons)
const rad1 = (v, term) => { let r = v.slice(0, -2); if (/^[aâoô]/.test(term)) { if (r.endsWith('g')) r += 'e'; else if (r.endsWith('c')) r = r.slice(0, -1) + 'ç'; } return r; };
function simple(v, temps, p) {
  const g = groupe(v), I = IRR[v];
  if (temps === 'present') return g === 3 ? I.pres[p] : g === 2 ? v.slice(0, -2) + ['is', 'is', 'it', 'issons', 'issez', 'issent'][p] : rad1(v, TERM.pres1[p]) + TERM.pres1[p];
  if (temps === 'imparfait') { const t = TERM.imp[p]; return g === 3 ? I.imp + t : g === 2 ? v.slice(0, -2) + 'iss' + t : rad1(v, t) + t; }
  if (temps === 'futur') return (g === 3 ? I.fut : v) + TERM.fut[p];
  if (temps === 'conditionnel') return (g === 3 ? I.fut : v) + TERM.imp[p];
  if (temps === 'passe_simple') { if (g === 3) return I.ps[p]; if (g === 2) return v.slice(0, -2) + TERM.ps2[p]; const t = TERM.ps1[p]; return rad1(v, t) + t; }
  if (temps === 'subjonctif') return g === 3 ? I.subj[p] : g === 2 ? v.slice(0, -2) + 'iss' + TERM.subj[p] : v.slice(0, -2) + TERM.subj[p];
  if (temps === 'imperatif') { const k = { 1: 0, 3: 1, 4: 2 }[p]; if (g === 3) return I.ipa[k]; if (g === 2) return v.slice(0, -2) + ['is', 'issons', 'issez'][k]; const t = ['e', 'ons', 'ez'][k]; return rad1(v, t) + t; }
}
const PP = v => IRR[v] ? IRR[v].pp : V2.includes(v) ? v.slice(0, -1) : v.slice(0, -2) + 'é';
const COMPOSE = { passe_compose: 'present', plus_que_parfait: 'imparfait', futur_anterieur: 'futur', conditionnel_passe: 'conditionnel' };
// p : 0-5 ; genre/nombre du sujet pour l'accord avec être ; renvoie la forme sans le pronom
function conjuguer(v, temps, p, fem) {
  if (!COMPOSE[temps]) return simple(v, temps, p);
  const etre = ETRE_V.includes(v), aux = simple(etre ? 'être' : 'avoir', COMPOSE[temps], p);
  let pp = PP(v); if (etre) { if (fem) pp += 'e'; if (p >= 3) pp += 's'; }
  return aux + ' ' + pp;
}
const NOM_TEMPS = { present: 'présent', imparfait: 'imparfait', futur: 'futur simple', passe_simple: 'passé simple', passe_compose: 'passé composé', plus_que_parfait: 'plus-que-parfait', futur_anterieur: 'futur antérieur', conditionnel: 'conditionnel présent', conditionnel_passe: 'conditionnel passé', subjonctif: 'subjonctif présent', imperatif: 'impératif présent' };
const minus1 = s => s.charAt(0).toLowerCase() + s.slice(1);
const elide = forme => /^[aeéèêiîoôuh]/i.test(forme);
// sujets : pronoms ou prénoms (p = personne ; fem pour l'accord)
const SUJETS = [
  { s: 'je', p: 0 }, { s: 'tu', p: 1 }, { s: 'il', p: 2 }, { s: 'elle', p: 2, f: 1 }, { s: 'nous', p: 3 }, { s: 'vous', p: 4 }, { s: 'ils', p: 5 }, { s: 'elles', p: 5, f: 1 },
  { s: 'Amara', p: 2, f: 1 }, { s: 'Noah', p: 2 }, { s: 'Amara et Noah', p: 5 }, { s: 'Les filles', p: 5, f: 1 }, { s: 'Papa', p: 2 }, { s: 'Les élèves', p: 5 }
];
const VERBES_CLASSE = {
  1: ['être', 'avoir'], 2: ['être', 'avoir', 'aller', 'faire', 'chanter', 'danser', 'jouer', 'parler', 'manger', 'marcher', 'laver', 'porter'],
  3: ['être', 'avoir', 'aller', 'faire', 'finir', 'grandir', 'choisir', ...V1.slice(0, 16)],
  4: ['être', 'avoir', 'aller', 'faire', 'dire', 'venir', 'prendre', ...V2.slice(0, 5), ...V1],
  5: [...Object.keys(IRR), ...V2, ...V1], 6: [...Object.keys(IRR), ...V2, ...V1]
};
function genConjugaison(r, o) {
  const temps = o.temps, n = Math.min(o.nombre, 12), items = [], vus = new Set(), choix = o.classe <= 2;
  const verbes = o.verbes || VERBES_CLASSE[o.classe];
  let g = 0;
  while (items.length < n && g++ < 4000) {
    const tps = choisir(r, temps), v = choisir(r, verbes);
    if (tps === 'imperatif' && !(IRR[v] ? IRR[v].ipa : true)) continue;
    let sj = choisir(r, SUJETS);
    if (tps === 'imperatif') sj = choisir(r, [{ s: '(tu)', p: 1 }, { s: '(nous)', p: 3 }, { s: '(vous)', p: 4 }]);
    if (COMPOSE[tps] && ETRE_V.includes(v) && [0, 1, 3, 4].includes(sj.p)) continue;   // accord : seulement avec un sujet dont on voit le genre
    const forme = conjuguer(v, tps, sj.p, sj.f), cle = v + tps + sj.s;
    if (vus.has(cle)) continue; vus.add(cle);
    let sujet = sj.s;
    if (tps === 'subjonctif') {
      const bas = /^(Les|Le|La) /.test(sj.s) ? minus1(sj.s) : sj.s;
      sujet = sj.s === 'je' ? (elide(forme) ? "Il faut que j'" : 'Il faut que je') : (/^[aeiouéèh]/i.test(bas) ? "Il faut qu'" + bas : 'Il faut que ' + bas);
    } else if (sj.s === 'je' && elide(forme)) sujet = "J'";
    let opts = null;
    if (choix) { const autres = melanger(r, [0, 1, 2, 3, 4, 5].filter(q => q !== sj.p).map(q => conjuguer(v, tps, q))).filter(x => x !== forme); opts = melanger(r, [forme, ...[...new Set(autres)].slice(0, 2)]); }
    items.push({ sujet: tps === 'imperatif' || tps === 'subjonctif' ? sujet : maj1(sujet), forme, v, tps, opts });
  }
  const unTemps = temps.length === 1;
  return {
    titre: 'Conjugaison' + (unTemps ? ' : ' + NOM_TEMPS[temps[0]] : ''),
    consigne: choix ? 'Choisis la bonne forme du verbe.' : unTemps ? `Conjugue le verbe au ${NOM_TEMPS[temps[0]]}.` : 'Conjugue le verbe au temps demandé.',
    aide: 'conjugaison',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit conj">${i + 1}. ${x.sujet}${x.sujet.endsWith("'") ? '' : ' '}${choix ? repChoix(sol, x.forme, x.opts) : vide(sol, x.forme, true)} <span class="inf">(${x.v}${unTemps ? '' : ', ' + NOM_TEMPS[x.tps]})</span></div>`).join('')}</div>`
  };
}

// ================= SIL / CP : lettres, sons, syllabes =================
const VOYELLES = 'aeiouy';
function genLettresFR(r, o) {
  const n = Math.min(o.nombre, 12), items = [], alpha = 'abcdefghijklmnopqrstuvwxyz';
  while (items.length < n) {
    if (items.length % 2) { const i = entre(r, 1, 24); items.push({ t: `${alpha[i - 1]} &nbsp; ${'□'} &nbsp; ${alpha[i + 1]}`, c: alpha[i], typ: 'manque' }); }
    else { const l = alpha[entre(r, 0, 25)]; items.push({ t: `<b class="grosse-lettre">${l.toUpperCase()} ${l}</b>`, c: VOYELLES.includes(l) ? 'voyelle' : 'consonne', typ: 'vc' }); }
  }
  return {
    titre: 'Les lettres', consigne: 'Voyelle ou consonne ? Les voyelles sont : a, e, i, o, u, y. Trouve aussi la lettre qui manque.', aide: 'lettresfr',
    rendu: sol => `<div class="grille col2">${items.map(x => x.typ === 'vc' ? `<div class="calc petit">${x.t} ${repChoix(sol, x.c, ['voyelle', 'consonne'])}</div>` : `<div class="calc petit">${x.t.replace('□', sol ? `<span class="rep">${x.c}</span>` : '<span class="ligne courte"></span>')}</div>`).join('')}</div>`
  };
}

const MOTS_SYL = [['ba', 'na', 'ne', '🍌'], ['ma', 'man', '👩'], ['pa', 'pa', '👨'], ['to', 'ma', 'te', '🍅'], ['mou', 'ton', '🐑'], ['la', 'pin', '🐇'], ['vé', 'lo', '🚲'], ['li', 'vre', '📕'], ['pi', 'ro', 'gue', '🛶'], ['ma', 'ni', 'oc'], ['pa', 'pa', 'ye'], ['a', 'na', 'nas', '🍍'], ['mo', 'to', '🏍️'], ['ca', 'deau', '🎁'], ['jar', 'din'], ['é', 'co', 'le', '🏫'], ['pou', 'le', '🐔'], ['chè', 'vre', '🐐'], ['ca', 'ma', 'ra', 'de'], ['ta', 'pis'], ['ra', 'dio', '📻'], ['ca', 'hier', '📒'], ['so', 'leil', '☀️'], ['ta', 'ble']];
function genSyllabes(r, o) {
  const n = Math.min(o.nombre, 10), items = [], liste = melanger(r, MOTS_SYL);
  for (let i = 0; i < n && i < liste.length; i++) {
    const m = liste[i], emo = /\p{Extended_Pictographic}/u.test(m[m.length - 1]) ? m[m.length - 1] : '', syl = emo ? m.slice(0, -1) : m;
    if (i % 2) { const j = entre(r, 0, syl.length - 1), autres = melanger(r, MOTS_SYL.flat().filter(s => s.length > 1 && !/\p{Extended_Pictographic}/u.test(s) && s !== syl[j])); items.push({ emo, typ: 'manque', mot: syl.map((s, k) => k === j ? '□' : s).join(''), c: syl[j], opts: melanger(r, [syl[j], ...[...new Set(autres)].slice(0, 2)]) }); }
    else items.push({ emo, typ: 'compte', mot: syl.join(''), dec: syl.join(' - '), c: syl.length });
  }
  return {
    titre: 'Les syllabes', consigne: 'Tape dans tes mains pour chaque syllabe. Compte les syllabes, ou trouve la syllabe qui manque.', aide: 'syllabes',
    rendu: sol => `<div class="grille col2">${items.map(x => x.typ === 'compte'
      ? `<div class="calc petit">${x.emo} <b>${x.mot}</b> : ${vide(sol, x.c)} syllabes${sol ? ` <span class="petitnote">(${x.dec})</span>` : ''}</div>`
      : `<div class="calc petit">${x.emo} <b>${x.mot.replace('□', '<span class="trou">…</span>')}</b> ${repChoix(sol, x.c, x.opts)}</div>`).join('')}</div>`
  };
}

const MOTS_SONS = [['mouton', 'ou', '🐑'], ['poule', 'ou', '🐔'], ['bouche', 'ou', '👄'], ['roue', 'ou', '🛞'], ['ballon', 'on', '⚽'], ['maison', 'on', '🏠'], ['savon', 'on', '🧼'], ['bonbon', 'on', '🍬'], ['maman', 'an', '👩'], ['enfant', 'an', '🧒'], ['éléphant', 'an', '🐘'], ['pantalon', 'an', '👖'], ['lapin', 'in', '🐇'], ['jardin', 'in', '🌳'], ['sapin', 'in', '🌲'], ['matin', 'in', '🌅'], ['roi', 'oi', '👑'], ['poisson', 'oi', '🐟'], ['étoile', 'oi', '⭐'], ['voiture', 'oi', '🚗'], ['chat', 'ch', '🐈'], ['chèvre', 'ch', '🐐'], ['vache', 'ch', '🐄'], ['chemise', 'ch', '👕']];
function genSons(r, o) {
  const n = Math.min(o.nombre, 12), items = [], liste = melanger(r, MOTS_SONS), sons = ['ou', 'on', 'an', 'in', 'oi', 'ch'];
  for (let i = 0; i < n && i < liste.length; i++) {
    const [mot, son, emo] = liste[i], k = mot.indexOf(son);
    items.push({ emo, trou: mot.slice(0, k) + '□' + mot.slice(k + son.length), mot, c: son, opts: melanger(r, [son, ...melanger(r, sons.filter(s => s !== son)).slice(0, 2)]) });
  }
  return {
    titre: 'Les sons', consigne: 'Regarde l\'image et dis le mot. Quel son manque ? ou, on, an, in, oi, ch.', aide: 'sons',
    audio: items.map(x => x.mot).join('. '),
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${x.emo} <b>${x.trou.replace('□', '<span class="trou">…</span>')}</b> ${repChoix(sol, x.c, x.opts)}</div>`).join('')}</div>`
  };
}

// ================= Grammaire =================
const CATS = { personne: ['maman', 'papa', 'élève', 'maître', 'docteur', 'bébé', 'maîtresse', 'grand-mère'], animal: ['chèvre', 'poule', 'chien', 'chat', 'poisson', 'mouton', 'éléphant', 'singe'], chose: ['table', 'cahier', 'ballon', 'chaise', 'livre', 'assiette', 'marmite', 'crayon'] };
function genCategories(r, o) {
  const n = Math.min(o.nombre, 12), items = [], vus = new Set();
  while (items.length < n) { const c = choisir(r, Object.keys(CATS)), m = choisir(r, CATS[c]); if (vus.has(m)) continue; vus.add(m); items.push({ m, c }); }
  return {
    titre: 'Personne, animal ou chose ?', consigne: 'Ce nom désigne-t-il une personne, un animal ou une chose ?', aide: 'categories',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit"><b>${x.m}</b> ${repChoix(sol, x.c, ['personne', 'animal', 'chose'])}</div>`).join('')}</div>`
  };
}

const NOMS_M = ['ballon', 'cahier', 'livre', 'chien', 'mouton', 'vélo', 'crayon', 'sac', 'pagne', 'manguier', 'poisson', 'tambour'];
const NOMS_F = ['table', 'chaise', 'poule', 'chèvre', 'maison', 'case', 'robe', 'banane', 'mangue', 'moto', 'voiture', 'marmite'];
function genArticles(r, o) {
  const n = Math.min(o.nombre, 12), items = [], vus = new Set(), cp = o.classe >= 2;
  let g = 0;
  while (items.length < n && g++ < 500) {
    const f = r() < 0.5, m = choisir(r, f ? NOMS_F : NOMS_M); if (vus.has(m)) continue; vus.add(m);
    const typ = cp ? choisir(r, ['un', 'le', 'pos']) : choisir(r, ['un', 'le']);
    if (typ === 'un') items.push({ m, c: f ? 'une' : 'un', opts: ['un', 'une'] });
    else if (typ === 'le') items.push({ m, c: f ? 'la' : 'le', opts: ['le', 'la'] });
    else { const pl = r() < 0.33; items.push({ m: pl ? m + 's' : m, c: pl ? 'mes' : f ? 'ma' : 'mon', opts: ['mon', 'ma', 'mes'] }); }
  }
  return {
    titre: cp ? 'Un, une, le, la, mon, ma, mes' : 'Un ou une ? Le ou la ?', consigne: 'Choisis le bon petit mot devant le nom.', aide: 'articles',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${repChoix(sol, x.c, x.opts)} <b>${x.m}</b></div>`).join('')}</div>`
  };
}

const PHR_PRON = [['Amara', 'Elle'], ['Noah', 'Il'], ['Le chien', 'Il'], ['La poule', 'Elle'], ['Les enfants', 'Ils'], ['Les filles', 'Elles'], ['Amara et Noah', 'Ils'], ['Grâce et Manuela', 'Elles'], ['Papa', 'Il'], ['Maman et Tata', 'Elles'], ['Le maître', 'Il'], ['Les chèvres', 'Elles'], ['Junior et Brice', 'Ils'], ['La maîtresse', 'Elle']];
const FINS_ANIMAUX = ['mange du maïs', 'dort sous le manguier', 'court dans la cour', 'boit de l\'eau'];
const FINS = ['mange une mangue', 'joue au ballon', 'chante à l\'école', 'danse dans la cour', 'regarde le ciel', 'marche vers le marché', 'lave les assiettes'];
function genPronoms(r, o) {
  const n = Math.min(o.nombre, 10), items = melanger(r, PHR_PRON).slice(0, n).map(([s, p]) => {
    const animal = /chèvre|poule|chien/.test(s);
    let v = choisir(r, animal ? FINS_ANIMAUX : FINS); if (['Ils', 'Elles'].includes(p)) v = v.replace(/^(\S+?)(e|t) /, (m, a, b) => b === 't' ? a + 'vent ' : a + 'ent ').replace(/^dorvent/, 'dorment').replace(/^courvent/, 'courent').replace(/^boivent/, 'boivent');
    return { s, p, v };
  });
  return {
    titre: 'Les pronoms il, elle, ils, elles', consigne: 'Remplace le groupe en gras par il, elle, ils ou elles.', aide: 'pronoms',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. <b>${x.s}</b> ${x.v}. → ${repChoix(sol, x.p, ['Il', 'Elle', 'Ils', 'Elles'])} ${x.v}.</div>`).join('')}</div>`
  };
}

// Nature des mots dans une petite phrase
const ADJ = [['petit', 'petite'], ['grand', 'grande'], ['joli', 'jolie'], ['gros', 'grosse'], ['jeune', 'jeune'], ['beau', 'belle']];
const VERBE_OBJ = [['mange', ['une mangue', 'une banane', 'du plantain']], ['regarde', ['le ballon', 'un cahier', 'la marmite']], ['cherche', ['le ballon', 'un cahier', 'la clé']], ['porte', ['la marmite', 'un cahier', 'le panier']], ['lave', ['la marmite', 'les assiettes']], ['trouve', ['le ballon', 'un cahier', 'la clé']]];
function genNature(r, o) {
  const cp = o.classe <= 2, cm = o.classe >= 5, n = Math.min(o.nombre, 10), items = [];
  const natures = cp ? ['nom', 'verbe'] : cm ? ['nom', 'verbe', 'adjectif', 'article', 'pronom'] : ['nom', 'verbe', 'adjectif', 'article'];
  while (items.length < n) {
    const f = r() < 0.5, nom = choisir(r, f ? ['fille', 'maîtresse', 'vendeuse', 'cuisinière'] : ['garçon', 'maître', 'cuisinier', 'vendeur']), [am, af] = choisir(r, ADJ), adj = f ? af : am;
    const art = f ? 'La' : 'Le', [v, objs] = choisir(r, VERBE_OBJ), obj = choisir(r, objs), pron = r() < 0.4 && cm;
    const mots = pron ? [[f ? 'Elle' : 'Il', 'pronom'], [v, 'verbe'], ...obj.split(' ').map((w, k) => [w, k ? 'nom' : 'article'])] : [[art, 'article'], [adj, 'adjectif'], [nom, 'nom'], [v, 'verbe'], ...obj.split(' ').map((w, k) => [w, k ? 'nom' : 'article'])];
    const cands = mots.filter(m => natures.includes(m[1])), [mot, nat] = choisir(r, cands);
    const phrase = mots.map(m => m[0]).join(' ') + '.';
    if (items.some(x => x.phrase === phrase && x.mot === mot)) continue;
    items.push({ phrase, mot, nat });
  }
  return {
    titre: cp ? 'Le nom et le verbe' : 'La nature des mots', consigne: 'Quelle est la nature du mot souligné ?', aide: 'nature',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x.phrase.replace(new RegExp('(^|\\s)' + x.mot + '(?=[\\s.])'), '$1<u><b>' + x.mot + '</b></u>')} ${repChoix(sol, x.nat, natures)}</div>`).join('')}</div>`
  };
}

const PLURIELS = [['mangue', 'mangues', 1], ['ballon', 'ballons', 1], ['cahier', 'cahiers', 1], ['élève', 'élèves', 1], ['oiseau', 'oiseaux', 1], ['gâteau', 'gâteaux', 1], ['jeu', 'jeux', 1], ['cheveu', 'cheveux', 2], ['bateau', 'bateaux', 1], ['cheval', 'chevaux', 2], ['journal', 'journaux', 2], ['animal', 'animaux', 2], ['hôpital', 'hôpitaux', 2], ['chou', 'choux', 3], ['bijou', 'bijoux', 3], ['genou', 'genoux', 3], ['caillou', 'cailloux', 3], ['clou', 'clous', 3], ['trou', 'trous', 3], ['travail', 'travaux', 4], ['corail', 'coraux', 4], ['rail', 'rails', 4], ['éventail', 'éventails', 4], ['festival', 'festivals', 4], ['bal', 'bals', 4], ['nez', 'nez', 2], ['souris', 'souris', 2], ['bras', 'bras', 2], ['prix', 'prix', 3]];
function genPluriel(r, o) {
  const niv = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 4 }[o.classe] || 2, n = Math.min(o.nombre, 12);
  const items = melanger(r, PLURIELS.filter(x => x[2] <= niv)).slice(0, n);
  return {
    titre: 'Le pluriel des noms', consigne: 'Écris le nom au pluriel. En général on ajoute s. Attention : eau → eaux, al → aux' + (niv >= 3 ? ', et 7 mots en ou prennent x (bijou, caillou, chou, genou, hibou, joujou, pou)' : '') + (niv >= 4 ? ' ; travail → travaux, mais rail → rails' : '') + '.', aide: 'pluriel',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">un ${x[0]} → des ${vide(sol, x[1], true)}</div>`).join('')}</div>`
  };
}

const ADJ_ACC = [['petit', 'petite', 'petits', 'petites'], ['grand', 'grande', 'grands', 'grandes'], ['content', 'contente', 'contents', 'contentes'], ['joli', 'jolie', 'jolis', 'jolies'], ['beau', 'belle', 'beaux', 'belles'], ['gentil', 'gentille', 'gentils', 'gentilles'], ['gros', 'grosse', 'gros', 'grosses'], ['blanc', 'blanche', 'blancs', 'blanches'], ['heureux', 'heureuse', 'heureux', 'heureuses'], ['sportif', 'sportive', 'sportifs', 'sportives'], ['nouveau', 'nouvelle', 'nouveaux', 'nouvelles'], ['long', 'longue', 'longs', 'longues'], ['bon', 'bonne', 'bons', 'bonnes'], ['fatigué', 'fatiguée', 'fatigués', 'fatiguées'], ['rapide', 'rapide', 'rapides', 'rapides']];
const GN_ACC = [['Noah', 0], ['Amara', 1], ['Les garçons', 2], ['Les filles', 3], ['Junior', 0], ['Grâce', 1], ['Mes frères', 2], ['Mes sœurs', 3], ['Le chien', 0], ['La chèvre', 1]];
function genAccord(r, o) {
  const n = Math.min(o.nombre, 12), items = [], vus = new Set(), max = o.classe <= 3 ? 9 : ADJ_ACC.length;
  let g = 0;
  while (items.length < n && g++ < 500) {
    const a = choisir(r, ADJ_ACC.slice(0, max)), [s, k] = choisir(r, o.classe <= 2 ? GN_ACC.filter(x => x[1] < 2) : GN_ACC), cle = a[0] + s;
    if (vus.has(cle)) continue; vus.add(cle);
    items.push({ s, verbe: k >= 2 ? 'sont' : 'est', c: a[k], base: a[0] });
  }
  return {
    titre: o.classe <= 2 ? 'Masculin et féminin' : 'Accorder l\'adjectif', consigne: 'Accorde l\'adjectif avec le nom : féminin → souvent + e ; pluriel → souvent + s.', aide: 'accord',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x.s} ${x.verbe} ${vide(sol, x.c, true)}. <span class="inf">(${x.base})</span></div>`).join('')}</div>`
  };
}

const TYPES_PH = [['Amara va à l\'école.', 'déclarative'], ['Noah mange du plantain.', 'déclarative'], ['Il pleut beaucoup ce matin.', 'déclarative'], ['Où est ton cahier ?', 'interrogative'], ['As-tu fini ton travail ?', 'interrogative'], ['Pourquoi pleures-tu ?', 'interrogative'], ['Quelle belle robe !', 'exclamative'], ['Comme il fait chaud !', 'exclamative'], ['Bravo, tu as gagné !', 'exclamative'], ['Ferme la porte.', 'impérative'], ['Range tes affaires.', 'impérative'], ['Lave-toi les mains avant de manger.', 'impérative'], ['Le marché est plein de monde.', 'déclarative'], ['Combien coûtent les mangues ?', 'interrogative']];
function genTypesPhrases(r, o) {
  const petit = o.classe <= 2, n = Math.min(o.nombre, 10), items = melanger(r, TYPES_PH).slice(0, n);
  if (petit) return {
    titre: 'La ponctuation : . ? !', consigne: 'Choisis le bon signe à la fin de la phrase : le point (.), le point d\'interrogation (?) ou le point d\'exclamation (!).', aide: 'ponctuation',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => { const s = x[0].slice(-1), p = x[0].slice(0, -1).trim(); return `<div class="calc petit">${i + 1}. ${p} ${repChoix(sol, s, ['.', '?', '!'])}</div>`; }).join('')}</div>`
  };
  return {
    titre: 'Les types de phrases', consigne: 'Quel est le type de chaque phrase ?', aide: 'typesphrases',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x[0]} ${repChoix(sol, x[1], ['déclarative', 'interrogative', 'exclamative', 'impérative'])}</div>`).join('')}</div>`
  };
}

// Voix active / passive (CM)
const ACT = [['Le chat', 0, 'mange', 'la souris', 1, 'mangé'], ['Le mécanicien', 0, 'répare', 'la voiture', 1, 'réparé'], ['Maman', 1, 'prépare', 'le repas', 0, 'préparé'], ['Le maître', 0, 'corrige', 'le cahier', 0, 'corrigé'], ['Amara', 1, 'lave', 'la marmite', 1, 'lavé'], ['Le vent', 0, 'casse', 'la branche', 1, 'cassé'], ['Le chien', 0, 'garde', 'la maison', 1, 'gardé'], ['Noah', 0, 'range', 'le ballon', 0, 'rangé'], ['La pluie', 1, 'arrose', 'le champ', 0, 'arrosé'], ['Le planteur', 0, 'récolte', 'le cacao', 0, 'récolté']];
function genVoix(r, o) {
  const cm2 = o.classe === 6, n = Math.min(o.nombre, 8), items = melanger(r, ACT).slice(0, n).map(([s, , v, c, cf, pp], i) => {
    const sujPas = /^[A-Z][a-zâ]+$/.test(s) && !/^(Le|La)$/.test(s.split(' ')[0]) ? s : minus1(s);
    const active = `${s} ${v} ${c}.`, passive = `${maj1(c)} est ${pp}${cf ? 'e' : ''} par ${sujPas}.`;
    return { active, passive, montre: cm2 && i % 2 ? 'trans' : r() < 0.5 ? 'active' : 'passive' };
  });
  return {
    titre: cm2 ? 'Voix active et voix passive' : 'Reconnaître la voix active ou passive', aide: 'voix',
    consigne: cm2 ? 'Dis si la phrase est à la voix active ou passive. Puis transforme les phrases actives à la voix passive.' : 'La phrase est-elle à la voix active ou à la voix passive ? À la voix passive, le sujet subit l\'action (« est … par »).',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => x.montre === 'trans'
      ? `<div class="calc petit">${i + 1}. ${x.active}<br>→ ${vide(sol, x.passive, true)}</div>`
      : `<div class="calc petit">${i + 1}. ${x.montre === 'active' ? x.active : x.passive} ${repChoix(sol, x.montre, ['active', 'passive'])}</div>`).join('')}</div>`
  };
}

// Accord du participe passé avec être (CM)
function genAccordPP(r, o) {
  const n = Math.min(o.nombre, 10), items = [], verbes = [['arriver', 'arrivé'], ['partir', 'parti'], ['tomber', 'tombé'], ['venir', 'venu'], ['rentrer', 'rentré'], ['sortir', 'sorti'], ['monter', 'monté'], ['descendre', 'descendu']];
  const sujets = [['Amara', 'est', 'e'], ['Noah', 'est', ''], ['Les filles', 'sont', 'es'], ['Les garçons', 'sont', 's'], ['Maman et Grâce', 'sont', 'es'], ['Papa et Junior', 'sont', 's'], ['La maîtresse', 'est', 'e'], ['Le car', 'est', '']], quand = ['hier', 'ce matin', 'à midi', 'tôt', 'en retard'];
  const vus = new Set(); let g = 0;
  while (items.length < n && g++ < 500) {
    const [inf, pp] = choisir(r, verbes), [s, aux, t] = choisir(r, sujets); if (vus.has(inf + s)) continue; vus.add(inf + s);
    items.push({ s, aux, inf, c: pp + t, q: choisir(r, quand) });
  }
  return {
    titre: 'Le participe passé avec être', consigne: 'Avec l\'auxiliaire être, le participe passé s\'accorde avec le sujet : Amara est partie, les garçons sont partis.', aide: 'accordpp',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x.s} ${x.aux} ${vide(sol, x.c, true)} ${x.q}. <span class="inf">(${x.inf})</span></div>`).join('')}</div>`
  };
}

// ================= Orthographe : homophones =================
const HOMO = {
  'a/à': [['Amara □ une poupée.', 'a'], ['Noah va □ l\'école.', 'à'], ['Il □ faim.', 'a'], ['Maman part □ Douala.', 'à'], ['Junior □ perdu son stylo.', 'a'], ['Nous mangeons □ midi.', 'à'], ['Elle □ un vélo rouge.', 'a'], ['Je joue □ la balle.', 'à']],
  'et/est': [['Le ciel □ bleu.', 'est'], ['Amara □ Noah jouent.', 'et'], ['Papa □ au marché.', 'est'], ['Je mange du riz □ du poisson.', 'et'], ['La mangue □ mûre.', 'est'], ['Il chante □ il danse.', 'et']],
  'son/sont': [['Les enfants □ à l\'école.', 'sont'], ['Noah range □ cahier.', 'son'], ['Elles □ contentes.', 'sont'], ['Amara lave □ assiette.', 'son'], ['Les mangues □ mûres.', 'sont'], ['Il prend □ sac.', 'son']],
  'on/ont': [['Les élèves □ fini.', 'ont'], ['□ va au marché.', 'On'], ['Ils □ une grande maison.', 'ont'], ['Le soir, □ regarde la télé.', 'on'], ['Mes amis □ un ballon.', 'ont'], ['À l\'école, □ apprend à lire.', 'on']],
  'ou/où': [['Tu veux du thé □ du lait ?', 'ou'], ['□ est ton cahier ?', 'Où'], ['La ville □ j\'habite est belle.', 'où'], ['Viens lundi □ mardi.', 'ou'], ['Je ne sais pas □ il est.', 'où'], ['Une mangue □ une banane ?', 'ou']],
  'ces/ses': [['Le chat lèche □ pattes.', 'ses'], ['Amara se brosse □ dents.', 'ses'], ['Papa lave □ mains.', 'ses'], ['□ enfants-là jouent au ballon.', 'Ces'], ['Regarde □ oiseaux-là !', 'ces'], ['Achète □ mangues-ci !', 'ces']],
  'la/là/l\'a': [['Pose ton sac □ !', 'là'], ['□ poule picore.', 'La'], ['Le ballon ? Noah □ pris.', 'l\'a'], ['Je vois □ maison.', 'la'], ['Mon cahier ? Le maître □ corrigé.', 'l\'a'], ['Reste □, je reviens.', 'là']],
  'peu/peut': [['Il □ venir demain.', 'peut'], ['Elle mange un □ de riz.', 'peu'], ['Amara □ courir vite.', 'peut'], ['Il y a □ d\'eau dans le seau.', 'peu'], ['Noah ne □ pas sortir.', 'peut'], ['J\'ai □ de temps.', 'peu']],
  'mes/mais': [['J\'ai pris □ cahiers.', 'mes'], ['Il pleut, □ nous sortons.', 'mais'], ['Je cherche □ chaussures.', 'mes'], ['Elle est fatiguée □ contente.', 'mais'], ['□ amis sont venus.', 'Mes'], ['C\'est loin, □ j\'y vais.', 'mais']]
};
const HOMO_CLASSE = { 3: ['a/à', 'et/est', 'son/sont', 'on/ont'], 4: ['a/à', 'et/est', 'son/sont', 'on/ont', 'ou/où', 'ces/ses'], 5: ['on/ont', 'a/à', 'la/là/l\'a', 'et/est', 'mes/mais', 'peu/peut'], 6: ['on/ont', 'a/à', 'la/là/l\'a', 'et/est', 'mes/mais', 'peu/peut', 'ou/où', 'ces/ses'] };
function genHomophones(r, o) {
  const paires = HOMO_CLASSE[o.classe] || HOMO_CLASSE[3], n = Math.min(o.nombre, 12), toutes = melanger(r, paires.flatMap(p => HOMO[p].map(x => [...x, p]))).slice(0, n);
  const items = toutes.map(([ph, c, p]) => ({ ph, c, opts: p.split('/').map(x => /^[A-ZÀ-Ý]/.test(c) ? maj1(x) : x) }));
  return {
    titre: 'Les homophones : ' + paires.join(', '), consigne: 'Choisis le bon mot. Astuce : « a » se remplace par « avait », « est » par « était », « sont » par « étaient », « ont » par « avaient ».', aide: 'homophones',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x.ph.replace('□', repChoix(sol, x.c, x.opts))}</div>`).join('')}</div>`
  };
}

// ================= Vocabulaire =================
const CONTRAIRES = [['grand', 'petit'], ['chaud', 'froid'], ['jour', 'nuit'], ['ouvrir', 'fermer'], ['monter', 'descendre'], ['rapide', 'lent'], ['propre', 'sale'], ['plein', 'vide'], ['gagner', 'perdre'], ['entrer', 'sortir'], ['lourd', 'léger'], ['riche', 'pauvre'], ['haut', 'bas'], ['vieux', 'jeune'], ['commencer', 'finir'], ['rire', 'pleurer'], ['acheter', 'vendre'], ['devant', 'derrière']];
const SYNONYMES = [['content', 'joyeux'], ['beau', 'joli'], ['bâtir', 'construire'], ['finir', 'terminer'], ['crier', 'hurler'], ['docteur', 'médecin'], ['voiture', 'automobile'], ['regarder', 'observer'], ['peur', 'frayeur'], ['commencer', 'débuter'], ['maison', 'habitation'], ['cadeau', 'présent']];
const NIVEAUX_L = [['bagnole', 'voiture', 'automobile'], ['bouquin', 'livre', 'ouvrage'], ['bouffer', 'manger', 'se restaurer'], ['boulot', 'travail', 'labeur'], ['gamin', 'enfant', 'bambin'], ['fringues', 'vêtements', 'tenue'], ['se barrer', 's\'en aller', 'se retirer']];
const FAMILLES = [['dent', ['dentiste', 'dentifrice', 'dentier'], 'danse'], ['jardin', ['jardinier', 'jardinage', 'jardiner'], 'jaune'], ['chant', ['chanteur', 'chanter', 'chanson'], 'champ'], ['nage', ['nageur', 'nager', 'natation'], 'neige'], ['terre', ['terrain', 'enterrer', 'souterrain'], 'terreur'], ['lait', ['laitier', 'laitage', 'allaiter'], 'laid'], ['pêche', ['pêcheur', 'pêcher', 'repêcher'], 'péché'], ['fleur', ['fleurir', 'fleuriste', 'fleuri'], 'flûte']];
function genVocabulaire(r, o) {
  const cm = o.classe >= 5, n = Math.min(o.nombre, 10), items = [];
  const types = cm ? ['contr', 'syn', 'niv', 'fam'] : ['contr', 'syn', 'contr', 'fam'];
  let g = 0;
  while (items.length < n && g++ < 500) {
    const t = types[items.length % types.length];
    if (t === 'contr') { const p = choisir(r, CONTRAIRES), k = entre(r, 0, 1), autres = melanger(r, CONTRAIRES.filter(x => x !== p)).slice(0, 2).map(x => x[k ? 0 : 1]); items.push({ q: `Le contraire de « ${p[k]} » :`, c: p[1 - k], opts: melanger(r, [p[1 - k], ...autres]) }); }
    else if (t === 'syn') { const p = choisir(r, SYNONYMES), autres = melanger(r, SYNONYMES.filter(x => x !== p)).slice(0, 2).map(x => x[1]); items.push({ q: `Un mot de même sens que « ${p[0]} » :`, c: p[1], opts: melanger(r, [p[1], ...autres]) }); }
    else if (t === 'niv') { const p = choisir(r, NIVEAUX_L), k = entre(r, 0, 2); items.push({ q: `« ${p[k]} » est un mot de langage :`, c: ['familier', 'courant', 'soutenu'][k], opts: ['familier', 'courant', 'soutenu'] }); }
    else { const [m, fam, intrus] = choisir(r, FAMILLES); items.push({ q: `Quel mot n'est pas de la famille de « ${m} » ?`, c: intrus, opts: melanger(r, [intrus, ...fam]) }); }
    if (items.slice(0, -1).some(x => x.q === items[items.length - 1].q)) items.pop();
  }
  return {
    titre: cm ? 'Vocabulaire : sens des mots, niveaux de langue' : 'Vocabulaire : contraires, synonymes, familles', consigne: 'Choisis la bonne réponse.', aide: 'vocabulaire',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x.q} ${repChoix(sol, x.c, x.opts)}</div>`).join('')}</div>`
  };
}

// ================= Dictées =================
const DICTEES = {
  1: ['papa', 'maman', 'moto', 'ami', 'lit', 'riz', 'pipe', 'tomate', 'mur', 'vélo', 'lune', 'pomme'],
  2: ['le mouton', 'la maison', 'un lapin', 'le roi', 'la poule', 'un ballon', 'la voiture', 'le jardin', 'une étoile', 'le chat', 'la chèvre', 'un enfant'],
  3: ['Amara va à l\'école avec son frère.', 'Le coq chante tôt le matin.', 'Maman achète des tomates au marché.', 'Noah joue au ballon dans la cour.', 'La pluie tombe sur le toit de la case.', 'Les élèves lisent un beau livre.', 'Papa répare la moto de mon oncle.', 'Le soir, nous mangeons du plantain.'],
  4: ['Le samedi, toute la famille va au champ.', 'Grand-mère raconte une histoire sous le manguier.', 'Les enfants portent de l\'eau dans des seaux.', 'Au marché de Bafoussam, il y a beaucoup de légumes.', 'Le maître écrit la date au tableau.', 'Après la pluie, les chemins sont pleins de boue.', 'Junior a gagné la course de l\'école.', 'Nous plantons des arbres autour de l\'école.'],
  5: ['Le car quitte la gare routière très tôt le matin.', 'Les voyageurs rangent leurs bagages sur le toit.', 'Pendant la saison sèche, le vent soulève la poussière.', 'Les pêcheurs de Kribi rentrent avec leurs pirogues chargées.', 'Le docteur conseille de dormir sous une moustiquaire.', 'Chaque matin, les élèves chantent l\'hymne national.', 'Ma tante vend du poisson braisé au bord de la route.', 'Le fleuve Sanaga traverse une grande partie du pays.'],
  6: ['Les cultivateurs attendent impatiemment les premières pluies.', 'Le directeur a félicité les élèves qui ont réussi l\'examen.', 'Dans la forêt, on entend le cri des oiseaux et le bruit des branches.', 'Les infirmières ont vacciné tous les enfants du village.', 'Si tu travailles régulièrement, tu réussiras ton concours.', 'Le mont Cameroun est le plus haut sommet d\'Afrique centrale.', 'Les cacaoyers donnent des cabosses jaunes et rouges.', 'Nos ancêtres nous ont transmis de nombreux contes et proverbes.']
};
function genDictee(r, o) {
  const k = o.classe, n = k <= 2 ? Math.min(o.nombre, 8) : Math.min(o.nombre, 5), items = melanger(r, DICTEES[k]).slice(0, n), mots = k <= 2;
  return {
    titre: mots ? 'Dictée de mots' : 'Dictée de phrases', consigne: mots ? 'Écoute le mot et écris-le.' : 'Écoute la phrase et écris-la. N\'oublie pas la majuscule et le point.', aide: 'dictee',
    audio: items.join(mots ? '. ' : ' '), dictee: true,
    vorlesen: { html: `<ol class="texte-dictee">${items.map(x => `<li>${x}</li>`).join('')}</ol><p class="petitnote">Lisez chaque ${mots ? 'mot' : 'phrase'} deux fois, lentement.</p>` },
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${sol ? `<span class="rep" data-audio="${x.replace(/"/g, '&quot;')}">${x}</span>` : '<span class="ligne longue"></span>'}</div>`).join('')}</div>`
  };
}

// ================= Lecture (textes + vrai/faux) =================
const TEXTES_LEC = {
  petit: [
    { t: 'Le marché', x: 'Maman va au marché. Elle achète des tomates et des bananes. Amara porte le panier. Le panier est lourd.', q: [['Maman va au marché.', 'vrai'], ['Elle achète des mangues.', 'faux'], ['Amara porte le panier.', 'vrai'], ['Le panier est léger.', 'faux']] },
    { t: 'La poule', x: 'Noah a une poule. La poule est noire. Elle pond un œuf chaque matin. Noah donne du maïs à la poule.', q: [['La poule est blanche.', 'faux'], ['La poule pond un œuf.', 'vrai'], ['Noah donne du maïs à la poule.', 'vrai'], ['Amara a une poule.', 'faux']] },
    { t: 'La pluie', x: 'Il pleut. Les enfants rentrent vite à la maison. Papa ferme la porte. Le chat dort près du feu.', q: [['Il fait beau.', 'faux'], ['Les enfants rentrent à la maison.', 'vrai'], ['Papa ferme la fenêtre.', 'faux'], ['Le chat dort.', 'vrai']] },
    { t: 'À l\'école', x: 'Junior est à l\'école. Il lit un livre. La maîtresse écrit au tableau. À midi, Junior mange du riz.', q: [['Junior est au marché.', 'faux'], ['La maîtresse écrit au tableau.', 'vrai'], ['Junior lit un livre.', 'vrai'], ['À midi, il mange du plantain.', 'faux']] }
  ],
  moyen: [
    { t: 'Le champ de grand-père', x: 'Pendant les vacances, Amara et Noah vont au village. Leur grand-père a un grand champ de maïs et d\'arachides. Le matin, ils partent tôt avec lui. Noah arrache les mauvaises herbes. Amara arrose les jeunes plants avec un arrosoir. À midi, grand-mère apporte du couscous et de la sauce gombo. Le soir, les enfants sont fatigués mais heureux.', q: [['Les enfants vont au village pendant les vacances.', 'vrai'], ['Le grand-père cultive du cacao.', 'faux'], ['Amara arrose les plants.', 'vrai'], ['Grand-mère apporte du couscous à midi.', 'vrai'], ['Le soir, les enfants sont tristes.', 'faux']] },
    { t: 'Le match de football', x: 'Samedi, l\'école de Junior joue contre l\'école du quartier voisin. Tous les élèves sont venus encourager leur équipe. Au début, l\'équipe de Junior perd un but à zéro. Puis Brice marque un beau but de la tête. À la dernière minute, Junior marque le deuxième but. Les supporters chantent et dansent. Le directeur offre un ballon neuf à l\'équipe.', q: [['Le match a lieu samedi.', 'vrai'], ['L\'équipe de Junior gagne au début.', 'faux'], ['Brice marque un but de la tête.', 'vrai'], ['Junior marque le premier but.', 'faux'], ['Le directeur offre un ballon neuf.', 'vrai']] },
    { t: 'La fête de l\'école', x: 'Pour la fête de fin d\'année, la classe de CE2 prépare une danse traditionnelle. Les filles portent des pagnes de toutes les couleurs. Les garçons jouent du tam-tam. Les parents sont assis sous un grand arbre. Après la danse, le maître donne des prix aux meilleurs élèves. Grâce reçoit un dictionnaire.', q: [['La classe prépare une chanson.', 'faux'], ['Les garçons jouent du tam-tam.', 'vrai'], ['Les parents sont assis sous un arbre.', 'vrai'], ['Grâce reçoit un dictionnaire.', 'vrai'], ['Les filles portent des robes blanches.', 'faux']] }
  ],
  grand: [
    { t: 'Le voyage à Kribi', x: 'Pendant les grandes vacances, la famille de Manuela a quitté Yaoundé pour Kribi. Le voyage en car a duré près de quatre heures. En arrivant, les enfants ont couru vers la plage pour voir la mer. Le lendemain, ils ont visité les chutes de la Lobé, où la rivière tombe directement dans l\'océan. Le soir, ils ont dégusté du poisson braisé avec des bâtons de manioc. Manuela a promis d\'écrire un récit de ce voyage pour sa classe.', q: [['La famille habite à Douala.', 'faux'], ['Le voyage a duré environ quatre heures.', 'vrai'], ['Les chutes de la Lobé tombent dans l\'océan.', 'vrai'], ['Ils ont mangé du poulet le soir.', 'faux'], ['Manuela veut raconter son voyage à sa classe.', 'vrai']] },
    { t: 'Le paludisme', x: 'Depuis deux jours, Ekane avait de la fièvre et mal à la tête. Sa mère l\'a conduit au centre de santé. L\'infirmière a fait un test : c\'était le paludisme. Elle lui a donné des médicaments et a expliqué que cette maladie est transmise par un moustique. « Pour vous protéger, dormez toujours sous une moustiquaire et ne laissez pas d\'eau stagnante autour de la maison », a-t-elle conseillé. Une semaine plus tard, Ekane était guéri et retournait à l\'école.', q: [['Ekane avait de la fièvre.', 'vrai'], ['Son père l\'a conduit à l\'hôpital.', 'faux'], ['Le paludisme est transmis par un moustique.', 'vrai'], ['Il faut garder de l\'eau stagnante près de la maison.', 'faux'], ['Ekane a guéri en une semaine.', 'vrai']] },
    { t: 'La coopérative du village', x: 'Les planteurs du village de Mbarga ont créé une coopérative. Avant, chacun vendait son cacao seul et les acheteurs payaient un prix très bas. Maintenant, ils rassemblent leurs sacs dans un magasin et les vendent ensemble. Avec l\'argent gagné, la coopérative a construit un puits et acheté des bancs pour l\'école. Le président de la coopérative dit souvent : « L\'union fait la force. »', q: [['Les planteurs cultivent du café.', 'faux'], ['Avant, les acheteurs payaient un prix bas.', 'vrai'], ['La coopérative a construit un puits.', 'vrai'], ['Elle a acheté des tables pour la mairie.', 'faux'], ['Le président aime dire « L\'union fait la force ».', 'vrai']] }
  ]
};
function genLecture(r, o) {
  const niv = o.classe <= 2 ? 'petit' : o.classe <= 4 ? 'moyen' : 'grand', tx = choisir(r, TEXTES_LEC[niv]), qs = melanger(r, tx.q);
  return {
    titre: 'Lecture : ' + tx.t, consigne: 'Lis le texte (ou écoute-le). Puis dis si chaque phrase est vraie ou fausse.', aide: 'lecture',
    audio: tx.t + '. ' + tx.x, lireTexte: true,
    rendu: sol => `<div class="texte-lecture"><h3>${tx.t}</h3><p>${tx.x}</p></div><div class="grille col1">${qs.map(([q, c], i) => `<div class="calc petit">${i + 1}. ${q} ${repChoix(sol, c, ['vrai', 'faux'])}</div>`).join('')}</div>`
  };
}

// ================= Catalogue Français =================
(() => {
  const t = (id, nom, domaine, gen, k, defs, plus) => ({ id, fach: FR, nom, domaine, gen, options: ['nombre'], fixe: Object.assign({ classe: k }, plus || {}), defs: defs || { nombre: '12' } });
  const conj = (k, id, nom, temps, defs) => t(id, nom, D_CONJ, genConjugaison, k, defs || { nombre: '12' }, { temps });
  const AJ = {
    1: [t('lettresfr', 'Les lettres : voyelles et consonnes', D_LEC, genLettresFR, 1), t('syllabes', 'Les syllabes', D_LEC, genSyllabes, 1, { nombre: '6' }), t('lecture', 'Lire et comprendre', D_LEC, genLecture, 1, { nombre: '6' }), t('dictee', 'Dictée de mots', D_ECR, genDictee, 1, { nombre: '6' }),
      t('categories', 'Personne, animal ou chose', D_GRA, genCategories, 1), t('articles', 'Un, une, le, la', D_GRA, genArticles, 1), t('ponctuation', 'La ponctuation', D_GRA, genTypesPhrases, 1, { nombre: '6' }), conj(1, 'conj', 'Être et avoir au présent', ['present'], { nombre: '6' })],
    2: [t('sons', 'Les sons ou, on, an, in, oi, ch', D_LEC, genSons, 2), t('syllabes', 'Les syllabes', D_LEC, genSyllabes, 2, { nombre: '6' }), t('lecture', 'Lire et comprendre', D_LEC, genLecture, 2, { nombre: '6' }), t('dictee', 'Dictée de mots', D_ECR, genDictee, 2, { nombre: '6' }),
      t('nature', 'Le nom et le verbe', D_GRA, genNature, 2, { nombre: '6' }), t('articles', 'Un, une, le, la, mon, ma, mes', D_GRA, genArticles, 2), t('pronoms', 'Il, elle, ils, elles', D_GRA, genPronoms, 2, { nombre: '6' }), t('accord', 'Masculin et féminin', D_GRA, genAccord, 2, { nombre: '6' }), t('ponctuation', 'La ponctuation', D_GRA, genTypesPhrases, 2, { nombre: '6' }),
      conj(2, 'conj', 'Conjugaison : le présent', ['present']), conj(2, 'futur', 'Conjugaison : le futur', ['futur'])],
    3: [t('lecture', 'Lire et comprendre', D_LEC, genLecture, 3, { nombre: '6' }), t('dictee', 'Dictée de phrases', D_ECR, genDictee, 3, { nombre: '6' }), t('nature', 'La nature des mots', D_GRA, genNature, 3, { nombre: '6' }), t('typesphrases', 'Les types de phrases', D_GRA, genTypesPhrases, 3, { nombre: '6' }), t('accord', 'Accorder l\'adjectif', D_GRA, genAccord, 3), t('pronoms', 'Les pronoms personnels', D_GRA, genPronoms, 3, { nombre: '6' }),
      conj(3, 'conj', 'Conjugaison : le présent', ['present']), conj(3, 'futur', 'Conjugaison : le futur', ['futur']), conj(3, 'pc', 'Conjugaison : le passé composé', ['passe_compose']),
      t('pluriel', 'Le pluriel des noms', D_ORT, genPluriel, 3), t('homophones', 'Les homophones (a/à, et/est…)', D_ORT, genHomophones, 3), t('vocabulaire', 'Contraires, synonymes, familles', D_VOC, genVocabulaire, 3, { nombre: '6' })],
    4: [t('lecture', 'Lire et comprendre', D_LEC, genLecture, 4, { nombre: '6' }), t('dictee', 'Dictée de phrases', D_ECR, genDictee, 4, { nombre: '6' }), t('nature', 'La nature des mots', D_GRA, genNature, 4, { nombre: '6' }), t('typesphrases', 'Les types de phrases', D_GRA, genTypesPhrases, 4, { nombre: '6' }), t('accord', 'Accorder l\'adjectif', D_GRA, genAccord, 4),
      conj(4, 'conj', 'Conjugaison : le présent', ['present']), conj(4, 'imparfait', 'Conjugaison : l\'imparfait', ['imparfait']), conj(4, 'futur', 'Conjugaison : le futur', ['futur']), conj(4, 'pc', 'Conjugaison : le passé composé', ['passe_compose']), conj(4, 'ps', 'Conjugaison : le passé simple', ['passe_simple']), conj(4, 'melange', 'Conjugaison : tous les temps', ['present', 'imparfait', 'futur', 'passe_compose', 'passe_simple']),
      t('pluriel', 'Le pluriel des noms', D_ORT, genPluriel, 4), t('homophones', 'Les homophones (ou/où, ces/ses…)', D_ORT, genHomophones, 4), t('vocabulaire', 'Contraires, synonymes, familles', D_VOC, genVocabulaire, 4, { nombre: '6' })]
  };
  [5, 6].forEach(k => {
    const cm2 = k === 6;
    AJ[k] = [t('lecture', 'Lire et comprendre', D_LEC, genLecture, k, { nombre: '6' }), t('dictee', 'Dictée de phrases', D_ECR, genDictee, k, { nombre: '6' }), t('nature', 'La nature des mots', D_GRA, genNature, k, { nombre: '6' }), t('typesphrases', 'Les types de phrases', D_GRA, genTypesPhrases, k, { nombre: '6' }), t('voix', cm2 ? 'Voix active et voix passive' : 'La voix active et passive', D_GRA, genVoix, k, { nombre: '6' }),
      conj(k, 'indicatif', 'Indicatif : temps simples', ['present', 'imparfait', 'futur', 'passe_simple']), conj(k, 'composes', 'Indicatif : temps composés', ['passe_compose', 'plus_que_parfait', 'futur_anterieur']), conj(k, 'imperatif', 'L\'impératif présent', ['imperatif'], { nombre: '6' }),
      conj(k, 'conditionnel', cm2 ? 'Le conditionnel présent et passé' : 'Le conditionnel présent', cm2 ? ['conditionnel', 'conditionnel_passe'] : ['conditionnel']), conj(k, 'subjonctif', 'Le subjonctif présent', ['subjonctif']),
      t('accordpp', 'Le participe passé avec être', D_ORT, genAccordPP, k, { nombre: '6' }), t('pluriel', 'Le pluriel des noms (al, ail, ou)', D_ORT, genPluriel, k), t('homophones', 'Les homophones (on/ont, la/là/l\'a…)', D_ORT, genHomophones, k), t('vocabulaire', 'Sens des mots et niveaux de langue', D_VOC, genVocabulaire, k, { nombre: '8' })];
  });
  Object.keys(AJ).forEach(k => { THEMES[k] = [...(THEMES[k] || []), ...AJ[k]]; });
})();
