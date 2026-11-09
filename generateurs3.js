// v0.3 — Maths corrigées d'après les PDF officiels MINEDUB 2018
// (Curriculum SIL-CP et Curriculum CM1-CM2, lus le 09/11/2026).
// Ce fichier ajoute des exercices et corrige le catalogue de generateurs2.js.

// Une réponse « au choix » : à l'écran, l'enfant touche un bouton.
const repChoix = (sol, att, choix) => sol ? `<span class="rep" data-choix="${choix.join('|')}">${att}</span>` : `<span class="choix-papier">${choix.join(' / ')}</span>`;

// ---------- SIL et CP ----------

// Monnaie : SIL jusqu'à 20 F, CP jusqu'à 50 F (pièces de 1, 2, 5, 10, 25, 50 F)
function genMonnaiePetit(r, o) {
  const sil = o.classe === 1, n = Math.min(o.nombre, 8), items = [];
  const valeurs = sil ? [10, 5, 2, 1] : [50, 25, 10, 5, 2, 1], max = sil ? 20 : 50;
  let e = 0;
  while (items.length < n && e++ < 3000) {
    const k = entre(r, 2, sil ? 3 : 4), sel = [];
    for (let i = 0; i < k; i++) sel.push(choisir(r, valeurs));
    sel.sort((a, b) => b - a);
    const total = sel.reduce((s, v) => s + v, 0);
    if (total > max || items.some(x => x.sel.join('+') === sel.join('+'))) continue;
    items.push({ sel, total });
  }
  return {
    titre: 'La monnaie : le franc CFA', consigne: 'Compte les pièces. Combien d\'argent y a-t-il en tout ?', kontrolle: items.map(x => x.total),
    rendu: sol => `<div class="grille col2">${items.map(t => `<div class="case-geld"><div class="argent">${t.sel.map(v => `<span class="piece cuivre">${v} F</span>`).join('')}</div><div>En tout : ${vide(sol, t.total)} F</div></div>`).join('')}</div>`
  };
}

// Double et moitié : SIL double < 10, moitié < 20 ; CP double ≤ 50, moitié < 100
function genDoubleMoitiePetit(r, o) {
  const sil = o.classe === 1, n = Math.min(o.nombre, 12), items = [], vus = new Set();
  let g = 0;
  while (items.length < n && g++ < 2000) {
    const x = sil ? entre(r, 1, 9) : entre(r, 3, 49), moitie = r() < 0.5, cle = moitie + '-' + x;
    if (vus.has(cle) && g < 1000) continue; vus.add(cle);
    items.push(moitie ? { t: `la moitié de ${2 * x}`, c: x } : { t: `le double de ${x}`, c: 2 * x });
  }
  return {
    titre: 'Double et moitié', consigne: 'Complète. Le double, c\'est 2 fois le nombre. La moitié, c\'est partager en 2 parts égales.', kontrolle: items.map(i => i.c),
    rendu: sol => `<div class="grille col2">${items.map(i => `<div class="calc petit">${i.t} = ${vide(sol, i.c)}</div>`).join('')}</div>`
  };
}

// Mesures du temps : SIL jour et semaine ; CP semaine, mois, année
const SEMAINE = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function genTemps(r, o) {
  const sil = o.classe === 1, n = Math.min(o.nombre, 10), items = [], vus = new Set();
  const modeles = sil ? [
    () => { const j = entre(r, 0, 5); return { t: `Après ${SEMAINE[j]}, c'est`, c: SEMAINE[j + 1] }; },
    () => { const j = entre(r, 1, 6); return { t: `Avant ${SEMAINE[j]}, c'est`, c: SEMAINE[j - 1] }; },
    () => ({ t: 'Dans une semaine, il y a', c: '7', u: 'jours' }),
    () => { const j = entre(r, 0, 4); return { t: `Hier, c'était ${SEMAINE[j]}. Aujourd'hui, c'est`, c: SEMAINE[j + 1] }; },
    () => { const j = entre(r, 0, 4); return { t: `Aujourd'hui, c'est ${SEMAINE[j]}. Demain, ce sera`, c: SEMAINE[j + 1] }; }
  ] : [
    () => { const m = entre(r, 0, 10); return { t: `Après ${MOIS[m]}, c'est le mois de`, c: MOIS[m + 1] }; },
    () => { const m = entre(r, 1, 11); return { t: `Avant ${MOIS[m]}, c'est le mois de`, c: MOIS[m - 1] }; },
    () => ({ t: 'Dans une année, il y a', c: '12', u: 'mois' }),
    () => ({ t: 'Dans une semaine, il y a', c: '7', u: 'jours' }),
    () => { const k = entre(r, 2, 4); return { t: `${k} semaines, c'est`, c: String(7 * k), u: 'jours' }; },
    () => { const k = entre(r, 2, 3); return { t: `${k} ans, c'est`, c: String(12 * k), u: 'mois' }; },
    () => ({ t: 'Dans une année, il y a environ', c: '52', u: 'semaines' }),
    () => { const k = entre(r, 2, 4); return { t: `${7 * k} jours, c'est`, c: String(k), u: 'semaines' }; }
  ];
  let g = 0;
  while (items.length < n && g++ < 2000) {
    const x = choisir(r, modeles)(); if (vus.has(x.t) && g < 1000) continue; vus.add(x.t); items.push(x);
  }
  return {
    titre: sil ? 'Les jours de la semaine' : 'Semaine, mois et année',
    consigne: sil ? 'Complète. Les jours : lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.' : 'Complète. 1 semaine = 7 jours ; 1 année = 12 mois.',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. ${x.t} ${vide(sol, x.c, true)}${x.u ? ' ' + x.u : ''}.</div>`).join('')}</div>`
  };
}

