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

// ─── PACKS BUILTIN ──────────────────────────────────────────────────────────

export interface BuiltinPack {
  id: string;
  name: string;
  /** 'blind_test' = mode blind test QCM, 'quiz' = mode QCM classique */
  mode: 'blind_test' | 'quiz';
  emoji: string;
  questions: (QCMQuestion | BuzzQuestion)[];
}

// ── Quiz — Culture Générale ──────────────────────────────────────────────────
const QUIZ_CULTURE_GENERALE: QCMQuestion[] = [
  { type: 'qcm', q: "Quel est le pays le plus peuplé du monde ?", choices: ["Chine", "Inde", "États-Unis", "Indonésie"], correct: 1 },
  { type: 'qcm', q: "Combien d'os y a-t-il dans le corps humain adulte ?", choices: ["186", "196", "206", "216"], correct: 2 },
  { type: 'qcm', q: "Qui a peint 'La Nuit étoilée' ?", choices: ["Monet", "Gauguin", "Van Gogh", "Cézanne"], correct: 2 },
  { type: 'qcm', q: "Quelle est la plus haute montagne du monde ?", choices: ["K2", "Mont Blanc", "Kilimandjaro", "Everest"], correct: 3 },
  { type: 'qcm', q: "En quelle année a été construite la Tour Eiffel ?", choices: ["1879", "1884", "1889", "1894"], correct: 2 },
  { type: 'qcm', q: "Qui a inventé le téléphone ?", choices: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi"], correct: 2 },
  { type: 'qcm', q: "Quelle est la devise de la France ?", choices: ["Dieu, Honneur, Patrie", "Liberté, Égalité, Fraternité", "Force, Courage, Honneur", "Travail, Famille, Patrie"], correct: 1 },
  { type: 'qcm', q: "Quel est le plus rapide animal terrestre ?", choices: ["Lion", "Guépard", "Autruche", "Lévrier"], correct: 1 },
  { type: 'qcm', q: "Quel est l'élément chimique dont le symbole est 'Na' ?", choices: ["Magnésium", "Nickel", "Neptunium", "Sodium"], correct: 3 },
  { type: 'qcm', q: "Combien de pays composent l'Union Européenne ?", choices: ["24", "25", "27", "30"], correct: 2 },
  { type: 'qcm', q: "Quel est le plus grand océan du monde ?", choices: ["Atlantique", "Antarctique", "Indien", "Pacifique"], correct: 3 },
  { type: 'qcm', q: "En quelle année a eu lieu la chute du mur de Berlin ?", choices: ["1987", "1988", "1989", "1990"], correct: 2 },
  { type: 'qcm', q: "Quelle planète est surnommée la 'planète rouge' ?", choices: ["Jupiter", "Vénus", "Mars", "Saturne"], correct: 2 },
  { type: 'qcm', q: "Qui a écrit 'Les Misérables' ?", choices: ["Gustave Flaubert", "Victor Hugo", "Émile Zola", "Alexandre Dumas"], correct: 1 },
  { type: 'qcm', q: "Quel pays a remporté le plus de Coupes du Monde de football ?", choices: ["Allemagne", "France", "Argentine", "Brésil"], correct: 3 },
];

// ── Quiz — Cinéma & Séries ────────────────────────────────────────────────────
const QUIZ_CINEMA_SERIES: QCMQuestion[] = [
  { type: 'qcm', q: "Qui joue Iron Man dans l'univers Marvel ?", choices: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"], correct: 2 },
  { type: 'qcm', q: "Dans quelle série trouve-t-on Walter White et Jesse Pinkman ?", choices: ["Dexter", "Breaking Bad", "Narcos", "Better Call Saul"], correct: 1 },
  { type: 'qcm', q: "Quel réalisateur a créé le film 'Inception' ?", choices: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Ridley Scott"], correct: 2 },
  { type: 'qcm', q: "Quelle actrice joue Hermione Granger dans Harry Potter ?", choices: ["Keira Knightley", "Natalie Portman", "Emma Stone", "Emma Watson"], correct: 3 },
  { type: 'qcm', q: "Quel acteur joue Jack Dawson dans Titanic ?", choices: ["Brad Pitt", "Matt Damon", "Leonardo DiCaprio", "Tom Hanks"], correct: 2 },
  { type: 'qcm', q: "Dans quelle série trouve-t-on le Trône de Fer ?", choices: ["The Witcher", "Vikings", "Game of Thrones", "The Last Kingdom"], correct: 2 },
  { type: 'qcm', q: "Quel film Pixar met en scène le robot WALL-E ?", choices: ["Ratatouille", "WALL-E", "Cars", "Up"], correct: 1 },
  { type: 'qcm', q: "Qui joue James Bond dans 'Casino Royale' de 2006 ?", choices: ["Pierce Brosnan", "Daniel Craig", "Sean Connery", "Roger Moore"], correct: 1 },
  { type: 'qcm', q: "Combien de saisons compte la série 'Friends' ?", choices: ["8", "9", "10", "11"], correct: 2 },
  { type: 'qcm', q: "Dans quel film entend-on la réplique 'Houston, we have a problem' ?", choices: ["Gravity", "Interstellar", "Apollo 13", "The Martian"], correct: 2 },
  { type: 'qcm', q: "Quel film d'animation de 1994 met en scène un lion nommé Simba ?", choices: ["Bambi", "Dumbo", "Tarzan", "Le Roi Lion"], correct: 3 },
  { type: 'qcm', q: "Quelle série Netflix met en scène des enfants face à des phénomènes surnaturels à Hawkins ?", choices: ["Dark", "The OA", "Stranger Things", "Mindhunter"], correct: 2 },
];

// ── Quiz — Sport & Champions ─────────────────────────────────────────────────
const QUIZ_SPORT_CHAMPIONS: QCMQuestion[] = [
  { type: 'qcm', q: "Combien de joueurs composent une équipe de basketball ?", choices: ["4", "5", "6", "7"], correct: 1 },
  { type: 'qcm', q: "Qui détient le record du monde du 100 mètres masculin ?", choices: ["Carl Lewis", "Asafa Powell", "Usain Bolt", "Tyson Gay"], correct: 2 },
  { type: 'qcm', q: "En quelle année la France a-t-elle remporté sa première Coupe du Monde de football ?", choices: ["1994", "1996", "1998", "2002"], correct: 2 },
  { type: 'qcm', q: "Quel sport se joue avec un volant ?", choices: ["Tennis de table", "Squash", "Badminton", "Padel"], correct: 2 },
  { type: 'qcm', q: "Quel joueur de football a remporté le plus de Ballons d'Or ?", choices: ["Cristiano Ronaldo", "Lionel Messi", "Pelé", "Ronaldo"], correct: 1 },
  { type: 'qcm', q: "Combien de joueurs composent une équipe de rugby à XV ?", choices: ["13", "14", "15", "16"], correct: 2 },
  { type: 'qcm', q: "Quel pays a accueilli les Jeux Olympiques d'été en 2021 ?", choices: ["Chine", "France", "Japon", "États-Unis"], correct: 2 },
  { type: 'qcm', q: "Dans quel sport pratique-t-on un 'Grand Chelem' ?", choices: ["Golf", "Tennis", "Athlétisme", "Natation"], correct: 1 },
  { type: 'qcm', q: "Quel club de football a remporté le plus de Ligues des Champions UEFA ?", choices: ["Barcelona", "Bayern Munich", "Real Madrid", "AC Milan"], correct: 2 },
  { type: 'qcm', q: "En combien de sets se dispute un match de tennis masculin en Grand Chelem ?", choices: ["2", "3", "5", "7"], correct: 2 },
  { type: 'qcm', q: "Quel pays a remporté le plus de médailles d'or aux Jeux Olympiques ?", choices: ["Russie", "Chine", "Allemagne", "États-Unis"], correct: 3 },
  { type: 'qcm', q: "Quel est le sport national du Canada ?", choices: ["Curling", "Hockey sur glace", "Lacrosse", "Basketball"], correct: 1 },
];

// ── Quiz — Science & Technologie ─────────────────────────────────────────────
const QUIZ_SCIENCE_TECHNO: QCMQuestion[] = [
  { type: 'qcm', q: "Quelle planète est la plus grande du système solaire ?", choices: ["Saturne", "Neptune", "Jupiter", "Uranus"], correct: 2 },
  { type: 'qcm', q: "Qui a découvert la pénicilline ?", choices: ["Marie Curie", "Louis Pasteur", "Alexander Fleming", "Robert Koch"], correct: 2 },
  { type: 'qcm', q: "En quelle année a été lancé le premier iPhone ?", choices: ["2005", "2006", "2007", "2008"], correct: 2 },
  { type: 'qcm', q: "Quel est l'élément le plus abondant dans l'univers ?", choices: ["Oxygène", "Carbone", "Hélium", "Hydrogène"], correct: 3 },
  { type: 'qcm', q: "Combien de chromosomes possède l'être humain ?", choices: ["23", "46", "48", "52"], correct: 1 },
  { type: 'qcm', q: "Qui a fondé Microsoft ?", choices: ["Steve Jobs", "Elon Musk", "Bill Gates", "Jeff Bezos"], correct: 2 },
  { type: 'qcm', q: "Quel organe produit l'insuline ?", choices: ["Le foie", "Le pancréas", "Les reins", "La rate"], correct: 1 },
  { type: 'qcm', q: "À quelle température l'eau bout-elle au niveau de la mer ?", choices: ["90°C", "95°C", "100°C", "105°C"], correct: 2 },
  { type: 'qcm', q: "Quelle est la vitesse approximative de la lumière ?", choices: ["200 000 km/s", "250 000 km/s", "300 000 km/s", "350 000 km/s"], correct: 2 },
  { type: 'qcm', q: "Quel langage de programmation est à la base du web côté client ?", choices: ["Python", "Java", "JavaScript", "PHP"], correct: 2 },
  { type: 'qcm', q: "Quelle entreprise a développé le système d'exploitation Android ?", choices: ["Apple", "Microsoft", "Google", "Samsung"], correct: 2 },
  { type: 'qcm', q: "Combien de neurones environ contient le cerveau humain ?", choices: ["10 millions", "100 millions", "86 milliards", "1 trillion"], correct: 2 },
];

// ── Quiz — Histoire & Civilisations ─────────────────────────────────────────
const QUIZ_HISTOIRE_CIVILISATIONS: QCMQuestion[] = [
  { type: 'qcm', q: "En quelle année a eu lieu la chute de l'Empire romain d'Occident ?", choices: ["376", "410", "476", "527"], correct: 2 },
  { type: 'qcm', q: "Quel pharaon a fait construire la grande pyramide de Gizeh ?", choices: ["Ramsès II", "Khéops", "Toutânkhamon", "Akhenaton"], correct: 1 },
  { type: 'qcm', q: "En quelle année a commencé la Première Guerre mondiale ?", choices: ["1912", "1913", "1914", "1915"], correct: 2 },
  { type: 'qcm', q: "Qui était le premier Président de la Ve République française ?", choices: ["Georges Pompidou", "Charles de Gaulle", "René Coty", "Vincent Auriol"], correct: 1 },
  { type: 'qcm', q: "Quelle civilisation a inventé l'écriture cunéiforme ?", choices: ["Égyptienne", "Grecque", "Sumérienne", "Romaine"], correct: 2 },
  { type: 'qcm', q: "En quelle année Christophe Colomb a-t-il atteint l'Amérique ?", choices: ["1488", "1490", "1492", "1498"], correct: 2 },
  { type: 'qcm', q: "Quelle guerre a duré de 1337 à 1453 ?", choices: ["Guerre de Trente Ans", "Guerre de Sept Ans", "Guerre de Cent Ans", "Guerre de Succession"], correct: 2 },
  { type: 'qcm', q: "Qui était l'épouse de Napoléon lors de son couronnement en 1804 ?", choices: ["Marie-Louise", "Joséphine de Beauharnais", "Marie-Antoinette", "Marie Walewska"], correct: 1 },
  { type: 'qcm', q: "Quel événement symbolique a déclenché la Révolution française le 14 juillet 1789 ?", choices: ["La fuite du roi", "La prise de la Bastille", "L'exécution de Robespierre", "La mort de Louis XVI"], correct: 1 },
  { type: 'qcm', q: "En quelle année a eu lieu la réunification allemande ?", choices: ["1988", "1989", "1990", "1991"], correct: 2 },
  { type: 'qcm', q: "Qui a dirigé l'URSS pendant la Seconde Guerre mondiale ?", choices: ["Lénine", "Trotski", "Staline", "Khrouchtchev"], correct: 2 },
  { type: 'qcm', q: "Quel empire était gouverné par Gengis Khan au XIIIe siècle ?", choices: ["Empire ottoman", "Empire mongol", "Empire perse", "Empire chinois"], correct: 1 },
];

// ═══════════════════════════════════════════════════════════════════════════
// ── BLIND TEST PACKS — tous les liens YouTube vérifiés embeddables ✅
// ═══════════════════════════════════════════════════════════════════════════

// ── Blind Test — Classiques Rock & Pop (80s/90s/2000s) ───────────────────────
// Tous les liens vérifiés via oEmbed — aucun n'est bloqué par les labels
const BT_CLASSIQUES: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe interprète cette chanson ?", choices: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=hTWKbfoikeg", audio_start_time: 0 },   // Smells Like Teen Spirit ✅
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["The Rolling Stones", "Queen", "Led Zeppelin", "The Who"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ", audio_start_time: 49 },  // Bohemian Rhapsody ✅ — "Mama just killed a man"
  { type: 'qcm', q: "Quel groupe interprète ce morceau ?", choices: ["AC/DC", "Aerosmith", "Guns N' Roses", "Metallica"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=1w7OgIMMRc4", audio_start_time: 0 },   // Sweet Child O' Mine ✅
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Foreigner", "Journey", "Survivor", "REO Speedwagon"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=btPJPFnesV4", audio_start_time: 0 },   // Eye of the Tiger ✅
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Jay-Z", "Dr. Dre", "Eminem", "50 Cent"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=_Yhyp-_hX2s", audio_start_time: 0 },  // Lose Yourself ✅
  { type: 'qcm', q: "Quel groupe chante ce titre ?", choices: ["Korn", "System of a Down", "Papa Roach", "Linkin Park"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=eVTXPUF4Oz4", audio_start_time: 0 },  // In the End ✅
  { type: 'qcm', q: "Quel groupe interprète cette chanson ?", choices: ["Interpol", "The Strokes", "The Killers", "Franz Ferdinand"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=gGdGFtwCNBE", audio_start_time: 0 },  // Mr. Brightside ✅
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Blur", "Radiohead", "Oasis", "The Verve"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=bx1Bh8ZvH84", audio_start_time: 0 },  // Wonderwall ✅
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Mariah Carey", "Céline Dion", "Whitney Houston", "Jennifer Lopez"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=3JWTaaS7LdU", audio_start_time: 55 }, // I Will Always Love You ✅
  { type: 'qcm', q: "Quel groupe interprète cette chanson ?", choices: ["Blur", "Radiohead", "Oasis", "The Verve"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=XFkzRNyygfk", audio_start_time: 56 }, // Creep ✅ — refrain à 56s
];

// ── Blind Test — Hits Actuels (2010 → aujourd'hui) ───────────────────────────
// Tous vérifiés ✅ — remplacé Don't Start Now (bloqué), Djadja (bloqué), Peaches (bloqué)
const BT_HITS_ACTUELS: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["One Direction", "BTS", "Backstreet Boys", "Jonas Brothers"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=gdZLi9oWNZg", audio_start_time: 0 },   // Dynamite ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Shawn Mendes", "Harry Styles", "Ed Sheeran", "Niall Horan"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=H5v3kku4y6Q", audio_start_time: 0 },   // As It Was ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Dua Lipa", "Olivia Rodrigo", "Billie Eilish", "Sabrina Carpenter"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=ZmDBbnmKpqQ", audio_start_time: 48 },  // drivers license ✅
  { type: 'qcm', q: "Qui interprète ce morceau ?", choices: ["Drake", "Post Malone", "Travis Scott", "Juice WRLD"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=wXhTHyIgQ_U", audio_start_time: 0 },   // Circles ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Dua Lipa", "Olivia Rodrigo", "Taylor Swift", "Camila Cabello"], correct: 0,
    youtube_url: "https://www.youtube.com/watch?v=TUVcZfQe-Kw", audio_start_time: 30 },  // Levitating ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Ariana Grande", "Olivia Rodrigo", "Doja Cat", "Billie Eilish"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=gNi_6U5Pm_o", audio_start_time: 0 },   // good 4 u ✅
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Two Door Cinema Club", "MGMT", "Tame Impala", "Glass Animals"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=mRD0-GxqHVo", audio_start_time: 30 },  // Heat Waves ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Ariana Grande", "Taylor Swift", "Olivia Rodrigo", "Sabrina Carpenter"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=q3zqJs7JUCQ", audio_start_time: 40 },  // Fortnight (Taylor Swift) ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Justin Bieber", "Ed Sheeran", "Shawn Mendes", "Sam Smith"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g", audio_start_time: 40 },  // Perfect ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Lady Gaga", "Katy Perry", "Rihanna", "Ariana Grande"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=CevxZvSJLk8", audio_start_time: 42 },  // Roar ✅
];

// ── Blind Test — Grands Classiques (mix iconiques tous genres) ───────────────
// Renommé depuis "Chansons Françaises Classiques" — labels FR bloquent l'embed
// Garde Piaf + Brel (INA ✅), complète avec classiques internationaux tous vérifiés
const BT_CLASSIQUES_FR: QCMQuestion[] = [
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Édith Piaf", "Barbara", "Dalida", "Juliette Gréco"], correct: 0,
    youtube_url: "https://www.youtube.com/watch?v=Q3Kvu6Kgp88", audio_start_time: 0 },   // Non je ne regrette rien ✅ INA Olympia
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Yves Montand", "Jacques Brel", "Gilbert Bécaud", "Charles Aznavour"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=n0ehZeWGXW0", audio_start_time: 0 },   // Ne me quitte pas ✅ INA
  { type: 'qcm', q: "Quel groupe interprète cette chanson ?", choices: ["The Rolling Stones", "The Beatles", "The Kinks", "The Who"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=HCTunqv1Xt4", audio_start_time: 0 },   // When I'm Sixty-Four ✅ Beatles Topic
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Mariah Carey", "Céline Dion", "Whitney Houston", "Jennifer Lopez"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=3JWTaaS7LdU", audio_start_time: 55 },  // I Will Always Love You ✅
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Duran Duran", "The Police", "U2", "Simple Minds"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=OMOGaugKpzs", audio_start_time: 0 },   // Every Breath You Take ✅
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["The Eagles", "Fleetwood Mac", "Toto", "Journey"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=FTQbiNvZqaY", audio_start_time: 49 },  // Africa ✅ — refrain à 49s
  { type: 'qcm', q: "Quel groupe interprète ce morceau ?", choices: ["ABC", "Culture Club", "Thompson Twins", "Simple Minds"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=JmcA9LIIXWw", audio_start_time: 0 },   // Karma Chameleon ✅
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Dire Straits", "Journey", "Foreigner", "REO Speedwagon"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=1k8craCGpgs", audio_start_time: 68 },  // Don't Stop Believin' ✅ — chant à 68s
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Duran Duran", "Depeche Mode", "Pet Shop Boys", "New Order"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=u1xrNaTO1bI", audio_start_time: 0 },   // Personal Jesus ✅ DepecheModeVEVO
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Duran Duran", "a-ha", "Tears for Fears", "New Order"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=aGCdLKXNF3w", audio_start_time: 0 },   // Everybody Wants to Rule the World ✅ TearsForFearsVEVO
];

// ── Blind Test — Pop Internationale ──────────────────────────────────────────
// Renommé depuis "Chansons Françaises" — artistes FR bloquent tous l'embed
// 10 tubes pop internationaux, tous vérifiés ✅, aucun overlap avec BT_HITS_ACTUELS
const BT_CHANSONS_FRANCAISES: QCMQuestion[] = [
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Ricky Martin", "Enrique Iglesias", "Luis Fonsi", "J Balvin"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=NUsoVlDFqZg", audio_start_time: 30 },  // Bailando ✅ EnriqueIglesiasVEVO
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Jennifer Lopez", "Shakira", "Beyoncé", "Rihanna"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=pRpeEdMmmQ0", audio_start_time: 0 },   // Waka Waka ✅ shakiraVEVO
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Katy Perry", "Rihanna", "Lady Gaga", "Nicki Minaj"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=qrO4YZeyl0I", audio_start_time: 55 },  // Bad Romance ✅ LadyGagaVEVO
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Shawn Mendes", "Harry Styles", "Ed Sheeran", "Justin Bieber"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=JGwWNGJdvx8", audio_start_time: 15 },  // Shape of You ✅
  { type: 'qcm', q: "Qui interprète ce morceau ?", choices: ["Bruno Mars seul", "Mark Ronson ft. Bruno Mars", "Pharrell Williams", "Justin Timberlake"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=OPf0YbXqDm0", audio_start_time: 48 },  // Uptown Funk ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Ne-Yo", "Pharrell Williams", "Robin Thicke", "John Legend"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs", audio_start_time: 0 },   // Happy ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Katy Perry", "Ariana Grande", "Taylor Swift", "Selena Gomez"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=nfWlot6h_JM", audio_start_time: 18 },  // Shake It Off ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Halsey", "Dua Lipa", "Olivia Rodrigo", "Billie Eilish"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=DyDfgMOUjCI", audio_start_time: 0 },   // bad guy ✅
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["P!nk", "Adele", "Florence + The Machine", "Lana Del Rey"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=hLQl3WQQoQ0", audio_start_time: 44 },  // Hello ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Adele", "Sam Smith", "Hozier", "James Bay"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=pB-5XG-DbAA", audio_start_time: 42 },  // Stay With Me ✅
];

// ── Blind Test — Rap & Hip-Hop ────────────────────────────────────────────────
// Remplacé les 5 artistes FR (Orelsan, PNL, SCH, JuL, Ninho — tous bloqués)
// par classiques US vérifiés ✅
const BT_RAP_HIPHOP: QCMQuestion[] = [
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["J. Cole", "Kendrick Lamar", "Travis Scott", "Drake"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=tvTRZJ-4EyI", audio_start_time: 0 },   // HUMBLE. ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Drake", "Post Malone", "Tyga", "21 Savage"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=UceaB4D0jpo", audio_start_time: 30 },  // Rockstar ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Nicki Minaj", "Cardi B", "Doja Cat", "Megan Thee Stallion"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=PEGccV-NOm8", audio_start_time: 30 },  // Bodak Yellow ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Travis Scott", "Young Thug", "Future", "Migos"], correct: 0,
    youtube_url: "https://www.youtube.com/watch?v=6ONRf7h3Mdk", audio_start_time: 45 },  // SICKO MODE ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Drake", "Childish Gambino", "Chance the Rapper", "Kanye West"], correct: 0,
    youtube_url: "https://www.youtube.com/watch?v=xpVfcZ0ZcFM", audio_start_time: 45 },  // God's Plan ✅
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Jay-Z", "Dr. Dre", "Eminem", "50 Cent"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=_Yhyp-_hX2s", audio_start_time: 0 },   // Lose Yourself ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Kanye West", "Jay-Z", "Nas", "50 Cent"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=vk6014HuxcE", audio_start_time: 0 },   // Empire State of Mind ✅ JayZVEVO
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Ne-Yo", "Chris Brown", "Usher", "R. Kelly"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=GxBSyx85Kp8", audio_start_time: 0 },   // Yeah! ✅ UsherVEVO
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["LMFAO", "Pitbull", "Taio Cruz", "Black Eyed Peas"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=uSD4vsh1zDA", audio_start_time: 0 },   // I Gotta Feeling ✅
  { type: 'qcm', q: "Quel duo interprète ce titre ?", choices: ["Jay-Z & Kanye", "Rae Sremmurd", "OutKast", "Clipse"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=PWgvGjAhvIw", audio_start_time: 0 },   // Hey Ya! ✅ OutkastVEVO
];

// ── Blind Test — Années 2000 (Pop, RnB, Électro) ─────────────────────────────
// Tous vérifiés ✅ — remplacé Nelly Furtado "Maneater" (bloqué) par OutKast "Hey Ya!"
const BT_ANNEES2000: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Basement Jaxx", "Faithless", "Chemical Brothers", "Daft Punk"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=FGBhQbmPwH8", audio_start_time: 0 },   // One More Time ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Mariah Carey", "Destiny's Child", "Alicia Keys", "Beyoncé"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=ViwtNLUqkMY", audio_start_time: 0 },   // Crazy in Love ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Duffy", "Lily Allen", "Amy Winehouse", "Adele"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=KUmZp8pR1uc", audio_start_time: 0 },   // Rehab ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Katy Perry", "Ke$ha", "Nicki Minaj", "Lady Gaga"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=bESGLojNYSo", audio_start_time: 30 },  // Poker Face ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Beyoncé", "Rihanna", "Ciara", "Mariah Carey"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=CvBfHwUxHIk", audio_start_time: 30 },  // Umbrella ✅
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Jessica Simpson", "Christina Aguilera", "Britney Spears", "Paris Hilton"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=LOZuxwVk7TU", audio_start_time: 0 },   // Toxic ✅
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["*NSYNC", "Justin Timberlake", "Backstreet Boys", "Boyz II Men"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=DksSPZTZES0", audio_start_time: 0 },   // Cry Me a River ✅
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["LMFAO", "Pitbull", "Taio Cruz", "Black Eyed Peas"], correct: 3,
    youtube_url: "https://www.youtube.com/watch?v=uSD4vsh1zDA", audio_start_time: 0 },   // I Gotta Feeling ✅
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Danity Kane", "Destiny's Child", "En Vogue", "TLC"], correct: 1,
    youtube_url: "https://www.youtube.com/watch?v=sQgd6MccwZc", audio_start_time: 30 },  // Say My Name ✅
  { type: 'qcm', q: "Quel duo chante cette chanson ?", choices: ["Jay-Z & Kanye", "Rae Sremmurd", "OutKast", "Clipse"], correct: 2,
    youtube_url: "https://www.youtube.com/watch?v=PWgvGjAhvIw", audio_start_time: 0 },   // Hey Ya! ✅ OutkastVEVO
];

