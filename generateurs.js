// Générateurs de fiches de mathématiques (programme MINEDUB 2018). Ici : outils communs + CE1 et CE2.
// Les autres classes (SIL, CP, CM1, CM2) sont dans generateurs2.js.
// Tous les calculs sont faits par le code : pas d'erreur possible.
// Un même numéro de fiche (graine) donne toujours la même fiche.

function rngDe(graine) {            // petit générateur pseudo-aléatoire (mulberry32)
  let a = graine >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const entre = (r, min, max) => min + Math.floor(r() * (max - min + 1));
const choisir = (r, liste) => liste[Math.floor(r() * liste.length)];
function melanger(r, liste) {
  const l = liste.slice();
  for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; }
  return l;
}
const vide = (sol, val, large) => sol
  ? `<span class="rep">${val}</span>`
  : `<span class="trou${large ? ' large' : ''}"></span>`;
// Les grands nombres s'écrivent avec une espace : 3 450 (espace insécable, le nombre ne se coupe pas)
const fmtNb = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const CE1 = k => k <= 3;                         // CE1 (ou avant) → nombres jusqu'à 1 000 ; CE2 → 10 000
// Nombres étudiés dans chaque classe : SIL 0-20, CP 0-100, CE1 100-1 000, CE2 1 000-10 000, CM1 jusqu'au million, CM2 jusqu'au milliard
const MAXC = { 1: 20, 2: 100, 3: 1000, 4: 10000, 5: 1000000, 6: 1000000000 };
const MINC = { 1: 0, 2: 10, 3: 100, 4: 1000, 5: 10000, 6: 1000000 };
const PASC = { 1: 10, 2: 10, 3: 100, 4: 1000, 5: 10000, 6: 1000000 };
const NOMPAS = { 10: 'dizaines', 100: 'centaines', 1000: 'milliers', 10000: 'dizaines de mille', 1000000: 'millions' };
const maxCl = k => MAXC[k];

// ---------- Nombres en lettres (orthographe traditionnelle, utilisée à l'école au Cameroun) ----------
const UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
const DIZAINES = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
function moins100(n) {
  if (n < 17) return UNITES[n];
  if (n < 20) return 'dix-' + UNITES[n - 10];
  const d = Math.floor(n / 10), u = n % 10;
  if (d <= 6) return DIZAINES[d] + (u === 0 ? '' : u === 1 ? ' et un' : '-' + UNITES[u]);
  if (d === 7) return 'soixante' + (u === 1 ? ' et onze' : '-' + moins100(10 + u));
  if (d === 8) return u === 0 ? 'quatre-vingts' : 'quatre-vingt-' + UNITES[u];
  return 'quatre-vingt-' + moins100(10 + u);
}
function moins1000(n) {
  const c = Math.floor(n / 100), r = n % 100;
  if (c === 0) return moins100(r);
  const cent = c === 1 ? 'cent' : UNITES[c] + ' cent';
  return r ? cent + ' ' + moins100(r) : cent + (c > 1 ? 's' : '');
}
function enLettres(n) {
  if (n < 1000) return moins1000(n);
  const md = Math.floor(n / 1e9), mi = Math.floor(n / 1e6) % 1000, m = Math.floor(n / 1000) % 1000, r = n % 1000, parts = [];
  // « million » et « milliard » sont des noms : ils prennent un s (deux cents millions). « mille » est invariable.
  if (md) parts.push(moins1000(md) + ' milliard' + (md > 1 ? 's' : ''));
  if (mi) parts.push(moins1000(mi) + ' million' + (mi > 1 ? 's' : ''));
  if (m) parts.push(m === 1 ? 'mille' : moins1000(m).replace(/(cent|vingt)s$/, '$1') + ' mille');
  if (r) parts.push(moins1000(r));
  return parts.join(' ');
}

// ---------- NOMBRES ----------

function genLettres(r, o) {
  const max = maxCl(o.classe), min = MINC[o.classe], n = Math.min(o.nombre, 12), items = [], vus = new Set();
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    let x = entre(r, min, max - 1);
    if (r() < 0.3 && x > 20) x = Math.round(x / 10) * 10 || x;          // quelques nombres ronds
    if (vus.has(x)) continue; vus.add(x);
    items.push({ x, lettres: items.length % 2 === 0 });
  }
  return {
    titre: 'Lire et écrire les nombres',
    consigne: 'Écris le nombre en lettres ou en chiffres.',
    rendu: sol => `<div class="grille col1">${items.map(i => i.lettres
      ? `<div class="calc petit">${fmtNb(i.x)} → ${sol ? `<span class="rep">${enLettres(i.x)}</span>` : '<span class="ligne longue"></span>'}</div>`
      : `<div class="calc petit">${enLettres(i.x)} → ${vide(sol, fmtNb(i.x), true)}</div>`).join('')}</div>`
  };
}

