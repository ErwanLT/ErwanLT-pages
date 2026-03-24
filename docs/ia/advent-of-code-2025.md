---
layout: "default"
title: "Advent of code 2025"
permalink: "/ia/advent-of-code-2025/"
tags: [adventofcode, ia]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/ia/advent-of-code-2025/"
banner: "https://www.sfeir.dev/content/images/2025/12/day2.png"
published_at: "2026-01-09"
sfeir_slug: "advent-of-code-2025"
date: "2026-01-09"
---
Je ne vais pas revenir ici sur l'histoire de l'[advent of code](https://www.sfeir.dev/tendances/les-coulisses-dadvent-of-code/), un super article sur le sujet peut être trouvé juste ici :


Les coulisses de l'AoC

Je ne vais pas non plus vous faire la description de comment fonctionne l'événement, ni vous dire qu'utiliser l'[IA](https://www.sfeir.dev/ia/chatgpt-a-3-ans-du-chatbot-viral-a-une-infrastructure-cle-de-lia-generative/) pour tenter de résoudre les problèmes est contraire au but du jeu, j'ai déjà écrit sur le sujet.

[IA generative vs Advent of code](/ia/ia-generative-vs-advent-of-code/)

D'autant plus qu'Eric Wastl en remet une couche dans la section about du site :

> [_Should I use AI to solve Advent of Code puzzles?_](https://adventofcode.com/2025/about?ref=sfeir.dev#faq_ai) No. If you send a friend to the gym on your behalf, would you expect to get stronger? Advent of Code puzzles are designed to be interesting for humans to solve - no consideration is made for whether AI can or cannot solve a puzzle. If you want practice prompting an AI, there are almost certainly better exercises elsewhere designed with that in mind.

Mais du coup de quoi vais-je bien pouvoir vous parler ?

Dans un premier temps, je parlerai des problèmes de cette année, des types de problèmes rencontrés, et de ceux qui m'ont fait me creuser sérieusement la cervelle au point de la faire fumer.

[![](https://media.tenor.com/vJED-qIRUK0AAAAC/brain-blast-jimmy-neutron.gif)](https://media.tenor.com/vJED-qIRUK0AAAAC/brain-blast-jimmy-neutron.gif)

Cerveau en éruption comme dirait Jimmy Neutron

Et dans un second temps, je testerai quelque chose qui comme dit précédemment va à l'encontre même des principes de l'Advent of Code, je mettrai au défi plusieurs modèles d'IA sur un problème donné de cette année, voir si ces derniers sont à la ramasse ou si finalement ils sont enfin performants sur ce genre d'énoncé.

## Récapitulatif des problèmes

Rassurez-vous, cette année il n'y a que 12 problèmes et non pas 25 comme les années précédentes.

- **Secret Entrance** : il faut trouver le mot de passe d'un coffre. Pour la partie 1, il s'agit de compter le nombre de fois que le cadran s'arrête sur 0. Pour la partie 2, il faut compter chaque fois que le cadran passe par 0 pendant les rotations.
- **Gift Shop** : il faut trouver des ID de produits invalides. Pour la partie 1, un ID est invalide s'il est composé d'une séquence répétée deux fois. Pour la partie 2, la règle s'étend à une séquence répétée au moins deux fois.
- **Lobby** : l'objectif est d'alimenter un escalator en combinant des tensions de batteries. Pour la partie 1, il faut créer le plus grand nombre avec deux chiffres de chaque ligne. Pour la partie 2, il faut utiliser douze chiffres.
- **Printing Department** : il faut optimiser le déplacement de rouleaux de papier. La partie 1 demande de compter les rouleaux accessibles (moins de 4 voisins). La partie 2 est un processus itératif : on retire les rouleaux accessibles et on recompte, l'objectif est de trouver le nombre total de rouleaux pouvant être retirés.
- **Cafeteria** : il faut gérer un inventaire. La partie 1 consiste à vérifier combien d'ID disponibles sont dans des plages d'ID "frais". La partie 2 demande de calculer le nombre total d'ID uniques considérés comme frais en fusionnant les plages.
- **Trash Compactor** : il faut résoudre une feuille de calcul. En partie 1, les nombres sont lus horizontalement. En partie 2, ils sont lus verticalement, colonne par colonne.
- **Laboratories** : il faut analyser la propagation de faisceaux dans un collecteur. La partie 1 demande de compter le nombre de divisions de faisceaux. La partie 2 interprète chaque division comme la création d'une nouvelle "timeline" et demande de compter le nombre total de timelines.
- **Playground** : il s'agit de connecter des boîtes de jonction. Pour la partie 1, on effectue les 1000 connexions les plus courtes et on calcule le produit de la taille des 3 plus grands circuits. Pour la partie 2, on continue jusqu'à ce que tout soit connecté et on s'intéresse à la dernière connexion établie.
- **Movie Theater** : l'objectif est de trouver le plus grand rectangle. En partie 1, le rectangle est défini par deux tuiles rouges sur une grille. En partie 2, le rectangle ne doit contenir que des tuiles rouges ou vertes, ajoutant une contrainte de confinement.
- **Factory** : il faut initialiser des machines avec des boutons. La partie 1 est un système binaire (lumières allumées / éteintes). La partie 2 est un système d'équations linéaires (incrémentation de compteurs de tension).
- **Reactor** : il faut compter des chemins dans un réseau. La partie 1 demande de trouver tous les chemins de `you` à `out`. La partie 2 demande de trouver les chemins de `svr` à `out` qui doivent obligatoirement passer par `dac` et `fft`.
- **Christmas Tree Farm** : la première partie consiste à résoudre un problème de rangement de formes complexes (type Tetris/Pentomino) dans des zones définies. La seconde partie est narrative et conclut l'aventure, il n'y a pas de nouveau défi technique.

### Le plus simple, et le plus complexe

À mon avis, le problème le plus simple de cette année était le **Jour 1 : Secret Entrance**. La raison est qu'il s'agit d'une simulation directe avec un état très simple (la position du cadran). La logique ne nécessite que des opérations arithmétiques de base (addition, soustraction et modulo) sans avoir besoin de structures de données ou d'algorithmes complexes.  
  
Le plus compliqué, selon moi, était le **Jour 12 : Christmas Tree Farm**. Il s'agit d'une variante du problème du bin packing (remplissage de boîtes), qui est connu pour être NP-difficile. La résolution exige la mise en œuvre d'un algorithme de recherche avec retour sur trace (backtracking) pour essayer de placer toutes les formes (polyominos) avec toutes leurs transformations possibles (rotations et retournements) dans une grille. Ce type de problème de "couverture exacte" est très coûteux en calcul et difficile à mettre en œuvre de manière performante.  
Le **Jour 10 : Factory**, avec sa nécessité de résoudre des systèmes d'équations linéaires, était également un concurrent sérieux pour le titre du plus complexe.

## IA vs advent of code

Après un lancer de dé à 12 faces, voici le problème tiré au sort

[![](https://www.sfeir.dev/content/images/2025/12/image-1.png)](https://www.sfeir.dev/content/images/2025/12/image-1.png)

On s'attaquera donc au problème numéro 3 : [**Lobby**](https://adventofcode.com/2025/day/3?ref=sfeir.dev)**.**

Pour mettre les différents modèles sur un pied d'égalité je vais respecter certaines conditions, pas d'IA intégré dans l'IDE, on part d'un contexte vierge, pas de modèle payant, on reste sur de l'accessible gratuit, et uniquement via le chat. Ils auront également tous le même prompt :

> Voici l'énoncé d'un problème, je veux que tu implémentes une solution en utilisant le langage java, l'input sera dans les resources du projet, le problème est en 2 parties, tu auras la partie 2 si ta solution donne la bonne réponse à la partie 1.

Et ça [sans la moindre menace pour la motiver](https://michaeldri.com/blog/marketing-digital/menacez-lia-selon-une-etude-elle-sameliorera/?ref=sfeir.dev).

Et pour ce qui est des modèles d'IA je vais mettre en compétition les points suivants :

- [ChatGPT 5.1](https://www.sfeir.dev/ia/etes-vous-poli-avec-chatgpt/)
- [Claude Sonnet 4.5](https://www.sfeir.dev/tag/claude/)
- [Gemini 3](https://www.sfeir.dev/tag/gemini-3/)
- [Le chat de Mistral](https://www.sfeir.dev/ia/il-etait-une-fois-le-chat-de-mistral-ai/)

Pour référence, le temps d'exécution de ma partie 1 est de **4ms** avec le code que j'ai mis en place pour résoudre le problème, et la réponse correcte est **17403**.

```log
[2025-12-12 15:48:10.428 ] Start : Lobby
[2025-12-12 15:48:10.432 ] Part 1 answer : 17403
[2025-12-12 15:48:10.433 ] Part 2 answer : 173416889848394
[2025-12-12 15:48:10.433 ] End
```

### ChatGPT

Assez rapidement une solution apparait dans la fenêtre de chat, avec une courte explication de ce que fait l'algorithme proposé :

**Pour chaque ligne (banque de batteries) :**

- on parcourt **toutes les paires (i, j)** avec `i < j`
- on construit le nombre `10 * bank[i] + bank[j]`
- on garde **le maximum**
- on additionne au total final

C’est une solution en O(n²) par ligne, largement suffisante ici.

```java
public class Day3Part1 {

    public static void main(String[] args) throws IOException {
        System.out.println("--- START PROCESSING ---");
        long startTime = System.nanoTime(); // Début du chronomètre
        // Chargement du fichier dans resources
        Path inputPath = Path.of("src/main/resources/day3.txt");
        List<String> lines = Files.readAllLines(inputPath);

        long total = 0;

        for (String bank : lines) {
            int best = computeBestJoltage(bank);
            total += best;
        }

        System.out.println("Part 1 answer : " + total);
        long endTime = System.nanoTime(); // Fin du chronomètre
        long durationMs = (endTime - startTime) / 1_000_000; // Conversion en millisecondes

        System.out.println("--- END PROCESSING ---");
        System.out.println("Execution time: " + durationMs + " ms");
    }

    /**
     * Calcule le meilleur nombre possible en choisissant deux chiffres
     * dans l'ordre du string (sans réarranger).
     */
    private static int computeBestJoltage(String bank) {
        int maxValue = 0;

        for (int i = 0; i < bank.length(); i++) {
            int d1 = bank.charAt(i) - '0';

            for (int j = i + 1; j < bank.length(); j++) {
                int d2 = bank.charAt(j) - '0';

                int value = d1 * 10 + d2;
                if (value > maxValue) {
                    maxValue = value;
                }
            }
        }

        return maxValue;
    }
}
```

La solution de chatGPT

Grâce aux lignes de log, l'on sait que le code s'est exécuté en **14ms**.

```log
--- START PROCESSING ---
Part 1 answer : 17403
--- END PROCESSING ---
Execution time: 14 ms
```

### Claude

Claude, comme chatGPT me propose tout de suite une solution, une fois sa solution fournie dans la fenêtre de chat, il m'explique ensuite comment fonctionne le code qu'il à créer.

**Explication de l'algorithme :**

1. **Lecture du fichier** : la méthode `readInputFromResources()` charge le fichier `input.txt` depuis le dossier `resources` du projet.
2. **Traitement de chaque banque** : pour chaque ligne (banque de batteries), on trouve le joltage maximum possible.
3. **Algorithme de recherche** : la fonction `findMaxJoltageForBank()` :
    - Parcourt toutes les paires possibles de positions (i, j) où i < j
    - Pour chaque paire, crée un nombre à 2 chiffres en prenant le digit à la position i (dizaines) et le digit à la position j (unités)
    - Garde trace du maximum trouvé
4. **Calcul du total** : on additionne les joltages maximums de toutes les banques.

```java
public class Day3Solution {
    
    public static void main(String[] args) {
        System.out.println("--- START PROCESSING ---");
        long startTime = System.nanoTime(); // Début du chronomètre
        try {
            List<String> lines = readInputFromResources("input.txt");
            int totalJoltage = solvePart1(lines);
            System.out.println("Part 1 - Total output joltage: " + totalJoltage);
        } catch (IOException e) {
            System.err.println("Error reading input file: " + e.getMessage());
            e.printStackTrace();
        } finally {
            long endTime = System.nanoTime(); // Fin du chronomètre
            long durationMs = (endTime - startTime) / 1_000_000; // Conversion en millisecondes

            System.out.println("--- END PROCESSING ---");
            System.out.println("Execution time: " + durationMs + " ms");
        }
    }
    
    /**
     * Calcule le joltage total en trouvant le maximum pour chaque banque
     */
    public static int solvePart1(List<String> lines) {
        int totalJoltage = 0;
        
        for (String line : lines) {
            int maxJoltage = findMaxJoltageForBank(line);
            totalJoltage += maxJoltage;
            System.out.println("Bank: " + line + " -> Max joltage: " + maxJoltage);
        }
        
        return totalJoltage;
    }
    
    /**
     * Trouve le joltage maximum pour une banque donnée en essayant toutes les paires possibles
     */
    private static int findMaxJoltageForBank(String bank) {
        int maxJoltage = 0;
        int n = bank.length();
        
        // Essayer toutes les paires de positions (i, j) où i < j
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                // Créer le nombre avec les deux chiffres aux positions i et j
                char digit1 = bank.charAt(i);
                char digit2 = bank.charAt(j);
                
                // Former le nombre à deux chiffres
                int joltage = (digit1 - '0') * 10 + (digit2 - '0');
                
                // Mettre à jour le maximum
                maxJoltage = Math.max(maxJoltage, joltage);
            }
        }
        
        return maxJoltage;
    }
    
    /**
     * Lit le fichier d'entrée depuis les resources
     */
    private static List<String> readInputFromResources(String filename) throws IOException {
        List<String> lines = new ArrayList<>();
        
        // Charger le fichier depuis les resources
        InputStream inputStream = Day3Solution.class.getClassLoader().getResourceAsStream(filename);
        
        if (inputStream == null) {
            throw new IOException("File not found in resources: " + filename);
        }
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    lines.add(line.trim());
                }
            }
        }
        
        return lines;
    }
}
```

code fourni par Claude

Grâce aux lignes de log, l'on sait que le code s'est exécuté en **17ms**.

```log
Part 1 - Total output joltage: 17403
--- END PROCESSING ---
Execution time: 17 ms
```

### Gemini

Gemini a analysé le problème et m'en fait une rapide description.

Cette solution part du principe que "vous ne pouvez pas réorganiser les batteries" signifie que l'ordre relatif des chiffres doit être respecté. Pour chaque ligne, nous devons trouver deux chiffres aux positions _i_ et _j_ (avec _i_ < _j_) qui maximisent la valeur 10 times chiffre[_i_] + chiffre[_j_].

```java
public class Day3LobbyPart1 {

    public static void main(String[] args) {
        System.out.println("--- START PROCESSING ---");
        long startTime = System.nanoTime(); // Début du chronomètre

        Day3LobbyPart1 solver = new Day3LobbyPart1();
        try {
            // Le fichier doit être dans src/main/resources/input.txt
            long result = solver.solve("input.txt");

            System.out.println("--- Day 3: Lobby (Part 1) ---");
            System.out.println("Total Output Joltage: " + result);

        } catch (IOException e) {
            System.err.println("Erreur lors de la lecture de l'input : " + e.getMessage());
        } finally {
            long endTime = System.nanoTime(); // Fin du chronomètre
            long durationMs = (endTime - startTime) / 1_000_000; // Conversion en millisecondes

            System.out.println("--- END PROCESSING ---");
            System.out.println("Execution time: " + durationMs + " ms");
        }
    }

    /**
     * Lit le fichier ligne par ligne et calcule la somme des joltages maximaux.
     */
    public long solve(String filename) throws IOException {
        InputStream is = getClass().getClassLoader().getResourceAsStream(filename);
        if (is == null) {
            throw new IOException("Fichier non trouvé dans les ressources : " + filename);
        }

        long totalJoltage = 0;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                totalJoltage += getMaxJoltageForBank(line.trim());
            }
        }
        return totalJoltage;
    }

    /**
     * Trouve le plus grand nombre à 2 chiffres formable en respectant l'ordre d'apparition.
     * Pour une banque donnée, on cherche max(d[i]*10 + d[j]) où i < j.
     */
    private int getMaxJoltageForBank(String bank) {
        int maxJoltage = 0;
        char[] digits = bank.toCharArray();

        // On parcourt tous les couples (i, j) possibles avec i < j
        for (int i = 0; i < digits.length; i++) {
            for (int j = i + 1; j < digits.length; j++) {
                int d1 = Character.getNumericValue(digits[i]);
                int d2 = Character.getNumericValue(digits[j]);
                
                int currentJoltage = d1 * 10 + d2;
                
                if (currentJoltage > maxJoltage) {
                    maxJoltage = currentJoltage;
                }
            }
        }
        return maxJoltage;
    }
}
```

solution à la partie 1 proposé par Gemini

Grâce aux lignes de log, l'on sait que le code n'a mis que **12ms** pour s’exécuter.

```log
--- START PROCESSING ---
--- Day 3: Lobby (Part 1) ---
Total Output Joltage: 17403
--- END PROCESSING ---
Execution time: 12 ms
```

### Le chat

Comme ces concurrents, le chat propose assez vite une solution avec une explication de son algorithme :

1. **Lire le fichier d'entrée** : chaque ligne du fichier représente une banque de batteries.
2. **Traiter chaque ligne** : pour chaque ligne, nous devons trouver les deux chiffres qui forment le plus grand nombre possible.
3. **Calculer le joltage maximal** : pour chaque banque, identifier les deux chiffres qui, combinés, donnent le plus grand nombre possible.
4. **Somme des joltages maximaux** : additionner les joltages maximaux de toutes les banques pour obtenir le résultat final.

```java
public class Lobby {

    public static void main(String[] args) {
        System.out.println("--- START PROCESSING ---");
        long startTime = System.nanoTime(); // Début du chronomètre
        List<String> banks = readInput("input.txt");
        int totalJoltage = 0;

        for (String bank : banks) {
            int maxJoltage = findMaxJoltage(bank);
            totalJoltage += maxJoltage;
        }

        System.out.println("Total output joltage: " + totalJoltage);
        long endTime = System.nanoTime(); // Fin du chronomètre
        long durationMs = (endTime - startTime) / 1_000_000; // Conversion en millisecondes

        System.out.println("--- END PROCESSING ---");
        System.out.println("Execution time: " + durationMs + " ms");
    }

    public static List<String> readInput(String fileName) {
        List<String> lines = new ArrayList<>();
        try (InputStream is = Lobby.class.getClassLoader().getResourceAsStream(fileName);
             BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return lines;
    }

    public static int findMaxJoltage(String bank) {
        int maxJoltage = 0;
        for (int i = 0; i < bank.length(); i++) {
            for (int j = i + 1; j < bank.length(); j++) {
                char c1 = bank.charAt(i);
                char c2 = bank.charAt(j);
                if (Character.isDigit(c1) && Character.isDigit(c2)) {
                    int joltage = (c1 - '0') * 10 + (c2 - '0');
                    if (joltage > maxJoltage) {
                        maxJoltage = joltage;
                    }
                }
            }
        }
        return maxJoltage;
    }
}
```

la solution du chat

Grâce aux lignes de log, l'on sait que le code a mis **20ms** pour s’exécuter.

```log
--- START PROCESSING ---
Total output joltage: 17403
--- END PROCESSING ---
Execution time: 20 ms
```

## Conclusion

Et la palme du code le plus performant est décernée à ... l'humain, aucun des algos proposé par les machines n'est aussi rapide que la solution mise en place de mon coté.

L'on peut aussi noter que les temps d'exécution des programme fournis par les IA sont dans la même fourchette de grandeur, entre **12** et **20ms.** Notons cependant que la solution la plus courte en termes de ligne de code est proposée par le papy de la bande : chatGPT.

Le hasard nous a fait tomber sur le problème du jour 3 qui en soi, est un problème simple, et qui comme je viens de le démontrer ne met pas en difficulté les IA modernes. Il aurait peut-être été préférable de les mettre au défi sur les problèmes des derniers jours, qui sait, je ferai peut être une seconde partie dessus.
