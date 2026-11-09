// Générateurs pour la SIL, le CP, le CM1 et le CM2 (programme MINEDUB 2018).
// v0.3 : vérifiés avec les PDF officiels SIL-CP et CM1-CM2 ; corrections dans generateurs3.js.

const fmtDec = (x, d) => { const [e, f] = x.toFixed(d).split('.'); return fmtNb(+e) + (f ? ',' + f : ''); };
const arr = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
const decSimple = x => { let s = fmtDec(x, 3); if (s.includes(',')) s = s.replace(/0+$/, '').replace(/,$/, ''); return s; };

// ---------- SIL et CP ----------

const OBJETS = ['🥭', '🍌', '⚽', '🐔', '✏️', '🍊', '🐟', '⭐'];
function genCompter(r, o) {
  const max = o.classe === 1 ? 20 : 50, n = Math.min(o.nombre, 8), items = [];
  let g = 0;
  while (items.length < n && g++ < 500) {
    const x = entre(r, 2, max), obj = choisir(r, OBJETS);
    if (items.some(i => i.x === x)) continue;
    items.push({ x, obj });
  }
  // les objets sont rangés par paquets de 5 pour aider à compter
  const dessin = i => Array.from({ length: Math.ceil(i.x / 5) }, (_, p) => `<span class="paquet">${i.obj.repeat(Math.min(5, i.x - p * 5))}</span>`).join('');
  return {
    titre: 'Compter les objets', consigne: 'Compte les objets. Écris le nombre.', kontrolle: items.map(i => i.x),
    rendu: sol => `<div class="grille col2">${items.map(i => `<div class="case-compter"><div class="objets">${dessin(i)}</div><div>Il y a ${vide(sol, i.x)}</div></div>`).join('')}</div>`
  };
}

const FORMES = {
  'carré': '<rect x="20" y="20" width="60" height="60"/>',
  'rectangle': '<rect x="8" y="30" width="84" height="44"/>',
  'triangle': '<polygon points="50,14 88,84 12,84"/>',
  'rond': '<circle cx="50" cy="50" r="36"/>'
};
function genFormes(r, o) {
  const n = Math.min(o.nombre, 12), noms = Object.keys(FORMES), coul = ['#f4c542', '#2f9e55', '#2a6fdb', '#e8877a'], items = [];
  while (items.length < n) items.push({ f: noms[items.length % 4], c: choisir(r, coul), rot: choisir(r, [0, 0, 15, -20, 90]) });
  const liste = melanger(r, items);
  return {
    titre: 'Les formes', consigne: 'Comment s\'appelle cette forme ? carré, rectangle, triangle ou rond.',
    rendu: sol => `<div class="grille col4">${liste.map(i => `<div class="case-fraction"><svg viewBox="0 0 100 100" class="fraction-dessin forme"><g fill="${i.c}" stroke="#1d3557" stroke-width="3" transform="rotate(${i.f === 'rond' ? 0 : i.rot} 50 50)">${FORMES[i.f]}</g></svg><div>${sol ? `<span class="rep">${i.f}</span>` : '<span class="ligne courte"></span>'}</div></div>`).join('')}</div>`
  };
}

function genAvantApres(r, o) {
  const max = MAXC[o.classe], n = Math.min(o.nombre, 15), items = [], vus = new Set();
  let g = 0;
  while (items.length < n && g++ < 1000) { const x = entre(r, 1, max - 1); if (vus.has(x)) continue; vus.add(x); items.push(x); }
  return {
    titre: 'Le nombre d\'avant, le nombre d\'après', consigne: 'Écris le nombre qui vient juste avant et juste après.',
    rendu: sol => `<div class="grille col3">${items.map(x => `<div class="calc">${vide(sol, x - 1)} <b class="milieu">${x}</b> ${vide(sol, x + 1)}</div>`).join('')}</div>`
  };
}