function genDecomposer(r, o) {
  const ce2 = !CE1(o.classe), max = maxCl(o.classe), n = Math.min(o.nombre, 12), items = [];
  const noms = ce2 ? ['m', 'c', 'd', 'u'] : ['c', 'd', 'u'];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    const x = entre(r, max / 10, max - 1), ch = String(x).split('');
    items.push({ x, ch, sens: r() < 0.5 });
  }
  const leg = ce2 ? 'm = mille, c = centaines, d = dizaines, u = unités.' : 'c = centaines, d = dizaines, u = unités.';
  return {
    titre: 'Décomposer les nombres',
    consigne: 'Décompose le nombre ou retrouve-le. ' + leg,
    rendu: sol => `<div class="grille col2">${items.map(i => i.sens
      ? `<div class="calc petit">${i.ch.map((c, k) => `${c} ${noms[k]}`).join(' + ')} = ${vide(sol, fmtNb(i.x), true)}</div>`
      : `<div class="calc petit">${fmtNb(i.x)} = ${i.ch.map((c, k) => `${vide(sol, c)} ${noms[k]}`).join(' + ')}</div>`).join('')}</div>`
  };
}

function genComparer(r, o) {
  const max = maxCl(o.classe), pas = PASC[o.classe], mini = MINC[o.classe], n = Math.min(o.nombre, 18), items = [];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    if (items.length % 3 === 2) {      // encadrer
      let x = entre(r, pas + 1, max - 1); if (x % pas === 0) x++;
      items.push({ enc: true, x, a: Math.floor(x / pas) * pas, b: Math.floor(x / pas) * pas + pas });
    } else {
      const a = entre(r, mini, max - 1);
      let b = r() < 0.15 ? a : r() < 0.5 ? a + choisir(r, [-pas, -1, 1, pas, -10, 10, 9, -9]) : entre(r, mini, max - 1);
      if (b < 0 || b > max) b = entre(r, mini, max - 1);
      items.push({ a, b, s: a < b ? '<' : a > b ? '>' : '=' });
    }
  }
  return {
    titre: 'Comparer et encadrer les nombres',
    consigne: `Compare avec <, > ou =. Encadre le nombre entre deux ${NOMPAS[pas]}.`,
    rendu: sol => `<div class="grille col3">${items.map(x => x.enc
      ? `<div class="calc petit">${vide(sol, fmtNb(x.a), true)} < ${fmtNb(x.x)} < ${vide(sol, fmtNb(x.b), true)}</div>`
      : `<div class="calc">${fmtNb(x.a)} ${sol ? `<span class="rep rond">${x.s}</span>` : '<span class="rond"></span>'} ${fmtNb(x.b)}</div>`).join('')}</div>`
  };
}

function genSuites(r, o) {
  const ce1 = CE1(o.classe), max = maxCl(o.classe), n = Math.min(o.nombre, 8), items = [];
  const pas = { 1: [1, 2, 1, 2, 1], 2: [10, 2, 5, 10, 1], 3: [100, 10, 50, 5, 2], 4: [1000, 100, 500, 50, 10], 5: [10000, 1000, 5000, 100000, 500], 6: [100000, 1000000, 10000, 500000, 50000] }[o.classe];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    const p = pas[items.length % pas.length], monte = r() < 0.75;
    const debut = monte ? entre(r, 0, Math.floor((max - 6 * p) / p)) * p + (p < 50 ? entre(r, 0, p - 1) : 0) : entre(r, 6, Math.floor(max / p)) * p;
    const suite = Array.from({ length: 7 }, (_, i) => monte ? debut + i * p : debut - i * p);
    if (suite.some(x => x < 0 || x > max)) continue;
    const trous = new Set(melanger(r, [1, 2, 3, 4, 5, 6]).slice(0, 3));
    items.push({ p, monte, suite, trous });
  }
  return {
    titre: 'Suites de nombres jusqu\'à ' + fmtNb(max),
    consigne: 'Trouve la règle et complète la suite.',
    rendu: sol => `<div class="grille col1">${items.map(x => `<div class="calc petit suite"><small>${x.monte ? '+' : '−'} ${x.p}</small> ${x.suite.map((v, i) => x.trous.has(i) ? vide(sol, fmtNb(v), true) : fmtNb(v)).join(' ; ')}</div>`).join('')}</div>`
  };
}

// ---------- OPÉRATIONS ----------

function genCalcul(r, o) {
  const ce1 = CE1(o.classe), n = o.nombre, items = [], vus = new Set();
  let e = 0;
  while (items.length < n && e++ < 5000) {
    const op = o.operation === 'mix' ? choisir(r, ['+', '-']) : o.operation;
    // calcul mental : nombres « faciles » (dizaines, centaines)
    const unite = choisir(r, ce1 ? [1, 10, 10, 100] : [10, 100, 100, 1000]), lim = ce1 ? 1000 : 10000;
    let a = entre(r, 1, lim / unite - 1) * unite, b = entre(r, 1, Math.min(ce1 ? 99 : 999, lim / unite - 1)) * (unite === 1 ? 1 : unite);
    if (unite === 1) { a = entre(r, 100, 999); b = entre(r, 2, 9); }
    if (op === '+' && a + b > lim) continue;
    if (op === '-' && b >= a) continue;
    const c = op === '+' ? a + b : a - b;
    const cle = a + op + b; if (vus.has(cle)) continue; vus.add(cle);
    const trou = o.niveau == 3 ? choisir(r, ['a', 'b', 'c']) : 'c';
    items.push({ a, b, c, op: op === '-' ? '−' : '+', trou });
  }
  return {
    titre: 'Calcul mental : additions et soustractions',
    consigne: o.niveau == 3 ? 'Calcule dans ta tête. Trouve le nombre qui manque.' : 'Calcule dans ta tête.',
    kontrolle: items.map(x => x[x.trou]),
    rendu: sol => `<div class="grille col3">${items.map(t =>
      `<div class="calc">${t.trou === 'a' ? vide(sol, fmtNb(t.a), true) : fmtNb(t.a)} ${t.op} ${t.trou === 'b' ? vide(sol, fmtNb(t.b), true) : fmtNb(t.b)} = ${t.trou === 'c' ? vide(sol, fmtNb(t.c), true) : fmtNb(t.c)}</div>`).join('')}</div>`
  };
}