// CP : multiplication posée, résultat < 100
function genMultiplicationCP(r, o) {
  const n = Math.min(o.nombre, 8), items = [];
  let g = 0;
  while (items.length < n && g++ < 2000) {
    const b = entre(r, 2, 5), a = entre(r, 11, Math.floor(99 / b));
    if (items.some(x => x.a === a && x.b === b) && g < 1000) continue;
    items.push({ a, b, c: a * b });
  }
  return {
    titre: 'Multiplication posée', consigne: 'Pose la multiplication dans le quadrillage et calcule.', kontrolle: items.map(x => x.c),
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="carreaux"><div class="calc">${x.a} × ${x.b} = ${vide(sol, x.c)}</div><div class="quadrillage"></div></div>`).join('')}</div>`
  };
}

// CP : partages et fractions (2, 3, 4, 5 parts égales)
function genPartages(r, o) {
  const n = Math.min(o.nombre, 9), items = [];
  let e = 0;
  while (items.length < n && e++ < 2000) {
    const d = choisir(r, [2, 3, 4, 5]), k = entre(r, 1, d - 1);
    if (items.some(x => x.d === d && x.k === k) && e < 1000) continue;
    items.push({ d, k });
  }
  const dessin = x => { const w = 160 / x.d; return `<svg viewBox="0 0 170 50" class="fraction-dessin">${Array.from({ length: x.d }, (_, i) => `<rect x="${5 + i * w}" y="5" width="${w}" height="40" fill="${i < x.k ? '#f4c542' : '#fff'}" stroke="#1d3557" stroke-width="2"/>`).join('')}</svg>`; };
  return {
    titre: 'Partages et fractions', consigne: 'Le gâteau est partagé en parts égales. Quelle partie est coloriée ? Écris la fraction, par exemple 1/2.',
    rendu: sol => `<div class="grille col3">${items.map(x => `<div class="case-fraction">${dessin(x)}<div>${vide(sol, x.k + '/' + x.d)}</div></div>`).join('')}</div>`
  };
}

// ---------- CM1 et CM2 ----------

const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const frac = (a, b) => { const g = pgcd(a, b); return b / g === 1 ? String(a / g) : (a / g) + '/' + (b / g); };

