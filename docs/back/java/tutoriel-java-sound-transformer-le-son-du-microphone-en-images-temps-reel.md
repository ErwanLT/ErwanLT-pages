---
layout: "default"
title: "Tutoriel Java Sound - transformer le son du microphone en images temps réel"
permalink: "/back/java/tutoriel-java-sound-transformer-le-son-du-microphone-en-images-temps-reel/"
tags: [back, java, music]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/tutoriel-java-sound-transformer-le-son-du-microphone-en-images-temps-reel/"
banner: "https://www.sfeir.dev/content/images/2025/10/20251016_1306_Pixelated-Java-DJ-Vibes_simple_compose_01k7pb204rfx99sqpf1npky019.png"
published_at: "2025-11-18"
sfeir_slug: "tutoriel-java-sound-transformer-le-son-du-microphone-en-images-temps-reel"
date: "2025-11-18"
---
Le son dans une application n'est pas toujours qu'une simple lecture d'un fichier MP3. Et si on pouvait voir la musique ? Ou analyser les bruits ambiants captés par notre micro ? La bonne nouvelle, c'est que [Java](/back/java/il-etait-une-fois-java/), via son API **Java Sound**, nous donne tous les outils nécessaires pour le faire.

Dans cet article, nous allons construire une application Swing qui capture le son du microphone en temps réel et affiche son **spectre de fréquences**. C'est ce que l'on appelle un visualiseur de spectre audio.

Allez, on plonge !

## Le projet : Capturer / Analyser / Dessiner

Notre objectif est simple en apparence, mais il se décompose en trois grandes étapes techniques :

1. **Capturer l'audio** : Nous allons ouvrir une ligne d'entrée audio (le microphone) et lire les données sonores brutes en continu.
2. **Analyser les fréquences** : C'est le cœur du projet. Les données audio brutes sont une onde dans le temps. Pour savoir quelles fréquences (basses, médiums, aigus) la composent, nous devons la transformer. Pour cela, nous utiliserons un algorithme puissant : la [**Transformée de Fourier Rapide (FFT)**](https://fr.wikipedia.org/wiki/Transformation_de_Fourier_rapide?ref=sfeir.dev).
3. **Dessiner le spectre** : Une fois les intensités de chaque fréquence obtenues, nous les dessinerons à l'écran sous forme de barres colorées et dynamiques à l'aide de Swing.

## L'API Java Sound : votre boîte à outils audio

Avant de coder, comprenons nos outils. L'API Java Sound (`javax.sound.sampled`) peut sembler intimidante, mais elle s'articule autour de quelques concepts clés, un peu comme un studio d'enregistrement.

- **`AudioSystem`** : C'est le **chef d'orchestre**. C'est la classe principale qui vous donne accès à tout le reste. Vous lui demandez un micro, des haut-parleurs, ou des informations sur les formats audio, et il vous les fournit. C'est votre unique point d'entrée.
- **`Mixer`** : Représente un **périphérique audio**. Votre carte son est un mixer, votre microphone USB en est un autre. Un mixer peut avoir des lignes d'entrée (pour la capture) et/ou de sortie (pour la lecture).
- **`Line`** : C'est le **"canal"** par lequel transitent les données audio. C'est le concept le plus important. Il existe plusieurs types de lignes :
    - **`TargetDataLine`** : Une ligne d'**entrée** (IN). Elle capture les données audio depuis un mixer (ex: un microphone). Le mot "Target" (cible) signifie que votre application est la _cible_ des données. **C'est ce que nous utiliserons**.
    - **`SourceDataLine`** : Une ligne de **sortie** (OUT). Elle envoie des données audio vers un mixer (ex: des haut-parleurs). "Source" signifie que votre application est la _source_ des données.
    - **`Clip`** : Une ligne spéciale qui charge des données audio **en mémoire** avant de les jouer. Parfait pour des sons courts et répétés comme des effets sonores dans un jeu, car la lecture est instantanée.
- **`AudioFormat`** : C'est la **carte d'identité du son**. Cet objet décrit précisément la nature des données audio qui circulent dans une `Line`. Ses principaux attributs sont :
    - **Taux d'échantillonnage** (`sampleRate`) : Le nombre "d'instantanés" du son pris par seconde (ex: 44100 Hz pour une qualité CD).
    - **Taille de l'échantillon** (`sampleSizeInBits`) : La précision de chaque instantané (ex: 16 bits).
    - **Canaux** (`channels`) : 1 pour mono, 2 pour stéréo.
    - **Signé/Non signé** et **Big/Little Endian** : Des détails techniques sur le formatage des octets.