function cellules(nombre, largeur, sol, visible = true) {
  const s = String(nombre).padStart(largeur, ' ');
  return [...s].map(c => `<span class="case">${visible || sol ? (c === ' ' ? '' : (visible ? c : `<b class="rep">${c}</b>`)) : ''}</span>`).join('');
}
function genPosees(r, o) {
  const max = Math.min(maxCl(o.classe), 1000000), op = o.operation === 'mix' ? null : o.operation, n = Math.min(o.nombre, 12), items = [];
  let e = 0;
  while (items.length < n && e++ < 20000) {
    const ope = op || choisir(r, ['+', '-']);
    let a, b;
    if (ope === '+') { a = entre(r, max / 10, max * 0.7); b = entre(r, max / 20, max - a - 1); }
    else { a = entre(r, max / 5, max - 1); b = entre(r, max / 20, a - 1); }
    a = Math.floor(a); b = Math.floor(b);
    const retenue = ope === '+' ? String(a).split('').reverse().some((d, i) => +d + +(String(b).split('').reverse()[i] || 0) > 9)
      : String(a).split('').reverse().some((d, i) => +d < +(String(b).split('').reverse()[i] || 0));
    if (o.uebergang === 'ohne' && retenue) continue;
    if (o.uebergang === 'mit' && !retenue) continue;
    items.push({ a, b, ope, c: ope === '+' ? a + b : a - b });
  }
  const L = String(max).length;
  return {
    titre: max <= 100 ? 'Additions et soustractions posées jusqu\'à 100' : 'Additions et soustractions posées',
    consigne: 'Pose et calcule. Écris bien les unités sous les unités. Commence par la droite.',
    rendu: sol => `<div class="grille ${L > 4 ? 'col3' : 'col4'}">${items.map(x => `<div class="kolonne" style="--l:${L + 1}">
      <span class="case"></span>${cellules(x.a, L, sol)}
      <span class="case op">${x.ope === '-' ? '−' : '+'}</span>${cellules(x.b, L, sol)}
      <span class="trait"></span>
      <span class="case"></span>${cellules(x.c, L, sol, false)}</div>`).join('')}</div>`
  };
}

function genTables(r, o) {
  const reihen = o.reihen.length ? o.reihen : [3, 4, 5];
  const items = [], vus = new Set(); let e = 0;
  while (items.length < o.nombre && e++ < 5000) {
    const a = entre(r, 1, 10), b = choisir(r, reihen), c = a * b;
    const div = o.geteilt && r() < 0.35;
    const cle = (div ? 'd' : 'm') + a + 'x' + b; if (vus.has(cle) && vus.size < reihen.length * 20) continue; vus.add(cle);
    if (div) items.push({ v: a, txt: sol => `${c} : ${b} = ${vide(sol, a)}` });
    else if (o.niveau == 3 && r() < 0.5) items.push({ v: b, txt: sol => `${a} × ${vide(sol, b)} = ${c}` });
    else items.push({ v: c, txt: sol => `${b} × ${a} = ${vide(sol, c)}` });
  }
  return {
    titre: 'Tables de multiplication' + (reihen.length <= 3 ? ' : ' + reihen.join(', ') : ''),
    consigne: 'Calcule.', kontrolle: items.map(x => x.v),
    rendu: sol => `<div class="grille col3">${items.map(t => `<div class="calc">${t.txt(sol)}</div>`).join('')}</div>`
  };
}

function genMultiplication(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 8), items = [];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    if (!ce1 && items.length % 3 === 2) {       // × 10, × 100 en ligne
      const a = entre(r, 2, 99), m = choisir(r, [10, 100]); items.push({ ligne: true, t: `${a} × ${m} =`, c: a * m });
      continue;
    }
    const b = ce1 ? entre(r, 2, 9) : (o.niveau == 1 ? entre(r, 2, 9) : entre(r, 11, 49));
    const a = ce1 ? entre(r, o.niveau == 1 ? 11 : 102, o.niveau == 1 ? 99 : Math.floor(999 / b)) : entre(r, 102, Math.floor(9999 / b));
    items.push({ t: `${a} × ${b} =`, c: a * b });
  }
  return {
    titre: 'Multiplication posée', consigne: 'Pose la multiplication dans le quadrillage et calcule.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="carreaux"><div class="calc">${x.t} ${vide(sol, fmtNb(x.c), true)}</div>${x.ligne ? '' : '<div class="quadrillage"></div>'}</div>`).join('')}</div>`
  };
}

