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

// ── Blind Test — Années 80 ───────────────────────────────────────────────────
const BT_ANNEES80: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Duran Duran", "a-ha", "Depeche Mode", "New Order"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=djV11Xbc914", audio_start_time: 14 },  // Take On Me — refrain à 14s
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Kim Wilde", "Cyndi Lauper", "Pat Benatar", "Bonnie Tyler"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=PIb6AZdTr-A", audio_start_time: 36 }, // Kids in America — riff à 36s
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Spandau Ballet", "Wham!", "Pet Shop Boys", "Frankie Goes to Hollywood"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=pIIpUBJ9mAY", audio_start_time: 20 }, // Wake Me Up — refrain à 20s
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Depeche Mode", "The Human League", "Yazoo", "Soft Cell"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=uPudE8nDog0", audio_start_time: 0 },  // Don't You Want Me — reconnaissable dès le début
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["The Eagles", "Fleetwood Mac", "Toto", "Journey"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=FTQbiNvZqaY", audio_start_time: 49 }, // Africa — intro longue, refrain à 49s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Madonna", "Tina Turner", "Whitney Houston", "Janet Jackson"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=79fzeNUqMbk", audio_start_time: 10 }, // Material Girl — intro courte
  { type: 'qcm', q: "Quel groupe interprète ce morceau ?", choices: ["ABC", "Culture Club", "Thompson Twins", "Simple Minds"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=JmcA9LIIXWw", audio_start_time: 0 },  // Karma Chameleon — reconnaissable dès le début
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Sting", "Peter Gabriel", "Phil Collins", "Bryan Adams"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=OMOGaugKpzs", audio_start_time: 0 },  // Roxanne — reconnaissable dès le début
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Dire Straits", "Journey", "Foreigner", "REO Speedwagon"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=1k8craCGpgs", audio_start_time: 68 }, // Don't Stop Believin' — intro piano longue, chant à 68s
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Bauhaus", "The Cure", "Joy Division", "Spandau Ballet"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=DsHcFVkHXqU", audio_start_time: 42 }, // Gold — refrain à 42s
];

// ── Blind Test — Pop Internationale ─────────────────────────────────────────
const BT_POP_INTERNATIONAL: QCMQuestion[] = [
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Drake", "The Weeknd", "Post Malone", "Bruno Mars"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ", audio_start_time: 45 }, // Blinding Lights — refrain à 45s
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Shawn Mendes", "Harry Styles", "Ed Sheeran", "Justin Bieber"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=JGwWNGJdvx8", audio_start_time: 15 }, // Shape of You — riff à 15s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Beyoncé", "Rihanna", "Adele", "Amy Winehouse"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=rYEDA3JcQqw", audio_start_time: 50 }, // Someone Like You — refrain à 50s
  { type: 'qcm', q: "Qui interprète ce morceau ?", choices: ["Bruno Mars seul", "Mark Ronson ft. Bruno Mars", "Pharrell Williams", "Justin Timberlake"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=OPf0YbXqDm0", audio_start_time: 48 }, // Uptown Funk — refrain à 48s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Ne-Yo", "Pharrell Williams", "Robin Thicke", "John Legend"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs", audio_start_time: 0 },  // Happy — reconnaissable dès le début
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Katy Perry", "Ariana Grande", "Taylor Swift", "Selena Gomez"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=nfWlot6h_JM", audio_start_time: 18 }, // Shake It Off — hook à 18s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Halsey", "Dua Lipa", "Olivia Rodrigo", "Billie Eilish"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=DyDfgMOUjCI", audio_start_time: 0 },  // bad guy — reconnaissable dès le début
  { type: 'qcm', q: "Qui interprète ce morceau ?", choices: ["J Balvin", "Bad Bunny", "Luis Fonsi ft. Daddy Yankee", "Maluma"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=kTJczUoc26U", audio_start_time: 55 }, // Despacito — refrain à 55s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Adele", "Sam Smith", "Hozier", "James Bay"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=pB-5XG-DbAA", audio_start_time: 42 }, // Stay With Me — refrain à 42s
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["P!nk", "Adele", "Florence + The Machine", "Lana Del Rey"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=hLQl3WQQoQ0", audio_start_time: 44 }, // Hello — refrain à 44s
];

// ── Blind Test — Rock Français ───────────────────────────────────────────────
const BT_ROCK_FRANCAIS: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Téléphone", "Indochine", "Trust", "Niagara"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=w9XMD5LQsGw", audio_start_time: 30 }, // L'aventurier — refrain à 30s
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Indochine", "Téléphone", "Les Satellites", "Starshooter"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=cTrAA6jCLkM", audio_start_time: 25 }, // Téléphone — refrain à 25s
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Mano Negra", "Noir Désir", "Les Thugs", "Bérurier Noir"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=9mdBBBNfGPM", audio_start_time: 0 },  // Noir Désir — reconnaissable dès le début
  { type: 'qcm', q: "Quel groupe interprète ce morceau ?", choices: ["Téléphone", "Bijou", "Trust", "Little Bob Story"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=a_mLBNpERDc", audio_start_time: 0 },  // Antisocial Trust — reconnaissable dès le début
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Les Wampas", "Tryo", "Zebda", "Les Ogres de Barback"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=CXvdEF3MHHU", audio_start_time: 35 }, // Zebda — refrain à 35s
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Mano Negra", "La Ruda Salska", "Les Wampas", "Burning Heads"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=8Ri4MxWrmyY", audio_start_time: 20 }, // Mano Negra — refrain à 20s
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Louise Attaque", "Dionysos", "Deportivo", "Têtes Raides"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=KvI_56jBVXo", audio_start_time: 30 }, // Dionysos — refrain à 30s
  { type: 'qcm', q: "Quel groupe interprète ce morceau ?", choices: ["Noir Désir", "Tryo", "Superbus", "Les Rita Mitsouko"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=Lbzz6JRFQVY", audio_start_time: 25 }, // Superbus — refrain à 25s
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Rita Mitsouko", "Zazie", "Elli Medeiros", "Taxi Girl"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=JmSIHSYKFoA", audio_start_time: 0 },  // Rita Mitsouko — reconnaissable dès le début
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Saez", "Tryo", "Zebda", "Louise Attaque"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=2Ck1K1u4aPc", audio_start_time: 30 }, // Saez — refrain à 30s
];