// ── Catalogue complet des packs builtin ─────────────────────────────────────
export const BUILTIN_PACKS: BuiltinPack[] = [
  // ── 5 packs Quiz ──
  { id: 'builtin:quiz_culture',   name: '🌐 Culture Générale',        mode: 'quiz',       emoji: '🌐', questions: QUIZ_CULTURE_GENERALE },
  { id: 'builtin:quiz_cinema',    name: '🎬 Cinéma & Séries',         mode: 'quiz',       emoji: '🎬', questions: QUIZ_CINEMA_SERIES },
  { id: 'builtin:quiz_sport',     name: '⚽ Sport & Champions',        mode: 'quiz',       emoji: '⚽', questions: QUIZ_SPORT_CHAMPIONS },
  { id: 'builtin:quiz_science',   name: '🔬 Science & Technologie',   mode: 'quiz',       emoji: '🔬', questions: QUIZ_SCIENCE_TECHNO },
  { id: 'builtin:quiz_histoire',  name: '🏛️ Histoire & Civilisations', mode: 'quiz',       emoji: '🏛️', questions: QUIZ_HISTOIRE_CIVILISATIONS },
  // ── 6 packs Blind Test — tous liens vérifiés embeddables ✅ ──
  { id: 'builtin:bt_classiques',    name: '🎸 Blind Test Classiques',      mode: 'blind_test', emoji: '🎸', questions: BT_CLASSIQUES },
  { id: 'builtin:bt_actuels',       name: '🎵 Blind Test Hits Actuels',    mode: 'blind_test', emoji: '🎵', questions: BT_HITS_ACTUELS },
  { id: 'builtin:bt_classiques_fr', name: '🏆 Grands Classiques',          mode: 'blind_test', emoji: '🏆', questions: BT_CLASSIQUES_FR },
  { id: 'builtin:bt_fr',            name: '🌍 Pop Internationale',         mode: 'blind_test', emoji: '🌍', questions: BT_CHANSONS_FRANCAISES },
  { id: 'builtin:bt_rap',           name: '🎤 Blind Test Rap & Hip-Hop',   mode: 'blind_test', emoji: '🎤', questions: BT_RAP_HIPHOP },
  { id: 'builtin:bt_2000',          name: '💿 Blind Test Années 2000',     mode: 'blind_test', emoji: '💿', questions: BT_ANNEES2000 },
];

export function isBuiltinPack(packId: string | null | undefined): boolean {
  return !!packId && packId.startsWith('builtin:');
}

export function getBuiltinPackQuestions(packId: string): (QCMQuestion | BuzzQuestion)[] {
  const pack = BUILTIN_PACKS.find(p => p.id === packId);
  return pack?.questions ?? [];
}