function genDivision(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 8), items = [], reste = o.niveau == 3;
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    const b = ce1 ? entre(r, 2, 9) : entre(r, 11, 25), q = ce1 ? entre(r, 11, Math.floor(999 / b)) : entre(r, 12, Math.floor(9999 / b));
    const rr = reste ? entre(r, 1, b - 1) : 0;
    items.push({ a: q * b + rr, b, q, rr });
  }
  return {
    titre: ce1 ? 'Division par un nombre d\'un chiffre' : 'Division par un nombre de deux chiffres',
    consigne: reste ? 'Pose la division. Écris le quotient et le reste.' : 'Pose la division dans le quadrillage et calcule.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="carreaux"><div class="calc">${fmtNb(x.a)} : ${x.b} = ${vide(sol, fmtNb(x.q), true)}${reste ? ` reste ${vide(sol, x.rr)}` : ''}</div><div class="quadrillage"></div></div>`).join('')}</div>`
  };
}

// Preuve par 9 de la multiplication : croix avec les restes
const reste9 = x => x % 9;
function genPreuve9(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 6), items = [];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    const b = ce1 ? entre(r, 2, 9) : entre(r, 11, 39), a = entre(r, 21, ce1 ? 199 : 499);
    let p = a * b; const faux = r() < 0.35;
    if (faux) p += choisir(r, [10, -10, 1, -1, 100, 2, -2]);      // une erreur à trouver (jamais un multiple de 9)
    const g = reste9(a), d = reste9(b), h = reste9(g * d), bas = reste9(p);
    items.push({ a, b, p, g, d, h, bas, ok: h === bas ? 'juste' : 'faux' });
  }
  const croix = (x, sol) => `<div class="croix9"><svg viewBox="0 0 100 100" aria-hidden="true"><line x1="10" y1="10" x2="90" y2="90"/><line x1="90" y1="10" x2="10" y2="90"/></svg>
    <span class="c-haut">${vide(sol, x.h)}</span><span class="c-gauche">${vide(sol, x.g)}</span><span class="c-droite">${vide(sol, x.d)}</span><span class="c-bas">${vide(sol, x.bas)}</span></div>`;
  return {
    titre: 'La preuve par 9',
    consigne: 'Fais la preuve par 9. À gauche : le reste du 1er nombre. À droite : le reste du 2e nombre. En haut : le reste de leur produit. En bas : le reste du résultat. Le calcul est-il juste ou faux ?',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="case-preuve"><div class="calc petit">${fmtNb(x.a)} × ${x.b} = ${fmtNb(x.p)}</div>${croix(x, sol)}<div>Le calcul est : ${sol ? `<span class="rep">${x.ok}</span>` : 'juste ☐ &nbsp; faux ☐'}</div></div>`).join('')}</div>`
  };
}

function genDoubleMoitie(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 16), items = [];
  const types = ce1 ? [['double', 2, 1], ['moitié', 2, -1], ['triple', 3, 1], ['tiers', 3, -1]]
    : [['double', 2, 1], ['moitié', 2, -1], ['triple', 3, 1], ['tiers', 3, -1], ['quadruple', 4, 1], ['quart', 4, -1]];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    const [nom, f, s] = types[items.length % types.length];
    const base = ce1 ? entre(r, 2, s > 0 ? 150 : 100) : entre(r, 11, s > 0 ? 900 : 500);
    const x = s > 0 ? base : base * f, c = s > 0 ? base * f : base;
    items.push({ nom, x, c });
  }
  const art = nom => /^[aeiouéè]/.test(nom) ? 'l\'' : (nom === 'moitié' ? 'la ' : 'le ');
  return {
    titre: ce1 ? 'Double et moitié, triple et tiers' : 'Double, moitié, triple, tiers, quadruple, quart',
    consigne: 'Complète.', kontrolle: items.map(x => x.c),
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${art(x.nom)}${x.nom} de ${fmtNb(x.x)} = ${vide(sol, fmtNb(x.c), true)}</div>`).join('')}</div>`
  };
}

function genPairs(r, o) {
  const max = maxCl(o.classe), n = Math.min(o.nombre, 18), items = [], vus = new Set();
  while (items.length < n && vus.size < 5000) { const x = entre(r, 10, max - 1); if (vus.has(x)) continue; vus.add(x); items.push(x); }
  return {
    titre: 'Nombres pairs et impairs',
    consigne: 'Le nombre est-il pair ou impair ? Regarde le chiffre des unités : 0, 2, 4, 6, 8 → pair.',
    rendu: sol => `<div class="grille col3">${items.map(x => `<div class="calc petit">${fmtNb(x)} : ${sol ? `<span class="rep">${x % 2 ? 'impair' : 'pair'}</span>` : 'pair ☐ impair ☐'}</div>`).join('')}</div>`
  };
}