En résumé, le workflow est presque toujours le même :

1. On définit l'**`AudioFormat`** que l'on souhaite.
2. On demande à **`AudioSystem`** de nous donner une `**Line**` (par exemple, une `TargetDataLine`) compatible avec ce format.
3. On ouvre la ligne, on la démarre, puis on lit (`read()`) ou on écrit (`write()`) les données audio.

## Capturer le son du micro

La première étape consiste à accéder au microphone. Avec notre connaissance de l'API Java Sound, le code devient plus facile à lire. Le travail se fera dans un `Thread` séparé pour ne pas bloquer l'interface graphique.

```java
Thread captureThread = new Thread(() -> {
    try {
        // 1. Définir le format audio
        AudioFormat format = new AudioFormat(AudioConstants.SAMPLE_RATE, 16, 1, true, false);
        
        // 2. Obtenir la ligne du micro
        DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);
        TargetDataLine line = (TargetDataLine) AudioSystem.getLine(info);
        line.open(format, AudioConstants.SAMPLE_COUNT * AudioConstants.BYTES_PER_SAMPLE * 2);
        line.start();

        byte[] buffer = new byte[AudioConstants.SAMPLE_COUNT * AudioConstants.BYTES_PER_SAMPLE];

        // 3. Boucle de lecture
        while (running.get()) {
            int bytesRead = line.read(buffer, 0, buffer.length);
            if (bytesRead <= 0) continue;

            // ... traitement des données ...
        }

        line.stop();
        line.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
});
captureThread.start();
```

- `**AudioFormat**` : On définit la qualité du son qu'on souhaite capturer. Ici, un taux d'échantillonnage de `9600`0 `Hz` (qualité haute résolution), des échantillons de `16 bits`, `1` canal (mono), signé (`true`), et en "big-endian" (`false`).
- `**TargetDataLine**` : C'est l'objet qui représente une ligne d'entrée audio, comme notre microphone. On l'obtient via `AudioSystem`.
- `**line.read(buffer, ...)**` : C'est l'appel crucial. Il bloque jusqu'à ce que le buffer (tampon) soit rempli de données audio provenant du micro, puis il continue. Tout se passe dans une boucle `while` pour une capture en continu.

Une fois les octets (`byte[]`) lus, il faut les transformer en valeurs numériques manipulables (`double[]`). Chaque échantillon 16 bits est composé de deux octets que nous combinons et normalisons entre `-1.0` et `1.0`.

```java
// Conversion de bytes en samples (doubles)
for (int i = 0, s = 0; s < samplesRead; i += 2, s++) {
    int low = buffer[i] & 0xFF;
    int high = buffer[i + 1];
    int value = (high << 8) | low; // Combiner les deux octets
    samples[s] = value / 32768.0;   // Normaliser
}
```

## La magie de la FFT : Voir les fréquences cachées

Maintenant que nous avons un tableau de "samples" représentant l'onde sonore, comment en extraire les fréquences ?

