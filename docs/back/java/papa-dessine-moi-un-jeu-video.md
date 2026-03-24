---
layout: "default"
title: "Papa, dessine-moi un jeu vidéo"
permalink: "/back/java/papa-dessine-moi-un-jeu-video/"
tags: [back, java]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/papa-dessine-moi-un-jeu-video/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2026/01/20260129_1530_Image-Generation_simple_compose_01kg52hgv6env9x448jvwzczxy.png"
published_at: "2026-03-06"
sfeir_slug: "papa-dessine-moi-un-jeu-video"
date: "2026-03-06"
---
Quand on parle de créer un jeu vidéo avec un enfant, on imagine parfois tout de suite des mondes immenses, des graphismes complexes, des moteurs sophistiqués.

Mais pour apprendre, il faut parfois faire l’inverse.

Revenir à l’essentiel.

Et s’il y a bien un jeu qui traverse les générations, les langages et les supports, c’est **PONG**.

## Mais pourquoi PONG ?

PONG, c’est la simplicité même :

- Deux raquettes
- Une balle
- Un terrain
- Des règles simples

Et pourtant, c’est déjà **un jeu vidéo complet**.

C’est aussi un jeu que beaucoup d’entre nous ont déjà programmé, un rite de passage :

- En C ou C++ en cours d’informatique (levez la main si vous êtes passé par là)
- Sur calculatrice Texas Instruments pour passer le temps en cours de maths 🤫

