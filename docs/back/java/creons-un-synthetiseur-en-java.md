---
layout: "default"
title: "Créons un synthétiseur en Java"
permalink: "/back/java/creons-un-synthetiseur-en-java/"
tags: [back, java, musique]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/creons-un-synthetiseur-en-java/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/10/20251019_0930_Pixelated-Synth-Symphony_simple_compose_01k7xnvz5dfw6a9vvpc7cr9xwj.png"
published_at: "2026-02-25"
sfeir_slug: "creons-un-synthetiseur-en-java"
date: "2026-02-25"
---
Dans un [précédent article](/back/java/tutoriel-java-sound-transformer-le-son-du-microphone-en-images-temps-reel/), nous avions exploré la ****capture et l’analyse du son**** dans un programme Java. Nous avions vu comment récupérer un signal audio via un microphone et l’afficher sous forme d’onde, ouvrant ainsi la voie à des applications d’enregistrement, de détection de fréquence ou de visualisation en temps réel.

Aujourd’hui, nous franchissons le pas inverse : ****produire du son****.  
Là où le microphone transformait les vibrations de l’air en signaux électriques, notre objectif est désormais de faire l’inverse : transformer des données numériques en une onde sonore audible. Pour cela, rien de tel que de construire un ****petit synthétiseur****, directement en [Java](/back/java/il-etait-une-fois-java/).

Mais avant d’entrer dans le code, rappelons brièvement ce que nous manipulons réellement : ****le son lui-même****.

## Un peu de physique — comprendre ce qu’est le son

Faites appel à votre mémoire et à vos cours de physique au collège / lycée, ****qu'est ce que le son ?****

### Une onde avant tout

Le ****son**** n’est rien d’autre qu’une ****vibration de l’air****. Lorsqu’un objet oscille (une corde, une membrane, une colonne d’air), il provoque de petites variations de pression qui se propagent dans le milieu. Ces variations, captées par notre oreille, sont interprétées comme des sons.

En physique, on modélise le son comme une ****onde périodique****.  
Cette onde peut être représentée sous forme d’un signal variant dans le temps — exactement ce que nos ordinateurs manipulent lorsqu’ils traitent du son numérique.

### La fréquence — ou la hauteur du son

Chaque son est défini par sa ****fréquence****, exprimée en ****Hertz (Hz)****.  
C’est le nombre d’oscillations par seconde. Par exemple :

- un ****La 4**** correspond à 440 Hz ;
- un ****Do 4**** se situe autour de 261,63 Hz ;
- plus la fréquence est élevée, plus le son est aigu.

Dans notre synthétiseur, chaque touche correspondra à une fréquence précise, que nous retrouverons dans une table de correspondance appelée `AudioConstants.noteFrequencies`.

### Les différentes formes d’onde

La forme de l’onde influence le ****timbre**** du son.  
Voici les plus courantes :

- ****Sinusoïdale (Sine)**** : onde pure, douce, proche d’un diapason.
- ****Carrée (Square)**** : son plus métallique, riche en harmoniques impaires.
- ****Triangulaire (Triangle)**** : plus douce que la carrée, intermédiaire.
- ****Dent de scie (Sawtooth)**** : très riche en harmoniques, souvent utilisée pour les sons de cordes ou de synthés analogiques.

