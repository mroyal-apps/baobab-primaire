// Baobab Primaire – v0.6 : guide « Comment utiliser l'appli » (demande de Cedric, 10/11/2026)
// Page #/guide : les fonctions clés expliquées en phrases courtes, étape par étape. Bip le robot présente le guide.

const GUIDE = [
  ['🏫', 'Choisir la classe', [
    'Sur la page d\'accueil, touche ta classe : SIL, CP, CE1, CE2, CM1 ou CM2.',
    'Tu vois les exercices de mathématiques et de français de cette classe, selon le programme officiel du Cameroun.']],
  ['🖨️', 'Imprimer des fiches', [
    'En haut de la page de la classe, choisis « 🖨️ Fiches à imprimer ».',
    'Touche un exercice. Tu peux changer les réglages (par exemple la taille des nombres).',
    'Choisis le « Nombre de fiches différentes » (1 à 10) : chaque fiche a d\'autres exercices.',
    'Touche « 🖨️ Imprimer / PDF ». Les solutions et l\'aide pour les parents sont imprimées à la fin.']],
  ['🎮', 'S\'entraîner à l\'écran', [
    'En haut de la page de la classe, choisis « 🎮 S\'entraîner à l\'écran », puis un exercice.',
    'Écris ta réponse dans la case, ou touche la bonne réponse.',
    'Vert = c\'est juste ✅. Rouge = essaie encore. Après 3 essais, la solution s\'affiche.',
    'Une réponse juste du premier coup donne une étoile ⭐. Les étoiles restent sur l\'appareil.']],
  ['🤖', 'Bip, ton robot', [
    'Bip t\'accompagne pendant les exercices à l\'écran.',
    'Quand c\'est juste, il te félicite. Quand c\'est faux, il t\'encourage. À la fin, il fait la fête avec toi.',
    'Touche « 🤖🔊 Bip parle » pour que Bip parle à voix haute. Touche encore pour l\'arrêter.',
    'Bip est vivant : il cligne des yeux, il regarde ton doigt, sa bouche bouge quand il parle. Touche-le : il rit, il saute ou il tourne !',
    'Si tu ne fais rien pendant un moment, Bip s\'endort (Z z z). Touche l\'écran pour le réveiller.',
    'Tu préfères Amara ou Noah ? Touche « ✏️ Mon prénom » et choisis ton compagnon.']],
  ['✏️', 'Mon prénom', [
    'Sous le compagnon, touche « ✏️ Mon prénom ».',
    'Écris ton prénom, dis si tu es une fille ou un garçon, choisis ton compagnon, puis touche OK.',
    'Bip te dira « Bonjour Yohann ! » et « Bravo, Yohann ! ». « Effacer » enlève le prénom.']],
  ['🔊', 'Écouter', [
    'Touche « 🔊 Écouter » : l\'appli lit la consigne à voix haute. Pour une dictée, elle lit le texte lentement.']],
  ['🔄', 'Toujours de nouveaux exercices', [
    'Touche « 🔄 Nouveaux exercices » ou « 🔄 Nouvelle fiche » : l\'appli crée d\'autres exercices. Il n\'y a pas de limite.']],
  ['👪', 'Pour les parents', [
    'En bas de chaque exercice : « 👪 Aide pour les parents » explique comment aider l\'enfant.',
    'Toutes les explications pour les parents : <a href="#/parents">👪 Aide pour les parents</a>.']],
  ['📲', 'Installer l\'appli sur le téléphone', [
    'Android (Chrome) : touche ⋮ en haut à droite, puis « Installer l\'application » ou « Ajouter à l\'écran d\'accueil ».',
    'iPhone (Safari) : touche le bouton Partager ⬆️, puis « Sur l\'écran d\'accueil ».',
    'L\'icône Baobab Primaire apparaît sur l\'écran, comme une vraie appli.']],
  ['📴', 'Sans Internet', [
    'Après la première ouverture, l\'appli marche aussi sans Internet.']],
  ['✨', 'Mises à jour', [
    'Quand une nouvelle version existe, un bandeau s\'affiche. Touche « Mettre à jour ».']],
  ['🔒', 'Tes données', [
    'Pas de compte, pas de mot de passe. Le prénom, les étoiles et les réglages restent seulement sur cet appareil.']]
];

function pageGuide() {
  $app.innerHTML = `<section class="page page-guide">
    <div class="barre-retour"><a href="#/" class="retour">← ${t('accueil')}</a></div>
    <h1>📖 ${t('g_titre')}</h1>
    <div class="ueben-tete guide-tete"><div class="perso">${robotSVG('content')}</div><div class="bulle">${t('g_bip')}</div></div>
    <p><a class="btn" href="#/parents">👪 ${t('aide_titre')}</a></p>
    <nav class="guide-sommaire">${GUIDE.map(([ic, ti], i) => `<a href="#/guide" data-g="${i}">${ic} ${ti}</a>`).join('')}</nav>
    ${GUIDE.map(([ic, ti, l], i) => `<section class="guide-carte" id="g-${i}"><h2><span class="guide-ic">${ic}</span> ${ti}</h2>
      ${l.length > 1 ? `<ol>${l.map(x => `<li>${x}</li>`).join('')}</ol>` : `<p>${l[0]}</p>`}</section>`).join('')}
    <p class="guide-fin"><a class="btn principal" href="#/">🚀 ${t('g_commencer')}</a></p>
  </section>`;
  document.querySelectorAll('.guide-sommaire a').forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById('g-' + a.dataset.g).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

Object.assign(TEXTES.fr, {
  g_menu: 'Guide', g_titre: 'Comment utiliser l\'appli',
  g_bip: 'Bonjour ! Je suis Bip. 🤖 Ici, je t\'explique tout. Touche un titre pour aller directement à la bonne partie.',
  g_commencer: 'C\'est parti !'
});