[![](https://www.sfeir.dev/content/images/2026/01/image-2.png)](https://www.sfeir.dev/content/images/2026/01/image-2.png)

On pouvait en coder des choses sur cette machine mine de rien

- Comme premier projet d’apprentissage
- Parfois même plusieurs fois, dans différents langages

Le programmer aujourd’hui avec son enfant, c’est créer un pont entre générations.

## Mais au fait, c'est quoi PONG ?

Sorti en 1972, Pong est souvent considéré comme le premier grand succès commercial du jeu vidéo, même s’il n’est pas techniquement le tout premier jeu vidéo de l’histoire. Son créateur, [Nolan Bushnell](https://fr.wikipedia.org/wiki/Nolan_Bushnell?ref=sfeir.dev), cofondateur d’Atari, avait une vision simple mais ambitieuse : transformer une technologie encore confidentielle en un divertissement accessible au grand public.

Pour concrétiser cette idée, Bushnell confie le projet à un jeune ingénieur, [Allan Alcorn](https://fr.wikipedia.org/wiki/Allan_Alcorn?ref=sfeir.dev). L’objectif initial est presque anodin : créer un jeu simple inspiré du tennis de table, dans lequel deux joueurs renvoient une balle à l’aide de palettes. Le concept paraît minimaliste, mais il est redoutablement efficace. Très vite, Pong devient un phénomène culturel, notamment grâce à son gameplay immédiat, compréhensible en quelques secondes par n’importe qui (**y compris de jeunes enfants**).

[![](https://www.sfeir.dev/content/images/2026/01/image-4.png)](https://www.sfeir.dev/content/images/2026/01/image-4.png)

On connaît tous cet écran

La première borne est installée dans un bar californien en 1972. Quelques jours plus tard, le patron appelle Atari pour signaler une panne… qui n’en était pas une : la machine était simplement saturée de pièces de monnaie. Ce succès fulgurant confirme qu’Atari tient quelque chose d’unique.

[![](https://www.sfeir.dev/content/images/2026/01/image-3-1.png)](https://www.sfeir.dev/content/images/2026/01/image-3-1.png)

"Sa place est dans un musée", dirait un célèbre archéologue

## Construire PONG en [Java](/back/java/il-etait-une-fois-java/) - comprendre le programme bloc par bloc

### La fenêtre et le panneau principal

On commence par créer une classe qui hérite de `JPanel` et qui va tout gérer : affichage, mise à jour, entrées clavier.

```java
public class Pong extends JPanel implements ActionListener {
    private static final int WINDOW_WIDTH = 800;
    private static final int WINDOW_HEIGHT = 600;

    public Pong() {
        setPreferredSize(new Dimension(WINDOW_WIDTH, WINDOW_HEIGHT));
        setBackground(Color.BLACK);

        Timer timer = new Timer(16, this); // ~60 FPS
        timer.start();

        addKeyListener(...);
        setFocusable(true);
    }
    
    // ... suite du code
}
```

C’est le cœur du programme : un panneau noir, un timer pour les mises à jour fluides, et la possibilité de capter les touches.

Le choix de swing est délibéré pour garder un côté rétro.

### Les constantes du jeu (les tailles et vitesses)

Regrouper toutes les valeurs fixes au début permet de les modifier facilement.

```java
private static final int PADDLE_WIDTH = 10;
private static final int PADDLE_HEIGHT = 60;
private static final int BALL_SIZE = 15;
private static final int PADDLE_SPEED = 6;
private static final int AI_PADDLE_SPEED = 5;
private static final int PADDLE_X_OFFSET = 50;

private static final int INITIAL_BALL_SPEED = 5;
private static final double BALL_SPEED_INCREASE_FACTOR = 1.05;
private static final double MAX_BALL_SPEED = 15;
private static final int MAX_BOUNCE_Y_SPEED = 7;

private static final int GAME_DURATION_MS = 60 * 1000; // 1 minute
```

### Les variables d’état du jeu

On utilise des doubles pour la balle afin d’avoir une meilleure précision lors des petits déplacements.

```java
private double ballX = WINDOW_WIDTH / 2.0;
private double ballY = WINDOW_HEIGHT / 2.0;
private double ballXSpeed = INITIAL_BALL_SPEED;
private double ballYSpeed = INITIAL_BALL_SPEED;

private int paddle1Y = WINDOW_HEIGHT / 2 - PADDLE_HEIGHT / 2;
private int paddle2Y = WINDOW_HEIGHT / 2 - PADDLE_HEIGHT / 2;

private int score1 = 0;
private int score2 = 0;

private boolean p1_up, p1_down, p2_up, p2_down;
private boolean soloMode = false;
private boolean gameStarted = false;
private boolean gameOver = false;
```

### Le menu de sélection de mode

Avant de lancer la partie, on affiche un petit menu avec deux choix : Solo (vs IA) ou 2 joueurs (notre cible pour jouer avec nos chères têtes blondes).

```java
private int menuSelection = 0; // 0 = Solo, 1 = 2 joueurs

private void handleMenuKeyPress(KeyEvent e) {
    if (e.getKeyCode() == KeyEvent.VK_UP) {
        menuSelection = 0;
    } else if (e.getKeyCode() == KeyEvent.VK_DOWN) {
        menuSelection = 1;
    } else if (e.getKeyCode() == KeyEvent.VK_ENTER) {
        soloMode = (menuSelection == 0);
        gameStarted = true;
        startTime = System.currentTimeMillis();
    }
}
```

L’affichage se fait dans `drawMenu()` avec un curseur jaune pour indiquer la sélection.

### Gestion des touches (contrôles)

On utilise des booléens pour savoir quelles touches sont enfoncées (plus fluide qu’un switch à chaque frame).

Joueur 1 → **Z** (haut) / **S** (bas)  
Joueur 2 → **Flèche haut** / **Flèche bas**

```java
private void handleInGameKeyPress(KeyEvent e) {
    switch (e.getKeyCode()) {
        case KeyEvent.VK_Z:    p1_up   = true; break;
        case KeyEvent.VK_S:    p1_down = true; break;
        case KeyEvent.VK_UP:   p2_up   = true; break;
        case KeyEvent.VK_DOWN: p2_down = true; break;
    }
}
```

Et on les remet à false dans keyReleased.

### La boucle principale - actionPerformed

C’est ici que tout se passe 60 fois par seconde :

```java
@Override
public void actionPerformed(ActionEvent e) {
    if (gameStarted && !gameOver) {
        updateGame();
    }
    repaint();
}

private void updateGame() {
    if (System.currentTimeMillis() - startTime >= GAME_DURATION_MS) {
        gameOver = true;
        return;
    }
    movePaddles();
    moveBall();
    checkCollisions();
}
```

### Déplacement des raquettes

Séparé en deux cas : joueur ou IA.

```java
private void movePaddles() {
    // Joueur 1 (gauche)
    if (p1_up   && paddle1Y > 0)               paddle1Y -= PADDLE_SPEED;
    if (p1_down && paddle1Y < WINDOW_HEIGHT - PADDLE_HEIGHT) paddle1Y += PADDLE_SPEED;

    if (soloMode) {
        // IA très simple (suit la balle)
        if (paddle2Y + PADDLE_HEIGHT / 2 < ballY) paddle2Y += AI_PADDLE_SPEED;
        if (paddle2Y + PADDLE_HEIGHT / 2 > ballY) paddle2Y -= AI_PADDLE_SPEED;
    } else {
        // Joueur 2 (droite)
        if (p2_up   && paddle2Y > 0)               paddle2Y -= PADDLE_SPEED;
        if (p2_down && paddle2Y < WINDOW_HEIGHT - PADDLE_HEIGHT) paddle2Y += PADDLE_SPEED;
    }
}
```

### Déplacement et rebonds de la balle

La physique de base est très simple :

```java
private void moveBall() {
    ballX += ballXSpeed;
    ballY += ballYSpeed;
}

private void checkCollisions() {
    // Haut et bas
    if (ballY <= 0 || ballY >= WINDOW_HEIGHT - BALL_SIZE) {
        ballYSpeed = -ballYSpeed;
    }

    // Collision raquettes → (voir partie suivante)

    // Sortie gauche → point pour joueur 2
    if (ballX <= 0) {
        score2++;
        resetBall();
    }
    // Sortie droite → point pour joueur 1
    if (ballX >= WINDOW_WIDTH - BALL_SIZE) {
        score1++;
        resetBall();
    }
}
```

### Collision avec les raquettes (point clé du feeling)

C’est la partie la plus importante pour le gameplay :

```java
private void handlePaddleCollision(int paddleY, boolean isLeftPaddle) {
    // Inversion et accélération
    if (Math.abs(ballXSpeed) < MAX_BALL_SPEED) {
        ballXSpeed *= -BALL_SPEED_INCREASE_FACTOR;
    } else {
        ballXSpeed = -ballXSpeed;
    }

    // Angle selon l'endroit où on touche la raquette
    double relativeIntersectY = (paddleY + PADDLE_HEIGHT / 2.0) - (ballY + BALL_SIZE / 2.0);
    double normalized = relativeIntersectY / (PADDLE_HEIGHT / 2.0);
    ballYSpeed = normalized * -MAX_BOUNCE_Y_SPEED;

    // Anti-colle
    ballX = isLeftPaddle 
        ? PADDLE_X_OFFSET + PADDLE_WIDTH 
        : WINDOW_WIDTH - PADDLE_X_OFFSET - PADDLE_WIDTH - BALL_SIZE;
}
```

#### Calcul de l’angle de rebond

```java
// 1. Point d’impact relatif (centre raquette - centre balle)
double relativeY = (paddleY + PADDLE_HEIGHT / 2.0) - (ballY + BALL_SIZE / 2.0);

// 2. Normalisation → valeur entre -1 (haut) et +1 (bas)
double normalized = relativeY / (PADDLE_HEIGHT / 2.0);

// 3. Vitesse Y proportionnelle → plus on touche loin du centre, plus l’angle est fort
ballYSpeed = normalized * -MAX_BOUNCE_Y_SPEED;   // le - inverse haut/bas
```

```text
       Haut ──────────────  normalized ≈ -1.0  → ballYSpeed ≈ +7   (monte fort)
            │
            │   Un peu haut   ≈ -0.5         → +3.5
            │
   MILIEU ──┼─────────────────  0.0          → 0 (horizontal)
            │
            │   Un peu bas     ≈ +0.5         → -3.5
            │
       Bas  ──────────────   +1.0            → -7   (descend fort)
```

Plus la balle touche loin du centre de la raquette → plus l’angle est prononcé.  
La formule transforme la position relative en vitesse verticale contrôlable.

## Conclusion

Programmer Pong aujourd’hui, ce n’est pas seulement écrire quelques lignes de code.

C’est comprendre comment un jeu vit, réagit, et devient amusant avec presque rien : un peu de logique, un peu de mathématiques, et beaucoup d’essais.

C’est aussi redécouvrir une époque où la contrainte technique obligeait à aller à l’essentiel. Là où chaque pixel comptait. Là où chaque comportement devait être pensé simplement, mais intelligemment.

Et c’est peut-être ça, la vraie richesse d’un projet comme Pong.