// ── Blind Test — Rap 2000 ────────────────────────────────────────────────────
const BT_RAP2000: QCMQuestion[] = [
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Booba", "Sinik", "Rohff", "Diam's"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=ZmSiJTRrBVY", audio_start_time: 30 }, // Diam's — refrain à 30s
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Eminem", "50 Cent", "Jay-Z", "Kanye West"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=5qm8PH4xAss", audio_start_time: 20 }, // In Da Club 50 Cent — beat reconnaissable à 20s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Pharrell Williams", "Nelly", "Usher", "Chingy"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=E2qs-oIRxwQ", audio_start_time: 15 }, // Nelly — refrain à 15s
  { type: 'qcm', q: "Qui interprète ce morceau ?", choices: ["Eminem", "Ja Rule", "DMX", "Ludacris"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=YVkUvmDQ3HY", audio_start_time: 0 },  // Eminem — reconnaissable dès le début
  { type: 'qcm', q: "Quel artiste chante cette chanson ?", choices: ["Jay-Z", "Kanye West", "Common", "Mos Def"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=Co0tTeuUVhU", audio_start_time: 40 }, // Kanye — refrain à 40s
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Nelly ft. Kelly Rowland", "Ja Rule ft. Ashanti", "Jay-Z ft. Beyoncé", "Usher ft. Alicia Keys"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=CKZvWhCqx1s", audio_start_time: 30 }, // Nelly ft. Kelly Rowland — refrain à 30s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["T.I.", "Ludacris", "Lil Wayne", "Young Jeezy"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=7i7iHkSQwMw", audio_start_time: 0 },  // Lil Wayne — reconnaissable dès le début
  { type: 'qcm', q: "Quel groupe interprète ce morceau ?", choices: ["The Roots", "Black Star", "The Black Eyed Peas", "OutKast"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=WpYeekQkAdc", audio_start_time: 28 }, // Black Eyed Peas — refrain à 28s
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["T-Pain", "Akon", "Sean Kingston", "Chris Brown"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=l0A4Xo2-KHw", audio_start_time: 30 }, // Akon — refrain à 30s
  { type: 'qcm', q: "Quel artiste interprète ce titre ?", choices: ["50 Cent", "The Game", "G-Unit", "Dr. Dre"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=eRxB4PC1M44", audio_start_time: 15 }, // 50 Cent — refrain à 15s
];

// ── Blind Test — Disney ──────────────────────────────────────────────────────
const BT_DISNEY: QCMQuestion[] = [
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Pocahontas", "La Petite Sirène", "Aladdin", "La Belle et la Bête"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=GC_mV1IpjWA", audio_start_time: 30 }, // Under the Sea — refrain à 30s
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Le Livre de la Jungle", "Le Roi Lion", "Tarzan", "Bambi"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=GiIHMtwTFUM", audio_start_time: 0 },  // Circle of Life — reconnaissable dès le début
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Frozen 2", "La Reine des Neiges", "Brave", "Raiponce"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=L0MK7qz13bU", audio_start_time: 0 },  // Let It Go — reconnaissable dès le début
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["La Belle et la Bête", "Cendrillon", "Blanche-Neige", "La Petite Sirène"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=7bCsHPEO0Xk", audio_start_time: 25 }, // Tale As Old As Time — refrain à 25s
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Hercule", "Mulan", "Aladdin", "Pocahontas"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=MQQZN7e7LH8", audio_start_time: 0 },  // A Whole New World — reconnaissable dès le début
  { type: 'qcm', q: "De quel film Pixar vient cette chanson ?", choices: ["A Bug's Life", "Monsters Inc.", "Toy Story", "Finding Nemo"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=g6b-pWFtSGo", audio_start_time: 0 },  // You've Got a Friend in Me — reconnaissable dès le début
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Moana / Vaiana", "Raya", "Encanto", "Wish"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=cPAbx5kgCJo", audio_start_time: 35 }, // How Far I'll Go — refrain à 35s
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Mulan", "Pocahontas", "Atlantide", "Hercule"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=p6sONt_HvCo", audio_start_time: 30 }, // Reflection — refrain à 30s
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Pinocchio", "Fantasia", "Dumbo", "Blanche-Neige"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=J2-kYFU0A1A", audio_start_time: 0 },  // When You Wish Upon a Star — reconnaissable dès le début
  { type: 'qcm', q: "De quel film Disney vient cette chanson ?", choices: ["Lilo & Stitch", "Encanto", "Coco", "Soul"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=LopWnTQFSGI", audio_start_time: 28 }, // Remember Me — refrain à 28s
];

// ── Quiz — Années 80 ─────────────────────────────────────────────────────────
const QUIZ_ANNEES80: QCMQuestion[] = [
  { type: 'qcm', q: "Quel film de 1985 met en scène un voyage dans le temps dans une DeLorean ?", choices: ["Ghostbusters", "E.T.", "Retour vers le futur", "Indiana Jones"], correct: 2 },
  { type: 'qcm', q: "Quel groupe a sorti l'album 'Thriller' en 1982 ?", choices: ["Prince", "Michael Jackson", "David Bowie", "George Michael"], correct: 1 },
  { type: 'qcm', q: "En quelle année les Jeux Olympiques de Los Angeles ont-ils eu lieu ?", choices: ["1980", "1982", "1984", "1986"], correct: 2 },
  { type: 'qcm', q: "Quel jeu vidéo Atari représentait une grenouille traversant la route ?", choices: ["Pac-Man", "Space Invaders", "Frogger", "Donkey Kong"], correct: 2 },
  { type: 'qcm', q: "Quel film d'animation Disney est sorti en 1989 ?", choices: ["Le Roi Lion", "La Belle au bois dormant", "La Petite Sirène", "Aladdin"], correct: 2 },
  { type: 'qcm', q: "Quel personnage portait un blouson rouge dans 'Thriller' ?", choices: ["Prince", "Michael Jackson", "David Bowie", "Freddie Mercury"], correct: 1 },
  { type: 'qcm', q: "Quel mur est tombé en novembre 1989 ?", choices: ["Mur de Chine", "Mur de Berlin", "Mur de Jéricho", "Mur de Hadrien"], correct: 1 },
  { type: 'qcm', q: "Quel est le prénom du héros de la série 'Magnum' ?", choices: ["Rick", "Thomas", "Jack", "Mike"], correct: 1 },
  { type: 'qcm', q: "Quel groupe de rock chantait 'We Will Rock You' ?", choices: ["AC/DC", "Led Zeppelin", "Queen", "The Rolling Stones"], correct: 2 },
  { type: 'qcm', q: "Dans quel pays se déroule la série 'Miami Vice' ?", choices: ["Floride, États-Unis", "Californie, États-Unis", "Texas, États-Unis", "New York, États-Unis"], correct: 0 },
];

// ── Quiz — Pop Internationale ────────────────────────────────────────────────
const QUIZ_POP_INTERNATIONAL: QCMQuestion[] = [
  { type: 'qcm', q: "Combien d'albums studio Adele a-t-elle sortis ?", choices: ["3", "4", "5", "6"], correct: 1 },
  { type: 'qcm', q: "Quel artiste détient le record du titre le plus streamé sur Spotify ?", choices: ["Ed Sheeran", "Drake", "The Weeknd", "Bad Bunny"], correct: 3 },
  { type: 'qcm', q: "Quel pays représente BTS ?", choices: ["Japon", "Chine", "Corée du Sud", "Thaïlande"], correct: 2 },
  { type: 'qcm', q: "Quel est le vrai nom de Lady Gaga ?", choices: ["Stefanie Germanotta", "Stefani Joanne Angelina Germanotta", "Alicia Moore", "Alecia Beth Moore"], correct: 1 },
  { type: 'qcm', q: "En quelle année Taylor Swift a-t-elle sorti son premier album ?", choices: ["2004", "2006", "2008", "2010"], correct: 1 },
  { type: 'qcm', q: "Quel groupe a popularisé le K-Pop à l'international ?", choices: ["EXO", "BTS", "BLACKPINK", "TWICE"], correct: 1 },
  { type: 'qcm', q: "Qui a chanté 'Bohemian Rhapsody' ?", choices: ["Elton John", "Queen", "David Bowie", "The Beatles"], correct: 1 },
  { type: 'qcm', q: "De quel pays vient Shakira ?", choices: ["Mexique", "Argentine", "Colombie", "Venezuela"], correct: 2 },
  { type: 'qcm', q: "Quel artiste a sorti l'album 'Purple Rain' en 1984 ?", choices: ["Michael Jackson", "Prince", "Stevie Wonder", "James Brown"], correct: 1 },
  { type: 'qcm', q: "Quel est le prénom de la chanteuse Beyoncé ?", choices: ["Beyoncé Giselle", "Beyoncé Solange", "Beyoncé Michelle", "Beyoncé Renée"], correct: 0 },
];

// ── Quiz — Rock Français ─────────────────────────────────────────────────────
const QUIZ_ROCK_FRANCAIS: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe a sorti 'L'aventurier' en 1982 ?", choices: ["Téléphone", "Indochine", "Trust", "Niagara"], correct: 1 },
  { type: 'qcm', q: "De quelle ville est originaire le groupe Téléphone ?", choices: ["Lyon", "Marseille", "Paris", "Bordeaux"], correct: 2 },
  { type: 'qcm', q: "Quel groupe français a chanté 'Antisocial' en 1980 ?", choices: ["Téléphone", "Indochine", "Trust", "Bijou"], correct: 2 },
  { type: 'qcm', q: "Quel chanteur de Noir Désir est décédé en 2011 ?", choices: ["Serge Teyssot-Gay", "Bertrand Cantat", "Denis Barthe", "Frédéric Vidalenc"], correct: 1 },
  { type: 'qcm', q: "Quel groupe a sorti l'album ' 3' en 1998 ?", choices: ["Noir Désir", "Tryo", "Indochine", "Louise Attaque"], correct: 2 },
  { type: 'qcm', q: "Zebda est un groupe originaire de quelle ville ?", choices: ["Paris", "Marseille", "Lyon", "Toulouse"], correct: 3 },
  { type: 'qcm', q: "Quel groupe a sorti 'Tomber la chemise' ?", choices: ["Tryo", "Zebda", "Les Wampas", "Matmatah"], correct: 1 },
  { type: 'qcm', q: "Combien de membres compte le groupe Téléphone à son apogée ?", choices: ["3", "4", "5", "6"], correct: 1 },
  { type: 'qcm', q: "Quel est le vrai prénom du chanteur d'Indochine ?", choices: ["Nicolas", "Stéphane", "François", "Jean"], correct: 0 },
  { type: 'qcm', q: "Quel album de Noir Désir contient 'Le vent nous portera' ?", choices: ["666.667 Club", "Du ciment sous les plaines", "Des visages des figures", "Tostaky"], correct: 2 },
];

// ── Quiz — Rap 2000 ──────────────────────────────────────────────────────────
const QUIZ_RAP2000: QCMQuestion[] = [
  { type: 'qcm', q: "Quel rappeur français a sorti l'album 'Nero Nemesis' en 2015 ?", choices: ["Rohff", "Booba", "Kaaris", "La Fouine"], correct: 1 },
  { type: 'qcm', q: "Quel est le vrai nom d'Eminem ?", choices: ["Marshall Bruce Mathers III", "Curtis James Jackson III", "Dwayne Michael Carter Jr", "Calvin Cordozar Broadus Jr"], correct: 0 },
  { type: 'qcm', q: "Quel rappeur a sorti 'Get Rich or Die Tryin'' en 2003 ?", choices: ["Jay-Z", "Nas", "50 Cent", "DMX"], correct: 2 },
  { type: 'qcm', q: "Quel groupe rap américain réunissait Dr. Dre et Ice Cube ?", choices: ["Wu-Tang Clan", "N.W.A", "Public Enemy", "A Tribe Called Quest"], correct: 1 },
  { type: 'qcm', q: "Quel album de Kanye West est sorti en 2004 ?", choices: ["My Beautiful Dark Twisted Fantasy", "The College Dropout", "Graduation", "Late Registration"], correct: 1 },
  { type: 'qcm', q: "Quel rappeur français est connu sous le nom de 'Rohff' ?", choices: ["Housni Mkouboi", "Cyril Kamar", "Omar Sy", "Abdoulaye Diallo"], correct: 0 },
  { type: 'qcm', q: "Quel est le label fondé par Jay-Z en 1995 ?", choices: ["Cash Money", "Roc-A-Fella Records", "Def Jam", "Bad Boy Records"], correct: 1 },
  { type: 'qcm', q: "Quel rappeur a popularisé le terme 'bling-bling' ?", choices: ["Puff Daddy", "Lil Wayne", "B.G.", "Master P"], correct: 2 },
  { type: 'qcm', q: "Diam's est originaire de quel pays ?", choices: ["France", "Chypre", "Belgique", "Maroc"], correct: 1 },
  { type: 'qcm', q: "Quel rappeur américain est surnommé 'Slim Shady' ?", choices: ["Jay-Z", "Kanye West", "Eminem", "Nas"], correct: 2 },
];

// ── Quiz — Disney ────────────────────────────────────────────────────────────
const QUIZ_DISNEY: QCMQuestion[] = [
  { type: 'qcm', q: "Quel est le premier long-métrage d'animation de Disney (1937) ?", choices: ["Pinocchio", "Fantasia", "Blanche-Neige et les Sept Nains", "Dumbo"], correct: 2 },
  { type: 'qcm', q: "Comment s'appelle le poisson-clown dans 'Le Monde de Nemo' ?", choices: ["Nemo", "Marlin", "Dory", "Gill"], correct: 0 },
  { type: 'qcm', q: "Quel personnage dit 'Hakuna Matata' dans 'Le Roi Lion' ?", choices: ["Simba", "Mufasa", "Timon et Pumbaa", "Rafiki"], correct: 2 },
  { type: 'qcm', q: "Dans quel film Disney la chanson 'Let It Go' est-elle chantée ?", choices: ["Brave", "La Reine des Neiges", "Raiponce", "Moana"], correct: 1 },
  { type: 'qcm', q: "Quel est le vrai nom de la Petite Sirène ?", choices: ["Ariel", "Arial", "Arielle", "Arièle"], correct: 0 },
  { type: 'qcm', q: "Combien de nains y a-t-il dans 'Blanche-Neige' ?", choices: ["5", "6", "7", "8"], correct: 2 },
  { type: 'qcm', q: "Quel film Pixar met en scène une voiture de course nommée Flash McQueen ?", choices: ["Cars", "Turbo", "Racing Story", "Speed Racer"], correct: 0 },
  { type: 'qcm', q: "De quel pays s'inspire le film 'Mulan' ?", choices: ["Japon", "Corée", "Chine", "Viêt Nam"], correct: 2 },
  { type: 'qcm', q: "Comment s'appelle la fée dans 'Peter Pan' ?", choices: ["Pervenche", "Clochette", "Elsa", "Fée Bleue"], correct: 1 },
  { type: 'qcm', q: "Quel animal est Simba dans 'Le Roi Lion' ?", choices: ["Tigre", "Léopard", "Lion", "Guépard"], correct: 2 },
];

// ═══════════════════════════════════════════════════════════════════════════
// ── NOUVEAUX PACKS MUZQUIZ — affichés dans le dropdown pour tous les joueurs
// ═══════════════════════════════════════════════════════════════════════════

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

// ── Blind Test — Classiques (80s, 90s, 2000s) ────────────────────────────────
const BT_CLASSIQUES: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe interprète cette chanson ?", choices: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=hTWKbfoikeg", audio_start_time: 0 },   // Smells Like Teen Spirit
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["The Rolling Stones", "Queen", "Led Zeppelin", "The Who"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ", audio_start_time: 49 },     // Bohemian Rhapsody — "Mama just killed a man"
  { type: 'qcm', q: "Quel groupe interprète ce morceau ?", choices: ["AC/DC", "Aerosmith", "Guns N' Roses", "Metallica"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=1w7OgIMMRc4", audio_start_time: 0 },          // Sweet Child O' Mine
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Foreigner", "Journey", "Survivor", "REO Speedwagon"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=btPJPFnesV4", audio_start_time: 0 },           // Eye of the Tiger
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Jay-Z", "Dr. Dre", "Eminem", "50 Cent"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=_Yhyp-_hX2s", audio_start_time: 0 },                          // Lose Yourself
  { type: 'qcm', q: "Quel groupe chante ce titre ?", choices: ["Korn", "System of a Down", "Papa Roach", "Linkin Park"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=eVTXPUF4Oz4", audio_start_time: 0 },             // In the End
  { type: 'qcm', q: "Quel groupe interprète cette chanson ?", choices: ["Interpol", "The Strokes", "The Killers", "Franz Ferdinand"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=gGdGFtwCNBE", audio_start_time: 0 }, // Mr. Brightside
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["Blur", "Radiohead", "Oasis", "The Verve"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=bx1Bh8ZvH84", audio_start_time: 0 },                     // Wonderwall
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Mariah Carey", "Céline Dion", "Whitney Houston", "Jennifer Lopez"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=3JWTaaS7LdU", audio_start_time: 55 }, // I Will Always Love You
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["John Mellencamp", "Tom Petty", "Bryan Adams", "Don Henley"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=eFjjO_lhf9c", audio_start_time: 0 },            // Summer of '69
];

// ── Blind Test — Hits Actuels (2010 → aujourd'hui) ───────────────────────────
const BT_HITS_ACTUELS: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["One Direction", "BTS", "Backstreet Boys", "Jonas Brothers"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=gdZLi9oWNZg", audio_start_time: 0 },    // Dynamite
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Dua Lipa", "Ariana Grande", "Selena Gomez", "Olivia Rodrigo"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=oygrmKOua_0", audio_start_time: 0 },           // Don't Start Now
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Ed Sheeran", "Harry Styles", "Shawn Mendes", "Sam Smith"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=H5v3kku4y6Q", audio_start_time: 0 },               // As It Was
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Dua Lipa", "Olivia Rodrigo", "Billie Eilish", "Sabrina Carpenter"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=ZmDBbnmKpqQ", audio_start_time: 48 },     // drivers license
  { type: 'qcm', q: "Qui interprète ce morceau ?", choices: ["Drake", "Post Malone", "Travis Scott", "Juice WRLD"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=wXhTHyIgQ_U", audio_start_time: 0 },                   // Circles
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Dua Lipa", "Olivia Rodrigo", "Taylor Swift", "Camila Cabello"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=TUVcZfQe-Kw", audio_start_time: 30 },         // Levitating
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Ariana Grande", "Olivia Rodrigo", "Doja Cat", "Billie Eilish"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=gNi_6U5Pm_o", audio_start_time: 0 },           // good 4 u
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Stromae", "Aya Nakamura", "Maître Gims", "Ninho"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=sgECLMoW_L8", audio_start_time: 30 },                      // Djadja
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Two Door Cinema Club", "MGMT", "Tame Impala", "Glass Animals"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=mRD0-GxqHVo", audio_start_time: 30 },  // Heat Waves
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Justin Bieber", "Ed Sheeran", "Shawn Mendes", "Niall Horan"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=tQ0yjYMhNs8", audio_start_time: 30 },           // Peaches
];

// ── Blind Test — Chansons Françaises ─────────────────────────────────────────
const BT_CHANSONS_FRANCAISES: QCMQuestion[] = [
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Black M", "Booba", "Stromae", "Maître Gims"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=VHoT4N43jK8", audio_start_time: 0 },        // Alors on danse (clip officiel 2010)
  { type: 'qcm', q: "Qui interprète cette chanson ?", choices: ["Zaz", "Indila", "Alizée", "Yelle"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=K5KAc5CoCuk", audio_start_time: 25 },               // Dernière Danse (clip officiel)
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Hoshi", "Pomme", "Angèle", "Roméo Elvis"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=Hi7Rx3En7-k", audio_start_time: 0 },             // Balance Ton Quoi (clip officiel)
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Yelle", "Housse de Racket", "Christine and the Queens", "La Femme"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=9RBzsjga73s", audio_start_time: 0 }, // Tilted (clip officiel)
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["IAM", "Assassin", "MC Solaar", "Oxmo Puccino"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=1R2etg__x1Y", audio_start_time: 0 },        // Nouveau Western (clip officiel)
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Vianney", "Julien Doré", "Gaëtan Roussel", "Romain Didier"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=eiAq7k7yuPM", audio_start_time: 30 }, // Paris-Seychelles (Victoires de la Musique 2014)
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Aya Nakamura", "Awa Imani", "Wejdene", "Yseult"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=SdUN-ogKY60", audio_start_time: 0 },     // Coeur — Clara Luciani (clip officiel)
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Vald", "Nekfeu", "Disiz", "Keny Arkana"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=6O0ANbFvmgA", audio_start_time: 30 },              // Étoiles (Nekfeu)
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Grand Corps Malade", "Oxmo Puccino", "Gaël Faye", "Kery James"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=pYrN9nxI0gM", audio_start_time: 0 }, // Funambule (clip officiel)
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Lomepal", "Orelsan", "Roméo Elvis", "Eddy de Pretto"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=2bjk26RwjyU", audio_start_time: 0 }, // Basique (clip officiel)
];