function genCalculPetit(r, o) {
  const max = o.classe === 1 ? (o.niveau == 1 ? 10 : 20) : 100, n = o.nombre, items = [], vus = new Set();
  let g = 0;
  while (items.length < n && g++ < 5000) {
    const op = o.operation === 'mix' ? choisir(r, ['+', '-']) : o.operation;
    let a, b;
    if (op === '+') { a = entre(r, 1, max - 1); b = entre(r, 1, max - a); } else { a = entre(r, 2, max); b = entre(r, 1, a - 1); }
    if (max === 100 && a < 10 && b < 10) continue;
    const cle = a + op + b; if (vus.has(cle) && vus.size < 60) continue; vus.add(cle);
    const c = op === '+' ? a + b : a - b, trou = o.niveau == 3 ? choisir(r, ['a', 'b', 'c']) : 'c';
    items.push({ a, b, c, op: op === '-' ? '−' : '+', trou });
  }
  return {
    titre: max === 100 ? 'Additions et soustractions jusqu\'à 100' : 'Ajouter et retirer jusqu\'à ' + max,
    consigne: o.niveau == 3 ? 'Calcule. Trouve le nombre qui manque.' : 'Calcule.', kontrolle: items.map(x => x[x.trou]),
    rendu: sol => `<div class="grille col3">${items.map(t => `<div class="calc">${t.trou === 'a' ? vide(sol, t.a) : t.a} ${t.op} ${t.trou === 'b' ? vide(sol, t.b) : t.b} = ${t.trou === 'c' ? vide(sol, t.c) : t.c}</div>`).join('')}</div>`
  };
}

function genDecomposerCP(r, o) {
  const n = Math.min(o.nombre, 12), items = [];
  while (items.length < n) { const x = entre(r, 11, 99); items.push({ x, d: Math.floor(x / 10), u: x % 10, sens: r() < 0.5 }); }
  return {
    titre: 'Dizaines et unités', consigne: 'Décompose le nombre ou retrouve-le. d = dizaines, u = unités.',
    rendu: sol => `<div class="grille col2">${items.map(i => i.sens ? `<div class="calc petit">${i.d} d + ${i.u} u = ${vide(sol, i.x)}</div>` : `<div class="calc petit">${i.x} = ${vide(sol, i.d)} d + ${vide(sol, i.u)} u</div>`).join('')}</div>`
  };
}

function genDoubleCP(r, o) {
  const n = Math.min(o.nombre, 12), items = [];
  while (items.length < n) { const x = entre(r, 1, 25), moitie = r() < 0.5; items.push(moitie ? { t: `la moitié de ${2 * x}`, c: x } : { t: `le double de ${x}`, c: 2 * x }); }
  return {
    titre: 'Double et moitié', consigne: 'Complète. Double = 2 fois. Moitié = partager en 2 parts égales.', kontrolle: items.map(i => i.c),
    rendu: sol => `<div class="grille col2">${items.map(i => `<div class="calc petit">${i.t} = ${vide(sol, i.c)}</div>`).join('')}</div>`
  };
}

function genEnsemblesCP(r, o) {
  const n = Math.min(o.nombre, 6), items = [];
  const familles = [['fruits', ['mangue', 'banane', 'orange', 'papaye', 'ananas'], ['chaise', 'ballon', 'stylo']], ['animaux', ['chèvre', 'poule', 'chien', 'chat', 'mouton'], ['table', 'livre', 'cahier']], ['nombres pairs', ['2', '4', '6', '8', '10'], ['3', '5', '7']]];
  while (items.length < n) {
    const [nom, dans, hors] = choisir(r, familles), A = melanger(r, dans).slice(0, 4);
    const tests = melanger(r, [A[0], A[1], choisir(r, hors), choisir(r, dans.filter(x => !A.includes(x)))]).map(x => ({ x, s: A.includes(x) ? '∈' : '∉' }));
    items.push({ nom, A, tests });
  }
  return {
    titre: 'Les ensembles', consigne: '∈ veut dire « est dans l\'ensemble ». ∉ veut dire « n\'est pas dans l\'ensemble ».',
    rendu: sol => items.map((x, i) => `<div class="probleme ensembles"><p><b>${i + 1}.</b> A = { ${x.A.join(' ; ')} }</p><p>${x.tests.map(t => `${t.x} ${sol ? `<span class="rep rond">${t.s}</span>` : '<span class="rond"></span>'} A`).join(' &nbsp; &nbsp; ')}</p></div>`).join('')
  };
}

function genMesuresCP(r, o) {
  const n = Math.min(o.nombre, 8), items = [];
  while (items.length < n) items.push({ cm: entre(r, 2, 14) });
  return {
    titre: 'Mesurer avec la règle', consigne: 'Combien mesure le trait ? Lis la règle. Écris le nombre de centimètres.',
    rendu: sol => `<div class="grille col1">${items.map(i => `<div class="case-regle"><svg viewBox="0 0 330 46" class="regle"><line x1="10" y1="10" x2="${10 + i.cm * 20}" y2="10" stroke="#c0392b" stroke-width="5" stroke-linecap="round"/>
      <rect x="5" y="18" width="320" height="24" fill="#fff6d6" stroke="#1d3557"/>${Array.from({ length: 16 }, (_, k) => `<line x1="${10 + k * 20}" y1="18" x2="${10 + k * 20}" y2="28" stroke="#1d3557"/><text x="${10 + k * 20}" y="39" font-size="9" text-anchor="middle">${k}</text>`).join('')}</svg>
      <span>${vide(sol, i.cm)} cm</span></div>`).join('')}</div>`
  };
}

