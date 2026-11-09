// Données : prénoms et classes. Tout est écrit pour ce projet (Baobab Primaire, programme MINEDUB 2018).
const PRENOMS = [
  ['Amara','f'],['Noah','m'],['Nadège','f'],['Junior','m'],['Ngono','f'],['Ekane','m'],['Mbarga','m'],['Manuela','f'],
  ['Aïssatou','f'],['Hamadou','m'],['Brice','m'],['Clarisse','f'],['Ewané','m'],['Ange','f'],['Fotso','m'],['Grâce','f']
];
// Les 6 classes du primaire. CE1-CE2 : programme officiel lu en entier. SIL-CP et CM : d'après le résumé, à vérifier.
const CLASSES = { 1: 'SIL', 2: 'CP', 3: 'CE1', 4: 'CE2', 5: 'CM1', 6: 'CM2' };
const NIVEAUX = { 1: 'Niveau 1', 2: 'Niveau 1', 3: 'Niveau 2', 4: 'Niveau 2', 5: 'Niveau 3', 6: 'Niveau 3' };
const ACTIVES = [1, 2, 3, 4, 5, 6];
const NOMCL = k => CLASSES[k] || '';
// Pas de vente dans la version test : tout est libre.
const estLibre = () => true, estGratuit = () => false;