// ── Blind Test — Rap & Hip-Hop ────────────────────────────────────────────────
const BT_RAP_HIPHOP: QCMQuestion[] = [
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["J. Cole", "Kendrick Lamar", "Travis Scott", "Drake"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=tvTRZJ-4EyI", audio_start_time: 0 },    // HUMBLE.
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Drake", "Post Malone", "Tyga", "21 Savage"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=UceaB4D0jpo", audio_start_time: 30 },             // Rockstar
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Nicki Minaj", "Cardi B", "Doja Cat", "Megan Thee Stallion"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=PEGccV-NOm8", audio_start_time: 30 }, // Bodak Yellow
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Nekfeu", "Lomepal", "Orelsan", "Vald"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=v6WA-4A4pEM", audio_start_time: 0 },                  // La Fête est finie
  { type: 'qcm', q: "Quel duo interprète ce titre ?", choices: ["Booba & Kaaris", "Ninho & Niska", "PNL", "MHD & Gradur"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=LHcpMNODFCI", audio_start_time: 0 }, // Au DD
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Jul", "Sch", "Ninho", "Niska"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=jNQ0XRWUCP4", audio_start_time: 30 },                        // Dior (SCH)
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Travis Scott", "Young Thug", "Future", "Migos"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=6ONRf7h3Mdk", audio_start_time: 45 },        // SICKO MODE
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Drake", "Childish Gambino", "Chance the Rapper", "Kanye West"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=xpVfcZ0ZcFM", audio_start_time: 45 }, // God's Plan
  { type: 'qcm', q: "Quel artiste interprète ce titre ?", choices: ["MHD", "Gradur", "JuL", "Rim'K"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=Y9YFKU_JKak", audio_start_time: 0 },               // Bande Organisée (Jul)
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Ninho", "Niska", "Koba LaD", "Freeze Corleone"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=Sv7YJDdSCfg", audio_start_time: 20 },       // Millions
];