// Fractions : simplifier, additionner (même dénominateur), multiplier, comparer
function genFractionsOp(r, o) {
  const cm2 = o.classe === 6, n = Math.min(o.nombre, 12), items = [];
  const types = cm2 ? ['simp', 'add', 'sous', 'mul', 'div', 'add2'] : ['simp', 'add', 'sous', 'mul', 'mulE', 'simp'];
  while (items.length < n) {
    const t = types[items.length % types.length];
    if (t === 'simp') { const a = entre(r, 1, 6), b = entre(r, a + 1, 9), k = entre(r, 2, 6); if (pgcd(a, b) !== 1) continue; items.push({ t: `${a * k}/${b * k}`, c: `${a}/${b}`, q: 'simplifie' }); }
    else if (t === 'add' || t === 'sous') { const d = entre(r, 3, 12), a = entre(r, 1, d - 1), b = entre(r, 1, d - 1); if (t === 'sous' && a <= b) continue; items.push({ t: `${a}/${d} ${t === 'add' ? '+' : '−'} ${b}/${d}`, c: frac(t === 'add' ? a + b : a - b, d) }); }
    else if (t === 'mul') { const b = entre(r, 2, 7), d = entre(r, 2, 7), a = entre(r, 1, b - 1), c = entre(r, 1, d - 1); items.push({ t: `${a}/${b} × ${c}/${d}`, c: frac(a * c, b * d) }); }
    else if (t === 'mulE') { const a = entre(r, 1, 4), b = entre(r, 2, 9), k = entre(r, 2, 5); items.push({ t: `${a}/${b} × ${k}`, c: frac(a * k, b) }); }
    else if (t === 'div') { const b = entre(r, 2, 7), d = entre(r, 2, 7), a = entre(r, 1, b - 1), c = entre(r, 1, d - 1); items.push({ t: `${a}/${b} : ${c}/${d}`, c: frac(a * d, b * c) }); }
    else { const b = choisir(r, [2, 3, 4]), d = b * choisir(r, [2, 3]), a = entre(r, 1, b - 1), c = entre(r, 1, d - 1); items.push({ t: `${a}/${b} + ${c}/${d}`, c: frac(a * d + c * b, b * d) }); }
  }
  return {
    titre: 'Calculer avec les fractions',
    consigne: 'Calcule et simplifie le résultat si tu peux. Même dénominateur : 2/7 + 3/7 = 5/7. Multiplier : 2/3 × 4/5 = 8/15.' + (cm2 ? ' Diviser : on multiplie par la fraction inverse.' : ''),
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${x.q ? 'Simplifie : ' : ''}${x.t} = ${vide(sol, x.c, true)}</div>`).join('')}</div>`
  };
}

// Divisibilité : CM1 par 2, 3, 5 ; CM2 par 2, 3, 5, 9
function genDivisibilite(r, o) {
  const div = o.classe === 6 ? [2, 3, 5, 9] : [2, 3, 5], n = Math.min(o.nombre, 12), items = [];
  let g = 0;
  while (items.length < n && g++ < 3000) {
    const d = choisir(r, div), oui = r() < 0.5;
    let x = entre(r, 100, 9999); if (oui) x -= x % d; else if (x % d === 0) x += 1;
    if (items.some(i => i.x === x)) continue;
    items.push({ x, d, c: x % d === 0 ? 'oui' : 'non' });
  }
  return {
    titre: 'Divisible ou pas ?', consigne: 'Par 2 : le nombre finit par 0, 2, 4, 6, 8. Par 5 : il finit par 0 ou 5. Par 3' + (div.includes(9) ? ' (ou 9)' : '') + ' : la somme des chiffres est dans la table de 3' + (div.includes(9) ? ' (ou de 9)' : '') + '.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${fmtNb(x.x)} est divisible par ${x.d} ? ${repChoix(sol, x.c, ['oui', 'non'])}</div>`).join('')}</div>`
  };
}

// Les nombres complexes (durées) : convertir, additionner, soustraire, multiplier
function genComplexes(r, o) {
  const cm2 = o.classe === 6, n = Math.min(o.nombre, 10), items = [], hm = m => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
  const types = ['conv', 'inv', 'add', 'sous', 'mul', 'div'];
  while (items.length < n) {
    const t = types[items.length % types.length];
    if (t === 'conv') { const m = entre(r, 70, 400); items.push({ t: `${m} min =`, c: hm(m) }); }
    else if (t === 'inv') { const h = entre(r, 1, 6), m = entre(r, 1, 59); items.push({ t: `${h} h ${String(m).padStart(2, '0')} =`, c: String(h * 60 + m), u: 'min' }); }
    else if (t === 'add') { const a = entre(r, 61, 300), b = entre(r, 20, 200); items.push({ t: `${hm(a)} + ${hm(b)} =`, c: hm(a + b) }); }
    else if (t === 'sous') { const a = entre(r, 200, 600), b = entre(r, 30, a - 20); items.push({ t: `${hm(a)} − ${hm(b)} =`, c: hm(a - b) }); }
    else if (t === 'mul') { const a = entre(r, 25, 150), k = entre(r, 2, 5); items.push({ t: `${hm(a)} × ${k} =`, c: hm(a * k) }); }
    else { const k = entre(r, 2, 5), a = entre(r, 25, 120) * k; items.push({ t: `${hm(a)} : ${k} =`, c: hm(a / k) }); }
  }
  return {
    titre: 'Les nombres complexes (heures et minutes)', consigne: '1 h = 60 min. Écris le résultat comme 2 h 05 (ou 45 min s\'il y a moins d\'une heure). Quand les minutes dépassent 60, on fait 1 heure de plus.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${x.t} ${vide(sol, x.c, true)}${x.u ? ' ' + x.u : ''}</div>`).join('')}</div>`
  };
}