function genProblemesPetits(r, o) {
  const sil = o.classe === 1, M = sil ? 9 : 60;
  const modeles = [
    p => { const a = entre(r, 2, M), b = entre(r, 1, sil ? 9 - Math.min(a, 8) || 1 : 30); return { t: `${p.n} a ${a} mangues. Maman lui donne ${b} mangues. Combien de mangues a-t-${p.il.toLowerCase()} maintenant ?`, calc: `${a} + ${b} = ${a + b}`, rep: `${p.il} a ${a + b} mangues.` }; },
    p => { const a = entre(r, sil ? 5 : 20, sil ? 10 : 90), b = entre(r, 1, a - 1); return { t: `Dans la cour, il y a ${a} poules. ${b} poules rentrent dans le poulailler. Combien de poules restent dans la cour ?`, calc: `${a} − ${b} = ${a - b}`, rep: `Il reste ${a - b} poules dans la cour.` }; },
    p => { const a = entre(r, 2, sil ? 6 : 40), b = entre(r, 2, sil ? 4 : 40); return { t: `Dans la classe, il y a ${a} filles et ${b} garçons. Combien d'élèves y a-t-il en tout ?`, calc: `${a} + ${b} = ${a + b}`, rep: `Il y a ${a + b} élèves.` }; },
    p => { const a = sil ? choisir(r, [10, 20]) : choisir(r, [50, 100]), b = sil ? 5 : choisir(r, [25, 50]); return a > b && { t: `${p.n} a ${a} F. ${p.il} achète un bonbon à ${b} F. Combien d'argent lui reste-t-il ?`, calc: `${a} − ${b} = ${a - b}`, rep: `Il lui reste ${a - b} F.` }; }
  ];
  const n = Math.min(o.nombre, 4), items = [], noms = melanger(r, PRENOMS);
  let i = 0;
  while (items.length < n && i < 300) { const [nom, g] = noms[i % noms.length]; const x = modeles[(i + Math.floor(r() * 4)) % 4]({ n: nom, il: g === 'f' ? 'Elle' : 'Il' }); i++; if (x && (!sil || +x.calc.split('= ').pop() <= 20) && !/(^|\s)1 [a-zé]/.test(x.t + ' ' + x.rep)) items.push(x); }
  return {
    titre: 'Petits problèmes', consigne: 'Lis le problème (ou écoute-le). Écris le calcul et la réponse.',
    audio: items.map(x => x.t).join(' '),
    rendu: sol => items.map((x, k) => `<div class="probleme"><p><b>${k + 1}.</b> ${x.t}</p><p>Calcul : ${sol ? `<span class="rep">${x.calc}</span>` : '<span class="ligne"></span>'}</p><p>Réponse : ${sol ? `<span class="rep">${x.rep}</span>` : '<span class="ligne longue"></span>'}</p></div>`).join('')
  };
}

// ---------- CM1 et CM2 ----------

function genCalculCM(r, o) {
  const n = o.nombre, items = [];
  while (items.length < n) {
    const t = choisir(r, o.classe === 5 ? ['x10', 'x100', 'x1000', 'd10', 'd100', 'add'] : ['x10', 'x100', 'x1000', 'd10', 'd100', 'd1000', 'xdec', 'add']);
    if (t[0] === 'x' && t !== 'xdec') { const m = +t.slice(1), a = entre(r, 2, 999); items.push({ t: `${fmtNb(a)} × ${fmtNb(m)}`, c: fmtNb(a * m) }); }
    else if (t[0] === 'd') { const m = +t.slice(1), a = entre(r, 2, 999) * (o.classe === 5 ? m : 1); items.push({ t: `${fmtNb(a)} : ${fmtNb(m)}`, c: decSimple(a / m) }); }
    else if (t === 'xdec') { const a = entre(r, 11, 999) / 10, m = choisir(r, [10, 100]); items.push({ t: `${decSimple(a)} × ${m}`, c: decSimple(arr(a * m, 3)) }); }
    else { const u = choisir(r, [1000, 10000, 100000]), a = entre(r, 1, 50) * u, b = entre(r, 1, 40) * u; items.push({ t: `${fmtNb(a)} + ${fmtNb(b)}`, c: fmtNb(a + b) }); }
  }
  return {
    titre: 'Calcul mental : × et : par 10, 100, 1 000', consigne: 'Calcule dans ta tête.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${x.t} = ${vide(sol, x.c, true)}</div>`).join('')}</div>`
  };
}

