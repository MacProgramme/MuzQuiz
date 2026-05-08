-- ═══════════════════════════════════════════════════════════════════════
-- QUIZ DU JOUR — MAI 2026
-- 31 jours × 10 questions | À exécuter dans l'éditeur SQL Supabase
-- ON CONFLICT DO NOTHING → sûr à ré-exécuter plusieurs fois
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO daily_quizzes (date, theme, questions) VALUES

-- ─────────────────────────────────────────────────────────────────────
-- 1er MAI — Culture générale
-- ─────────────────────────────────────────────────────────────────────
('2026-05-01', 'Culture générale', '[
  {"question":"Quelle est la capitale de l''Australie ?","choices":["Sydney","Melbourne","Canberra","Brisbane"],"correct":2},
  {"question":"Combien de côtés a un hexagone ?","choices":["5","6","7","8"],"correct":1},
  {"question":"Quel pays a la plus grande superficie au monde ?","choices":["Canada","Chine","États-Unis","Russie"],"correct":3},
  {"question":"Quelle planète est surnommée la planète rouge ?","choices":["Vénus","Mars","Jupiter","Saturne"],"correct":1},
  {"question":"Qui a peint la Joconde ?","choices":["Michel-Ange","Raphaël","Léonard de Vinci","Botticelli"],"correct":2},
  {"question":"Quelle est la langue la plus parlée au monde ?","choices":["Anglais","Espagnol","Hindi","Mandarin"],"correct":3},
  {"question":"En quelle année a eu lieu la Révolution française ?","choices":["1776","1789","1793","1804"],"correct":1},
  {"question":"Quelle est la formule chimique de l''eau ?","choices":["CO2","H2O","O2","NaCl"],"correct":1},
  {"question":"Quel est le plus long fleuve du monde ?","choices":["Amazone","Nil","Yangtsé","Mississippi"],"correct":0},
  {"question":"Combien de joueurs compose une équipe de rugby à XV ?","choices":["11","13","15","17"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 2 MAI — Cinéma & Séries
-- ─────────────────────────────────────────────────────────────────────
('2026-05-02', 'Cinéma & Séries', '[
  {"question":"Qui réalise la saga Star Wars originale ?","choices":["Steven Spielberg","George Lucas","James Cameron","Ridley Scott"],"correct":1},
  {"question":"Dans quel film trouve-t-on le personnage de Forrest Gump ?","choices":["Cast Away","Philadelphia","Forrest Gump","The Green Mile"],"correct":2},
  {"question":"Quelle série se déroule à Hawkins, Indiana ?","choices":["Dark","Stranger Things","The OA","Dark Matter"],"correct":1},
  {"question":"Quel acteur joue Iron Man dans le MCU ?","choices":["Chris Evans","Chris Hemsworth","Robert Downey Jr.","Mark Ruffalo"],"correct":2},
  {"question":"Dans quelle ville se passe Amélie Poulain ?","choices":["Lyon","Marseille","Paris","Bordeaux"],"correct":2},
  {"question":"Qui a réalisé Pulp Fiction ?","choices":["Quentin Tarantino","Martin Scorsese","Coen Brothers","David Fincher"],"correct":0},
  {"question":"Quelle franchise compte le film Avatar ?","choices":["Disney","Fox","Universal","Warner Bros"],"correct":1},
  {"question":"Dans Breaking Bad, quel est le vrai prénom de Walter White ?","choices":["Walter","Heisenberg","Harold","William"],"correct":0},
  {"question":"Quel studio produit les films d''animation Pixar ?","choices":["DreamWorks","Sony","Disney","Warner"],"correct":2},
  {"question":"Quel film a remporté l''Oscar du meilleur film en 2020 ?","choices":["1917","Joker","Parasite","The Irishman"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 3 MAI — Musique
-- ─────────────────────────────────────────────────────────────────────
('2026-05-03', 'Musique', '[
  {"question":"De quel pays vient le groupe ABBA ?","choices":["Norvège","Danemark","Suède","Finlande"],"correct":2},
  {"question":"Quel chanteur est surnommé The King of Pop ?","choices":["Elvis Presley","Michael Jackson","Prince","David Bowie"],"correct":1},
  {"question":"Quelle chanson de Céline Dion est liée au film Titanic ?","choices":["Think Twice","The Power of Love","My Heart Will Go On","All By Myself"],"correct":2},
  {"question":"Combien de membres compte le groupe des Beatles ?","choices":["3","4","5","6"],"correct":1},
  {"question":"Quel instrument joue principalement Eric Clapton ?","choices":["Piano","Basse","Guitare","Batterie"],"correct":2},
  {"question":"Dans quel pays est né Bob Marley ?","choices":["Brésil","Trinidad","Jamaïque","Cuba"],"correct":2},
  {"question":"Quel groupe chante Bohemian Rhapsody ?","choices":["Led Zeppelin","The Rolling Stones","Queen","Pink Floyd"],"correct":2},
  {"question":"Quelle est la note musicale entre Sol et Si ?","choices":["Fa","La","Mi","Ré"],"correct":1},
  {"question":"Qui est l''artiste la plus streamée sur Spotify en 2023 ?","choices":["Rihanna","Beyoncé","Taylor Swift","Billie Eilish"],"correct":2},
  {"question":"Quel genre musical est originaire de la Nouvelle-Orléans ?","choices":["Blues","Rock","Jazz","Soul"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 4 MAI — Sport
-- ─────────────────────────────────────────────────────────────────────
('2026-05-04', 'Sport', '[
  {"question":"Combien de grammes pèse une balle de tennis officielle ?","choices":["45-50 g","56-59 g","60-65 g","70-75 g"],"correct":1},
  {"question":"Quelle équipe a gagné la première Coupe du Monde de foot ?","choices":["Brésil","Italie","Argentine","Uruguay"],"correct":3},
  {"question":"Dans quel sport parle-t-on d''un Eagle ?","choices":["Tennis","Golf","Basket","Baseball"],"correct":1},
  {"question":"Combien d''anneaux compte le drapeau olympique ?","choices":["4","5","6","7"],"correct":1},
  {"question":"Quel pays a remporté le plus de médailles d''or olympiques dans l''histoire ?","choices":["URSS","Chine","Allemagne","États-Unis"],"correct":3},
  {"question":"Quelle distance court-on lors d''un marathon ?","choices":["40 km","42,195 km","43 km","45 km"],"correct":1},
  {"question":"Combien de sets faut-il gagner pour remporter Wimbledon en simple messieurs ?","choices":["2","3","4","5"],"correct":1},
  {"question":"Quel coureur a gagné le plus de Tours de France ?","choices":["Bernard Hinault","Eddy Merckx","Lance Armstrong","Miguel Indurain"],"correct":1},
  {"question":"Dans quel sport utilise-t-on un volant ?","choices":["Squash","Badminton","Padel","Ping-pong"],"correct":1},
  {"question":"Quelle ville a accueilli les JO d''été en 2024 ?","choices":["Los Angeles","Tokyo","Brisbane","Paris"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 5 MAI — Histoire de France
-- ─────────────────────────────────────────────────────────────────────
('2026-05-05', 'Histoire de France', '[
  {"question":"En quelle année Napoléon est-il sacré Empereur ?","choices":["1799","1802","1804","1806"],"correct":2},
  {"question":"Quel roi a fait construire le château de Versailles ?","choices":["Louis XIII","Louis XIV","Louis XV","Louis XVI"],"correct":1},
  {"question":"En quelle année a eu lieu la prise de la Bastille ?","choices":["1787","1788","1789","1790"],"correct":2},
  {"question":"Qui était le général de la France libre pendant la Seconde Guerre mondiale ?","choices":["Henri Pétain","Jean Moulin","Charles de Gaulle","Louis de Funès"],"correct":2},
  {"question":"Quelle reine est décapitée en 1793 ?","choices":["Marie de Médicis","Anne d''Autriche","Marie-Antoinette","Catherine de Médicis"],"correct":2},
  {"question":"En quelle année la France abolit-elle l''esclavage définitivement ?","choices":["1794","1815","1848","1905"],"correct":2},
  {"question":"Quel est le nom du traité qui met fin à la Première Guerre mondiale ?","choices":["Traité de Paris","Traité de Versailles","Traité de Berlin","Armistice de Compiègne"],"correct":1},
  {"question":"Qui succède à François Mitterrand à la présidence en 1995 ?","choices":["Lionel Jospin","Édouard Balladur","Jacques Chirac","Nicolas Sarkozy"],"correct":2},
  {"question":"En quelle année la Tour Eiffel est-elle construite ?","choices":["1878","1885","1889","1895"],"correct":2},
  {"question":"Quelle ville est le berceau de la Renaissance française ?","choices":["Bordeaux","Lyon","Tours","Blois"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 6 MAI — Géographie
-- ─────────────────────────────────────────────────────────────────────
('2026-05-06', 'Géographie', '[
  {"question":"Quel est le plus grand océan du monde ?","choices":["Atlantique","Indien","Arctique","Pacifique"],"correct":3},
  {"question":"Quelle est la capitale du Japon ?","choices":["Osaka","Kyoto","Tokyo","Hiroshima"],"correct":2},
  {"question":"Sur quel continent se trouve l''Égypte ?","choices":["Asie","Moyen-Orient","Afrique","Europe"],"correct":2},
  {"question":"Quel est le plus long fleuve d''Europe ?","choices":["Danube","Rhin","Volga","Loire"],"correct":2},
  {"question":"Combien de pays composent l''Amérique du Sud ?","choices":["10","12","13","14"],"correct":1},
  {"question":"Quelle mer sépare l''Europe de l''Afrique ?","choices":["Mer Noire","Mer Rouge","Mer Méditerranée","Mer Adriatique"],"correct":2},
  {"question":"Dans quel pays se trouve le Machu Picchu ?","choices":["Bolivie","Chili","Colombie","Pérou"],"correct":3},
  {"question":"Quelle est la capitale du Canada ?","choices":["Toronto","Vancouver","Montréal","Ottawa"],"correct":3},
  {"question":"Quel détroit sépare l''Espagne du Maroc ?","choices":["Détroit de Bab-el-Mandeb","Détroit de Gibraltar","Détroit de Malacca","Détroit de Messine"],"correct":1},
  {"question":"Quel est le plus haut sommet du monde ?","choices":["K2","Kangchenjunga","Lhotse","Everest"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 7 MAI — Sciences & Nature
-- ─────────────────────────────────────────────────────────────────────
('2026-05-07', 'Sciences & Nature', '[
  {"question":"Quel est l''atome le plus léger du tableau périodique ?","choices":["Hélium","Lithium","Hydrogène","Carbone"],"correct":2},
  {"question":"Combien d''os contient le corps humain adulte ?","choices":["186","196","206","216"],"correct":2},
  {"question":"Quelle est la vitesse de la lumière (arrondie) ?","choices":["200 000 km/s","300 000 km/s","400 000 km/s","500 000 km/s"],"correct":1},
  {"question":"Qui a découvert la pénicilline ?","choices":["Louis Pasteur","Alexander Fleming","Marie Curie","Robert Koch"],"correct":1},
  {"question":"Quel gaz les plantes absorbent-elles lors de la photosynthèse ?","choices":["Oxygène","Azote","CO2","Hydrogène"],"correct":2},
  {"question":"Combien de chromosomes possède un être humain ?","choices":["44","46","48","50"],"correct":1},
  {"question":"Quelle est la planète la plus grande du système solaire ?","choices":["Saturne","Neptune","Jupiter","Uranus"],"correct":2},
  {"question":"Comment s''appelle la couche qui protège la Terre des UV ?","choices":["Ionosphère","Stratosphère","Couche d''ozone","Troposphère"],"correct":2},
  {"question":"Quel est le métal le plus conducteur ?","choices":["Or","Aluminium","Cuivre","Argent"],"correct":3},
  {"question":"Dans quelle unité mesure-t-on la fréquence d''un son ?","choices":["Décibel","Hertz","Pascal","Newton"],"correct":1}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 8 MAI — Gastronomie
-- ─────────────────────────────────────────────────────────────────────
('2026-05-08', 'Gastronomie', '[
  {"question":"De quelle région française vient le gruyère ?","choices":["Alsace","Normandie","Franche-Comté","Savoie"],"correct":2},
  {"question":"Quel pays est le plus grand producteur de café ?","choices":["Éthiopie","Colombie","Vietnam","Brésil"],"correct":3},
  {"question":"Qu''est-ce qu''un carpaccio ?","choices":["Un plat chaud","De la viande ou poisson en fines tranches crues","Une sauce italienne","Un dessert sicilien"],"correct":1},
  {"question":"Quel est l''ingrédient principal du guacamole ?","choices":["Tomate","Poivron","Avocat","Piment"],"correct":2},
  {"question":"De quelle ville vient la quiche lorraine ?","choices":["Strasbourg","Metz","Nancy","Lyon"],"correct":2},
  {"question":"Qu''est-ce que le sashimi ?","choices":["Un riz vinaigré avec garniture","Du poisson cru en tranches","Des rouleaux de printemps","Des boulettes de riz"],"correct":1},
  {"question":"Quel fromage français est protégé par AOP et vient du Massif Central ?","choices":["Brie","Camembert","Roquefort","Munster"],"correct":2},
  {"question":"Quelle épice provient du safran ?","choices":["Les feuilles","Les racines","Les pistils de la fleur","Les graines"],"correct":2},
  {"question":"Combien de bouteilles contient un Mathusalem de Champagne ?","choices":["4","6","8","12"],"correct":2},
  {"question":"Quel pays a inventé la fondue ?","choices":["France","Autriche","Belgique","Suisse"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 9 MAI — Jeux vidéo & Technologie
-- ─────────────────────────────────────────────────────────────────────
('2026-05-09', 'Jeux vidéo & Technologie', '[
  {"question":"Quelle est l''entreprise créatrice de la Nintendo Switch ?","choices":["Sony","Microsoft","Sega","Nintendo"],"correct":3},
  {"question":"En quelle année est sorti le premier iPhone ?","choices":["2005","2006","2007","2008"],"correct":2},
  {"question":"Quel personnage est la mascotte de Sega ?","choices":["Crash Bandicoot","Sonic the Hedgehog","Pac-Man","Spyro"],"correct":1},
  {"question":"Que signifie l''acronyme GPU ?","choices":["General Processing Unit","Graphics Processing Unit","Global Power Unit","Game Programming Unit"],"correct":1},
  {"question":"Quel jeu se déroule dans le royaume de Hyrule ?","choices":["Zelda","Mario","Metroid","Kirby"],"correct":0},
  {"question":"Quelle société a développé le moteur de jeu Unreal Engine ?","choices":["Unity","EA Games","Epic Games","Ubisoft"],"correct":2},
  {"question":"Combien de bits avait la Nintendo 64 ?","choices":["16","32","64","128"],"correct":2},
  {"question":"Quel est le jeu vidéo le plus vendu de tous les temps ?","choices":["GTA V","Tetris","Minecraft","Wii Sports"],"correct":1},
  {"question":"Quelle entreprise fabrique les processeurs Ryzen ?","choices":["Intel","NVIDIA","AMD","Qualcomm"],"correct":2},
  {"question":"Dans Fortnite, combien de joueurs maximum participent à une partie Battle Royale ?","choices":["50","75","100","150"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 10 MAI — Art & Littérature
-- ─────────────────────────────────────────────────────────────────────
('2026-05-10', 'Art & Littérature', '[
  {"question":"Qui a écrit Les Misérables ?","choices":["Honoré de Balzac","Victor Hugo","Émile Zola","Gustave Flaubert"],"correct":1},
  {"question":"Dans quel musée peut-on voir La Vénus de Milo ?","choices":["Musée d''Orsay","Centre Pompidou","Musée du Louvre","Musée Picasso"],"correct":2},
  {"question":"Qui est l''auteur de Don Quichotte ?","choices":["Lope de Vega","Francisco de Quevedo","Miguel de Cervantes","Garcilaso de la Vega"],"correct":2},
  {"question":"Quel peintre a coupé son oreille ?","choices":["Paul Gauguin","Paul Cézanne","Georges Seurat","Vincent van Gogh"],"correct":3},
  {"question":"Quel mouvement artistique est associé à Salvador Dalí ?","choices":["Cubisme","Fauvisme","Surréalisme","Expressionnisme"],"correct":2},
  {"question":"Qui a écrit La Divine Comédie ?","choices":["Pétrarque","Dante Alighieri","Boccace","Virgile"],"correct":1},
  {"question":"Quel est le vrai prénom de Molière ?","choices":["François","Jacques","Jean-Baptiste","Pierre"],"correct":2},
  {"question":"Quel architecte a conçu le Centre Pompidou à Paris ?","choices":["Le Corbusier","Renzo Piano","Jean Nouvel","Zaha Hadid"],"correct":1},
  {"question":"Dans quel roman apparaît Hercule Poirot ?","choices":["Sherlock Holmes","Le Crime de l''Orient-Express","Rebecca","Les Dix Petits Nègres"],"correct":1},
  {"question":"Qui a peint Le Cri ?","choices":["Gustav Klimt","Egon Schiele","Edvard Munch","Ernst Ludwig Kirchner"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 11 MAI — Animaux
-- ─────────────────────────────────────────────────────────────────────
('2026-05-11', 'Animaux', '[
  {"question":"Quel est le plus grand animal terrestre ?","choices":["Rhinocéros","Hippopotame","Girafe","Éléphant d''Afrique"],"correct":3},
  {"question":"Combien de cœurs possède le poulpe ?","choices":["1","2","3","4"],"correct":2},
  {"question":"Quel animal est le symbole du WWF ?","choices":["Éléphant","Ours polaire","Panda géant","Tigre"],"correct":2},
  {"question":"Quelle est la gestation d''un éléphant ?","choices":["12 mois","18 mois","22 mois","26 mois"],"correct":2},
  {"question":"Quel est l''oiseau le plus rapide en piqué ?","choices":["Aigle royal","Faucon pèlerin","Albatros","Autour des palombes"],"correct":1},
  {"question":"Combien de pattes a une araignée ?","choices":["6","8","10","12"],"correct":1},
  {"question":"Quel oiseau est totalement incapable de voler ?","choices":["Faucon","Albatros","Manchot","Cigogne"],"correct":2},
  {"question":"Quel animal produit la soie naturelle ?","choices":["Abeille","Araignée","Ver à soie","Chenille processionnaire"],"correct":2},
  {"question":"Combien d''espèces de pingouins existe-t-il environ ?","choices":["8","13","18","25"],"correct":2},
  {"question":"Quel reptile peut changer de couleur ?","choices":["Gecko","Lézard vert","Caméléon","Iguane"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 12 MAI — Voyages & Découvertes
-- ─────────────────────────────────────────────────────────────────────
('2026-05-12', 'Voyages & Découvertes', '[
  {"question":"Qui a découvert l''Amérique en 1492 ?","choices":["Vasco de Gama","Fernand Magellan","Christophe Colomb","Jacques Cartier"],"correct":2},
  {"question":"Dans quel pays se trouve Angkor Vat ?","choices":["Thaïlande","Vietnam","Laos","Cambodge"],"correct":3},
  {"question":"Quel est l''État américain le plus visité au monde ?","choices":["New York","Californie","Floride","Nevada"],"correct":2},
  {"question":"Quelle ville est surnommée la Venise du Nord ?","choices":["Hambourg","Stockholm","Amsterdam","Bruges"],"correct":2},
  {"question":"Dans quel pays se trouve la Grande Barrière de Corail ?","choices":["Nouvelle-Zélande","Indonésie","Philippines","Australie"],"correct":3},
  {"question":"Quelle est la compagnie aérienne nationale française ?","choices":["Corsair","Transavia","Air France","Easyjet"],"correct":2},
  {"question":"Quel explorateur a réalisé le premier tour du monde ?","choices":["Fernand Magellan","Amerigo Vespucci","Vasco de Gama","Francis Drake"],"correct":0},
  {"question":"Dans quel pays le mont Kilimandjaro est-il situé ?","choices":["Kenya","Éthiopie","Tanzanie","Rwanda"],"correct":2},
  {"question":"Quelle est la ville la plus peuplée du monde ?","choices":["Shanghai","Pékin","Mumbai","Tokyo"],"correct":3},
  {"question":"Quel pays accueille Petra, la cité rose ?","choices":["Israël","Arabie Saoudite","Jordanie","Égypte"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 13 MAI — Culture générale
-- ─────────────────────────────────────────────────────────────────────
('2026-05-13', 'Culture générale', '[
  {"question":"Quel est le métal le plus précieux ?","choices":["Or","Platine","Palladium","Rhodium"],"correct":3},
  {"question":"Combien de livres contient la Bible (canon catholique) ?","choices":["66","73","78","81"],"correct":1},
  {"question":"Qui a inventé le téléphone ?","choices":["Thomas Edison","Nikola Tesla","Alexander Graham Bell","Guglielmo Marconi"],"correct":2},
  {"question":"Quelle est la monnaie du Japon ?","choices":["Yuan","Won","Yen","Baht"],"correct":2},
  {"question":"En quelle année l''homme a-t-il marché sur la Lune pour la première fois ?","choices":["1967","1969","1971","1973"],"correct":1},
  {"question":"Quel pays a le plus grand nombre de lauréats au Nobel ?","choices":["Royaume-Uni","Allemagne","France","États-Unis"],"correct":3},
  {"question":"Quelle est la vitesse maximale légale sur autoroute en France ?","choices":["110 km/h","120 km/h","130 km/h","140 km/h"],"correct":2},
  {"question":"Combien de lettres compte l''alphabet grec ?","choices":["22","24","26","28"],"correct":1},
  {"question":"Quel est le symbole chimique du fer ?","choices":["Fr","Fe","Fi","Fn"],"correct":1},
  {"question":"Quelle est la superficie de la France métropolitaine ?","choices":["541 000 km²","551 500 km²","563 000 km²","575 000 km²"],"correct":1}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 14 MAI — Cinéma & Séries
-- ─────────────────────────────────────────────────────────────────────
('2026-05-14', 'Cinéma & Séries', '[
  {"question":"Quel film de Christopher Nolan se passe dans un rêve ?","choices":["Memento","Interstellar","Inception","The Dark Knight"],"correct":2},
  {"question":"Qui joue Daenerys Targaryen dans Game of Thrones ?","choices":["Sophie Turner","Emilia Clarke","Lena Headey","Maisie Williams"],"correct":1},
  {"question":"Quelle série met en scène les familles Soprano ?","choices":["Boardwalk Empire","The Wire","The Sopranos","Oz"],"correct":2},
  {"question":"Dans quel film Léonardo DiCaprio gagne-t-il enfin l''Oscar ?","choices":["Aviator","The Revenant","Shutter Island","Inception"],"correct":1},
  {"question":"Quel personnage dit ''Je suis ton père'' dans Star Wars ?","choices":["Obi-Wan Kenobi","Palpatine","Dark Vador","Yoda"],"correct":2},
  {"question":"Quel réalisateur a créé la trilogie du Parrain ?","choices":["Martin Scorsese","Francis Ford Coppola","Sidney Lumet","William Friedkin"],"correct":1},
  {"question":"Quel film met en scène Tom Hanks seul sur une île déserte ?","choices":["Philadelphia","The Terminal","Cast Away","Forrest Gump"],"correct":2},
  {"question":"Dans The Office US, quelle ville est le siège de Dunder Mifflin ?","choices":["Albany","Scranton","Syracuse","Utica"],"correct":1},
  {"question":"Quel film d''animation Pixar se passe sous l''eau ?","choices":["Brave","Up","Le Monde de Nemo","Ratatouille"],"correct":2},
  {"question":"Qui interprète James Bond dans Casino Royale (2006) ?","choices":["Pierce Brosnan","Timothy Dalton","Roger Moore","Daniel Craig"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 15 MAI — Musique
-- ─────────────────────────────────────────────────────────────────────
('2026-05-15', 'Musique', '[
  {"question":"Quel chanteur français est surnommé Le Fou Chantant ?","choices":["Charles Trenet","Charles Aznavour","Georges Brassens","Jacques Brel"],"correct":0},
  {"question":"Quel album de Michael Jackson est le plus vendu de tous les temps ?","choices":["Bad","Dangerous","Off the Wall","Thriller"],"correct":3},
  {"question":"Quel groupe chante Stairway to Heaven ?","choices":["The Who","Deep Purple","Led Zeppelin","Black Sabbath"],"correct":2},
  {"question":"De quel pays vient la bossa nova ?","choices":["Argentine","Cuba","Brésil","Mexique"],"correct":2},
  {"question":"Quelle chanson de Johnny Hallyday est surnommée son hymne ?","choices":["Que je t''aime","Allumer le feu","L''Envie","Rock & Roll Attitude"],"correct":0},
  {"question":"Combien de touches blanches y a-t-il sur un piano standard ?","choices":["48","52","56","61"],"correct":1},
  {"question":"Quel artiste a popularisé le gangsta rap à Compton ?","choices":["Ice Cube","Snoop Dogg","Dr. Dre","Kendrick Lamar"],"correct":2},
  {"question":"Quel compositeur est sourd en écrivant sa 9e Symphonie ?","choices":["Mozart","Schubert","Beethoven","Bach"],"correct":2},
  {"question":"Dans quel pays est né Édith Piaf ?","choices":["Belgique","France","Suisse","Canada"],"correct":1},
  {"question":"Quel groupe chante Smells Like Teen Spirit ?","choices":["Pearl Jam","Soundgarden","Nirvana","Alice in Chains"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 16 MAI — Sport
-- ─────────────────────────────────────────────────────────────────────
('2026-05-16', 'Sport', '[
  {"question":"Combien de joueurs compose une équipe de football américain sur le terrain ?","choices":["9","10","11","12"],"correct":2},
  {"question":"Quel est le nom du trophée décerné au meilleur basketteur NBA ?","choices":["Hart Trophy","Larry O''Brien Trophy","Maurice Podoloff Trophy","Art Ross Trophy"],"correct":2},
  {"question":"Quelle nation a remporté le plus de Coupes du monde de football ?","choices":["Allemagne","Italie","Argentine","Brésil"],"correct":3},
  {"question":"En natation, quelle nage est la plus rapide ?","choices":["Brasse","Dos","Papillon","Crawl"],"correct":3},
  {"question":"Quel sportif français a remporté Roland-Garros le plus de fois ?","choices":["Henri Leconte","Yannick Noah","Henri Lacoste","Gustavo Kuerten"],"correct":1},
  {"question":"Quelle équipe de basket porte le surnom des ''Bulls'' ?","choices":["Los Angeles","New York","Chicago","Boston"],"correct":2},
  {"question":"Quel est le record du monde du 100 m ?","choices":["9s58","9s63","9s69","9s72"],"correct":0},
  {"question":"Dans quel sport pratique-t-on le salto ?","choices":["Gym rythmique","Trampoline","Gym artistique","Plongeon"],"correct":2},
  {"question":"Quel joueur de tennis a gagné le plus de Grand Chelem ?","choices":["Roger Federer","Rafael Nadal","Novak Djokovic","Pete Sampras"],"correct":2},
  {"question":"De quelle ville vient le club de foot Paris Saint-Germain ?","choices":["Bordeaux","Marseille","Lyon","Paris"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 17 MAI — Histoire mondiale
-- ─────────────────────────────────────────────────────────────────────
('2026-05-17', 'Histoire mondiale', '[
  {"question":"En quelle année a eu lieu la Révolution russe bolchevique ?","choices":["1905","1912","1917","1921"],"correct":2},
  {"question":"Quel mur tombe symboliquement en 1989 ?","choices":["Le mur d''Hadrien","Le mur de Berlin","Le mur de Chine","Le mur de Jéricho"],"correct":1},
  {"question":"Qui est le premier président des États-Unis ?","choices":["John Adams","Thomas Jefferson","Benjamin Franklin","George Washington"],"correct":3},
  {"question":"Quel empire était le plus grand de l''histoire en superficie ?","choices":["Empire romain","Empire mongol","Empire britannique","Empire ottoman"],"correct":2},
  {"question":"En quelle année Hiroshima est-elle bombardée ?","choices":["1943","1944","1945","1946"],"correct":2},
  {"question":"Qui dirige l''Allemagne nazie de 1933 à 1945 ?","choices":["Hermann Göring","Heinrich Himmler","Joseph Goebbels","Adolf Hitler"],"correct":3},
  {"question":"Quelle civilisation a construit les pyramides de Gizeh ?","choices":["Sumériens","Babyloniens","Égyptiens","Romains"],"correct":2},
  {"question":"En quelle année Christophe Colomb arrive-t-il en Amérique ?","choices":["1488","1492","1498","1504"],"correct":1},
  {"question":"Quel pays a lancé le premier satellite artificiel, Spoutnik ?","choices":["USA","Chine","URSS","Allemagne"],"correct":2},
  {"question":"Qui est le premier homme à avoir marché sur la Lune ?","choices":["Buzz Aldrin","Neil Armstrong","Yuri Gagarine","John Glenn"],"correct":1}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 18 MAI — Géographie
-- ─────────────────────────────────────────────────────────────────────
('2026-05-18', 'Géographie', '[
  {"question":"Quel est le pays le plus peuplé du monde ?","choices":["Inde","Chine","USA","Indonésie"],"correct":0},
  {"question":"Quelle est la capitale de l''Argentine ?","choices":["Santiago","Lima","Montevideo","Buenos Aires"],"correct":3},
  {"question":"Quel fleuve traverse Le Caire ?","choices":["Congo","Niger","Nil","Zambèze"],"correct":2},
  {"question":"Quel est le plus petit État du monde ?","choices":["Monaco","Liechtenstein","San Marin","Vatican"],"correct":3},
  {"question":"Dans quel pays se trouve le lac Titicaca ?","choices":["Chili","Équateur","Pérou & Bolivie","Argentine"],"correct":2},
  {"question":"Quelle est la mer intérieure entre la Russie et le Kazakhstan ?","choices":["Mer Caspienne","Mer d''Aral","Lac Baïkal","Mer Noire"],"correct":0},
  {"question":"Quel pays n''a pas d''accès à la mer ?","choices":["Bolivie","Paraguay","Zambie","Tous ces pays"],"correct":3},
  {"question":"Quelle chaîne de montagnes sépare l''Europe de l''Asie ?","choices":["Caucase","Carpates","Oural","Alpes"],"correct":2},
  {"question":"Quelle est la capitale de la Nouvelle-Zélande ?","choices":["Auckland","Christchurch","Hamilton","Wellington"],"correct":3},
  {"question":"Quel est le seul continent entièrement recouvert de glace ?","choices":["Afrique","Australie","Asie","Antarctique"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 19 MAI — Sciences & Espace
-- ─────────────────────────────────────────────────────────────────────
('2026-05-19', 'Sciences & Espace', '[
  {"question":"Combien de planètes compte notre système solaire ?","choices":["7","8","9","10"],"correct":1},
  {"question":"Quelle est la distance Terre-Lune (approximativement) ?","choices":["284 000 km","384 000 km","484 000 km","584 000 km"],"correct":1},
  {"question":"Qui a formulé la théorie de la relativité générale ?","choices":["Isaac Newton","Niels Bohr","Albert Einstein","Max Planck"],"correct":2},
  {"question":"Quel télescope spatial a été lancé en 2021 pour succéder à Hubble ?","choices":["Chandra","Spitzer","James Webb","Kepler"],"correct":2},
  {"question":"Qu''est-ce qu''une année-lumière ?","choices":["La durée de révolution de la Terre","La distance parcourue par la lumière en 1 an","La luminosité d''une étoile","La distance Terre-Soleil"],"correct":1},
  {"question":"Quelle planète possède les anneaux les plus visibles ?","choices":["Jupiter","Uranus","Neptune","Saturne"],"correct":3},
  {"question":"Quel est le symbole chimique de l''or ?","choices":["Go","Ar","Au","Ag"],"correct":2},
  {"question":"Combien de neurones environ possède le cerveau humain ?","choices":["86 millions","860 millions","86 milliards","860 milliards"],"correct":2},
  {"question":"Quel scientifique a découvert la radioactivité ?","choices":["Ernest Rutherford","Marie Curie","Henri Becquerel","Pierre Curie"],"correct":2},
  {"question":"En quelle année la station spatiale ISS a-t-elle été lancée ?","choices":["1995","1998","2001","2004"],"correct":1}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 20 MAI — Gastronomie
-- ─────────────────────────────────────────────────────────────────────
('2026-05-20', 'Gastronomie', '[
  {"question":"Quel chef français a popularisé la nouvelle cuisine ?","choices":["Paul Bocuse","Joël Robuchon","Michel Guérard","Guy Savoy"],"correct":0},
  {"question":"Quelle est la boisson nationale du Mexique ?","choices":["Rhum","Mezcal","Tequila","Pisco"],"correct":2},
  {"question":"De quel pays vient le kimchi ?","choices":["Chine","Japon","Corée","Vietnam"],"correct":2},
  {"question":"Quelle herbe aromatique est indispensable dans un pesto ?","choices":["Persil","Coriandre","Basilic","Menthe"],"correct":2},
  {"question":"Quel est l''ingrédient principal d''un houmous ?","choices":["Lentilles","Pois chiches","Haricots blancs","Fèves"],"correct":1},
  {"question":"Quelle région produit le vin de Bordeaux ?","choices":["Bourgogne","Pays de la Loire","Nouvelle-Aquitaine","Occitanie"],"correct":2},
  {"question":"Qu''est-ce que le miso ?","choices":["Une sauce de soja","Une pâte fermentée de soja","Un riz gluant","Un vinaigre de riz"],"correct":1},
  {"question":"Quel fromage est indispensable dans la vraie pizza Margherita ?","choices":["Parmesan","Pecorino","Mozzarella","Ricotta"],"correct":2},
  {"question":"Quelle épice donne sa couleur orange au curry ?","choices":["Curcuma","Safran","Paprika","Gingembre"],"correct":0},
  {"question":"Combien de grammes de beurre contient environ un croissant ?","choices":["10-15 g","25-30 g","40-50 g","60-70 g"],"correct":1}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 21 MAI — Pop culture & Internet
-- ─────────────────────────────────────────────────────────────────────
('2026-05-21', 'Pop culture & Internet', '[
  {"question":"Quel réseau social a lancé le concept de ''like'' ?","choices":["MySpace","Twitter","Facebook","Instagram"],"correct":2},
  {"question":"Que signifie OMG en anglais ?","choices":["On My Goodness","Oh My God","Oh Man, Great","On My Ground"],"correct":1},
  {"question":"Quel est le vrai nom de Pewdiepie ?","choices":["Felix Arvid Ulf Kjellberg","Felix Magnus Kjellberg","Peter Kjellberg","Lars Kjellberg"],"correct":0},
  {"question":"Quel app est connue pour ses vidéos courtes de 60 secondes max ?","choices":["Instagram","YouTube Shorts","TikTok","Snapchat"],"correct":2},
  {"question":"Qui est la youtubeuse franco-belge connue pour ses tests beauté ?","choices":["EnjoyPhoenix","Léna Situations","Natoo","Cyprien"],"correct":0},
  {"question":"En quelle année Twitter est-il fondé ?","choices":["2004","2005","2006","2007"],"correct":2},
  {"question":"Que signifie ''meme'' dans le contexte internet ?","choices":["Une blague en image","Une vidéo virale","Un gif animé","Un tweet"],"correct":0},
  {"question":"Quel personnage est le logo de Reddit ?","choices":["Un alien vert","Un chien","Un extraterrestre orange","Un raton laveur"],"correct":2},
  {"question":"Combien de followers a Cristiano Ronaldo sur Instagram (environ, 2024) ?","choices":["400 M","500 M","600 M","700 M"],"correct":2},
  {"question":"Quel réseau social est fondé par Elon Musk après son rachat de Twitter ?","choices":["X","Bluesky","Threads","Mastodon"],"correct":0}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 22 MAI — Art & Bande dessinée
-- ─────────────────────────────────────────────────────────────────────
('2026-05-22', 'Art & Bande dessinée', '[
  {"question":"Qui a créé Tintin ?","choices":["André Franquin","Peyo","Hergé","Morris"],"correct":2},
  {"question":"Dans quel pays est né Pablo Picasso ?","choices":["France","Italie","Portugal","Espagne"],"correct":3},
  {"question":"Qui a créé le personnage Astérix ?","choices":["Franquin & Morris","Goscinny & Uderzo","Hergé & Jacobs","Peyo & Gos"],"correct":1},
  {"question":"Quel est le style artistique de Jackson Pollock ?","choices":["Impressionnisme","Expressionnisme abstrait","Cubisme","Pop art"],"correct":1},
  {"question":"Quelle BD met en scène Gaston Lagaffe ?","choices":["Tintin","Spirou","Lucky Luke","Gaston"],"correct":1},
  {"question":"Quel peintre est connu pour ses tableaux de ballerines ?","choices":["Auguste Renoir","Claude Monet","Edgar Degas","Pierre Bonnard"],"correct":2},
  {"question":"Qui a créé les Schtroumpfs ?","choices":["Hergé","Peyo","Franquin","Tillieux"],"correct":1},
  {"question":"Dans quelle ville se trouve le musée du Prado ?","choices":["Barcelone","Madrid","Séville","Lisbonne"],"correct":1},
  {"question":"Quel mouvement artistique a suivi le cubisme ?","choices":["Dadaïsme","Fauvisme","Art nouveau","Réalisme"],"correct":0},
  {"question":"Quel personnage de BD américain dit ''Shazam !'' pour se transformer ?","choices":["Superman","Batman","Shazam / Captain Marvel","Flash"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 23 MAI — Animaux & Nature
-- ─────────────────────────────────────────────────────────────────────
('2026-05-23', 'Animaux & Nature', '[
  {"question":"Quel arbre vit le plus longtemps sur Terre ?","choices":["Séquoia","Chêne","Pin Bristlecone","Baobab"],"correct":2},
  {"question":"Combien d''estomacs a une vache ?","choices":["1","2","3","4"],"correct":3},
  {"question":"Quel insecte produit le miel ?","choices":["Guêpe","Frelon","Bourdon","Abeille"],"correct":3},
  {"question":"Quelle est la durée de vie moyenne d''un chien ?","choices":["7-9 ans","10-13 ans","14-17 ans","18-20 ans"],"correct":1},
  {"question":"Quel est le plus grand prédateur terrestre ?","choices":["Lion","Tigre du Bengale","Ours polaire","Jaguar"],"correct":2},
  {"question":"Comment s''appelle le bébé grenouille avant de perdre sa queue ?","choices":["Larve","Têtard","Triton","Salamandre"],"correct":1},
  {"question":"Quelle plante carnivore est la plus célèbre ?","choices":["Sarracénie","Drosera","Népenthès","Dionée attrape-mouche"],"correct":3},
  {"question":"Quel est le seul mammifère capable de voler vraiment ?","choices":["Écureuil volant","Chauve-souris","Colugo","Lemur volant"],"correct":1},
  {"question":"Combien de pattes a un crabe ?","choices":["6","8","10","12"],"correct":2},
  {"question":"Quelle fleur nationale représente la France ?","choices":["Rose","Tulipe","Iris","Fleur de lys"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 24 MAI — Histoire de France
-- ─────────────────────────────────────────────────────────────────────
('2026-05-24', 'Histoire de France', '[
  {"question":"Quel roi est surnommé le Roi-Soleil ?","choices":["Louis XII","Louis XIII","Louis XIV","Louis XV"],"correct":2},
  {"question":"En quelle année la France devient-elle une République pour la première fois ?","choices":["1789","1791","1792","1795"],"correct":2},
  {"question":"Qui est la première femme à avoir présidé un gouvernement français ?","choices":["Simone Veil","Édith Cresson","Ségolène Royal","Martine Aubry"],"correct":1},
  {"question":"Quel est le régime politique instauré par Napoléon III ?","choices":["Première République","Seconde République","Second Empire","Troisième République"],"correct":2},
  {"question":"Quelle loi de 1905 sépare l''Église et l''État ?","choices":["Loi Jules Ferry","Loi Combes","Loi de séparation","Loi Falloux"],"correct":2},
  {"question":"Quel héros médiéval français est surnommé le Connétable de France ?","choices":["Bertrand du Guesclin","Jeanne d''Arc","Bayard","Roland"],"correct":0},
  {"question":"Dans quelle ville se situe le château des Ducs de Bretagne ?","choices":["Rennes","Brest","Saint-Malo","Nantes"],"correct":3},
  {"question":"Quel est le nom de la première constitution française ?","choices":["Constitution de 1789","Constitution de 1791","Déclaration des droits","Charte de 1814"],"correct":1},
  {"question":"Quel général remplace de Gaulle comme chef d''État en 1969 ?","choices":["Michel Debré","Jacques Chaban-Delmas","Georges Pompidou","Valéry Giscard d''Estaing"],"correct":2},
  {"question":"Quel était le titre de Clovis, premier roi des Francs ?","choices":["Empereus","Rex Francorum","Basileus","Dux"],"correct":1}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 25 MAI — Musique
-- ─────────────────────────────────────────────────────────────────────
('2026-05-25', 'Musique', '[
  {"question":"Quel groupe britannique chante Hotel California ?","choices":["Fleetwood Mac","Eagles","The Doors","Crosby, Stills & Nash"],"correct":1},
  {"question":"Quelle chanteuse est surnommée Lady Soul ?","choices":["Tina Turner","Nina Simone","Aretha Franklin","Whitney Houston"],"correct":2},
  {"question":"Quel instrument Yannick Noah joue-t-il en dehors du tennis ?","choices":["Guitare","Piano","Batterie","Basse"],"correct":0},
  {"question":"Quelle est la danse nationale de l''Argentine ?","choices":["Salsa","Tango","Cumbia","Merengue"],"correct":1},
  {"question":"Qui est le rappeur français le plus écouté en streaming ?","choices":["Jul","Nekfeu","Ninho","SCH"],"correct":2},
  {"question":"Quel chanteur belge est connu pour Ne me quitte pas ?","choices":["Stromae","Jacques Brel","Arno","Adamo"],"correct":1},
  {"question":"Dans quelle ville se déroule le festival de Glastonbury ?","choices":["Liverpool","Manchester","Londres","Somerset"],"correct":3},
  {"question":"Quel est le nom de la voix féminine la plus aiguë en musique classique ?","choices":["Mezzo-soprano","Soprano","Contralto","Colorature"],"correct":1},
  {"question":"Qui chante Purple Rain ?","choices":["David Bowie","Michael Jackson","Prince","James Brown"],"correct":2},
  {"question":"Quelle rappeuse américaine a sorti l''album Lemonade ?","choices":["Nicki Minaj","Cardi B","Rihanna","Beyoncé"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 26 MAI — Sport
-- ─────────────────────────────────────────────────────────────────────
('2026-05-26', 'Sport', '[
  {"question":"Quel pays a inventé le judo ?","choices":["Chine","Corée","Japon","Vietnam"],"correct":2},
  {"question":"Combien de km fait le Tour de France approximativement ?","choices":["2 800 km","3 400 km","3 900 km","4 500 km"],"correct":1},
  {"question":"Dans quel sport Usain Bolt est-il champion olympique ?","choices":["Saut en longueur","Sprint (100 m & 200 m)","Décathlon","400 m haies"],"correct":1},
  {"question":"Combien de sets se jouent au maximum en tennis Grand Chelem chez les hommes ?","choices":["3","4","5","6"],"correct":2},
  {"question":"Quel est le nom de la formule 1 de Mercedes ?","choices":["W12","W13","W14","W15"],"correct":3},
  {"question":"Quelle ville accueille le Grand Prix de Monaco de F1 ?","choices":["Monte-Carlo uniquement","Monaco","Nice","Cannes"],"correct":1},
  {"question":"Dans quel sport pratique-t-on le ''smash'' et le ''lob'' ?","choices":["Volleyball","Tennis","Badminton","Tous ces sports"],"correct":3},
  {"question":"Quel club de foot a remporté le plus de Ligues des Champions ?","choices":["Barcelona","Liverpool","Bayern Munich","Real Madrid"],"correct":3},
  {"question":"Combien de joueurs joue une équipe de baseball sur le terrain ?","choices":["8","9","10","11"],"correct":1},
  {"question":"Quel boxeur est surnommé The Greatest ?","choices":["Joe Frazier","George Foreman","Mike Tyson","Muhammad Ali"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 27 MAI — Géographie
-- ─────────────────────────────────────────────────────────────────────
('2026-05-27', 'Géographie', '[
  {"question":"Quelle est la capitale de l''Iran ?","choices":["Bagdad","Ankara","Téhéran","Kaboul"],"correct":2},
  {"question":"Quel est le plus grand lac d''Afrique ?","choices":["Lac Tchad","Lac Victoria","Lac Tanganyika","Lac Malawi"],"correct":1},
  {"question":"Dans quel pays se trouve la ville de Dubrovnik ?","choices":["Grèce","Monténégro","Albanie","Croatie"],"correct":3},
  {"question":"Quel archipel appartient à l''Espagne et se situe près de l''Afrique ?","choices":["Baléares","Açores","Canaries","Madère"],"correct":2},
  {"question":"Quelle est la capitale du Nigeria ?","choices":["Lagos","Ibadan","Kano","Abuja"],"correct":3},
  {"question":"Quel fleuve passe à Paris ?","choices":["Loire","Rhône","Marne","Seine"],"correct":3},
  {"question":"Dans quel pays se trouvent les chutes d''Iguaçu ?","choices":["Pérou","Brésil & Argentine","Bolivie","Paraguay"],"correct":1},
  {"question":"Quelle est la capitale de la Thaïlande ?","choices":["Hanoï","Phnom Penh","Bangkok","Yangon"],"correct":2},
  {"question":"Quel pays a la plus longue frontière avec la France ?","choices":["Espagne","Italie","Belgique","Allemagne"],"correct":0},
  {"question":"Dans quel pays se trouve la forêt amazonienne en majorité ?","choices":["Bolivie","Colombie","Venezuela","Brésil"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 28 MAI — Sciences
-- ─────────────────────────────────────────────────────────────────────
('2026-05-28', 'Sciences', '[
  {"question":"Quelle loi décrit la chute des corps ?","choices":["Loi de Coulomb","Loi de Newton","Loi d''Ohm","Loi de Faraday"],"correct":1},
  {"question":"Quel est le numéro atomique du carbone ?","choices":["4","6","8","12"],"correct":1},
  {"question":"Que mesure un thermomètre ?","choices":["La pression","L''humidité","La température","Le vent"],"correct":2},
  {"question":"Quelle partie de l''œil perçoit les couleurs ?","choices":["Cornée","Iris","Rétine","Pupille"],"correct":2},
  {"question":"Quel est le pH de l''eau pure ?","choices":["5","6","7","8"],"correct":2},
  {"question":"Combien d''éléments compte le tableau périodique actuel ?","choices":["108","112","118","124"],"correct":2},
  {"question":"Quel type d''onde est le son ?","choices":["Électromagnétique","Mécanique longitudinale","Transversale","Gravitationnelle"],"correct":1},
  {"question":"Quel organe filtre le sang dans le corps humain ?","choices":["Foie","Rate","Reins","Pancréas"],"correct":2},
  {"question":"Quelle force maintient les planètes en orbite ?","choices":["Force électromagnétique","Force nucléaire","Gravitation","Pression solaire"],"correct":2},
  {"question":"En quelle année Darwin publie L''Origine des espèces ?","choices":["1839","1849","1859","1869"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 29 MAI — Cinéma
-- ─────────────────────────────────────────────────────────────────────
('2026-05-29', 'Cinéma', '[
  {"question":"Quel film a rapporté le plus d''argent dans l''histoire du cinéma ?","choices":["Titanic","Avengers: Endgame","Avatar","The Force Awakens"],"correct":2},
  {"question":"Qui joue le Joker dans le film Joker de 2019 ?","choices":["Heath Ledger","Jared Leto","Joaquin Phoenix","Jack Nicholson"],"correct":2},
  {"question":"Quel réalisateur a fait Schindler''s List ?","choices":["Martin Scorsese","Steven Spielberg","Clint Eastwood","Roman Polanski"],"correct":1},
  {"question":"Dans Jurassic Park, quelle était la première méthode de clonage utilisée ?","choices":["Fossiles","ADN dans ambre","Cellules congelées","Fossiles marins"],"correct":1},
  {"question":"Qui incarne Hermione Granger dans Harry Potter ?","choices":["Bonnie Wright","Emma Watson","Evanna Lynch","Katie Leung"],"correct":1},
  {"question":"En quelle année sort le film Le Seigneur des Anneaux : La Communauté de l''Anneau ?","choices":["1999","2001","2003","2005"],"correct":1},
  {"question":"Quel film de Denis Villeneuve adapte un roman de Frank Herbert ?","choices":["Blade Runner 2049","Arrival","Dune","Sicario"],"correct":2},
  {"question":"Quel acteur joue dans Taxi Driver ET Goodfellas ?","choices":["Al Pacino","Jack Nicholson","Robert De Niro","Dustin Hoffman"],"correct":2},
  {"question":"Quelle actrice joue Sarah Connor dans les deux premiers films Terminator ?","choices":["Sigourney Weaver","Linda Hamilton","Kate Winslet","Jamie Lee Curtis"],"correct":1},
  {"question":"Dans quel film voit-on la scène de danse du twist entre Uma Thurman et John Travolta ?","choices":["Kill Bill","Reservoir Dogs","Jackie Brown","Pulp Fiction"],"correct":3}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 30 MAI — Culture générale
-- ─────────────────────────────────────────────────────────────────────
('2026-05-30', 'Culture générale', '[
  {"question":"Quelle est l''unité de mesure de la puissance électrique ?","choices":["Volt","Ampère","Watt","Ohm"],"correct":2},
  {"question":"Combien de dents a un adulte avec ses dents de sagesse ?","choices":["28","30","32","34"],"correct":2},
  {"question":"Quel pays est le plus grand exportateur de pétrole ?","choices":["Russie","Irak","Arabie Saoudite","États-Unis"],"correct":2},
  {"question":"En quelle année l''Union européenne est-elle fondée (traité de Maastricht) ?","choices":["1989","1990","1992","1995"],"correct":2},
  {"question":"Quel est le prénom du président américain élu en 2020 ?","choices":["Donald","Barack","Joseph","George"],"correct":2},
  {"question":"Quelle est la hauteur de la Tour Eiffel ?","choices":["300 m","324 m","350 m","376 m"],"correct":1},
  {"question":"Combien de pays font partie du G7 ?","choices":["6","7","8","10"],"correct":1},
  {"question":"Quel sport se pratique sur un tatami ?","choices":["Boxe","Judo","Lutte gréco-romaine","Karaté"],"correct":1},
  {"question":"Qui a fondé Amazon ?","choices":["Bill Gates","Elon Musk","Jeff Bezos","Larry Page"],"correct":2},
  {"question":"Quelle est la monnaie officielle du Royaume-Uni ?","choices":["Euro","Couronne","Livre sterling","Franc"],"correct":2}
]'),

-- ─────────────────────────────────────────────────────────────────────
-- 31 MAI — Mix (toutes catégories)
-- ─────────────────────────────────────────────────────────────────────
('2026-05-31', 'Mix — Toutes catégories', '[
  {"question":"Quel est le nombre de doigts d''une patte de chien ?","choices":["3","4","5","6"],"correct":2},
  {"question":"Qui chante la chanson La Vie en Rose ?","choices":["Joséphine Baker","Édith Piaf","Charles Trenet","Mireille Mathieu"],"correct":1},
  {"question":"Quel est le plus grand pays d''Afrique par superficie ?","choices":["République Démocratique du Congo","Soudan","Libye","Algérie"],"correct":3},
  {"question":"Quel personnage de fiction est surnommé l''Homme araignée ?","choices":["Batman","Iron Man","Superman","Spider-Man"],"correct":3},
  {"question":"Quelle est la capitale de la Suisse ?","choices":["Genève","Lausanne","Berne","Zurich"],"correct":2},
  {"question":"Qui a écrit Germinal ?","choices":["Victor Hugo","Guy de Maupassant","Émile Zola","Honoré de Balzac"],"correct":2},
  {"question":"Quel est le plus grand stade de football du monde (capacité) ?","choices":["Camp Nou","Wembley","Maracanã","Narendra Modi Stadium"],"correct":3},
  {"question":"Quelle est la distance officielle d''un marathon ?","choices":["40 km","41,195 km","42,195 km","43 km"],"correct":2},
  {"question":"Quel pays a gagné la Coupe du Monde de football en 2018 ?","choices":["Brésil","Allemagne","Croatie","France"],"correct":3},
  {"question":"Quel est le personnage principal du roman L''Étranger de Camus ?","choices":["Jean-Baptiste Clamence","Meursault","Sisyphe","Caligula"],"correct":1}
]')

ON CONFLICT (date) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- FIN DU FICHIER — 31 jours × 10 questions = 310 questions au total
-- Pour le mois suivant : dupliquer ce fichier, changer les dates et
-- les questions, puis exécuter dans l''éditeur SQL Supabase.
-- ═══════════════════════════════════════════════════════════════════════