// Mouvements uniformes : distance, vitesse, temps, heure d'arrivée
function genVitesse(r, o) {
  const cm2 = o.classe === 6, n = Math.min(o.nombre, 6), items = [], villes = [['Yaoundé', 'Douala'], ['Douala', 'Bafoussam'], ['Yaoundé', 'Bertoua'], ['Ngaoundéré', 'Garoua'], ['Yaoundé', 'Bafoussam'], ['Douala', 'Kribi']];
  const modeles = [
    () => { const v = entre(r, 4, 9) * 10, h = entre(r, 2, 5), [a, b] = choisir(r, villes); return { t: `Un car va de ${a} à ${b}. Il roule à ${v} km/h pendant ${h} h. Quelle distance parcourt-il ?`, calc: `${v} × ${h} = ${v * h}`, rep: `Il parcourt ${v * h} km.` }; },
    () => { const v = entre(r, 4, 9) * 10, h = entre(r, 2, 5); return { t: `Un camion parcourt ${v * h} km en ${h} h. Quelle est sa vitesse moyenne ?`, calc: `${v * h} : ${h} = ${v}`, rep: `Sa vitesse moyenne est de ${v} km/h.` }; },
    () => { const v = entre(r, 4, 9) * 10, h = entre(r, 2, 6); return { t: `Une moto roule à ${v} km/h. Combien de temps met-elle pour faire ${v * h} km ?`, calc: `${v * h} : ${v} = ${h}`, rep: `Elle met ${h} h.` }; },
    () => { const v = entre(r, 5, 8) * 10, h = entre(r, 2, 4), dep = entre(r, 6, 11), [a, b] = choisir(r, villes); return { t: `Un bus quitte ${a} à ${dep} h. Il roule à ${v} km/h sur ${v * h} km jusqu'à ${b}. À quelle heure arrive-t-il ?`, calc: `${v * h} : ${v} = ${h} ; ${dep} + ${h} = ${dep + h}`, rep: `Il arrive à ${dep + h} h.` }; },
    () => { const v1 = entre(r, 3, 5) * 10, v2 = entre(r, 4, 6) * 10, h = entre(r, 2, 3); return cm2 && { t: `Deux cars partent en même temps de deux villes éloignées de ${(v1 + v2) * h} km. L'un roule à ${v1} km/h, l'autre à ${v2} km/h. Ils vont l'un vers l'autre. Au bout de combien de temps se rencontrent-ils ?`, calc: `${v1} + ${v2} = ${v1 + v2} ; ${(v1 + v2) * h} : ${v1 + v2} = ${h}`, rep: `Ils se rencontrent au bout de ${h} h.` }; }
  ];
  const ordre = melanger(r, modeles.map((_, i) => i));
  let i = 0;
  while (items.length < n && i < 60) { const x = modeles[ordre[i % ordre.length]](); i++; if (x) items.push(x); }
  return {
    titre: 'Les mouvements uniformes (vitesse)', consigne: 'Distance = vitesse × temps. Vitesse = distance : temps. Temps = distance : vitesse.',
    audio: items.map(x => x.t).join(' '),
    rendu: sol => items.map((x, k) => `<div class="probleme"><p><b>${k + 1}.</b> ${x.t}</p><p>Opération : ${sol ? `<span class="rep">${x.calc}</span>` : '<span class="ligne"></span>'}</p><p>Réponse : ${sol ? `<span class="rep">${x.rep}</span>` : '<span class="ligne longue"></span>'}</p></div>`).join('')
  };
}