function genMultiplicationCM(r, o) {
  const n = Math.min(o.nombre, 6), items = [];
  while (items.length < n) {
    if (o.classe === 6 && items.length % 2 === 1) { const a = entre(r, 101, 9999) / 100, b = entre(r, 2, 49); items.push({ t: `${decSimple(a)} × ${b} =`, c: decSimple(arr(a * b)) }); continue; }
    const a = entre(r, 123, 9999), b = entre(r, o.niveau == 1 ? 12 : 102, o.niveau == 1 ? 99 : 999);
    items.push({ t: `${fmtNb(a)} × ${b} =`, c: fmtNb(a * b) });
  }
  return {
    titre: o.classe === 6 ? 'Multiplication posée (avec des décimaux)' : 'Multiplication posée', consigne: 'Pose la multiplication dans le quadrillage et calcule.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="carreaux"><div class="calc">${x.t} ${vide(sol, x.c, true)}</div><div class="quadrillage"></div></div>`).join('')}</div>`
  };
}

function genDivisionCM(r, o) {
  const n = Math.min(o.nombre, 6), items = [], reste = o.niveau == 3;
  while (items.length < n) {
    const b = o.classe === 5 ? entre(r, 12, 99) : entre(r, 12, 250), q = entre(r, 21, o.classe === 5 ? 999 : 4999), rr = reste ? entre(r, 1, b - 1) : 0;
    items.push({ a: q * b + rr, b, q, rr });
  }
  return {
    titre: 'Division posée', consigne: reste ? 'Pose la division. Écris le quotient et le reste.' : 'Pose la division dans le quadrillage et calcule.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="carreaux"><div class="calc">${fmtNb(x.a)} : ${x.b} = ${vide(sol, fmtNb(x.q), true)}${reste ? ` reste ${vide(sol, x.rr)}` : ''}</div><div class="quadrillage"></div></div>`).join('')}</div>`
  };
}

function genDecimaux(r, o) {
  const n = Math.min(o.nombre, 12), items = [], cm2 = o.classe === 6;
  const types = cm2 ? ['frac', 'comp', 'add', 'sous', 'add'] : ['frac', 'lire', 'comp', 'add', 'sous'];
  while (items.length < n) {
    const t = types[items.length % types.length];
    if (t === 'frac') { const d = choisir(r, [10, 100, 1000]), x = entre(r, 1, d * 9 - 1); items.push({ t: `${x}/${d}`, c: decSimple(x / d), q: 'en nombre décimal' }); }
    else if (t === 'lire') { const e = entre(r, 1, 99), f = entre(r, 1, 99); const x = e + f / 100; items.push({ t: fmtDec(x, 2), c: `${e} unités et ${f} centièmes`, q: '', lire: { e, f } }); }
    else if (t === 'comp') { const a = entre(r, 100, 9999) / 100; let b = choisir(r, [arr(a + 0.1), arr(a - 0.01), entre(r, 100, 9999) / 100, a]); if (b < 0) b = a; items.push({ cmp: true, a, b, s: a < b ? '<' : a > b ? '>' : '=' }); }
    else { const a = entre(r, 100, cm2 ? 99999 : 9999) / 100, b = entre(r, 10, Math.floor(a * 100) - 1) / 100; items.push({ t: `${decSimple(a)} ${t === 'add' ? '+' : '−'} ${decSimple(b)}`, c: decSimple(arr(t === 'add' ? a + b : a - b)) }); }
  }
  return {
    titre: 'Les nombres décimaux', consigne: 'La virgule sépare la partie entière et la partie décimale. 3,45 = 3 unités, 4 dixièmes, 5 centièmes. Calcule, compare ou écris le nombre.',
    rendu: sol => `<div class="grille col2">${items.map(x => x.cmp ? `<div class="calc">${decSimple(x.a)} ${sol ? `<span class="rep rond">${x.s}</span>` : '<span class="rond"></span>'} ${decSimple(x.b)}</div>`
      : x.lire ? `<div class="calc petit">${x.t} = ${vide(sol, x.lire.e)} unités et ${vide(sol, x.lire.f)} centièmes</div>`
      : `<div class="calc petit">${x.t}${x.q ? ' → ' : ' = '}${vide(sol, x.c, true)}</div>`).join('')}</div>`
  };
}