// ---------- ENSEMBLES ----------
function genEnsembles(r, o) {
  const n = Math.min(o.nombre, 6), items = [];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    const taille = CE1(o.classe) ? 5 : 6, univers = melanger(r, Array.from({ length: 15 }, (_, i) => i + 1));
    const A = univers.slice(0, taille).sort((a, b) => a - b);
    const communs = entre(r, 1, 3);
    const B = [...univers.slice(0, communs), ...univers.slice(taille, taille + (taille - communs))].sort((a, b) => a - b);
    const inter = A.filter(x => B.includes(x)), union = [...new Set([...A, ...B])].sort((a, b) => a - b);
    const tests = melanger(r, [...A.slice(0, 2), univers[14], univers[13]]).slice(0, 3).map(x => ({ x, s: A.includes(x) ? '∈' : '∉' }));
    items.push({ A, B, inter, union, tests });
  }
  const ens = l => '{ ' + l.join(' ; ') + ' }';
  const ce2 = !CE1(o.classe);
  return {
    titre: 'Les ensembles',
    consigne: '∈ veut dire « appartient à », ∉ « n\'appartient pas à ». ∩ = l\'intersection (les éléments communs)' + (ce2 ? ', ∪ = la réunion (tous les éléments).' : '.') + ' Sépare les nombres par des points-virgules.',
    rendu: sol => items.map((x, i) => `<div class="probleme ensembles"><p><b>${i + 1}.</b> A = ${ens(x.A)} &nbsp; et &nbsp; B = ${ens(x.B)}</p>
      <p>${x.tests.map(t => `${t.x} ${sol ? `<span class="rep rond">${t.s}</span>` : '<span class="rond"></span>'} A`).join(' &nbsp; &nbsp; ')}</p>
      <p>A ∩ B = ${sol ? `<span class="rep">${ens(x.inter)}</span>` : '<span class="ligne"></span>'}</p>
      ${ce2 ? `<p>A ∪ B = ${sol ? `<span class="rep">${ens(x.union)}</span>` : '<span class="ligne longue"></span>'}</p>` : ''}</div>`).join('')
  };
}

// ---------- FRACTIONS ----------
function genFractions(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 9), items = [];
  const parts = ce1 ? [2, 3, 4] : [2, 3, 4, 5, 6, 8, 10];
  let e = 0;
  while (items.length < n && e++ < 2000) {
    const d = choisir(r, parts), k = entre(r, 1, d - 1);
    if (items.some(x => x.d === d && x.k === k) && e < 1000) continue;
    items.push({ d, k, rond: d <= 6 && r() < 0.5 });
  }
  const dessin = x => {
    if (x.rond) {
      const parts = Array.from({ length: x.d }, (_, i) => {
        const a0 = (i / x.d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / x.d) * 2 * Math.PI - Math.PI / 2;
        return `<path d="M50 50 L${(50 + 40 * Math.cos(a0)).toFixed(1)} ${(50 + 40 * Math.sin(a0)).toFixed(1)} A40 40 0 0 1 ${(50 + 40 * Math.cos(a1)).toFixed(1)} ${(50 + 40 * Math.sin(a1)).toFixed(1)} Z" fill="${i < x.k ? '#f4c542' : '#fff'}" stroke="#1d3557" stroke-width="2"/>`;
      }).join('');
      return `<svg viewBox="0 0 100 100" class="fraction-dessin">${parts}</svg>`;
    }
    const w = 160 / x.d;
    return `<svg viewBox="0 0 170 50" class="fraction-dessin">${Array.from({ length: x.d }, (_, i) => `<rect x="${5 + i * w}" y="5" width="${w}" height="40" fill="${i < x.k ? '#f4c542' : '#fff'}" stroke="#1d3557" stroke-width="2"/>`).join('')}</svg>`;
  };
  return {
    titre: 'Les fractions',
    consigne: 'Quelle partie est coloriée ? Écris la fraction, par exemple 3/4 (3 parts sur 4).',
    rendu: sol => `<div class="grille col3">${items.map(x => `<div class="case-fraction">${dessin(x)}<div>${vide(sol, x.k + '/' + x.d)}</div></div>`).join('')}</div>`
  };
}

// ---------- MESURES ----------
function genMonnaie(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 8), items = [];
  const valeurs = { 1: [25, 10, 5], 2: [100, 50, 25, 10, 5], 3: [1000, 500, 100, 50, 25, 10, 5] }[o.classe] || [5000, 2000, 1000, 500, 100, 50, 25, 10];
  const max = { 1: 100, 2: 500, 3: 5000 }[o.classe] || 10000;
  let e = 0;
  while (items.length < n && e++ < 3000) {
    const k = entre(r, o.classe <= 2 ? 2 : 3, o.classe <= 1 ? 4 : 6), sel = [];
    for (let i = 0; i < k; i++) sel.push(choisir(r, valeurs));
    sel.sort((a, b) => b - a);
    const total = sel.reduce((s, v) => s + v, 0);
    if (total > max || items.some(x => x.sel.join('+') === sel.join('+'))) continue;
    items.push({ sel, total });
  }
  const piece = v => v >= 1000 ? `<span class="billet">${fmtNb(v)} F</span>` : `<span class="piece${v < 100 ? ' cuivre' : ''}">${v} F</span>`;
  return {
    titre: 'La monnaie : le franc CFA',
    consigne: 'Combien d\'argent y a-t-il en tout ?', kontrolle: items.map(x => x.total),
    rendu: sol => `<div class="grille col2">${items.map(t =>
      `<div class="case-geld"><div class="argent">${t.sel.map(piece).join('')}</div><div>En tout : ${vide(sol, fmtNb(t.total), true)} F</div></div>`).join('')}</div>`
  };
}

