// lib/questions.ts
import { BuzzQuestion, QCMQuestion, GameMode, isBuzzMechanic, isBlindTestMode } from '@/types';

export const BUZZ_QUESTIONS: BuzzQuestion[] = [
  { type: 'buzz', q: "Quelle est la capitale de la France ?", a: "Paris", choices: ["Lyon", "Paris", "Marseille", "Bordeaux"], correct: 1 },
  { type: 'buzz', q: "Combien font 7 × 8 ?", a: "56", choices: ["48", "54", "56", "64"], correct: 2 },
  { type: 'buzz', q: "Quel est le plus grand océan du monde ?", a: "Pacifique", choices: ["Atlantique", "Indien", "Pacifique", "Arctique"], correct: 2 },
  { type: 'buzz', q: "En quelle année a eu lieu la Révolution française ?", a: "1789", choices: ["1776", "1783", "1789", "1799"], correct: 2 },
  { type: 'buzz', q: "Qui a peint la Joconde ?", a: "Léonard de Vinci", choices: ["Raphaël", "Botticelli", "Michel-Ange", "Léonard de Vinci"], correct: 3 },
  { type: 'buzz', q: "Quel est le symbole chimique de l'or ?", a: "Au", choices: ["Ag", "Fe", "Au", "Cu"], correct: 2 },
  { type: 'buzz', q: "Combien de cordes a une guitare classique ?", a: "6", choices: ["4", "5", "6", "7"], correct: 2 },
  { type: 'buzz', q: "Quel pays a inventé les Jeux Olympiques ?", a: "Grèce", choices: ["Rome", "Grèce", "Égypte", "Perse"], correct: 1 },
  { type: 'buzz', q: "Quelle est la planète la plus proche du Soleil ?", a: "Mercure", choices: ["Vénus", "Mars", "Mercure", "Jupiter"], correct: 2 },
  { type: 'buzz', q: "Qui a écrit Roméo et Juliette ?", a: "Shakespeare", choices: ["Molière", "Dickens", "Hugo", "Shakespeare"], correct: 3 },
  { type: 'buzz', q: "Combien de continents y a-t-il sur Terre ?", a: "7", choices: ["5", "6", "7", "8"], correct: 2 },
  { type: 'buzz', q: "Quelle est la monnaie du Japon ?", a: "Yen", choices: ["Won", "Yuan", "Yen", "Ringgit"], correct: 2 },
];

export const QCM_QUESTIONS: QCMQuestion[] = [
  { type: 'qcm', q: "Quelle est la capitale de l'Australie ?", choices: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2 },
  { type: 'qcm', q: "Combien de joueurs y a-t-il dans une équipe de football ?", choices: ["9", "10", "11", "12"], correct: 2 },
  { type: 'qcm', q: "Quel est le plus grand pays du monde ?", choices: ["Canada", "Chine", "États-Unis", "Russie"], correct: 3 },
  { type: 'qcm', q: "En quelle année a eu lieu le premier alunissage ?", choices: ["1965", "1967", "1969", "1972"], correct: 2 },
  { type: 'qcm', q: "Quelle est la formule chimique de l'eau ?", choices: ["HO", "H2O", "H3O", "OH2"], correct: 1 },
  { type: 'qcm', q: "Qui a peint la Chapelle Sixtine ?", choices: ["Léonard de Vinci", "Raphaël", "Michel-Ange", "Botticelli"], correct: 2 },
  { type: 'qcm', q: "Combien de côtés a un hexagone ?", choices: ["5", "6", "7", "8"], correct: 1 },
  { type: 'qcm', q: "Quel animal est le symbole de l'Australie ?", choices: ["Koala", "Kangourou", "Wombat", "Émeu"], correct: 1 },
  { type: 'qcm', q: "Quelle est la vitesse de la lumière ?", choices: ["200 000 km/s", "250 000 km/s", "300 000 km/s", "350 000 km/s"], correct: 2 },
  { type: 'qcm', q: "Quel est le plus long fleuve du monde ?", choices: ["Amazone", "Nil", "Mississippi", "Yangtsé"], correct: 1 },
];