function genFractionsCM(r, o) {
  const n = Math.min(o.nombre, 12), items = [];
  while (items.length < n) {
    const d = choisir(r, [2, 3, 4, 5, 8, 10]), k = entre(r, 1, d - 1), q = entre(r, 2, o.classe === 5 ? 20 : 60) * d;
    if (items.length % 3 === 2) { const a = entre(r, 1, 11), b = choisir(r, [2, 3, 4, 5, 6, 8]); items.push({ cmp: true, t: `${a}/${b}`, s: a < b ? '<' : a > b ? '>' : '=' }); }
    else items.push({ t: `${k}/${d} de ${fmtNb(q)}`, c: fmtNb(q / d * k) });
  }
  return {
    titre: 'Fractions d\'une quantité', consigne: 'Pour trouver les 3/4 de 20 : 20 : 4 = 5, puis 5 × 3 = 15. Compare aussi la fraction avec 1.',
    rendu: sol => `<div class="grille col2">${items.map(x => x.cmp ? `<div class="calc">${x.t} ${sol ? `<span class="rep rond">${x.s}</span>` : '<span class="rond"></span>'} 1</div>` : `<div class="calc petit">${x.t} = ${vide(sol, x.c, true)}</div>`).join('')}</div>`
  };
}

function genMesuresCM(r, o) {
  const n = Math.min(o.nombre, 12), items = [], vus = new Set();
  const regles = o.classe === 5
    ? [['km', 'm', 1000], ['m', 'cm', 100], ['m', 'mm', 1000], ['kg', 'g', 1000], ['t', 'kg', 1000], ['L', 'cL', 100], ['hL', 'L', 100], ['h', 'min', 60]]
    : [['km', 'm', 1000], ['m²', 'dm²', 100], ['m²', 'cm²', 10000], ['ha', 'm²', 10000], ['m³', 'dm³', 1000], ['dm³', 'L', 1], ['kg', 'g', 1000], ['t', 'kg', 1000], ['h', 'min', 60]];
  let g = 0;
  while (items.length < n && g++ < 1000) {
    const [gr, p, f] = choisir(r, regles), dec = f >= 10 && f !== 60 && r() < 0.5;
    const x = dec ? entre(r, 11, 99) / 10 : entre(r, 2, 9);
    const cle = gr + p + x; if (vus.has(cle)) continue; vus.add(cle);
    items.push({ t: `${decSimple(x)} ${gr}`, c: decSimple(arr(x * f, 3)), p });
  }
  return {
    titre: o.classe === 5 ? 'Mesures : longueurs, masses, capacités, durées' : 'Mesures : longueurs, aires, volumes, durées',
    consigne: o.classe === 5 ? 'Convertis. 1 km = 1 000 m ; 1 t = 1 000 kg ; 1 hL = 100 L ; 1 h = 60 min.' : 'Convertis. 1 m² = 100 dm² ; 1 ha = 10 000 m² ; 1 m³ = 1 000 dm³ ; 1 dm³ = 1 L.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${x.t} = ${vide(sol, x.c, true)} ${x.p}</div>`).join('')}</div>`
  };
}

