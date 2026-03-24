---
layout: "default"
title: "Agrandissons l'orchestre avec la guitare"
permalink: "/back/java/agrandissons-l-orchestre-avec-la-guitare/"
tags: [back, java]
status: "Draft"
---
Dans les précédents chapitres, nous avons exploré le monde du son numérique sous deux angles :  
d’abord ****[[Tutoriel Java Sound - transformer le son du microphone en images temps réel|l’écoute]]****, en capturant les ondes à travers un microphone ;  
puis ****[[Créons un synthétiseur en Java|la création]]****, en donnant forme à ces ondes grâce à un petit synthétiseur.

Aujourd’hui, notre aventure musicale prend une tournure plus instrumentale.  
Nous allons concevoir une ****guitare virtuelle****, un instrument à six cordes, fidèle dans son comportement aux lois physiques du son, mais animé dans le monde numérique par Java.

Cette réalisation prolonge naturellement notre quête : ****du signal abstrait au geste musical****.  
Là où le synthétiseur faisait naître le son de manière purement électronique, la guitare, elle, ****vibre****, ****résonne****, ****s’éteint****… Elle vit, en somme.

## De la corde vibrante à la guitare virtuelle

Reproduire une guitare, ce n’est pas seulement jouer des notes ; c’est ****simuler une vibration physique****.  
[Chaque corde, tendue entre deux points, obéit à la même équation fondamentale du son](https://fr.wikipedia.org/wiki/Onde_sur_une_corde_vibrante) :

> la fréquence dépend de la tension, de la longueur et de la masse linéique.

Dans notre version numérique, la corde devient une ****file de valeurs échantillonnées****, représentant la pression acoustique dans le temps.  
Cette approche trouve ses racines dans l' [****algorithme de Karplus–Strong****](https://fr.wikipedia.org/wiki/Algorithme_de_Karplus-Strong), mis au point en 1983, qui permit de simuler le timbre des instruments à cordes avec une simplicité déconcertante : un petit tampon circulaire, du bruit blanc et un filtre passe-bas suffisent.

Nous allons nous inspirer de ce principe pour donner à notre guitare un son ****organique****, ****dynamique**** et légèrement ****imprévisible****, comme un véritable instrument.

Je vous passe toute la partie sur la définition du son, vous pouvez la retrouver dans cet article

[[Créons un synthétiseur en Java]]

## La classe principale : `VirtualGuitar`

Commençons par le cœur de notre programme, la fenêtre principale.  
C’est elle qui orchestre la création de l’interface graphique, la gestion des touches du clavier et le démarrage du moteur audio.

```java
public class VirtualGuitar extends JFrame {

    private int capoFret = 0; 

    private double[] currentStringFrequencies = { 
        AudioConstants.noteFrequencies.get("E2"), // (thickest)
        AudioConstants.noteFrequencies.get("A2"), 
        AudioConstants.noteFrequencies.get("D3"), 
        AudioConstants.noteFrequencies.get("G3"), 
        AudioConstants.noteFrequencies.get("B3"), 
        AudioConstants.noteFrequencies.get("E4")  // (thinnest)
    };

    private int currentTuningIndex = 0; 
    private float distortionLevel = 0.0f;

    public VirtualGuitar() {
        setTitle("Guitare Virtuelle");
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        GuitarPanel guitarPanel = new GuitarPanel();
        add(guitarPanel);

        Map<Integer, GuitarString> activeStrings = new ConcurrentHashMap<>();
        GuitarKeyBindings guitarKeyBindings = new GuitarKeyBindings(this, guitarPanel, activeStrings);
        guitarKeyBindings.setupBindings((JPanel) getContentPane());

        pack();
        setLocationRelativeTo(null);
        setVisible(true);

        new Thread(new GuitarAudioProcessor(this, activeStrings)).start();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(VirtualGuitar::new);
    }

    public int getCapoFret() { return capoFret; }
    public void setCapoFret(int capoFret) { this.capoFret = capoFret; }
    public double[] getCurrentStringFrequencies() { return currentStringFrequencies; }
    public void setCurrentStringFrequencies(double[] currentStringFrequencies) { this.currentStringFrequencies = currentStringFrequencies; }
    public int getCurrentTuningIndex() { return currentTuningIndex; }
    public void setCurrentTuningIndex(int currentTuningIndex) { this.currentTuningIndex = currentTuningIndex; }
    public float getDistortionLevel() { return distortionLevel; }
    public void setDistortionLevel(float distortionLevel) { this.distortionLevel = distortionLevel; }
}
```

- ****Les fréquences d’accordage**** : six cordes, accordées en ****Mi–La–Ré–Sol–Si–Mi****, la norme universelle des guitares. Les valeurs proviennent de `AudioConstants.noteFrequencies` déjà utiliser pour notre synthétiseur.
- ****Le “capo”**** : fidèle compagnon des guitaristes, il nous permet de transposer l’ensemble de l’accordage en changeant simplement la position du sillet mobile.

![](https://www.sfeir.dev/content/images/2025/10/image-16.png)

un capo

- ****La distorsion**** : un clin d’œil aux guitares électriques, simulée par un simple effet mathématique, mais ô combien expressif.

## Le son : `GuitarString`

C’est ici que se joue la magie.  
Chaque corde est un petit monde autonome : elle s’excite lorsqu’on la pince, vibre, filtre et s’éteint lentement.

```java
public class GuitarString {

    private final Queue<Double> ringBuffer;
    private int tickCount = 0;
    private double envelope = 1.0;
    private double lastFilterOutput = 0.0;

    public GuitarString(double frequency, double initialAmplitude) {
        int capacity = (int) (AudioConstants.SAMPLE_RATE / frequency);
        this.ringBuffer = new LinkedList<>();
        Random random = new Random();

        for (int i = 0; i < capacity; i++) {
            ringBuffer.add((random.nextDouble() - 0.5) * initialAmplitude);
        }
    }

    public GuitarString(double frequency) {
        this(frequency, 1.0);
    }

    public double getNextSample() {
        if (ringBuffer.isEmpty()) {
            return 0.0;
        }

        double first = ringBuffer.poll();

        double newSample = (first + lastFilterOutput) * 0.5;
        lastFilterOutput = newSample;
        ringBuffer.add(newSample);

        envelope = Math.exp(-tickCount / (AudioConstants.SAMPLE_RATE * 0.4));

        tickCount++;
        return newSample * envelope;
    }

    public boolean isActive() {
        return envelope > 0.005;
    }

    public double getVibrationAmplitude() {
        return envelope;
    }
}
```

- ****Un tampon circulaire**** (ring buffer) qui conserve l’état de la corde.
- ****Un bruit blanc initial**** : la corde est « excitée » par une perturbation aléatoire, comme un vrai pincement.
- ****Un filtre passe-bas IIR**** qui simule la perte d’énergie à chaque rebond.
- ****Une enveloppe exponentielle**** (`exp(-tickCount/...)`) qui reproduit la décroissance progressive du son.

Le résultat est une vibration douce, légèrement instable, rappelant le timbre naturel d’une guitare acoustique.

## Le moteur sonore : `GuitarAudioProcessor`

Une guitare ne joue pas seule.  
Il faut un ****chef d’orchestre audio****, capable de mélanger les cordes actives, de produire le [flux PCM](https://fr.wikipedia.org/wiki/Modulation_par_impulsions_et_codage) et d’ajouter des effets.

```java
public record GuitarAudioProcessor(VirtualGuitar virtualGuitar,
                                   Map<Integer, GuitarString> activeStrings) implements Runnable {

    @Override
    public void run() {
        try (SourceDataLine line = AudioSystem.getSourceDataLine(new AudioFormat(AudioConstants.SAMPLE_RATE, 16, 1, true, true))) {
            line.open();
            line.start();
            byte[] buffer = new byte[1024];

            while (true) {
                for (int i = 0; i < buffer.length / 2; i++) {
                    double mixedSample = 0;

                    for (Map.Entry<Integer, GuitarString> entry : activeStrings.entrySet()) {
                        GuitarString string = entry.getValue();
                        mixedSample += string.getNextSample();
                        if (!string.isActive()) {
                            activeStrings.remove(entry.getKey());
                        }
                    }

                    // Apply distortion
                    if (virtualGuitar.getDistortionLevel() > 0.0f) {
                        double gain = 1.0 + (virtualGuitar.getDistortionLevel() * 5.0);
                        mixedSample = Math.tanh(mixedSample * gain) / Math.tanh(gain);
                    }

                    mixedSample = Math.max(-1.0, Math.min(1.0, mixedSample * 0.5));
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
}
```

Dans cette boucle infinie, chaque corde contribue à la trame sonore.  
Les échantillons sont additionnés, filtrés et ****convertis en PCM 16 bits**** avant d’être envoyés au système audio.

L’effet de ****distorsion**** est obtenu grâce à la fonction `tanh`, une méthode classique de __soft clipping__.  
Le résultat : un son plus chaud, légèrement saturé, rappelant la chaleur des lampes à vide des amplis vintage.

## Le jeu : `GuitarKeyBindings`

Jusqu’ici, notre guitare sait vibrer et produire du son.  
Mais pour la jouer, il nous faut un ****moyen d’interagir**** avec elle.  
C’est là qu’intervient la classe `GuitarKeyBindings`.  
Elle relie les ****touches du clavier**** de l’ordinateur aux ****cordes virtuelles****, aux ****accords****, et même à des effets comme la ****distorsion**** ou le ****capo****.

### Définition des accords et des accordages

{% raw %}
```java
private final Map<Character, int[][]> chordDefinitions = Map.of(
    'A', new int[][]{{0, -1}, {1, 3}, {2, 2}, {3, 0}, {4, 1}, {5, 0}}, // C Major
    'Z', new int[][]{{0, 3}, {1, 2}, {2, 0}, {3, 0}, {4, 0}, {5, 3}}, // G Major
    'E', new int[][]{{0, -1}, {1, -1}, {2, 0}, {3, 2}, {4, 3}, {5, 2}}, // D Major
    'R', new int[][]{{0, 0}, {1, 2}, {2, 2}, {3, 0}, {4, 0}, {5, 0}}  // E Minor
);

// Define tuning presets
private final Map<String, double[]> tuningPresets = Map.of(
    "Standard", new double[]{
        AudioConstants.noteFrequencies.get("E2"),
        AudioConstants.noteFrequencies.get("A2"),
        AudioConstants.noteFrequencies.get("D3"),
        AudioConstants.noteFrequencies.get("G3"),
        AudioConstants.noteFrequencies.get("B3"),
        AudioConstants.noteFrequencies.get("E4")
    },
    "Drop D", new double[]{
        AudioConstants.noteFrequencies.get("D2"), // E string dropped to D
        AudioConstants.noteFrequencies.get("A2"),
        AudioConstants.noteFrequencies.get("D3"),
        AudioConstants.noteFrequencies.get("G3"),
        AudioConstants.noteFrequencies.get("B3"),
        AudioConstants.noteFrequencies.get("E4")
    },
    "Open G", new double[]{
        AudioConstants.noteFrequencies.get("D2"),
        AudioConstants.noteFrequencies.get("G2"),
        AudioConstants.noteFrequencies.get("D3"),
        AudioConstants.noteFrequencies.get("G3"),
        AudioConstants.noteFrequencies.get("B3"),
        AudioConstants.noteFrequencies.get("D4")
    }
);

private final String[] tuningNames;
```
{% endraw %}

- `chordDefinitions` contient des tableaux `{corde, frette}` pour chaque accord, avec `-1` pour les cordes muettes.
- `tuningPresets` définit des accordages classiques et alternatifs.
- `tuningNames` permet de parcourir les différentes options facilement.

### Configuration des touches du clavier

```java
public void setupBindings(JPanel contentPane) {
    InputMap im = contentPane.getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW);
    ActionMap am = contentPane.getActionMap();

    
   Map<Character, Integer> keyToString = Map.of(
        'Q', 5, // E4 (aigu)
        'S', 4, // B3
        'D', 3, // G3
        'F', 2, // D3
        'G', 1, // A2
        'H', 0  // E2 (grave)
    );

    for (Map.Entry<Character, Integer> entry : keyToString.entrySet()) {
        char key = entry.getKey();
        int stringIndex = entry.getValue();
        im.put(KeyStroke.getKeyStroke("pressed " + key), "press_" + key);
        am.put("press_" + key, new StringAction(stringIndex));
    }
```

Cette boucle ****relie chaque touche du clavier à une corde****, en créant une action dédiée pour la pression

### Gestion du capo

```java
    // Capo controls
    im.put(KeyStroke.getKeyStroke("RIGHT"), "capo_up");
    am.put("capo_up", new AbstractAction() {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (virtualGuitar.getCapoFret() < 12) {
                virtualGuitar.setCapoFret(virtualGuitar.getCapoFret() + 1);
                guitarPanel.setCapoFret(virtualGuitar.getCapoFret());
            }
        }
    });

    im.put(KeyStroke.getKeyStroke("LEFT"), "capo_down");
    am.put("capo_down", new AbstractAction() {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (virtualGuitar.getCapoFret() > 0) {
                virtualGuitar.setCapoFret(virtualGuitar.getCapoFret() - 1);
                guitarPanel.setCapoFret(virtualGuitar.getCapoFret());
            }
        }
    });
```

- Les touches fléchées gauche/droite permettent ****d’avancer ou reculer le capo****.
- Chaque mouvement met à jour la guitare et l’affichage dans `GuitarPanel`.

### Gestion des accords

```java
for (Map.Entry<Character, int[][]> entry : chordDefinitions.entrySet()) {
    char key = entry.getKey();
    int[][] chordShape = entry.getValue();
    im.put(KeyStroke.getKeyStroke("pressed " + key), "press_chord_" + key);
    am.put("press_chord_" + key, new ChordAction(chordShape));
}
```

Chaque touche définie dans `chordDefinitions` joue un ****accord complet**** en utilisant la classe interne `ChordAction`.

### Réglages supplémentaires : accordages et distorsion

```java
    // Tuning controls
    im.put(KeyStroke.getKeyStroke("pressed T"), "cycle_tuning");
    am.put("cycle_tuning", new AbstractAction() {
        @Override
        public void actionPerformed(ActionEvent e) {
            virtualGuitar.setCurrentTuningIndex((virtualGuitar.getCurrentTuningIndex() + 1) % tuningNames.length);
            virtualGuitar.setCurrentStringFrequencies(tuningPresets.get(tuningNames[virtualGuitar.getCurrentTuningIndex()]));
            activeStrings.clear();
            System.out.println("Tuning changed to: " + tuningNames[virtualGuitar.getCurrentTuningIndex()]);
        }
    });

    // Distortion controls
    im.put(KeyStroke.getKeyStroke("pressed U"), "distortion_up");
    am.put("distortion_up", new AbstractAction() {
        @Override
        public void actionPerformed(ActionEvent e) {
            virtualGuitar.setDistortionLevel(Math.min(1.0f, virtualGuitar.getDistortionLevel() + 0.1f));
            System.out.println("Distortion: " + String.format("%.1f", virtualGuitar.getDistortionLevel()));
        }
    });

    im.put(KeyStroke.getKeyStroke("pressed J"), "distortion_down");
    am.put("distortion_down", new AbstractAction() {
        @Override
        public void actionPerformed(ActionEvent e) {
            virtualGuitar.setDistortionLevel(Math.max(0.0f, virtualGuitar.getDistortionLevel() - 0.1f));
            System.out.println("Distortion: " + String.format("%.1f", virtualGuitar.getDistortionLevel()));
        }
    });
}
```

Ainsi, la touche `T` ****change l’accordage**** tandis que `U` et `J` ****modifient le niveau de distorsion****, offrant un ****contrôle complet du son en temps réel****.

## L’aspect visuel : `GuitarPanel`

Notre guitare n’est pas muette à l’écran : chaque corde y ****vibre visuellement****, avec un mouvement doux inspiré de la forme d’onde qu’elle produit.  
Les frettes, le manche, le capo sont dessinés dans un style épuré, presque symbolique.  
Ce panneau, animé par une simple boucle de rafraîchissement, confère à l’ensemble une véritable présence visuelle.

Ainsi, on ****voit**** la vibration autant qu’on ****l’entend****.

![](https://www.sfeir.dev/content/images/2025/10/Enregistrementdelecran2025-10-23a12.58.50-ezgif.com-video-to-gif-converter.gif)

notre guitare en action

Vous pouvez maintenant embrasser une carrière de guitariste amateur et qui sait, devenir le prochain Guitar Hero :

![](https://media.tenor.com/Pb531euXDzoAAAAC/dancing-strumming.gif)

Slash

## Vers un orchestre numérique

Notre guitare virtuelle n’est pas qu’un exercice de programmation ; elle est la rencontre de trois mondes :

- ****La physique****, avec la modélisation de la vibration d’une corde.
- ****Les mathématiques****, avec les fonctions de filtrage et de distorsion.
- ****L’art****, avec le jeu, le toucher, la résonance.

Elle prolonge naturellement le travail initié dans les deux articles précédents :

- le premier écoutait le monde,
- le second faisait chanter la machine,
- celui-ci lui donne des ****cordes sensibles****.

Et peut-être, demain, viendra le temps de l’orchestre complet : un clavier, une batterie, des cuivres, tous reliés dans une même symphonie logicielle.