// ── Blind Test — Années 2000 (Pop, RnB, Électro) ─────────────────────────────
const BT_ANNEES2000: QCMQuestion[] = [
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Basement Jaxx", "Faithless", "Chemical Brothers", "Daft Punk"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=FGBhQbmPwH8", audio_start_time: 0 }, // One More Time
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Mariah Carey", "Destiny's Child", "Alicia Keys", "Beyoncé"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=ViwtNLUqkMY", audio_start_time: 0 },          // Crazy in Love
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Duffy", "Lily Allen", "Amy Winehouse", "Adele"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=KUmZp8pR1uc", audio_start_time: 0 },                       // Rehab
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Katy Perry", "Ke$ha", "Nicki Minaj", "Lady Gaga"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=bESGLojNYSo", audio_start_time: 30 },                   // Poker Face
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["Beyoncé", "Rihanna", "Ciara", "Mariah Carey"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=CvBfHwUxHIk", audio_start_time: 30 },                        // Umbrella
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Jessica Simpson", "Christina Aguilera", "Britney Spears", "Paris Hilton"], correct: 2, youtube_url: "https://www.youtube.com/watch?v=LOZuxwVk7TU", audio_start_time: 0 }, // Toxic
  { type: 'qcm', q: "Qui interprète ce titre ?", choices: ["*NSYNC", "Justin Timberlake", "Backstreet Boys", "Boyz II Men"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=DksSPZTZES0", audio_start_time: 0 },        // Cry Me a River
  { type: 'qcm', q: "Quel groupe chante cette chanson ?", choices: ["LMFAO", "Pitbull", "Taio Cruz", "Black Eyed Peas"], correct: 3, youtube_url: "https://www.youtube.com/watch?v=uSD4vsh1zDA", audio_start_time: 0 },             // I Gotta Feeling
  { type: 'qcm', q: "Quel groupe interprète ce titre ?", choices: ["Danity Kane", "Destiny's Child", "En Vogue", "TLC"], correct: 1, youtube_url: "https://www.youtube.com/watch?v=sQgd6MccwZc", audio_start_time: 30 },           // Say My Name
  { type: 'qcm', q: "Qui chante cette chanson ?", choices: ["Nelly Furtado", "Fergie", "Kelis", "Pink"], correct: 0, youtube_url: "https://www.youtube.com/watch?v=5lSKVmJMO-s", audio_start_time: 0 },                            // Maneater
];

// ── Catalogue complet des packs builtin ─────────────────────────────────────
export const BUILTIN_PACKS: BuiltinPack[] = [
  // ── 5 packs Quiz ──
  { id: 'builtin:quiz_culture',   name: '🌐 Culture Générale',        mode: 'quiz',       emoji: '🌐', questions: QUIZ_CULTURE_GENERALE },
  { id: 'builtin:quiz_cinema',    name: '🎬 Cinéma & Séries',         mode: 'quiz',       emoji: '🎬', questions: QUIZ_CINEMA_SERIES },
  { id: 'builtin:quiz_sport',     name: '⚽ Sport & Champions',        mode: 'quiz',       emoji: '⚽', questions: QUIZ_SPORT_CHAMPIONS },
  { id: 'builtin:quiz_science',   name: '🔬 Science & Technologie',   mode: 'quiz',       emoji: '🔬', questions: QUIZ_SCIENCE_TECHNO },
  { id: 'builtin:quiz_histoire',  name: '🏛️ Histoire & Civilisations', mode: 'quiz',       emoji: '🏛️', questions: QUIZ_HISTOIRE_CIVILISATIONS },
  // ── 5 packs Blind Test ──
  { id: 'builtin:bt_classiques',  name: '🎸 Blind Test Classiques',   mode: 'blind_test', emoji: '🎸', questions: BT_CLASSIQUES },
  { id: 'builtin:bt_actuels',     name: '🎵 Blind Test Hits Actuels', mode: 'blind_test', emoji: '🎵', questions: BT_HITS_ACTUELS },
  { id: 'builtin:bt_fr',         name: 'Fr Blind Test Chansons FR',  mode: 'blind_test', emoji: '🇫🇷', questions: BT_CHANSONS_FRANCAISES },
  { id: 'builtin:bt_rap',         name: '🎤 Blind Test Rap & Hip-Hop', mode: 'blind_test', emoji: '🎤', questions: BT_RAP_HIPHOP },
  { id: 'builtin:bt_2000',        name: '💿 Blind Test Années 2000',  mode: 'blind_test', emoji: '💿', questions: BT_ANNEES2000 },
];

export function isBuiltinPack(packId: string | null | undefined): boolean {
  return !!packId && packId.startsWith('builtin:');
}

export function getBuiltinPackQuestions(packId: string): (QCMQuestion | BuzzQuestion)[] {
  const pack = BUILTIN_PACKS.find(p => p.id === packId);
  return pack?.questions ?? [];
}