// Opérations commerciales et intérêts
function genCommerce(r, o) {
  const n = Math.min(o.nombre, 6), items = [], F = x => fmtNb(x) + ' F';
  const modeles = [
    () => { const a = entre(r, 20, 90) * 1000, f = entre(r, 2, 9) * 500; return { t: `Un commerçant achète un sac de riz à ${F(a)}. Le transport coûte ${F(f)}. Quel est le prix de revient ?`, calc: `${fmtNb(a)} + ${fmtNb(f)} = ${fmtNb(a + f)}`, rep: `Le prix de revient est ${F(a + f)}.` }; },
    () => { const pr = entre(r, 20, 90) * 1000, b = entre(r, 2, 15) * 500; return { t: `Mama Ngono achète des pagnes pour ${F(pr)}. Elle veut gagner ${F(b)}. À quel prix doit-elle les vendre ?`, calc: `${fmtNb(pr)} + ${fmtNb(b)} = ${fmtNb(pr + b)}`, rep: `Elle doit les vendre ${F(pr + b)}.` }; },
    () => { const pr = entre(r, 20, 90) * 1000, b = entre(r, 2, 15) * 500; return { t: `Un vendeur achète une radio à ${F(pr)} et la vend à ${F(pr + b)}. Quel est son bénéfice ?`, calc: `${fmtNb(pr + b)} − ${fmtNb(pr)} = ${fmtNb(b)}`, rep: `Son bénéfice est de ${F(b)}.` }; },
    () => { const pr = entre(r, 20, 90) * 1000, p = entre(r, 2, 12) * 500; return { t: `Un planteur achète des plants pour ${F(pr)}. Il les revend seulement ${F(pr - p)}. Quelle est sa perte ?`, calc: `${fmtNb(pr)} − ${fmtNb(pr - p)} = ${fmtNb(p)}`, rep: `Sa perte est de ${F(p)}.` }; },
    () => { const c = entre(r, 10, 90) * 10000, t = choisir(r, [4, 5, 6, 8, 10]); return { t: `Papa place ${F(c)} à la banque au taux de ${t} % par an. Combien d'intérêts reçoit-il en 1 an ?`, calc: `${fmtNb(c)} × ${t} : 100 = ${fmtNb(c * t / 100)}`, rep: `Il reçoit ${F(c * t / 100)} d'intérêts.` }; },
    () => { const c = entre(r, 2, 9) * 120000, t = choisir(r, [5, 10]), m = choisir(r, [3, 6, 9]); const i = c * t / 100 * m / 12; return { t: `Une association place ${F(c)} au taux de ${t} % par an pendant ${m} mois. Combien d'intérêts reçoit-elle ?`, calc: `${fmtNb(c)} × ${t} : 100 × ${m} : 12 = ${fmtNb(i)}`, rep: `Elle reçoit ${F(i)} d'intérêts.` }; }
  ];
  const ordre = melanger(r, modeles.map((_, i) => i));
  let i = 0;
  while (items.length < n && i < 60) { items.push(modeles[ordre[i % ordre.length]]()); i++; }
  return {
    titre: 'Acheter, vendre, gagner, perdre', consigne: 'Prix de revient = prix d\'achat + frais. Bénéfice = prix de vente − prix de revient. Intérêt d\'un an = capital × taux : 100.',
    audio: items.map(x => x.t).join(' '),
    rendu: sol => items.map((x, k) => `<div class="probleme"><p><b>${k + 1}.</b> ${x.t}</p><p>Opération : ${sol ? `<span class="rep">${x.calc}</span>` : '<span class="ligne"></span>'}</p><p>Réponse : ${sol ? `<span class="rep">${x.rep}</span>` : '<span class="ligne longue"></span>'}</p></div>`).join('')
  };
}

