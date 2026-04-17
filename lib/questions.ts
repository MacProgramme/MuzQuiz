// lib/questions.ts
import { BuzzQuestion, QCMQuestion } from '@/types';

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

export const FREE_QUESTION_LIMIT = 999;