function genMesures(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 16), items = [], vus = new Set();
  const regles = ce1
    ? [['m', 'cm', 100], ['m', 'dm', 10], ['dm', 'cm', 10], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'cL', 100]]
    : [['km', 'm', 1000], ['hm', 'm', 100], ['dam', 'm', 10], ['m', 'cm', 100], ['m', 'mm', 1000], ['kg', 'g', 1000], ['hg', 'g', 100], ['dag', 'g', 10], ['L', 'cL', 100], ['L', 'mL', 1000], ['daL', 'L', 10], ['hL', 'L', 100]];
  let e = 0;
  while (items.length < n && e++ < 1000) {
    const [g, p, f] = choisir(r, regles), x = entre(r, 1, 9), reste = entre(r, 1, f - 1);
    const type = o.niveau == 1 ? 0 : entre(r, 0, o.niveau == 2 ? 1 : 2);
    const cle = [g, p, x, type].join('-'); if (vus.has(cle)) continue; vus.add(cle);
    if (type === 0) items.push(sol => `${x} ${g} = ${vide(sol, fmtNb(x * f), true)} ${p}`);
    else if (type === 1) items.push(sol => `${x} ${g} ${reste} ${p} = ${vide(sol, fmtNb(x * f + reste), true)} ${p}`);
    else items.push(sol => `${fmtNb(x * f + reste)} ${p} = ${vide(sol, x)} ${g} ${vide(sol, reste)} ${p}`);
  }
  return {
    titre: 'Mesures : longueurs, masses, capacités',
    consigne: ce1 ? 'Convertis. 1 m = 10 dm = 100 cm ; 1 cm = 10 mm ; 1 kg = 1 000 g ; 1 L = 100 cL.'
      : 'Convertis. km, hm, dam, m, dm, cm, mm : on multiplie par 10 à chaque rang. Pareil pour g et L.',
    rendu: sol => `<div class="grille col2">${items.map(f => `<div class="calc petit">${f(sol)}</div>`).join('')}</div>`
  };
}

function horlogeSVG(h, m) {
  const ang = d => (d - 90) * Math.PI / 180, cx = 60, cy = 60;
  let traits = '';
  for (let i = 0; i < 60; i++) {
    const g = i % 5 === 0, r1 = g ? 46 : 50;
    traits += `<line x1="${cx + r1 * Math.cos(ang(i * 6))}" y1="${cy + r1 * Math.sin(ang(i * 6))}" x2="${cx + 53 * Math.cos(ang(i * 6))}" y2="${cy + 53 * Math.sin(ang(i * 6))}" stroke="#333" stroke-width="${g ? 2 : 0.7}"/>`;
  }
  let chiffres = '';
  for (let i = 1; i <= 12; i++) chiffres += `<text x="${cx + 37 * Math.cos(ang(i * 30))}" y="${cy + 37 * Math.sin(ang(i * 30)) + 4}" font-size="11" text-anchor="middle" font-family="Andika, Arial">${i}</text>`;
  const ah = ang((h % 12) * 30 + m * 0.5), am = ang(m * 6);
  return `<svg viewBox="0 0 120 120" class="horloge"><circle cx="60" cy="60" r="56" fill="#fff" stroke="#1f6f5c" stroke-width="4"/>${traits}${chiffres}
    <line x1="60" y1="60" x2="${60 + 25 * Math.cos(ah)}" y2="${60 + 25 * Math.sin(ah)}" stroke="#c0392b" stroke-width="5" stroke-linecap="round"/>
    <line x1="60" y1="60" x2="${60 + 42 * Math.cos(am)}" y2="${60 + 42 * Math.sin(am)}" stroke="#1d3557" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="3.5" fill="#333"/></svg>`;
}
function genHeure(r, o) {
  const minutes = o.niveau == 1 ? [0] : o.niveau == 2 ? [0, 30] : [0, 15, 30, 45];
  const n = Math.min(o.nombre, 12), items = [], vus = new Set(); let e = 0;
  while (items.length < n && e++ < 1000) {
    const h = entre(r, 1, 12), m = choisir(r, minutes);
    if (vus.has(h + ':' + m)) continue; vus.add(h + ':' + m);
    items.push({ h, m });
  }
  const pad = x => String(x).padStart(2, '0');
  return {
    titre: 'Lire l\'heure',
    consigne: 'Quelle heure est-il ? La petite aiguille (rouge) montre les heures, la grande (bleue) les minutes.',
    rendu: sol => `<div class="grille col4">${items.map(t =>
      `<div class="case-uhr">${horlogeSVG(t.h, t.m)}<div>${vide(sol, t.h + ' h ' + pad(t.m), true)}</div></div>`).join('')}</div>`
  };
}