// Moyenne, partages et proportionnalité (règle de trois)
function genMoyenne(r, o) {
  const cm2 = o.classe === 6, n = Math.min(o.nombre, 6), items = [];
  const modeles = [
    () => { const k = entre(r, 3, 5), m = entre(r, 9, 14), v = Array.from({ length: k }, () => m); for (let j = 0; j < k - 1; j++) { const d = entre(r, 0, 3); v[j] += d; v[j + 1] -= d; } return { t: `Les notes de Junior (sur 20) sont : ${v.join(' ; ')}. Quelle est sa moyenne ?`, calc: `(${v.join(' + ')}) : ${k} = ${m}`, rep: `Sa moyenne est ${m}.` }; },
    () => { const k = entre(r, 3, 6), q = entre(r, 12, 60); return { t: `${k} amis se partagent ${k * q} mangues en parts égales. Combien de mangues reçoit chacun ?`, calc: `${k * q} : ${k} = ${q}`, rep: `Chacun reçoit ${q} mangues.` }; },
    () => { const p = entre(r, 5, 30) * 100, a = entre(r, 2, 9), b = entre(r, 2, 9); return a !== b && { t: `${a} cahiers coûtent ${fmtNb(p * a)} F. Combien coûtent ${b} cahiers ?`, calc: `${fmtNb(p * a)} : ${a} = ${fmtNb(p)} ; ${fmtNb(p)} × ${b} = ${fmtNb(p * b)}`, rep: `${b} cahiers coûtent ${fmtNb(p * b)} F.` }; },
    () => { const q = entre(r, 5, 40) * 100, d = entre(r, 2, 8) * 100; return { t: `Fotso et Ewané se partagent ${fmtNb(2 * q + d)} F. Fotso reçoit ${fmtNb(d)} F de plus qu'Ewané. Combien reçoit chacun ?`, calc: `(${fmtNb(2 * q + d)} − ${fmtNb(d)}) : 2 = ${fmtNb(q)}`, rep: `Ewané reçoit ${fmtNb(q)} F et Fotso ${fmtNb(q + d)} F.` }; },
    () => { const a = entre(r, 2, 5), b = entre(r, 2, 5), u = entre(r, 5, 40) * 100; return cm2 && a !== b && { t: `Deux familles se partagent ${fmtNb((a + b) * u)} F en parts proportionnelles à ${a} et ${b}. Combien reçoit chaque famille ?`, calc: `${fmtNb((a + b) * u)} : ${a + b} = ${fmtNb(u)} ; ${fmtNb(u)} × ${a} = ${fmtNb(a * u)} ; ${fmtNb(u)} × ${b} = ${fmtNb(b * u)}`, rep: `Elles reçoivent ${fmtNb(a * u)} F et ${fmtNb(b * u)} F.` }; }
  ];
  const ordre = melanger(r, modeles.map((_, i) => i));
  let i = 0;
  while (items.length < n && i < 80) { const x = modeles[ordre[i % ordre.length]](); i++; if (x) items.push(x); }
  return {
    titre: cm2 ? 'Moyenne, partages et règle de trois' : 'Moyenne et partages', consigne: 'Moyenne = somme des nombres : nombre de nombres. Règle de trois : on cherche d\'abord le prix d\'un seul objet.',
    audio: items.map(x => x.t).join(' '),
    rendu: sol => items.map((x, k) => `<div class="probleme"><p><b>${k + 1}.</b> ${x.t}</p><p>Opération : ${sol ? `<span class="rep">${x.calc}</span>` : '<span class="ligne"></span>'}</p><p>Réponse : ${sol ? `<span class="rep">${x.rep}</span>` : '<span class="ligne longue"></span>'}</p></div>`).join('')
  };
}

// Aires et périmètres : CM1 carré, rectangle, triangle, cercle ; CM2 + trapèze, losange, disque
function genAires(r, o) {
  const cm2 = o.classe === 6, n = Math.min(o.nombre, 6), items = [], vus = new Set();
  const types = cm2 ? ['ra', 'trap', 'los', 'disque', 'cercle', 'cote'] : ['rp', 'ra', 'ca', 'ta', 'cercle', 'cp'];
  while (items.length < n) {
    const t = types[items.length % types.length], L = entre(r, 6, 30), l = entre(r, 2, L - 2), h = entre(r, 2, 20) * 2, d = entre(r, 2, 20);
    if (t === 'rp') items.push({ f: 'Rectangle', d: `L = ${L} m, l = ${l} m`, q: 'Périmètre', c: fmtNb(2 * (L + l)), u: 'm' });
    else if (t === 'ra') items.push({ f: 'Rectangle', d: `L = ${L} m, l = ${l} m`, q: 'Aire', c: fmtNb(L * l), u: 'm²' });
    else if (t === 'cp') items.push({ f: 'Carré', d: `côté = ${l} m`, q: 'Périmètre', c: fmtNb(4 * l), u: 'm' });
    else if (t === 'ca') items.push({ f: 'Carré', d: `côté = ${l} m`, q: 'Aire', c: fmtNb(l * l), u: 'm²' });
    else if (t === 'ta') items.push({ f: 'Triangle', d: `base = ${L} cm, hauteur = ${h} cm`, q: 'Aire', c: fmtNb(L * h / 2), u: 'cm²' });
    else if (t === 'cercle') items.push({ f: 'Cercle', d: `diamètre = ${d} cm`, q: 'Périmètre', c: decSimple(arr(d * 3.14)), u: 'cm' });
    else if (t === 'disque') items.push({ f: 'Disque', d: `rayon = ${d} cm`, q: 'Aire', c: decSimple(arr(d * d * 3.14)), u: 'cm²' });
    else if (t === 'trap') items.push({ f: 'Trapèze', d: `grande base = ${L} m, petite base = ${l} m, hauteur = ${h} m`, q: 'Aire', c: fmtNb((L + l) * h / 2), u: 'm²' });
    else if (t === 'los') items.push({ f: 'Losange', d: `grande diagonale = ${L} cm, petite diagonale = ${h} cm`, q: 'Aire', c: fmtNb(L * h / 2), u: 'cm²' });
    else items.push({ f: 'Rectangle', d: `aire = ${fmtNb(L * l)} m², L = ${L} m`, q: 'Largeur l', c: String(l), u: 'm' });
  }
  return {
    titre: cm2 ? 'Aires : trapèze, losange, disque' : 'Périmètres et aires',
    consigne: cm2 ? 'Trapèze : A = (B + b) × h : 2. Losange : A = D × d : 2. Disque : A = r × r × 3,14. Cercle : P = D × 3,14.'
      : 'Rectangle : P = (L + l) × 2 ; A = L × l. Carré : P = c × 4 ; A = c × c. Triangle : A = b × h : 2. Cercle : P = diamètre × 3,14.',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. <b>${x.f}</b> (${x.d}). ${x.q} = ${vide(sol, x.c, true)} ${x.u}</div>`).join('')}</div>`
  };
}

