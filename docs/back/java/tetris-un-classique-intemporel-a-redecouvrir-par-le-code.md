---
layout: "default"
title: "Tetris - un classique intemporel à redécouvrir par le code"
permalink: "/back/java/tetris-un-classique-intemporel-a-redecouvrir-par-le-code/"
tags: [back, java, jeux-videos, tetris]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/tetris-un-classique-intemporel-a-redecouvrir-par-le-code/"
banner: "https://www.sfeir.dev/content/images/2025/06/tetris-1.png"
published_at: "2025-07-10"
sfeir_slug: "tetris-un-classique-intemporel-a-redecouvrir-par-le-code"
date: "2025-07-10"
---
Dans notre [série estivale](https://www.sfeir.dev/front/demineur-angular/) où l'on démonte les jeux de notre enfance pour les reconstruire pièce par pièce en explorant les frameworks modernes, on retrouve TETRIS !

Parmi les jeux vidéo les plus iconiques de l’histoire, Tetris occupe, évidemment une place à part. Derrière sa mécanique simple et son esthétique minimaliste, se cache un jeu captivant, capable de fasciner aussi bien les joueurs que les programmeurs. Aujourd’hui, je vous propose une incursion dans le code de Tetris, à travers une implémentation en [Java](/back/java/il-etait-une-fois-java/) avec Swing.  
Ce sera l’occasion de mêler histoire du jeu vidéo et développement.

## Une brève histoire de Tetris

[![](https://www.sfeir.dev/content/images/2025/06/image-14.png)](https://www.sfeir.dev/content/images/2025/06/image-14.png)

Alexei Pajitnov

**Tetris** voit le jour en **juin 1984**, dans les murs austères de l’**Académie des sciences de l’URSS**, à **Moscou**, en pleine Guerre froide. Son créateur, **Alexey Pajitnov**, mathématicien passionné de jeux de réflexion, travaillait alors au **Centre de calcul Dorodnitsyn**, un institut chargé d’explorer les applications informatiques. Inspiré par un jeu classique appelé **Pentomino**, consistant à assembler des formes composées de cinq carrés, Pajitnov imagine une variation simplifiée où les pièces, désormais formées de **quatre blocs carrés** (les _tétriminos_), tomberaient du haut de l’écran.

[![](https://www.sfeir.dev/content/images/2025/06/image-15.png)](https://www.sfeir.dev/content/images/2025/06/image-15.png)

Les formes du Pentomino

[![](https://www.sfeir.dev/content/images/2025/06/image-18.png)](https://www.sfeir.dev/content/images/2025/06/image-18.png)

Les tétriminos

Dans une Union soviétique encore méfiante envers les jeux électroniques, Pajitnov réalise pourtant son prototype sur un **Electronika 60**, un ordinateur sans interface graphique. Pour contourner cette limite, il représente les blocs avec des **espaces vides et des crochets**. L’enthousiasme dans son laboratoire est immédiat : ses collègues se relaient pour y jouer, fascinés par la simplicité et la profondeur du jeu.

[![](https://www.sfeir.dev/content/images/2025/06/image-16.png)](https://www.sfeir.dev/content/images/2025/06/image-16.png)

Un Electronika 60

Le bouche-à-oreille opère rapidement. Une version pour PC IBM est développée, puis exportée clandestinement vers l’Ouest. **En 1986**, Tetris devient le **premier logiciel soviétique officiellement vendu en Occident**, d’abord dans les pays de l’Est, puis en Europe et aux États-Unis. Ce succès soudain attire l'attention des éditeurs de jeux, déclenchant une **bataille juridique intense** entre plusieurs entreprises pour en obtenir les droits.

## Le succès de Tetris

Mais c’est en **1989**, avec son intégration en bundle avec la **Game Boy** de **Nintendo**, que Tetris entre véritablement dans la légende. Sa mécanique simple mais addictive en fait un compagnon idéal pour la petite console monochrome. Ce choix marketing génial assure le triomphe simultané de **Tetris** et de la **Game Boy**, unissant les générations autour d’un jeu sans texte, sans violence, sans frontières.

[![](https://www.sfeir.dev/content/images/2025/06/image-17.png)](https://www.sfeir.dev/content/images/2025/06/image-17.png)

Les jeunes de moins de 30 ans ne connaissent pas ce petit bijou

Tetris dépasse alors son statut de simple jeu : il devient un **phénomène culturel mondial**, un vecteur d’émotion et de stratégie, de compétition et de détente. Enraciné dans une époque révolue, né derrière le Rideau de fer, il réussit à transcender les idéologies, les langues et les technologies.

## Implémenter Tetris en Java

Voyons maintenant comment nous pouvons donner vie à ce jeu en **Java**, en utilisant **Swing** pour l’interface graphique.

### La structure du plateau

Nous définissons une grille de **10 colonnes par 20 lignes**, où chaque cellule peut être vide ou occupée par une couleur représentant un bloc :

```java
private static final int BOARD_WIDTH = 10;
private static final int BOARD_HEIGHT = 20;
private final Color[][] board;
```

Chaque élément du tableau est une couleur (ou `null`) : cela permet d'associer facilement une teinte à chaque _tétrimino_.

### Les formes (tétriminos)

Nous définissons un tableau de formes (`SHAPES`) et un tableau correspondant de couleurs (`COLORS`). Chaque forme est une matrice d'entiers représentant la présence ou non d’un bloc :

{% raw %}
```java
private static final Color[] COLORS = {
    Color.CYAN, Color.BLUE, Color.ORANGE, Color.YELLOW,
    Color.GREEN, Color.MAGENTA, Color.RED
};

private static final int[][][] SHAPES = {
    {{1, 1, 1, 1}},         // I
    {{1, 1, 1}, {0, 0, 1}}, // J
    {{1, 1, 1}, {1, 0, 0}}, // L
    {{1, 1}, {1, 1}},       // O
    {{0, 1, 1}, {1, 1, 0}}, // S
    {{1, 1, 1}, {0, 1, 0}}, // T
    {{1, 1, 0}, {0, 1, 1}}  // Z
};
```
{% endraw %}

Chaque forme est encapsulée dans une classe `Tetromino` :

```java
class Tetromino {
    int[][] shape;
    int x, y;
    Color color;

    Tetromino(int type) {
        shape = SHAPES[type];
        color = COLORS[type];
        x = BOARD_WIDTH / 2 - shape[0].length / 2;
        y = 0;
    }

    void move(int dx, int dy) {
        x += dx;
        y += dy;
    }

    void rotate() {
        int[][] newShape = new int[shape[0].length][shape.length];
        for (int i = 0; i < shape.length; i++) {
            for (int j = 0; j < shape[0].length; j++) {
                newShape[j][shape.length - 1 - i] = shape[i][j];
            }
        }
        if (isValidPosition(newShape, x, y)) {
            shape = newShape;
        }
    }
}
```

Cette classe gère également le déplacement (`move`) et la rotation des pièces.

### Le déroulement du jeu

L’implémentation repose sur un **Timer Swing** qui fait descendre la pièce actuelle toutes les 500 ms :

```java
timer = new Timer(500, e -> {
    if (gameStarted && !gameOver) {
        moveDown();
    }
});
```

Les déplacements (gauche, droite, bas, rotation) sont déclenchés par les touches fléchées, via un `KeyAdapter`.

```java
addKeyListener(new KeyAdapter() {
    @Override
    public void keyPressed(KeyEvent e) {
        if (!gameStarted) {
            if (e.getKeyCode() == KeyEvent.VK_SPACE) {
                startGame();
            }
            return;
        }
        if (gameOver) return;

        switch (e.getKeyCode()) {
            case KeyEvent.VK_LEFT -> movePiece(-1);
            case KeyEvent.VK_RIGHT -> movePiece(1);
            case KeyEvent.VK_DOWN -> moveDown();
            case KeyEvent.VK_UP -> currentPiece.rotate();
        }
        repaint();
    }
});
```

### Placer une pièce et effacer les lignes

Lorsque la pièce ne peut plus descendre, elle est "figée" dans le plateau :

```java
private void placePiece() {
    for (int i = 0; i < currentPiece.shape.length; i++) {
        for (int j = 0; j < currentPiece.shape[0].length; j++) {
            if (currentPiece.shape[i][j] != 0) {
                board[currentPiece.y + i][currentPiece.x + j] = currentPiece.color;
            }
        }
    }
}
```

Puis on vérifie si des lignes sont pleines. Si oui, on les efface et on fait descendre le reste :

```java
private int clearLines() {
    int lines = 0;
    for (int i = BOARD_HEIGHT - 1; i >= 0; i--) {
        boolean full = true;
        for (int j = 0; j < BOARD_WIDTH; j++) {
            if (board[i][j] == null) {
                full = false;
                break;
            }
        }
        if (full) {
            lines++;
            for (int k = i; k > 0; k--) {
                System.arraycopy(board[k-1], 0, board[k], 0, BOARD_WIDTH);
            }
            Arrays.fill(board[0], null);
            i++;
        }
    }
    return lines;
}
```

### Mise à jour du score et gestion de la difficulté

Un système de points est utilisé selon le nombre de lignes supprimées d’un coup :

```java
private void updateScore(int lines) {
    linesCleared += lines;
    switch (lines) {
        case 1 -> score += 40 * level;
        case 2 -> score += 100 * level;
        case 3 -> score += 300 * level;
        case 4 -> score += 1200 * level;
    }
    level = 1 + linesCleared / 10;
    timer.setDelay(Math.max(100, 500 - (level - 1) * 40));
}
```

Plus le niveau augmente, plus la vitesse du jeu s’accélère.

### Affichage du plateau

Le rendu graphique se fait dans la méthode `paintComponent`, où l’on dessine chaque cellule remplie, la pièce courante, la pièce suivante, ainsi que le score, le niveau et les lignes effacées :

```java
@Override
protected void paintComponent(Graphics g) {
    super.paintComponent(g);
    ...
    // Dessin de la grille et des pièces
}
```

Un petit panneau sur la droite permet d'afficher les informations du jeu et la _next piece_.

## Conclusion

Tetris incarne l'élégance d’un concept simple, mais infiniment profond. Derrière ses blocs colorés, il cache une mécanique redoutablement efficace, qui a traversé les époques sans perdre de son attrait.  
En l’implémentant en Java, on redécouvre la beauté d’un gameplay fondé sur la rigueur, la logique et la réactivité. Plus qu’un jeu, Tetris est une leçon intemporelle de design vidéoludique, un héritage que l’on prend plaisir à recréer, ligne après ligne.

[![](https://www.sfeir.dev/content/images/2025/06/image-19.png)](https://www.sfeir.dev/content/images/2025/06/image-19.png)

Notre petite implémentation