function genDurees(r, o) {
  const n = Math.min(o.nombre, 8), items = [], pad = x => String(x).padStart(2, '0');
  while (items.length < n) {
    const h1 = entre(r, 6, 14), m1 = choisir(r, [0, 5, 10, 15, 20, 30, 40, 45, 50]), d = entre(r, 1, 3) * 60 + choisir(r, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
    const fin = h1 * 60 + m1 + d;
    items.push({ deb: `${h1} h ${pad(m1)}`, fin: `${Math.floor(fin / 60)} h ${pad(fin % 60)}`, c: `${Math.floor(d / 60)} h ${pad(d % 60)}` });
  }
  return {
    titre: 'Calculer une durée', consigne: 'Combien de temps s\'est passé entre le début et la fin ? Écris la durée, par exemple 2 h 25.',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. Le car part à ${x.deb} et arrive à ${x.fin}. Durée du voyage : ${vide(sol, x.c, true)}</div>`).join('')}</div>`
  };
}

function genAiresCM(r, o) {
  const n = Math.min(o.nombre, 6), items = [];
  while (items.length < n) {
    const t = choisir(r, o.classe === 5 ? ['rp', 'ra', 'cp', 'ca'] : ['ra', 'ta', 'ta', 'rp', 'cote']);
    const L = entre(r, 4, 30), l = entre(r, 2, L - 1), h = entre(r, 2, 20) * 2;
    if (t === 'rp') items.push({ f: 'Rectangle', d: `L = ${L} m, l = ${l} m`, q: 'Périmètre', c: 2 * (L + l), u: 'm' });
    else if (t === 'ra') items.push({ f: 'Rectangle', d: `L = ${L} m, l = ${l} m`, q: 'Aire', c: L * l, u: 'm²' });
    else if (t === 'cp') items.push({ f: 'Carré', d: `côté = ${l} m`, q: 'Périmètre', c: 4 * l, u: 'm' });
    else if (t === 'ca') items.push({ f: 'Carré', d: `côté = ${l} m`, q: 'Aire', c: l * l, u: 'm²' });
    else if (t === 'ta') items.push({ f: 'Triangle', d: `base = ${L} cm, hauteur = ${h} cm`, q: 'Aire', c: L * h / 2, u: 'cm²' });
    else items.push({ f: 'Rectangle', d: `aire = ${L * l} m², L = ${L} m`, q: 'Largeur l', c: l, u: 'm' });
  }
  return {
    titre: o.classe === 5 ? 'Périmètre et aire (carré, rectangle)' : 'Aires : rectangle et triangle',
    consigne: 'Rectangle : P = (L + l) × 2 ; A = L × l. Carré : P = côté × 4 ; A = côté × côté.' + (o.classe === 6 ? ' Triangle : A = base × hauteur : 2.' : ''),
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. <b>${x.f}</b> (${x.d}). ${x.q} = ${vide(sol, fmtNb(x.c), true)} ${x.u}</div>`).join('')}</div>`
  };
}

function genPourcentages(r, o) {
  const n = Math.min(o.nombre, 8), items = [];
  while (items.length < n) {
    const p = choisir(r, [10, 20, 25, 50, 5, 15, 30, 75]), prix = entre(r, 2, 80) * (p === 15 || p === 5 || p === 75 ? 100 : 100);
    const v = prix * p / 100;
    if (items.length % 2) items.push({ t: `Une radio coûte ${fmtNb(prix)} F. Le commerçant fait une réduction de ${p} %. Prix à payer :`, c: fmtNb(prix - v), u: 'F' });
    else items.push({ t: `${p} % de ${fmtNb(prix)} F =`, c: fmtNb(v), u: 'F' });
  }
  return {
    titre: 'Les pourcentages', consigne: '25 % de 800, c\'est 800 × 25 : 100 = 200.',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x.t} ${vide(sol, x.c, true)} ${x.u}</div>`).join('')}</div>`
  };
}

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
function genStatistiques(r, o) {
  const n = Math.min(o.nombre, 3), items = [];
  const sujets = [['beignets vendus par Mama Ngono', 'beignets'], ['élèves présents à l\'école', 'élèves'], ['litres de lait vendus', 'litres']];
  while (items.length < n) {
    const [titre, u] = sujets[items.length % 3], pas = choisir(r, [5, 10]), v = JOURS.map(() => entre(r, 2, 10) * pas);
    const j = entre(r, 0, 4), j2 = (j + entre(r, 1, 4)) % 5, hi = v[j] >= v[j2] ? j : j2, lo = hi === j ? j2 : j;
    items.push({ titre, u, v, q: [[`Combien le ${JOURS[j]} ?`, v[j]], ['Combien en tout dans la semaine ?', v.reduce((a, b) => a + b, 0)], [`Combien de plus le ${JOURS[hi]} que le ${JOURS[lo]} ?`, v[hi] - v[lo]]] });
  }
  const graph = x => { const m = Math.max(...x.v); return `<svg viewBox="0 0 300 150" class="stat-graph"><line x1="30" y1="125" x2="295" y2="125" stroke="#1d3557"/>
    ${x.v.map((y, i) => `<rect x="${40 + i * 52}" y="${125 - y / m * 100}" width="34" height="${y / m * 100}" fill="#2f9e55"/><text x="${57 + i * 52}" y="${120 - y / m * 100}" font-size="11" text-anchor="middle">${y}</text><text x="${57 + i * 52}" y="140" font-size="10" text-anchor="middle">${JOURS[i].slice(0, 3)}.</text>`).join('')}</svg>`; };
  return {
    titre: 'Lire un graphique', consigne: 'Regarde bien le graphique, puis réponds aux questions.',
    rendu: sol => items.map((x, i) => `<div class="probleme"><p><b>${i + 1}. Les ${x.titre} pendant la semaine</b></p>${graph(x)}${x.q.map(([q, c]) => `<p>${q} ${vide(sol, c)} ${x.u}</p>`).join('')}</div>`).join('')
  };
}