// Mesures : CM1 et CM2 (longueurs, capacités, masses avec le quintal, surfaces, mesures agraires, volumes)
function genConversions(r, o) {
  const cm2 = o.classe === 6, n = Math.min(o.nombre, 12), items = [], vus = new Set();
  const regles = cm2
    ? [['km', 'm', 1000], ['m', 'mm', 1000], ['L', 'mL', 1000], ['hL', 'L', 100], ['t', 'kg', 1000], ['t', 'q', 10], ['q', 'kg', 100], ['m²', 'dm²', 100], ['m²', 'cm²', 10000], ['ha', 'a', 100], ['ha', 'm²', 10000], ['m³', 'dm³', 1000], ['dm³', 'L', 1], ['m³', 'L', 1000]]
    : [['km', 'm', 1000], ['hm', 'm', 100], ['dam', 'm', 10], ['hL', 'L', 100], ['daL', 'L', 10], ['kg', 'g', 1000], ['q', 'kg', 100], ['m²', 'dm²', 100], ['ha', 'a', 100], ['a', 'm²', 100], ['a', 'ca', 100], ['m³', 'dm³', 1000], ['dm³', 'cm³', 1000]];
  let g = 0;
  while (items.length < n && g++ < 1000) {
    const [gr, p, f] = choisir(r, regles), dec = f >= 10 && r() < 0.4;
    const x = dec ? entre(r, 11, 99) / 10 : entre(r, 2, 9);
    const cle = gr + p + x; if (vus.has(cle)) continue; vus.add(cle);
    items.push({ t: `${decSimple(x)} ${gr}`, c: decSimple(arr(x * f, 3)), p });
  }
  return {
    titre: cm2 ? 'Mesures : masses, surfaces, volumes' : 'Mesures : longueurs, capacités, masses, surfaces',
    consigne: cm2 ? 'Convertis. 1 t = 10 q = 1 000 kg ; 1 ha = 100 a = 10 000 m² ; 1 m³ = 1 000 dm³ ; 1 dm³ = 1 L.'
      : 'Convertis. 1 km = 1 000 m ; 1 q (quintal) = 100 kg ; 1 ha = 100 a ; 1 a = 100 m² = 100 ca ; 1 m³ = 1 000 dm³.',
    rendu: sol => `<div class="grille col2">${items.map(x => `<div class="calc petit">${x.t} = ${vide(sol, x.c, true)} ${x.p}</div>`).join('')}</div>`
  };
}

// Volumes du cube et du pavé droit
function genVolumes(r, o) {
  const n = Math.min(o.nombre, 6), items = [];
  while (items.length < n) {
    const cube = items.length % 3 === 0, a = entre(r, 2, 12), b = entre(r, 2, 10), c = entre(r, 2, 8);
    items.push(cube ? { f: 'Cube', d: `arête = ${a} cm`, c: fmtNb(a * a * a) } : { f: 'Pavé droit', d: `L = ${a} cm, l = ${b} cm, h = ${c} cm`, c: fmtNb(a * b * c) });
  }
  return {
    titre: 'Volume du cube et du pavé droit', consigne: 'Cube : V = a × a × a. Pavé droit : V = L × l × h. Le résultat est en cm³.',
    rendu: sol => `<div class="grille col1">${items.map((x, i) => `<div class="calc petit">${i + 1}. <b>${x.f}</b> (${x.d}). Volume = ${vide(sol, x.c, true)} cm³</div>`).join('')}</div>`
  };
}

