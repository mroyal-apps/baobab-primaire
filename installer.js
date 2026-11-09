// Bouton « Installer l'appli » : propose l'installation (PWA) et explique les étapes selon l'appareil.
let invitationInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); invitationInstall = e; });
window.addEventListener('appinstalled', () => { invitationInstall = null; dessinerEntete(); });

const dejaInstallee = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

function appareil() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (ios) return /CriOS|FxiOS|EdgiOS|Brave/.test(ua) ? 'ios-autre' : 'ios';
  if (/Android/.test(ua)) return /SamsungBrowser|Firefox|OPR|EdgA|UCBrowser|MiuiBrowser|YaBrowser|; wv\)/.test(ua) ? 'android-autre' : 'android';
  if (/Macintosh/.test(ua)) return /Safari/.test(ua) && !/Chrome|Chromium/.test(ua) ? 'mac-safari' : (navigator.brave ? 'mac-brave' : 'mac');
  return 'pc';
}

const ETAPES = {
  fr: {
    installee: '✓ Application installée', deja: 'L\'appli est déjà installée sur cet appareil. Tu peux l\'ouvrir depuis l\'icône Baobab Primaire.',
    chrome: 'Ouvrir dans Chrome',
    'android-autre': ['Sur ce navigateur, Android peut bloquer l\'installation (Google Play Protect).', 'Touche le bouton <b>« Ouvrir dans Chrome »</b> ci-dessous.', 'Dans Chrome : <b>⋮</b> en haut à droite → <b>« Installer l\'application »</b> → <b>« Installer »</b>.'],
    'mac-brave': ['Dans Brave, clique sur le menu <b>☰</b> en haut à droite.', 'Clique sur <b>« Enregistrer et partager »</b> → <b>« Installer la page en tant qu\'application… »</b> → <b>« Installer »</b>.', 'Si cette ligne n\'existe pas : clique sur le <b>lion 🦁</b> à droite de l\'adresse, baisse les protections pour ce site, recharge la page et recommence.', 'Autre solution : <b>☰</b> → <b>« Plus d\'outils »</b> → <b>« Créer un raccourci… »</b>, coche <b>« Ouvrir dans une fenêtre »</b> → <b>« Créer »</b>.'],
    bouton: '📲 Installer l\'appli', titre: 'Installer Baobab Primaire comme une appli',
    fin: 'Ensuite, l\'icône Baobab Primaire est avec tes autres applis. L\'appli marche aussi sans internet.',
    ios: ['Ouvre ce site dans <b>Safari</b>.', 'Touche le bouton <b>Partager</b> (carré avec une flèche vers le haut).', 'Touche <b>« Sur l\'écran d\'accueil »</b>.', 'Touche <b>« Ajouter »</b>.'],
    'ios-autre': ['Copie le lien de ce site.', 'Ouvre-le dans <b>Safari</b> (sur iPhone, l\'installation marche seulement avec Safari).', 'Touche <b>Partager</b> → <b>« Sur l\'écran d\'accueil »</b> → <b>« Ajouter »</b>.'],
    android: ['Ouvre ce site dans <b>Chrome</b>.', 'Touche les <b>trois points ⋮</b> en haut à droite.', 'Touche <b>« Installer l\'application »</b> (ou « Ajouter à l\'écran d\'accueil »).', 'Confirme avec <b>« Installer »</b>.'],
    mac: ['Clique sur le menu <b>☰</b> (ou <b>⋮</b>) en haut à droite du navigateur.', 'Clique sur <b>« Enregistrer et partager »</b> → <b>« Installer la page en tant qu\'application… »</b>.', 'Si cette ligne n\'existe pas : <b>« Plus d\'outils »</b> → <b>« Créer un raccourci… »</b>, coche <b>« Ouvrir dans une fenêtre »</b>.', 'Clique sur <b>« Installer »</b> (ou « Créer »).'],
    'mac-safari': ['Dans Safari, clique sur le menu <b>Fichier</b>.', 'Clique sur <b>« Ajouter au Dock… »</b>.', 'Clique sur <b>« Ajouter »</b>.'],
    pc: ['Clique sur le menu <b>⋮</b> en haut à droite du navigateur (Chrome, Edge ou Brave).', 'Clique sur <b>« Installer Baobab Primaire »</b> (ou « Enregistrer et partager » → « Installer la page en tant qu\'application… »).', 'Clique sur <b>« Installer »</b>.']
  }
};

function aideInstallation() {
  const T = ETAPES[etat.langue] || ETAPES.fr;
  let m = document.getElementById('modale-install');
  if (!m) { m = document.createElement('div'); m.id = 'modale-install'; m.className = 'modale'; document.body.appendChild(m); }
  m.innerHTML = `<div class="boite boite-install" role="dialog" aria-modal="true"><button class="fermer" aria-label="Fermer">×</button>
    ${dejaInstallee() ? `<h2>${T.installee}</h2><p>${T.deja}</p>` : `<h2>${T.titre}</h2><ol class="etapes-install">${T[appareil()].map(e => `<li>${e}</li>`).join('')}</ol>
    ${appareil() === 'android-autre' ? `<p><a class="btn principal" href="intent://${location.host}${location.pathname}#Intent;scheme=https;package=com.android.chrome;end">${T.chrome}</a></p>` : ''}<p>${T.fin}</p>`}</div>`;
  m.hidden = false;
  m.querySelector('.fermer').onclick = () => { m.hidden = true; };
  m.onclick = e => { if (e.target === m) m.hidden = true; };
}

async function installer() {
  if (invitationInstall && !dejaInstallee() && appareil() !== 'android-autre') {
    invitationInstall.prompt();
    try { await invitationInstall.userChoice; } catch (e) {}
    invitationInstall = null;
  } else aideInstallation();
}

// Ajoute le bouton dans l'en-tête (à chaque dessin de l'en-tête, par exemple après un changement de langue).
const dessinerEnteteSansInstall = dessinerEntete;
dessinerEntete = function () {
  dessinerEnteteSansInstall();
  const T = ETAPES[etat.langue] || ETAPES.fr, fait = dejaInstallee();
  const b = document.createElement('button');
  b.id = 'btn-installer'; b.className = 'btn-installer' + (fait ? ' installee' : ''); b.type = 'button'; b.textContent = fait ? T.installee : T.bouton;
  b.onclick = installer;
  const langues = document.querySelector('#nav .langues');
  langues.parentNode.insertBefore(b, langues);
};
dessinerEntete();