function genPerimetre(r, o) {
  const ce1 = CE1(o.classe), n = Math.min(o.nombre, 6), items = [];
  let gardeN = 0;
  while (items.length < n && gardeN++ < 5000) {
    const carre = r() < 0.35, L = entre(r, 3, ce1 ? 12 : 25), l = carre ? L : entre(r, 2, L - 1);
    if (!carre && l === L) continue;
    const type = ce1 ? 'p' : choisir(r, ['p', 'a', 'a', 'cote']);
    items.push({ carre, L, l, type, p: 2 * (L + l), a: L * l });
  }
  const dessin = x => {
    const s = 9, w = Math.min(150, x.L * s), h = Math.min(90, x.l * s);
    return `<svg viewBox="0 0 190 ${h + 40}" class="rect-dessin"><rect x="20" y="10" width="${w}" height="${h}" fill="#e3f1ea" stroke="#1f6f5c" stroke-width="2.5"/>
      <text x="${20 + w / 2}" y="${h + 30}" text-anchor="middle" font-size="13">${x.type === 'cote' ? '?' : x.L + ' cm'}</text>
      <text x="${26 + w}" y="${10 + h / 2 + 4}" font-size="13">${x.carre ? '' : x.l + ' cm'}</text></svg>`;
  };
  const ques = (x, sol) => x.type === 'p' ? `Périmètre = ${vide(sol, x.p)} cm`
    : x.type === 'a' ? `Aire = ${vide(sol, x.a)} cm²`
    : `Le périmètre est ${x.p} cm. Longueur = ${vide(sol, x.L)} cm`;
  return {
    titre: ce1 ? 'Le périmètre du carré et du rectangle' : 'Périmètre et aire du rectangle',
    consigne: ce1 ? 'Calcule le périmètre (le tour de la figure). Rectangle : (L + l) × 2. Carré : côté × 4.'
      : 'Rectangle : périmètre = (L + l) × 2 ; aire = L × l. Carré : périmètre = côté × 4 ; aire = côté × côté.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="case-figure"><b>${x.carre ? 'Carré' : 'Rectangle'}</b>${dessin(x)}<div class="calc petit">${ques(x, sol)}</div></div>`).join('')}</div>`
  };
}

// ---------- PROBLÈMES DE LA VIE COURANTE ----------
function genProblemes(r, o) {
  const ce1 = CE1(o.classe), F = x => fmtNb(x) + ' F';
  const big = ce1 ? 1 : 10;
  const modeles = [
    p => { const a = entre(r, 3, 9) * 50 * big, b = entre(r, 2, 8) * 25 * big; return { t: `Maman achète un régime de plantain à ${F(a)} et des tomates à ${F(b)}. Combien dépense-t-elle ?`, calc: `${fmtNb(a)} + ${fmtNb(b)} = ${fmtNb(a + b)}`, rep: `Elle dépense ${F(a + b)}.` }; },
    p => { const a = entre(r, 4, 9) * 100 * big, b = entre(r, 1, 3) * 100 * big + 50 * big; return a > b && { t: `${p.n} a ${F(a)}. ${p.il} achète un cahier à ${F(b)}. Combien d'argent lui reste-t-il ?`, calc: `${fmtNb(a)} − ${fmtNb(b)} = ${fmtNb(a - b)}`, rep: `Il lui reste ${F(a - b)}.` }; },
    p => { const a = entre(r, ce1 ? 120 : 1200, ce1 ? 480 : 4800), b = entre(r, ce1 ? 100 : 1000, ce1 ? 450 : 4500); return { t: `Une école de Bafoussam a ${fmtNb(a)} filles et ${fmtNb(b)} garçons. Combien d'élèves a-t-elle en tout ?`, calc: `${fmtNb(a)} + ${fmtNb(b)} = ${fmtNb(a + b)}`, rep: `L'école a ${fmtNb(a + b)} élèves.` }; },
    p => { const a = entre(r, 40, 70), b = entre(r, 5, 25); return { t: `Un car part de Yaoundé pour Douala avec ${a} passagers. À Édéa, ${b} passagers descendent. Combien de passagers arrivent à Douala ?`, calc: `${a} − ${b} = ${a - b}`, rep: `${a - b} passagers arrivent à Douala.` }; },
    p => { const k = entre(r, 2, 9), g = ce1 ? entre(r, 2, 9) * 10 : entre(r, 25, 85); return { t: `Un planteur remplit ${k} sacs de cacao. Chaque sac pèse ${g} kg. Combien de kilogrammes de cacao a-t-il ?`, calc: `${k} × ${g} = ${k * g}`, rep: `Il a ${fmtNb(k * g)} kg de cacao.` }; },
    p => { const k = entre(r, 2, ce1 ? 6 : 9), q = entre(r, 3, ce1 ? 9 : 40) * 5; return { t: `Le maître partage ${k * q} craies entre ${k} classes. Chaque classe reçoit le même nombre de craies. Combien de craies a chaque classe ?`, calc: `${k * q} : ${k} = ${q}`, rep: `Chaque classe a ${q} craies.` }; },
    p => { const c = choisir(r, [150, 200, 250, 300]), k = entre(r, 2, ce1 ? 4 : 9); return { t: `Une course en moto-taxi coûte ${F(c)}. Papa fait ${k} courses dans la semaine. Combien paie-t-il ?`, calc: `${k} × ${c} = ${k * c}`, rep: `Il paie ${F(k * c)}.` }; },
    p => { const a = entre(r, ce1 ? 150 : 1200, ce1 ? 400 : 3000), b = entre(r, ce1 ? 60 : 500, a - 30); return { t: `Mama Ngono prépare ${fmtNb(a)} beignets pour le marché. Elle en vend ${fmtNb(b)}. Combien de beignets lui reste-t-il ?`, calc: `${fmtNb(a)} − ${fmtNb(b)} = ${fmtNb(a - b)}`, rep: `Il lui reste ${fmtNb(a - b)} beignets.` }; }
  ];
  const n = Math.min(o.nombre, 5), items = [], noms = melanger(r, PRENOMS), ordre = melanger(r, modeles.map((_, i) => i));
  let i = 0, e = 0;
  while (items.length < n && e++ < 200) {
    const [nom, g] = noms[i % noms.length];
    const res = modeles[ordre[i % ordre.length]]({ n: nom, il: g === 'f' ? 'Elle' : 'Il' });
    i++;
    if (res) items.push(res);
  }
  return {
    titre: 'Problèmes de la vie courante',
    consigne: 'Lis le problème. Écris l\'opération et la réponse par une phrase.',
    audio: items.map(x => x.t).join(' '),
    rendu: sol => items.map((x, k) => `<div class="probleme"><p><b>${k + 1}.</b> ${x.t}</p>
      <p>Opération : ${sol ? `<span class="rep">${x.calc}</span>` : '<span class="ligne"></span>'}</p>
      <p>Réponse : ${sol ? `<span class="rep">${x.rep}</span>` : '<span class="ligne longue"></span>'}</p></div>`).join('')
  };
}