// ---------- Le catalogue corrigé ----------
(() => {
  const t = (id, nom, domaine, gen, options, k, defs) => ({ id, fach: MA, nom, domaine, gen, options, fixe: { classe: k }, defs: defs || {} });
  const remplacer = (k, id, nouveau) => { const i = THEMES[k].findIndex(x => x.id === id); if (i >= 0) THEMES[k][i] = nouveau; else THEMES[k].push(nouveau); };
  const ajouterApres = (k, apres, nouveau) => { const i = THEMES[k].findIndex(x => x.id === apres); THEMES[k].splice(i < 0 ? THEMES[k].length : i + 1, 0, nouveau); };
  const enlever = (k, id) => { THEMES[k] = THEMES[k].filter(x => x.id !== id); };

  // SIL : monnaie ≤ 20 F, double et moitié, jours de la semaine
  remplacer(1, 'monnaie', t('monnaie', 'La monnaie (jusqu\'à 20 F)', MG, genMonnaiePetit, ['nombre'], 1, { nombre: '6' }));
  ajouterApres(1, 'calcul', t('doublemoitie', 'Double et moitié', NC, genDoubleMoitiePetit, ['nombre'], 1, { nombre: '12' }));
  ajouterApres(1, 'monnaie', t('temps', 'Les jours de la semaine', MG, genTemps, ['nombre'], 1, { nombre: '6' }));

  // CP : tables de 2, 4 et 5 ; multiplication posée ; partages ; monnaie ≤ 50 F ; semaine, mois, année (pas d'heure)
  remplacer(2, 'tables', t('tables', 'Tables de 2, 4 et 5', NC, genTables, ['reihen', 'niveau', 'nombre'], 2, { reihen: [2, 4, 5] }));
  ajouterApres(2, 'tables', t('multiplication', 'Multiplication posée (résultat < 100)', NC, genMultiplicationCP, ['nombre'], 2, { nombre: '6' }));
  remplacer(2, 'doublemoitie', t('doublemoitie', 'Double et moitié', NC, genDoubleMoitiePetit, ['nombre'], 2, { nombre: '12' }));
  ajouterApres(2, 'ensembles', t('partages', 'Partages et fractions', NC, genPartages, ['nombre'], 2, { nombre: '6' }));
  remplacer(2, 'monnaie', t('monnaie', 'La monnaie (jusqu\'à 50 F)', MG, genMonnaiePetit, ['nombre'], 2, { nombre: '6' }));
  enlever(2, 'heure');
  ajouterApres(2, 'monnaie', t('temps', 'Semaine, mois et année', MG, genTemps, ['nombre'], 2, { nombre: '8' }));

  // CM1 et CM2
  [5, 6].forEach(k => {
    const cm2 = k === 6;
    ajouterApres(k, 'multiplication', t('preuve9', 'La preuve par 9', NC, genPreuve9, ['nombre'], k, { nombre: '6' }));
    ajouterApres(k, 'division', t('divisibilite', cm2 ? 'Divisible par 2, 3, 5, 9 ?' : 'Divisible par 2, 3, 5 ?', NC, genDivisibilite, ['nombre'], k, { nombre: '12' }));
    ajouterApres(k, 'fractions', t('fractionsop', 'Calculer avec les fractions', NC, genFractionsOp, ['nombre'], k, { nombre: '12' }));
    remplacer(k, 'mesures', t('mesures', cm2 ? 'Mesures : masses, surfaces, volumes' : 'Mesures : longueurs, capacités, masses, surfaces', MG, genConversions, ['nombre'], k, { nombre: '12' }));
    ajouterApres(k, 'mesures', t('volumes', 'Volume du cube et du pavé droit', MG, genVolumes, ['nombre'], k, { nombre: '6' }));
    remplacer(k, 'durees', t('durees', 'Les nombres complexes (h, min)', MG, genComplexes, ['nombre'], k, { nombre: '6' }));
    remplacer(k, 'aires', t('aires', cm2 ? 'Aires : trapèze, losange, disque' : 'Périmètres et aires (avec le cercle)', MG, genAires, ['nombre'], k, { nombre: '6' }));
    ajouterApres(k, 'statistiques', t('moyenne', cm2 ? 'Moyenne, partages, règle de trois' : 'Moyenne et partages', 'Statistiques', genMoyenne, ['nombre'], k, { nombre: '5' }));
    ajouterApres(k, 'moyenne', t('vitesse', 'Les mouvements uniformes (vitesse)', NC, genVitesse, ['nombre'], k, { nombre: '4' }));
    ajouterApres(k, 'vitesse', t('commerce', 'Acheter, vendre, intérêts', NC, genCommerce, ['nombre'], k, { nombre: '5' }));
  });
})();