function genProblemesCM(r, o) {
  const cm2 = o.classe === 6, F = x => fmtNb(x) + ' F';
  const modeles = [
    () => { const k = entre(r, 12, 48), p = entre(r, 15, 60) * 100; return { t: `Une coopérative achète ${k} sacs d'engrais à ${F(p)} le sac. Combien paie-t-elle ?`, calc: `${k} × ${fmtNb(p)} = ${fmtNb(k * p)}`, rep: `Elle paie ${F(k * p)}.` }; },
    () => { const a = entre(r, 120, 900) * 1000, b = entre(r, 20, 110) * 1000; return { t: `Papa gagne ${F(a)} par mois. Il paie un loyer de ${F(b)}. Combien lui reste-t-il ?`, calc: `${fmtNb(a)} − ${fmtNb(b)} = ${fmtNb(a - b)}`, rep: `Il lui reste ${F(a - b)}.` }; },
    () => { const k = entre(r, 12, 40), q = entre(r, 25, 250); return { t: `On partage ${fmtNb(k * q)} cahiers entre ${k} écoles. Combien de cahiers reçoit chaque école ?`, calc: `${fmtNb(k * q)} : ${k} = ${q}`, rep: `Chaque école reçoit ${q} cahiers.` }; },
    () => { const a = entre(r, 1200, 8000), b = entre(r, 900, 6000); return { t: `Un planteur récolte ${fmtNb(a)} kg de cacao en octobre et ${fmtNb(b)} kg en novembre. Combien de kilogrammes a-t-il récolté en tout ?`, calc: `${fmtNb(a)} + ${fmtNb(b)} = ${fmtNb(a + b)}`, rep: `Il a récolté ${fmtNb(a + b)} kg.` }; },
    () => { const v = entre(r, 4, 9) * 10, h = entre(r, 2, 6); return cm2 && { t: `Un car roule à ${v} km par heure pendant ${h} heures. Quelle distance parcourt-il ?`, calc: `${v} × ${h} = ${v * h}`, rep: `Il parcourt ${v * h} km.` }; },
    () => { const p = entre(r, 20, 90) * 1000; return cm2 && { t: `Un vélo coûte ${F(p)}. Le vendeur fait une réduction de 10 %. Quel est le montant de la réduction ?`, calc: `${fmtNb(p)} × 10 : 100 = ${fmtNb(p / 10)}`, rep: `La réduction est de ${F(p / 10)}.` }; }
  ];
  const n = Math.min(o.nombre, 5), items = [], ordre = melanger(r, modeles.map((_, i) => i));
  let i = 0;
  while (items.length < n && i < 60) { const x = modeles[ordre[i % ordre.length]](); i++; if (x) items.push(x); }
  return {
    titre: 'Problèmes de la vie courante', consigne: 'Lis le problème. Écris l\'opération et la réponse par une phrase.',
    audio: items.map(x => x.t).join(' '),
    rendu: sol => items.map((x, k) => `<div class="probleme"><p><b>${k + 1}.</b> ${x.t}</p><p>Opération : ${sol ? `<span class="rep">${x.calc}</span>` : '<span class="ligne"></span>'}</p><p>Réponse : ${sol ? `<span class="rep">${x.rep}</span>` : '<span class="ligne longue"></span>'}</p></div>`).join('')
  };
}