![](https://www.sfeir.dev/content/images/2025/10/image-15.png)

les différentes formes d'ondes (source wikipedia)

Ces quatre formes d’onde constituent la base de la synthèse sonore dite ****subtractive****, que nous allons reproduire en Java.

## Mise en place du synthétiseur

### Architecture générale

Notre application Java repose sur ****Swing**** pour la partie interface graphique et sur la ****Java Sound API**** pour la génération et la diffusion du son.

Nous avons quatre classes principales :

1. **`**AudioConstants**`** : définit les constantes audio (fréquences, forme d’onde, taux d’échantillonnage).
2. **`**SynthControlsPanel**`** : les contrôles du synthétiseur (attaque, relâchement, filtre, forme d’onde).
3. **`**PianoKeyboardPanel**`** : le clavier virtuel permettant de jouer avec le clavier de l’ordinateur.
4. **`**Synthesiser**`** : la classe principale, qui orchestre le tout et gère les voix polyphoniques.

## La classe `AudioConstants` — Fondations harmoniques du synthétiseur

Avant même de produire un son, il est nécessaire d’en définir le ****langage**** : celui des fréquences et des formes d’ondes.  
La classe `AudioConstants` joue ce rôle fondamental. Il s’agit d’une ****classe utilitaire**** qui centralise les éléments immuables liés à la génération sonore : fréquence d’échantillonnage, types d’ondes et table de correspondance entre les notes et leurs fréquences.

### La fréquence d’échantillonnage

```java
public static final float SAMPLE_RATE = 96000f;
```

Cette constante fixe la ****fréquence d’échantillonnage**** à 96 kHz, c’est-à-dire que chaque seconde de son est découpée en 96 000 points.  
Plus cette fréquence est élevée, plus le son restitué est précis et fidèle, notamment pour les signaux à haute fréquence.

En comparaison :

- Les CD audio utilisent une fréquence standard de ****44,1 kHz****.
- Les productions professionnelles peuvent monter à ****96 kHz**** ou ****192 kHz****, comme ici.

Cette valeur influe directement sur la qualité du son et sur les calculs de génération dans la classe `Synthesiser`, où chaque période d’onde est traduite en un certain nombre d’échantillons numériques.

### Les types de formes d'ondes

```java
public enum Waveform {
    SINE, SQUARE, TRIANGLE, SAWTOOTH
}
```

Cet `enum` définit les ****formes d’onde élémentaires**** que le synthétiseur est capable de générer.  
Chaque forme d’onde correspond à une structure mathématique distincte et produit une ****timbre**** différent à l’oreille :

C’est ce paramètre qui est sélectionné par l’utilisateur dans le panneau de contrôle (`SynthControlsPanel`) pour modeler la texture du son généré.

La table de fréquences musicales

```java
public static final Map<String, Double> noteFrequencies = new HashMap<>();

    static {
        // Pre-populate note frequencies, grouped by note name

        // A Notes
        noteFrequencies.put("A0", 27.50);
        noteFrequencies.put("A#0", 29.14);
        noteFrequencies.put("Ab1", 51.91);
        noteFrequencies.put("A1", 55.00);
        noteFrequencies.put("A#1", 58.27);
        noteFrequencies.put("Ab2", 103.83);
        noteFrequencies.put("A2", 110.00);
        noteFrequencies.put("A#2", 116.54);
        noteFrequencies.put("Ab3", 207.65);
        noteFrequencies.put("A3", 220.00);
        noteFrequencies.put("A#3", 233.08);
        noteFrequencies.put("Ab4", 415.30);
        noteFrequencies.put("A4", 440.00);
        noteFrequencies.put("A#4", 466.16);

        ...
    }
```

Le cœur de `AudioConstants` réside dans cette ****carte de correspondance entre les notes et leurs fréquences****.  
Elle associe des noms de notes (ex. `A4` pour le La du diapason) à leurs fréquences en Hertz.

Cette table permet au synthétiseur de ****traduire une touche jouée**** (par exemple la touche `A` du clavier d’ordinateur) en une fréquence précise, qui servira ensuite à calculer la forme d’onde correspondante.

****Exemple**** :

- `A4` → 440 Hz
- `C4` → 261,63 Hz
- `E5` → 659,26 Hz

En pratique, lorsqu’une touche est pressée dans `PianoKeyboardPanel`, le programme récupère le nom de la note correspondante (`"C4"`, `"E4"`, etc.) puis lit sa fréquence dans ce dictionnaire.  
Cette fréquence devient l’argument de base de la génération du signal audio dans le moteur (`Synthesiser`).

### Rôle dans l’architecture globale

`AudioConstants` agit comme un ****socle commun**** reliant la théorie du son et l’implémentation logicielle.

Cette classe relie donc les ****concepts physiques du son**** (onde, fréquence, timbre) à leur ****représentation numérique**** au sein du programme.  
Sans elle, le synthétiseur n’aurait ni étalon de fréquence, ni base cohérente pour produire un son harmonieux.

## La classe `SynthControlsPanel` — L’art du contrôle sonore

Une fois les constantes établies avec `AudioConstants`, il nous faut offrir à l’utilisateur une interface pour ****façonner le son****.  
C’est le rôle de la classe `SynthControlsPanel`.  
Elle représente le ****panneau de commande**** du synthétiseur : l’endroit où l’on choisit la forme d’onde, le pitch, et les paramètres d’enveloppe ou de filtre.

Swing n'offrant pas de composant de type potentiomètre, on se contentera ici de sliders.

### Structure et composants déclarés

```java
private final JSlider attackSlider, releaseSlider, pitchSlider, cutoffSlider, resonanceSlider;
private final ButtonGroup waveformGroup;
```

- ****Sliders**** : cinq curseurs couvrant les paramètres temporels (attack/release), la transposition (pitch) et le filtre (cutoff, resonance).
- ****ButtonGroup**** : groupe de `JRadioButton` qui représente le choix de la forme d’onde (`AudioConstants.Waveform`).

### Panel forme d’onde

```java
JPanel waveformPanel = new JPanel();
waveformPanel.setBorder(BorderFactory.createTitledBorder("Waveform"));
waveformGroup = new ButtonGroup();
for (AudioConstants.Waveform w : AudioConstants.Waveform.values()) {
    JRadioButton waveButton = new JRadioButton(w.name());
    waveButton.setActionCommand(w.name());
    if (w == AudioConstants.Waveform.SINE) waveButton.setSelected(true);
    waveformGroup.add(waveButton);
    waveformPanel.add(waveButton);
}
```

- Pour chaque valeur de l’énum `Waveform`, on crée un `JRadioButton`.
- `setActionCommand(w.name())` facilite la récupération du choix via `waveformGroup.getSelection().getActionCommand()`.
- Par convention historique, on sélectionne `SINE` par défaut (son pur).

### Panel des sliders

```java
JPanel sliderPanel = new JPanel(new GridLayout(0, 1));
JPanel topSliderRow = new JPanel(new GridLayout(1, 0, 5, 5));
attackSlider = createSlider("Attack", 1, 500, 10);
releaseSlider = createSlider("Release", 1, 2000, 300);
pitchSlider = createSlider("Pitch", -12, 12, 0);
topSliderRow.add(attackSlider);
topSliderRow.add(releaseSlider);
topSliderRow.add(pitchSlider);

JPanel bottomSliderRow = new JPanel(new GridLayout(1, 0, 5, 5));
cutoffSlider = createSlider("Cutoff", 0, 100, 100);
resonanceSlider = createSlider("Resonance", 0, 100, 20);
bottomSliderRow.add(cutoffSlider);
bottomSliderRow.add(resonanceSlider);

sliderPanel.add(topSliderRow);
sliderPanel.add(bottomSliderRow);

add(waveformPanel);
add(sliderPanel);
```

- `sliderPanel` contient deux rangées (`topSliderRow` et `bottomSliderRow`), chacune utilisant un `GridLayout` pour distribuer uniformément les sliders.
- `topSliderRow` : attack, release, pitch.
- `bottomSliderRow` : cutoff, resonance.

### Getters — unités et significations

```java
public double getAttackTime() { return Math.max(1, attackSlider.getValue()) / 1000.0; }
public double getReleaseTime() { return Math.max(1, releaseSlider.getValue()) / 1000.0; }
public int getPitchOffset() { return pitchSlider.getValue(); }
public double getFilterCutoff() { return cutoffSlider.getValue() / 100.0; }
public double getFilterResonance() { return resonanceSlider.getValue() / 100.0; }
public AudioConstants.Waveform getSelectedWaveform() {
    return AudioConstants.Waveform.valueOf(waveformGroup.getSelection().getActionCommand());
}
```

- ****Waveform (forme d’onde)****
- - Définit le ****timbre de base**** du son.
    - ****SINE (sinusoïde)**** : son pur, doux, sans harmoniques — comme un diapason.
    - ****SQUARE (carrée)**** : riche en harmoniques impaires — son électronique, nasillard, typique du chiptune.
    - ****SAWTOOTH (dent de scie)**** : contient toutes les harmoniques — son brillant, agressif, idéal pour les cordes ou les cuivres synthétiques.
    - ****TRIANGLE (triangle)**** : plus doux qu’une dent de scie, légèrement harmonique — bon compromis entre pureté et richesse.
    - ****NOISE (bruit blanc)**** : sans hauteur précise — utile pour les percussions, vents, souffles ou effets spéciaux.
- ****Pitch Offset (hauteur du son)****
- - Permet de ****transposer l’ensemble du clavier**** de -12 à +12 demi-tons.
    - Une variation de 12 demi-tons correspond à ****une octave complète****.
    - Musicalement, cela change la ****tessiture**** (grave ↔ aigu) sans modifier le timbre.
- ****Attack (attaque)****
- - Contrôle la ****vitesse à laquelle le son atteint son volume maximal****.
    - ****Court**** → son immédiat, percussif (piano, guitare).
    - ****Long**** → montée progressive, douce (violon, pad, synthé planant).
    - Fait partie de l’enveloppe ****ADSR**** (__Attack, Decay, Sustain, Release__).
- ****Release (relâchement)****
- - Définit le ****temps que met le son à s’éteindre**** après le relâchement de la touche.
    - ****Court**** → coupure nette (piano sec).
    - ****Long**** → disparition progressive (ambiance, réverbération).
    - Conditionne la ****fin de vie de la note****.
- ****Cutoff (fréquence de coupure)****
- - Paramètre du ****filtre passe-bas**** : ne laisse passer que les fréquences ****en dessous**** du seuil choisi.
    - ****Cutoff bas**** → son sombre, feutré, étouffé.
    - ****Cutoff haut**** → son clair, brillant, ouvert.
    - Sert à ****sculpter la brillance du timbre****.
- ****Résonance (accentuation du filtre)****
- - Accentue les fréquences ****autour du cutoff****.
    - ****Faible résonance**** → filtre doux et musical.
    - ****Forte résonance**** → accentuation sifflante, effet électronique marqué.
    - Permet de ****donner du caractère**** et de ****modeler la couleur sonore****.

## La classe `PianoKeyboardPanel` — Le clavier, héritage des instruments à cordes et marteaux

Le ****piano**** est sans doute l’un des instruments les plus universels pour comprendre la musique. En reproduire l’esprit dans une interface graphique, c’est renouer avec plusieurs siècles de tradition : des clavecins baroques aux synthétiseurs analogiques des années 70.

Cette classe `PianoKeyboardPanel` constitue ****l’interface de jeu**** du synthétiseur. Elle traduit les pressions sur les touches du clavier de l’ordinateur en notes musicales, et les représente visuellement par un clavier dessiné à la main à l’aide de `Graphics2D`.

### Structure visuelle du clavier

```java
public class PianoKeyboardPanel extends JPanel {

    private final Set<Character> pressedKeys;
    private final Map<Character, Rectangle> whiteKeyRects = new HashMap<>();
    private final Map<Character, Rectangle> blackKeyRects = new HashMap<>();

    private static final int WHITE_KEY_WIDTH = 60;
    private static final int WHITE_KEY_HEIGHT = 200;
    private static final int BLACK_KEY_WIDTH = 40;
    private static final int BLACK_KEY_HEIGHT = 120;

    public PianoKeyboardPanel(Set<Character> pressedKeys) {
        this.pressedKeys = pressedKeys;

        char[] whiteKeys = {'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'};
        for (int i = 0; i < whiteKeys.length; i++) {
            whiteKeyRects.put(whiteKeys[i], new Rectangle(i * WHITE_KEY_WIDTH, 0, WHITE_KEY_WIDTH, WHITE_KEY_HEIGHT));
        }

        blackKeyRects.put('z', new Rectangle(WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2, 0, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT));
        blackKeyRects.put('e', new Rectangle(2 * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2, 0, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT));
        blackKeyRects.put('t', new Rectangle(4 * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2, 0, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT));
        blackKeyRects.put('y', new Rectangle(5 * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2, 0, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT));
        blackKeyRects.put('u', new Rectangle(6 * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2, 0, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT));
        blackKeyRects.put('i', new Rectangle(8 * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2, 0, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT));
        blackKeyRects.put('o', new Rectangle(9 * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2, 0, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT));

        int panelWidth = whiteKeys.length * WHITE_KEY_WIDTH;
        setPreferredSize(new Dimension(panelWidth, WHITE_KEY_HEIGHT));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        // Draw white keys
        for (Map.Entry<Character, Rectangle> entry : whiteKeyRects.entrySet()) {
            if (pressedKeys.contains(entry.getKey())) {
                g2d.setColor(Color.LIGHT_GRAY);
            } else {
                g2d.setColor(Color.WHITE);
            }
            g2d.fill(entry.getValue());
            g2d.setColor(Color.BLACK);
            g2d.draw(entry.getValue());
        }

        // Draw black keys
        for (Map.Entry<Character, Rectangle> entry : blackKeyRects.entrySet()) {
            if (pressedKeys.contains(entry.getKey())) {
                g2d.setColor(Color.DARK_GRAY);
            } else {
                g2d.setColor(Color.BLACK);
            }
            g2d.fill(entry.getValue());
        }
    }
}
```

Cette classe étend `JPanel`, ce qui lui permet d’être intégrée directement dans une interface Swing.  
Visuellement, elle se compose de deux couches :

- ****Les touches blanches****, dessinées en fond, occupant chacune 60 px de largeur pour 200 px de hauteur.
- ****Les touches noires****, superposées partiellement aux blanches, mesurant 40 px sur 120 px.

Les touches sont stockées sous forme de rectangles (`Rectangle`), associés à des caractères (`Map<Character, Rectangle>`).  
Chaque caractère représente une ****touche du clavier physique****.

Le dessin s’effectue dans la méthode `paintComponent(Graphics g)` :

- si la touche est appuyée (`pressedKeys.contains(key)`), sa couleur s’assombrit pour simuler la pression ;
- sinon, elle conserve sa couleur d’origine (blanche ou noire).

Cette approche donne à l’utilisateur une ****réponse visuelle immédiate**** : on __voit__ ce que l’on joue.

### Correspondance musicale

Chaque touche dessinée correspond à une note.  
Le clavier du synthétiseur transpose les lettres du clavier de l’ordinateur en ****notes d’une gamme chromatique****.

Ainsi :

- `q` représente le ****Do**** de référence,
- `z` son ****Do♯****,
- `s` correspond au ****Ré****, etc.

Cette disposition, bien que simplifiée, reproduit fidèlement la logique du clavier d’un piano :

- les touches blanches forment une ****gamme majeure naturelle****,
- les noires, plus courtes et décalées, correspondent aux ****notes intermédiaires****.

En liant directement la pression d’une touche (`pressedKeys`) à une fréquence déterminée dans la logique du synthétiseur, cette classe devient ****le lien entre l’interface visuelle et le moteur sonore****.

### Symbolique et conception

Ce composant graphique n’est pas qu’un dessin : il traduit une ****pensée musicale et historique****.  
Chaque touche virtuelle relie un geste physique (appuyer sur une touche d’ordinateur) à une idée sonore (entendre une note), renouant ainsi avec la logique fondamentale de l’instrumentiste.

On retrouve ici :

- la ****géométrie du clavier****, inchangée depuis Bach et ses fugues,
- la ****répartition visuelle des demi-tons****, rappelant la théorie musicale occidentale,
- et une ****interface sobre****, fidèle à l’élégance minimaliste des synthétiseurs analogiques des années 80.

## La classe `Synthesiser`

Cette classe représente le ****centre névralgique**** du projet : c’est elle qui coordonne l’interface graphique, les interactions clavier, et la génération sonore.  
C’est dans cette classe que le lien s’opère entre ****la physique du son**** et ****l’interaction musicale****.

### Structure générale et rôle global

```java
public class Synthesiser extends JFrame {
    private final Map<Character, Double> keyToFreq;
    private final Set<Character> pressedKeys = new HashSet<>();
    private final PianoKeyboardPanel pianoKeyboard;
    private final SynthControlsPanel controlsPanel;
    private static final int NUM_VOICES = 8;
    private final Voice[] voices;
}
```

- **`**JFrame**`** : la fenêtre principale du synthétiseur.
- **`**keyToFreq**`** : la correspondance entre les touches du clavier et les fréquences musicales (Do4, Ré4, etc.), définies dans `AudioConstants`.
- **`**pressedKeys**`** : garde la trace des notes actuellement appuyées.
- **`**pianoKeyboard**`** : l’affichage visuel des touches (blanches et noires), géré par la classe `PianoKeyboardPanel`.
- **`**controlsPanel**`** : les réglages de l’instrument (attaque, relâchement, filtre, forme d’onde...).
- **`**voices**`** : un petit “orchestre interne” de ****8 voix****, permettant le jeu polyphonique (plusieurs notes à la fois).

### Initialisation

```java
public Synthesiser() {
    setTitle("Mini Synthétiseur");
    setDefaultCloseOperation(EXIT_ON_CLOSE);

    voices = new Voice[NUM_VOICES];
    for (int i = 0; i < NUM_VOICES; i++) {
        voices[i] = new Voice();
    }

    pianoKeyboard = new PianoKeyboardPanel(pressedKeys);
    controlsPanel = new SynthControlsPanel();

    getContentPane().add(pianoKeyboard, BorderLayout.CENTER);
    getContentPane().add(controlsPanel, BorderLayout.SOUTH);

    setupKeyBindings();
    pack();
    setResizable(false);
    setLocationRelativeTo(null);
    setVisible(true);
    new Thread(this::soundLoop).start();
}
```

- Le constructeur ****met en place la fenêtre**** et les composants visuels.
- Le tableau `voices` initialise les canaux sonores indépendants.
- `setupKeyBindings()` lie les touches du clavier à des actions musicales.
- Enfin, un ****thread dédié**** (`soundLoop`) génère en continu le signal audio.

Cette séparation entre interface, entrées clavier et génération sonore reprend la ****structure des synthétiseurs modulaires**** :  
les modules de contrôle, de génération et de sortie sont indépendants mais interconnectés.

### Liaisons clavier et gestion des notes

```java
private void setupKeyBindings() {
    InputMap im = pianoKeyboard.getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW);
    ActionMap am = pianoKeyboard.getActionMap();
    for (char c : keyToFreq.keySet()) {
        char upperC = Character.toUpperCase(c);
        im.put(KeyStroke.getKeyStroke("pressed " + upperC), "press_" + c);
        am.put("press_" + c, new KeyAction(c, true));
        im.put(KeyStroke.getKeyStroke("released " + upperC), "release_" + c);
        am.put("release_" + c, new KeyAction(c, false));
    }
}
```

Chaque touche du clavier (`A`, `Z`, `E`, `Q`…) est reliée à une action :

- ****Appui**** → démarre une note,
- ****Relâchement**** → arrête la note correspondante.

Cela reproduit fidèlement le ****comportement d’un clavier de synthé physique**** :  
tant qu’une touche est maintenue, le son est entretenu (phase de “sustain”).

### Le moteur audio : la boucle de génération du son

```java
private void soundLoop() {
    try {
        AudioFormat af = new AudioFormat(AudioConstants.SAMPLE_RATE, 16, 1, true, true);
        SourceDataLine line = AudioSystem.getSourceDataLine(af);
        line.open(af, 4096);
        line.start();
        byte[] buffer = new byte[1024];
        while (true) {
            for (int i = 0; i < buffer.length / 2; i++) {
                double mixedSample = 0;
                for (Voice voice : voices) {
                    mixedSample += voice.getNextSample();
                }
                mixedSample *= 0.25;
                mixedSample = Math.tanh(mixedSample);
                short pcmValue = (short) (mixedSample * Short.MAX_VALUE);
                buffer[i * 2] = (byte) (pcmValue >> 8);
                buffer[i * 2 + 1] = (byte) pcmValue;
            }
            line.write(buffer, 0, buffer.length);
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

- À chaque itération, la méthode `getNextSample()` de chaque voix renvoie un petit fragment du signal sonore.
- Ces fragments sont additionnés (sommation des ondes), puis légèrement limités (`tanh`) pour éviter la saturation.
- Les valeurs sont converties en format PCM et envoyées à la carte son.

Ce mécanisme imite le ****mélangeur audio analogique**** d’un synthétiseur traditionnel.

## Résultat final

![](https://www.sfeir.dev/content/images/2025/10/image-13.png)

Je vous passe la phase de démonstration, la dernière fois que j'ai joué d'un instrument de musique j'était au collègue et il s'agissait de la flute à bec, et je joue suffisamment mal pour faire hurler un chien 🥲.  
Et pour ce qui concerne d'ajouter ma voix par dessus le son généré, ce n'est guerre mieux, appeler moi Assurancetourix.

![](https://www.sfeir.dev/content/images/2025/10/image-14.png)

le barde le plus célèbre de notre enfance

Bon allez, ma meilleure performance en image

## Conclusion

Le synthétiseur que nous avons exploré illustre parfaitement le lien entre ****physique, mathématiques et musique****. Chaque ligne de code n’est pas seulement une instruction informatique : elle correspond à un geste musical, une onde vibrante ou une modulation subtile.

De la correspondance entre touches et fréquences à la mise en œuvre des enveloppes ADSR, en passant par les filtres et les différentes formes d’onde, ce projet montre comment les concepts théoriques se traduisent en ****expressions sonores tangibles****.

Ainsi, au-delà de la programmation, il s’agit d’une ****expérience sensorielle et créative**** : un clavier d’ordinateur devient un instrument, un programme devient un interprète, et l’utilisateur retrouve le plaisir d’explorer le son avec la précision d’un ingénieur et la sensibilité d’un musicien.