Imaginez un accord de piano. Votre oreille entend une note unique, mais en réalité, c'est un mélange complexe d'une fréquence fondamentale et de plusieurs harmoniques. La [**Transformée de Fourier**](https://fr.wikipedia.org/wiki/Transformation_de_Fourier?ref=sfeir.dev) est un outil mathématique qui agit comme un prisme : elle prend un signal complexe (la lumière blanche, l'onde sonore) et le décompose en ses constituants simples (les couleurs de l'arc-en-ciel, les fréquences).

La **FFT (Fast Fourier Transform)** est un algorithme qui calcule cette transformation de manière très efficace.

```java
// Dans la boucle de capture
double[] newMagnitudes = computeFFT(samples);
```

La méthode `computeFFT` est une implémentation de cet algorithme. Il est inutile de comprendre chaque ligne de calcul, mais il faut retenir ce qu'elle fait :

- **En entrée** : Un tableau de `double` représentant l'amplitude du son dans le temps.
- **En sortie** : Un tableau de `double` représentant l'**intensité** (la magnitude) de chaque "bande" de fréquence.

Le premier élément du tableau de sortie correspond aux fréquences les plus basses (les basses), et le dernier aux plus hautes (les aigus).

## Mettre en scène : la visualisation avec Swing

Maintenant que nous avons nos magnitudes de fréquences, il ne reste "plus qu'à" les dessiner ! Notre classe hérite de `JPanel`, nous allons donc surcharger la méthode `paintComponent`.

```java
@Override
protected void paintComponent(Graphics g) {
    super.paintComponent(g);
    if (magnitudes == null) return;

    Graphics2D g2 = (Graphics2D) g;
    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

    int w = getWidth();
    int h = getHeight();
    g2.setColor(Color.BLACK);
    g2.fillRect(0, 0, w, h);

    int len = magnitudes.length;
    double max = Arrays.stream(magnitudes).max().orElse(1);

    // Using a logarithmic scale for the x-axis
    double logBase = Math.log(len);

    for (int i = 1; i < len; i++) { // Start from 1 to avoid log(0)
        double norm = magnitudes[i] / max;
        int barHeight = (int) (norm * h);

        // Calculate x position on a logarithmic scale
        double log_i = Math.log(i);
        int x = (int) (w * log_i / logBase);

        // Couleur dynamique (vert → jaune → rouge)
        float hue = (float) (0.33 - norm * 0.33); // 0.33=vert, 0.0=rouge
        g2.setColor(Color.getHSBColor(hue, 1.0f, 1.0f));

        g2.drawLine(x, h, x, h - barHeight);
    }

    g2.setColor(Color.WHITE);
    g2.drawString("Spectre Audio (Log) — " + (int) (AudioConstants.SAMPLE_RATE / 2) + " Hz", 10, 20);
}
```

Un `Timer` Swing appelle la méthode `repaint()` à une fréquence régulière (ici, environ 30 fois par seconde), ce qui redessine le composant et crée l'animation.

### Les petits plus qui font la différence

Notre code de rendu contient deux astuces très importantes :

- **L'échelle logarithmique** : l'oreille humaine ne perçoit pas les fréquences de manière linéaire. Nous sommes beaucoup plus sensibles aux variations dans les basses fréquences que dans les hautes. Pour que notre visualiseur soit plus "naturel", nous utilisons une échelle logarithmique sur l'axe des X. Les basses fréquences prennent plus de place à l'écran.

```java
// Calcul de la position x sur une échelle logarithmique
double log_i = Math.log(i);
int x = (int) (w * log_i / logBase);
```

- **Des couleurs qui dansent** : une barre qui change de couleur en fonction de son intensité, c'est bien plus joli ! On utilise le modèle de couleur HSB (Hue, Saturation, Brightness). En faisant varier la teinte (Hue) du vert (0.33) vers le rouge (0.0) lorsque l'intensité augmente, on obtient un dégradé dynamique.

```java
// Couleur dynamique (vert → jaune → rouge)
float hue = (float) (0.33 - norm * 0.33);
g2.setColor(Color.getHSBColor(hue, 1.0f, 1.0f));
```

- **Un lissage pour la fluidité** : pour éviter que les barres ne "sautillent" de manière trop agressive, on applique un lissage exponentiel. Chaque nouvelle valeur est une moyenne pondérée entre l'ancienne et la nouvelle, ce qui adoucit le mouvement.

```java
smoothedMagnitudes[i] = 0.8 * smoothedMagnitudes[i] + 0.2 * newMagnitudes[i];
```

## Et ça donne quoi ?

Maintenant il nous reste plus qu'à lancer notre programme, mettre de la musique et voir notre nostalgie de W[indows](https://www.sfeir.dev/tendances/il-etait-une-fois-microsoft/) Media Player refaire surface.

notre visualiseur en action

## Conclusion

Nous avons vu comment, avec un peu de code, on peut passer de la simple capture audio à une visualisation de données complexe et esthétique. Nous avons manipulé l'API Java Sound, implémenté une FFT et utilisé Swing pour un rendu dynamique.

Que faire ensuite ?

- **Analyser un fichier audio** au lieu du microphone en utilisant `AudioInputStream`.
- **Changer le type de visualisation** : un oscillogramme, un cercle, des vagues...
- **Détecter des notes** spécifiques en cherchant des pics à des fréquences précises.

Le champ des possibles est immense. Alors, à vous de jouer !