// ─── BLIND TEST : questions musique & culture pop ───────────────────────────
export const BLIND_TEST_QCM: QCMQuestion[] = [
  { type: 'qcm', q: "Qui chante 'Rolling in the Deep' (2010) ?", choices: ["Rihanna", "Beyoncé", "Adele", "Amy Winehouse"], correct: 2 },
  { type: 'qcm', q: "Quel groupe a sorti 'Bohemian Rhapsody' ?", choices: ["The Beatles", "Led Zeppelin", "Queen", "The Rolling Stones"], correct: 2 },
  { type: 'qcm', q: "Qui est l'auteur de 'La vie en rose' ?", choices: ["Juliette Gréco", "Barbara", "Dalida", "Édith Piaf"], correct: 3 },
  { type: 'qcm', q: "'Thriller' est l'album le plus vendu au monde. Qui l'a sorti ?", choices: ["Prince", "Michael Jackson", "David Bowie", "Elvis Presley"], correct: 1 },
  { type: 'qcm', q: "Quel artiste français a sorti 'Je veux' en 2011 ?", choices: ["Stromae", "Zaz", "Carla Bruni", "Camille"], correct: 1 },
  { type: 'qcm', q: "Dans quel film entend-on 'My Heart Will Go On' de Céline Dion ?", choices: ["Ghost", "Pretty Woman", "Titanic", "Dirty Dancing"], correct: 2 },
  { type: 'qcm', q: "Quel groupe chante 'Don't Stop Me Now' ?", choices: ["The Who", "Queen", "AC/DC", "Guns N' Roses"], correct: 1 },
  { type: 'qcm', q: "Qui a composé la 5e Symphonie en do mineur ?", choices: ["Mozart", "Bach", "Beethoven", "Chopin"], correct: 2 },
  { type: 'qcm', q: "Quel artiste a sorti 'Shape of You' en 2017 ?", choices: ["Justin Bieber", "Ed Sheeran", "Sam Smith", "Harry Styles"], correct: 1 },
  { type: 'qcm', q: "Stromae est originaire de quel pays ?", choices: ["France", "Suisse", "Canada", "Belgique"], correct: 3 },
  { type: 'qcm', q: "Quel groupe britannique a sorti 'Wonderwall' en 1995 ?", choices: ["Blur", "Radiohead", "Oasis", "The Verve"], correct: 2 },
  { type: 'qcm', q: "Qui interprète 'Papaoutai' ?", choices: ["Stromae", "Aloïse Sauvage", "Grand Corps Malade", "Vald"], correct: 0 },
];

export const BLIND_TEST_BUZZ: BuzzQuestion[] = [
  { type: 'buzz', q: "Qui chante 'Uptown Funk' avec Bruno Mars ?", a: "Mark Ronson", choices: ["Pharrell Williams", "Mark Ronson", "Jay-Z", "Kanye West"], correct: 1 },
  { type: 'buzz', q: "Quel groupe a popularisé le grunge avec l'album 'Nevermind' ?", a: "Nirvana", choices: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"], correct: 2 },
  { type: 'buzz', q: "Quelle chanteuse française est surnommée 'La Môme' ?", a: "Édith Piaf", choices: ["Barbara", "Dalida", "Édith Piaf", "Françoise Hardy"], correct: 2 },
  { type: 'buzz', q: "Quel artiste a sorti l'album 'Purple Rain' ?", a: "Prince", choices: ["Stevie Wonder", "James Brown", "Prince", "Marvin Gaye"], correct: 2 },
  { type: 'buzz', q: "Dans quelle ville a eu lieu le célèbre concert 'Live Aid' en 1985 ?", a: "Londres", choices: ["New York", "Paris", "Londres", "Berlin"], correct: 2 },
  { type: 'buzz', q: "Quel rappeur français a sorti 'Suprême NTM' avec Joey Starr ?", a: "Kool Shen", choices: ["IAM", "Kool Shen", "Doc Gynéco", "MC Solaar"], correct: 1 },
  { type: 'buzz', q: "Qui a composé 'Les Quatre Saisons' ?", a: "Vivaldi", choices: ["Haendel", "Vivaldi", "Bach", "Schubert"], correct: 1 },
  { type: 'buzz', q: "Quel est l'instrument principal d'Elton John ?", a: "Piano", choices: ["Guitare", "Basse", "Piano", "Violon"], correct: 2 },
];

/**
 * Retourne les questions à utiliser selon le mode de la salle
 * (gère les anciens modes 'qcm'/'buzz' + les 4 nouveaux)
 */
export function getQuestionsForMode(mode: GameMode): (QCMQuestion | BuzzQuestion)[] {
  if (isBlindTestMode(mode)) {
    return isBuzzMechanic(mode) ? BLIND_TEST_BUZZ : BLIND_TEST_QCM;
  }
  return isBuzzMechanic(mode) ? BUZZ_QUESTIONS : QCM_QUESTIONS;
}

export const FREE_QUESTION_LIMIT = 999;