// ---------- Catalogue (CE1 = 3, CE2 = 4) ----------
const MA = 'Mathématiques', NC = 'Nombres et calculs', MG = 'Mesures et grandeurs', GE = 'Géométrie et espace';
const THEMES = {};
[3, 4].forEach(k => {
  const ce1 = k === 3, f = { classe: k };
  THEMES[k] = [
    { id: 'lettres', fach: MA, nom: ce1 ? 'Nombres de 100 à 1 000 en lettres' : 'Nombres jusqu\'à 10 000 en lettres', domaine: NC, gen: genLettres, options: ['nombre'], fixe: f, defs: { nombre: '12' } },
    { id: 'decomposer', fach: MA, nom: 'Décomposer les nombres', domaine: NC, gen: genDecomposer, options: ['nombre'], fixe: f, defs: { nombre: '12' } },
    { id: 'comparer', fach: MA, nom: 'Comparer et encadrer', domaine: NC, gen: genComparer, options: ['nombre'], fixe: f },
    { id: 'suites', fach: MA, nom: ce1 ? 'Suites : de 100 en 100…' : 'Suites : de 1 000 en 1 000…', domaine: NC, gen: genSuites, options: ['nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'calcul', fach: MA, nom: 'Calcul mental (+ et −)', domaine: NC, gen: genCalcul, options: ['operation', 'niveau', 'nombre'], fixe: f },
    { id: 'posees', fach: MA, nom: 'Additions et soustractions posées', domaine: NC, gen: genPosees, options: ['operation', 'uebergang', 'nombre'], fixe: f, defs: { nombre: '12' } },
    { id: 'tables', fach: MA, nom: ce1 ? 'Tables de 3, 4 et 5' : 'Tables de 6, 7 et 8', domaine: NC, gen: genTables, options: ['reihen', 'geteilt', 'niveau', 'nombre'], fixe: f, defs: { reihen: ce1 ? [3, 4, 5] : [6, 7, 8] } },
    { id: 'multiplication', fach: MA, nom: ce1 ? 'Multiplier par un nombre d\'un chiffre' : 'Multiplier par 2 chiffres, par 10, par 100', domaine: NC, gen: genMultiplication, options: ['niveau', 'nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'division', fach: MA, nom: ce1 ? 'Diviser par un nombre d\'un chiffre' : 'Diviser par un nombre de 2 chiffres', domaine: NC, gen: genDivision, options: ['niveau', 'nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'preuve9', fach: MA, nom: 'La preuve par 9', domaine: NC, gen: genPreuve9, options: ['nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'doublemoitie', fach: MA, nom: ce1 ? 'Double, moitié, triple, tiers' : 'Double, moitié, triple, tiers, quadruple, quart', domaine: NC, gen: genDoubleMoitie, options: ['nombre'], fixe: f, defs: { nombre: '12' } },
    { id: 'pairs', fach: MA, nom: 'Nombres pairs et impairs', domaine: NC, gen: genPairs, options: ['nombre'], fixe: f, defs: { nombre: '12' } },
    { id: 'ensembles', fach: MA, nom: ce1 ? 'Les ensembles (∈, ∩)' : 'Les ensembles (∈, ∩, ∪)', domaine: NC, gen: genEnsembles, options: ['nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'fractions', fach: MA, nom: 'Les fractions simples', domaine: NC, gen: genFractions, options: ['nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'monnaie', fach: MA, nom: ce1 ? 'La monnaie (FCFA) jusqu\'à 5 000 F' : 'La monnaie (FCFA) jusqu\'à 10 000 F', domaine: MG, gen: genMonnaie, options: ['nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'mesures', fach: MA, nom: 'Longueurs, masses, capacités', domaine: MG, gen: genMesures, options: ['niveau', 'nombre'], fixe: f, defs: { nombre: '12' } },
    ...(ce1 ? [] : [{ id: 'heure', fach: MA, nom: 'Lire l\'heure (et quart, et demie)', domaine: MG, gen: genHeure, options: ['niveau', 'nombre'], fixe: f, defs: { niveau: '3', nombre: '12' } }]),
    { id: 'perimetre', fach: MA, nom: ce1 ? 'Périmètre du carré et du rectangle' : 'Périmètre et aire du rectangle', domaine: MG, gen: genPerimetre, options: ['nombre'], fixe: f, defs: { nombre: '6' } },
    { id: 'problemes', fach: MA, nom: 'Problèmes de la vie courante', domaine: NC, gen: genProblemes, options: ['nombre'], fixe: f, defs: { nombre: '6' } }
  ];
});