// ---------- Catalogue SIL (1), CP (2), CM1 (5), CM2 (6) ----------
(() => {
  const t = (id, nom, domaine, gen, options, k, defs, plus) => Object.assign({ id, fach: MA, nom, domaine, gen, options, fixe: { classe: k }, defs: defs || {} }, plus || {});
  THEMES[1] = [
    t('compter', 'Compter jusqu\'à 20', NC, genCompter, ['nombre'], 1, { nombre: '6' }),
    t('lettres', 'Les nombres de 0 à 20 en lettres', NC, genLettres, ['nombre'], 1, { nombre: '12' }),
    t('avantapres', 'Le nombre d\'avant, le nombre d\'après', NC, genAvantApres, ['nombre'], 1, { nombre: '12' }),
    t('comparer', 'Comparer les nombres (<, >, =)', NC, genComparer, ['nombre'], 1, { nombre: '12' }),
    t('suites', 'Suites de nombres', NC, genSuites, ['nombre'], 1, { nombre: '6' }),
    t('calcul', 'Ajouter et retirer', NC, genCalculPetit, ['operation', 'niveau', 'nombre'], 1, { nombre: '12' }),
    t('formes', 'Les formes', GE, genFormes, ['nombre'], 1, { nombre: '12' }),
    t('monnaie', 'La monnaie (jusqu\'à 100 F)', MG, genMonnaie, ['nombre'], 1, { nombre: '6' }),
    t('problemes', 'Petits problèmes', NC, genProblemesPetits, ['nombre'], 1, { nombre: '6' })
  ];
  THEMES[2] = [
    t('compter', 'Compter jusqu\'à 50', NC, genCompter, ['nombre'], 2, { nombre: '6' }),
    t('lettres', 'Les nombres jusqu\'à 100 en lettres', NC, genLettres, ['nombre'], 2, { nombre: '12' }),
    t('decomposer', 'Dizaines et unités', NC, genDecomposerCP, ['nombre'], 2, { nombre: '12' }),
    t('comparer', 'Comparer et encadrer', NC, genComparer, ['nombre'], 2, { nombre: '12' }),
    t('suites', 'Suites de nombres jusqu\'à 100', NC, genSuites, ['nombre'], 2, { nombre: '6' }),
    t('calcul', 'Additions et soustractions jusqu\'à 100', NC, genCalculPetit, ['operation', 'niveau', 'nombre'], 2),
    t('posees', 'Additions et soustractions posées', NC, genPosees, ['operation', 'uebergang', 'nombre'], 2, { nombre: '12', uebergang: 'ohne' }),
    t('tables', 'Tables de 2 et de 10', NC, genTables, ['reihen', 'niveau', 'nombre'], 2, { reihen: [2, 10] }),
    t('doublemoitie', 'Double et moitié', NC, genDoubleCP, ['nombre'], 2, { nombre: '12' }),
    t('pairs', 'Nombres pairs et impairs', NC, genPairs, ['nombre'], 2, { nombre: '12' }),
    t('ensembles', 'Les ensembles (∈, ∉)', NC, genEnsemblesCP, ['nombre'], 2, { nombre: '6' }),
    t('formes', 'Les formes', GE, genFormes, ['nombre'], 2, { nombre: '12' }),
    t('mesurer', 'Mesurer avec la règle (cm)', MG, genMesuresCP, ['nombre'], 2, { nombre: '6' }),
    t('monnaie', 'La monnaie (jusqu\'à 500 F)', MG, genMonnaie, ['nombre'], 2, { nombre: '6' }),
    t('heure', 'Lire l\'heure (heure juste et demie)', MG, genHeure, ['niveau', 'nombre'], 2, { niveau: '2', nombre: '8' }),
    t('problemes', 'Petits problèmes', NC, genProblemesPetits, ['nombre'], 2, { nombre: '6' })
  ];
  [5, 6].forEach(k => {
    const cm1 = k === 5;
    THEMES[k] = [
      t('lettres', cm1 ? 'Grands nombres (jusqu\'au million) en lettres' : 'Grands nombres (jusqu\'au milliard) en lettres', NC, genLettres, ['nombre'], k, { nombre: '8' }),
      t('comparer', 'Comparer et encadrer les grands nombres', NC, genComparer, ['nombre'], k, { nombre: '12' }),
      t('suites', 'Suites de grands nombres', NC, genSuites, ['nombre'], k, { nombre: '6' }),
      t('calcul', 'Calcul mental : × et : par 10, 100, 1 000', NC, genCalculCM, ['nombre'], k, { nombre: '12' }),
      t('posees', 'Additions et soustractions posées', NC, genPosees, ['operation', 'nombre'], k, { nombre: '9' }),
      t('tables', 'Toutes les tables (révision)', NC, genTables, ['reihen', 'geteilt', 'niveau', 'nombre'], k, { reihen: [6, 7, 8, 9], geteilt: true }),
      t('multiplication', 'Multiplication posée', NC, genMultiplicationCM, ['niveau', 'nombre'], k, { nombre: '6' }),
      t('division', 'Division posée', NC, genDivisionCM, ['niveau', 'nombre'], k, { nombre: '6' }),
      t('decimaux', 'Les nombres décimaux', NC, genDecimaux, ['nombre'], k, { nombre: '12' }),
      t('fractions', 'Fractions d\'une quantité', NC, genFractionsCM, ['nombre'], k, { nombre: '12' }),
      ...(cm1 ? [] : [t('pourcentages', 'Les pourcentages', NC, genPourcentages, ['nombre'], k, { nombre: '8' })]),
      t('mesures', cm1 ? 'Mesures : conversions' : 'Mesures : aires, volumes, conversions', MG, genMesuresCM, ['nombre'], k, { nombre: '12' }),
      t('durees', 'Calculer une durée', MG, genDurees, ['nombre'], k, { nombre: '6' }),
      t('aires', cm1 ? 'Périmètre et aire' : 'Aires : rectangle et triangle', MG, genAiresCM, ['nombre'], k, { nombre: '6' }),
      t('statistiques', 'Lire un graphique (statistiques)', 'Statistiques', genStatistiques, ['nombre'], k, { nombre: '3' }),
      t('problemes', 'Problèmes de la vie courante', NC, genProblemesCM, ['nombre'], k, { nombre: '5' })
    ];
  });
})();
