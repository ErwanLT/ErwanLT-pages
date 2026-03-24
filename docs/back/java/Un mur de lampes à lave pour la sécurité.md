---
layout: "default"
title: "Un mur de lampes à lave pour la sécurité"
permalink: "/back/java/un-mur-de-lampes-a-lave-pour-la-securite/"
tags: [back, java]
date: "2026-03-17"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/un-mur-de-lampes-a-lave-pour-la-securite/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/10/task_01k8tr2f0nezfvtc38x4fmb9y6_1761834376_img_0.webp"
published_at: "2026-03-17"
sfeir_slug: "un-mur-de-lampes-a-lave-pour-la-securite"
sfeir_tags: [Back, Java, Sécurité, chaos]
---
À la fin des années 1990, l’entreprise Silicon Graphics (SGI) imagina une approche aussi poétique qu’originale pour produire de l’aléatoire véritable : ****Lavarand****.  
Plutôt que de s’appuyer uniquement sur des algorithmes, SGI photographiait une véritable ****lampe à lave**** — ces objets emblématiques des années 70 — pour en tirer des valeurs chaotiques servant à alimenter un générateur de nombres aléatoires cryptographiquement sûrs.

L’idée était simple mais brillante : rien n’est plus imprévisible qu’une bulle de cire chauffée dans une lampe.

## Une idée intemporelle

Près de trente ans plus tard, l’idée conserve son charme. Dans un monde dominé par les simulateurs et les algorithmes prédictifs, puiser de l’aléa dans la ****physique du monde réel**** évoque une forme de pureté perdue.

Recréer Lavarand aujourd’hui, c’est rendre hommage à une époque où la science savait encore s’émerveiller d’un phénomène aussi simple que la montée d’une bulle dans la lumière chaude d’une lampe.  
Et cette fascination ne s’est pas éteinte.

L’entreprise ****Cloudflare****, gardienne des portes d’Internet moderne, perpétue cet héritage à sa manière.  
Dans le hall de son siège à San Francisco, un ****mur entier de lampes à lave**** brille en continu. Les formes mouvantes et chaotiques de ces lampes sont filmées en temps réel, puis converties en entropie pour alimenter leurs systèmes cryptographiques.

![](https://www.sfeir.dev/content/images/2025/10/image-35.png)

le mur de lampes à lave

Ainsi, derrière chaque connexion sécurisée, chaque requête HTTPS validée, se cache une parcelle de lumière liquide, un fragment d’aléa né du désordre esthétique d’une lampe à lave.

Ce ****“mur de lave”**** n’est pas un gadget décoratif : c’est un rappel que même au cœur du cloud, la ****matière**** et le ****hasard naturel**** gardent leur rôle fondateur.

## Une lampe à lave virtuelle

Ce mur de lave, gardien silencieux de l’aléa chez Cloudflare, illustre à merveille la ****rencontre entre l’art et la science****. Là où SGI utilisait la photographie, et où Cloudflare filme la lumière réelle pour nourrir la [[Sécurisez vos API avec Spring Security - Basic Auth|sécurité]]d’Internet, nous pouvons aujourd’hui ****recréer cet esprit dans le monde numérique****.

C’est précisément l’ambition de ce projet : faire renaître une lampe à lave dans le [[Il était une fois... Java|langage java]], en lui conférant une âme algorithmique.  
Ici, la cire devient ****particule virtuelle****, la chaleur une ****équation****, et la lumière une ****fenêtre graphique****.  
Le mouvement, lui, reste fidèle à l’original : lent, hypnotique, imprévisible.

Chaque instant de cette simulation devient une image unique, un motif fugace de pixels et de calculs — un équivalent numérique du hasard physique.  
Comme Cloudflare avec son mur de verre et de cire, notre lampe à lave virtuelle rappelle que le ****vrai aléa**** naît toujours du [[Introduisez du chaos dans votre application Spring Boot|****chaos maîtrisé****]], qu’il soit dans la matière… ou dans le code.

### EntropyUtils — utilitaires de hachage et de concaténation

```java
public class EntropyUtils {

    public static byte[] sha256(byte[] input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return md.digest(input);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static byte[] concat(byte[] a, byte[] b) {
        byte[] out = Arrays.copyOf(a, a.length + b.length);
        System.arraycopy(b, 0, out, a.length, b.length);
        return out;
    }
}
```

Cette classe fournit des outils de base pour manipuler les octets issus de la simulation :

- `sha256` permet de “blanchir” l’entropie visuelle, garantissant une taille fixe et réduisant les corrélations.
- `concat` combine différentes sources de bruit pour réensemencer le DRBG.

Ces fonctions sont essentielles pour transformer l’image de la lampe en donnée cryptographiquement utilisable.

### LavaLampSimulator — le moteur de la simulation visuelle

Cette classe est le ****cœur de notre lampe à lave virtuelle****. Elle gère les blobs (bulle de cire), leur mouvement, leur interaction avec les bords, et le rendu graphique en image.

```java
public static class Blob {
    double x, y;          // position du centre (0..1)
    double vx, vy;        // vitesse en unités par seconde
    double radius;        // rayon relatif (0..0.5)
    Color color;          // couleur de la bulle
}
```

Chaque `Blob` représente une bulle de cire. Ses coordonnées sont normalisées entre 0 et 1 pour simplifier le calcul. La couleur et le rayon définissent son apparence à l’écran.

```java
private final int width;
private final int height;
private final List<Blob> blobs = new ArrayList<>();
private final SecureRandom secureRandom;
private final double damping = 0.999;
private long lastUpdateNs;

public LavaLampSimulator(int width, int height, int nbBlobs, byte[] seed) {
    this.width = width;
    this.height = height;
    this.secureRandom = new SecureRandom(seed != null ? seed : SecureRandom.getSeed(16));
    initBlobs(nbBlobs);
    this.lastUpdateNs = System.nanoTime();
}
```

- `width` et `height` définissent la taille du rendu.
- `blobs` contient toutes les bulles.
- `secureRandom` initialise les positions, vitesses et couleurs des blobs de façon reproductible si une seed est fournie.
- `damping` réduit légèrement les vitesses pour un mouvement plus naturel.
- `lastUpdateNs` sert à calculer le temps écoulé entre deux étapes pour un mouvement fluide.

```java
private void initBlobs(int nb) {
    for (int i = 0; i < nb; i++) {
        Blob b = new Blob();
        b.x = 0.2 + secureRandom.nextDouble() * 0.6;
        b.y = 0.2 + secureRandom.nextDouble() * 0.6;
        b.vx = (secureRandom.nextDouble() - 0.5) * 0.2;
        b.vy = (secureRandom.nextDouble() - 0.5) * 0.2;
        b.radius = 0.08 + secureRandom.nextDouble() * 0.2;
        float h = (float) (secureRandom.nextDouble() * 0.15 + 0.55f);
        float s = (float) (0.7 + secureRandom.nextDouble() * 0.3);
        float br = (float) (0.6 + secureRandom.nextDouble() * 0.4);
        b.color = Color.getHSBColor(h, s, br);
        blobs.add(b);
    }
}
```

- Chaque blob reçoit une ****position aléatoire**** centrée pour éviter de coller aux bords.
- Les vitesses initiales sont petites pour un mouvement doux.
- Le rayon est aléatoire pour créer de la diversité visuelle.
- La couleur est choisie dans une ****palette de bleus lumineux****, avec variations de saturation et luminosité.

```java
public synchronized BufferedImage stepAndRender() {
    long now = System.nanoTime();
    double dt = Math.max(1e-6, (now - lastUpdateNs) / 1_000_000_000.0);
    lastUpdateNs = now;

    // update blobs positions with simple physics + gentle random perturbation
    for (Blob b : blobs) {
        // perturbation pour casser la périodicité (utilise secureRandom)
        double px = (secureRandom.nextDouble() - 0.5) * 0.02;
        double py = (secureRandom.nextDouble() - 0.5) * 0.02;

        b.vx = (b.vx + px) * damping;
        b.vy = (b.vy + py) * damping;

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // bounce within [0,1] with soft reflection
        if (b.x < 0.0) { b.x = 0.0; b.vx = Math.abs(b.vx) * 0.6; }
        if (b.x > 1.0) { b.x = 1.0; b.vx = -Math.abs(b.vx) * 0.6; }
        if (b.y < 0.0) { b.y = 0.0; b.vy = Math.abs(b.vy) * 0.6; }
        if (b.y > 1.0) { b.y = 1.0; b.vy = -Math.abs(b.vy) * 0.6; }
    }

    // render to image
    BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
    Graphics2D g = img.createGraphics();
    try {
        // background (dark)
        g.setComposite(AlphaComposite.SrcOver);
        g.setColor(new Color(0, 0, 0));
        g.fillRect(0, 0, width, height);

        // render blobs with additive blending for lava-like glow
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        for (Blob b : blobs) {
            int cx = (int) (b.x * width);
            int cy = (int) (b.y * height);
            int r = (int) (b.radius * Math.min(width, height));
            // gradient circle for soft edges
            drawSoftBlob(g, cx, cy, r, b.color);
        }

        // slight global blur effect imitation: draw a translucent overlay
        g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.06f));
        g.setColor(new Color(0, 191, 255)); // Deep Sky Blue
        // draw a very faint gradient to simulate light diffusion
        g.fillOval(width/4, height/4, width/2, height/2);
    } finally {
        g.dispose();
    }
    return img;
}
```

Cette méthode fait ****tout le travail à chaque frame**** :

1. ****Calcul du temps écoulé (******`**dt**`******)**** pour des mouvements dépendants du temps réel.
2. ****Mise à jour de chaque blob**** :
3. - Perturbations aléatoires pour casser la répétition.
    - Application du damping pour ralentir doucement les mouvements.
    - Déplacement selon la vitesse.
    - Rebond “souple” sur les bords.
4. ****Rendu graphique**** :
5. - Fond noir pour accentuer la luminosité.
    - Blobs dessinés avec des cercles concentriques pour des bords doux.
    - Légère superposition translucide pour simuler la diffusion lumineuse globale.

****Pourquoi c’est important :****

- Chaque image générée est ****unique et imprévisible****, source d’entropie pour le générateur.
- La simulation reste fidèle à l’esthétique hypnotique d’une vraie lampe à lave.

```java
private void drawSoftBlob(Graphics2D g, int cx, int cy, int r, Color color) {
    // draw concentric circles with decreasing alpha for soft edges
    for (int i = r; i > 0; i -= Math.max(1, r / 12)) {
        float alpha = Math.max(0.02f, (float) i / r * 0.6f);
        Color c = new Color(color.getRed(), color.getGreen(), color.getBlue(), Math.min(255, (int)(alpha*255)));
        g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, alpha));
        g.setColor(c);
        int d = i * 2;
        g.fillOval(cx - i, cy - i, d, d);
    }
}
```

- Dessine des cercles concentriques avec alpha décroissant pour créer un ****effet de glow****.
- Plus le rayon est grand, plus la transparence décroît doucement.
- Cette approche simule la ****diffusion lumineuse naturelle**** de la cire.

### VirtualLavaEntropy — transformation image → octets

```java
public class VirtualLavaEntropy {

    private final SecureRandom sysRandom = new SecureRandom();

    /**
     * Convertit l'image en tableau d'octets (grayscale downsampled)
     * qualityFactor : 1 = full resolution, 4 = 1/4 width & height
     */
    public byte[] snapshotToBytes(BufferedImage img, int qualityFactor) {
        if (img == null) return new byte[0];
        int w = Math.max(1, img.getWidth() / qualityFactor);
        int h = Math.max(1, img.getHeight() / qualityFactor);

        ByteBuffer buf = ByteBuffer.allocate(w * h + 48); // reserve extra
        for (int y = 0; y < img.getHeight(); y += qualityFactor) {
            for (int x = 0; x < img.getWidth(); x += qualityFactor) {
                int rgb = img.getRGB(x, y);
                int r = (rgb >> 16) & 0xff;
                int g = (rgb >> 8) & 0xff;
                int b = (rgb) & 0xff;
                // grayscale
                int gray = (r + g + b) / 3;
                buf.put((byte) (gray & 0xff));
            }
        }

        // add system jitter (nanoTime)
        long now = System.nanoTime();
        for (int i = 0; i < 8; i++) buf.put((byte) ((now >> (i * 8)) & 0xff));

        // add some SecureRandom noise
        byte[] noise = new byte[32];
        sysRandom.nextBytes(noise);
        buf.put(noise);

        int len = buf.position();
        byte[] out = Arrays.copyOf(buf.array(), len);
        // wipe sensitive buffers if needed (not strictly necessary in Java GC)
        Arrays.fill(noise, (byte) 0);
        return out;
    }

    /**
     * Sauvegarde un BufferedImage dans un fichier PNG.
     * @param img L'image à sauvegarder.
     * @param filename Le chemin du fichier où sauvegarder l'image.
     */
    public void saveSnapshot(BufferedImage img, String filename) {
        try {
            File outputfile = new File(filename);
            ImageIO.write(img, "png", outputfile);
            System.out.println("Snapshot saved to: " + filename);
        } catch (IOException e) {
            System.err.println("Error saving snapshot: " + e.getMessage());
        }
    }
}
```

- Transforme chaque image en un tableau d’octets en niveau de gris, downsampled selon `qualityFactor`.
- Ajoute du ****bruit système**** et un ****timestamp**** pour augmenter l’entropie.
- Permet également de sauvegarder les images pour inspection ou audit.

Cette classe est le lien entre la ****simulation visuelle**** et le générateur de nombres pseudo-aléatoires.

### HmacDRBG — générateur de nombres pseudo-aléatoires

Le ****HMAC-DRBG (Deterministic Random Bit Generator)**** est un standard défini par le ****NIST (****[****SP 800-90A****](https://en.wikipedia.org/wiki/NIST_SP_800-90A)****)****.  
Il s’agit d’un générateur pseudo-aléatoire ****cryptographiquement sûr****, qui dérive son flux de données à partir d’un état interne secret, mis à jour au fil du temps.

```java
private byte[] K; // clé interne
private byte[] V; // valeur interne
private final String HMAC_ALGO = "HmacSHA256";
```

Deux variables définissent son état :

- `K` — la ****clé interne**** de l’algorithme HMAC (mise à jour à chaque réensemencement ou génération).
- `V` — la ****valeur interne****, un vecteur de 256 bits servant de base à la génération des octets.

Toutes deux sont initialisées à des constantes (`0x00` et `0x01`) avant d’être mélangées avec la graine d’entropie issue de la lampe à lave virtuelle.

```java
private void reseedInternal(byte[] seedMaterial) {
    try {
        Mac mac = hmac();
        // K = HMAC(K, V || 0x00 || seed)
        mac.update(V);
        mac.update((byte) 0x00);
        if (seedMaterial != null) mac.update(seedMaterial);
        K = mac.doFinal();

        mac = hmac();
        mac.update(V);
        V = mac.doFinal();

        if (seedMaterial != null) {
            mac = hmac();
            mac.update(V);
            mac.update((byte) 0x01);
            mac.update(seedMaterial);
            K = mac.doFinal();

            mac = hmac();
            mac.update(V);
            V = mac.doFinal();
        }
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

La méthode `reseed` permet de ****réinjecter de nouvelles données d’entropie**** à tout moment dans le générateur.  
Ici, le matériau d’entropie provient directement des ****images générées par la simulation****, converties en octets, puis blanchies (hashées) par SHA-256.

Le réensemencement suit le protocole NIST :

1. Calcul d’un nouveau `K` à partir de l’ancien état et du `seedMaterial`.
2. Mise à jour de `V` avec le nouveau HMAC(`K`, `V`).
3. Application d’un second passage si des données d’entropie sont présentes, garantissant un état interne totalement différent.

Chaque appel à `reseed` ****renouvelle complètement**** l’état interne, brisant toute corrélation avec les valeurs précédentes.

```java
public synchronized byte[] generate(int n) {
    try {
        Mac mac = hmac();
        byte[] output = new byte[n];
        int pos = 0;
        while (pos < n) {
            mac = hmac();
            mac.update(V);
            V = mac.doFinal();
            int toCopy = Math.min(V.length, n - pos);
            System.arraycopy(V, 0, output, pos, toCopy);
            pos += toCopy;
        }
        // after generate, reseed update K and V with no additional data
        reseedInternal(null);
        return output;
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

La génération d’octets s’effectue en plusieurs étapes :

1. À chaque itération, un ****nouvel HMAC**** est calculé sur la valeur `V`.
2. Le résultat remplace `V` et sert à produire un bloc d’octets.
3. Ce processus se répète jusqu’à obtenir la quantité demandée (`n` octets).
4. Enfin, un ****auto-réensemencement léger**** est appliqué pour rafraîchir l’état interne.

Ainsi, même sans nouvelle entropie visuelle, le générateur reste sécurisé et ****imprévisible**** à l’échelle humaine.

### LavaLampEntropyGenerator — fusion du chaos et du calcul

Cette classe ne contient qu’une seule méthode publique, mais elle porte tout le sens du projet.  
C’est elle qui relie le monde visuel — la lampe à lave virtuelle — à la rigueur du générateur cryptographique.  
En une seule respiration, elle ****observe, mélange et engendre****.

```java
public class LavaLampEntropyGenerator {

    private final LavaLampSimulator simulator;
    private final VirtualLavaEntropy entropyCollector;
    private final HmacDRBG drbg;
    private final int qualityFactor;
    private int generationCount = 0;
    private static final int SAVE_INTERVAL = 5; // Save every 5 generations

    public LavaLampEntropyGenerator(int width, int height, int nbBlobs, int qualityFactor, byte[] initialSeed) {
        this.simulator = new LavaLampSimulator(width, height, nbBlobs, initialSeed);
        this.entropyCollector = new VirtualLavaEntropy();
        this.qualityFactor = qualityFactor;

        // Initialisation du DRBG avec la première image de la simulation
        BufferedImage firstSnapshot = simulator.stepAndRender();
        byte[] firstSeedBytes = entropyCollector.snapshotToBytes(firstSnapshot, this.qualityFactor);
        byte[] whitenedSeed = EntropyUtils.sha256(firstSeedBytes);
        this.drbg = new HmacDRBG(whitenedSeed);
    }

    /**
     * Avance la simulation, collecte l'entropie, la mélange avec du bruit système,
     * ré-ensemence le DRBG et génère un nombre d'octets aléatoires.
     *
     * @param numBytes le nombre d'octets aléatoires à générer.
     * @return un tableau d'octets aléatoires.
     */
    public synchronized byte[] mixEntropyAndGenerate(int numBytes) {
        // Avance la simulation de plusieurs images pour augmenter la diffusion
        for (int f = 0; f < 6; f++) {
            simulator.stepAndRender();
        }

        // Collecte la nouvelle entropie de l'image actuelle
        BufferedImage snap = simulator.stepAndRender();
        byte[] chunk = entropyCollector.snapshotToBytes(snap, qualityFactor);
        byte[] whitened = EntropyUtils.sha256(chunk);

        // **Important** : mélange avec un petit bloc de bruit système pour éviter le déterminisme pur
        byte[] sysNoise = new byte[16];
        new SecureRandom().nextBytes(sysNoise);
        byte[] toReseed = EntropyUtils.concat(whitened, sysNoise);

        // Ré-ensemence le DRBG avec le SHA256 du mélange
        drbg.reseed(EntropyUtils.sha256(toReseed));

        // Génère et retourne les octets
        byte[] generatedBytes = drbg.generate(numBytes);

        // Sauvegarde l'image périodiquement pour inspection
        generationCount++;
        if (generationCount % SAVE_INTERVAL == 0) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss_SSS"));
            String filename = "snapshot_" + timestamp + ".png";
            entropyCollector.saveSnapshot(snap, filename);
        }

        return generatedBytes;
    }

    /**
     * Retourne le simulateur pour permettre le rendu externe (ex: GUI).
     * @return l'instance de LavaLampSimulator.
     */
    public LavaLampSimulator getSimulator() {
        return simulator;
    }
}
```

À chaque appel, la simulation avance de quelques images, le temps que la cire virtuelle se déforme, se divise et fusionne.  
L’image obtenue devient alors une source d’entropie : chaque pixel, chaque nuance de couleur traduit un instant unique du chaos numérique.  
Cette entropie visuelle est ensuite ****purifiée**** par un hachage SHA-256, puis mêlée à un soupçon de bruit aléatoire issu du système (`SecureRandom`).  
Ce mélange scelle l’union du monde physique et du monde simulé.

Le tout est enfin transmis au ****HMAC-DRBG****, qui se réensemence avant de produire un flux d’octets pseudo-aléatoires.  
De temps à autre, une capture est sauvegardée : trace d’un instant précis, témoin de la vie intérieure de la lampe.

Ainsi, `LavaLampEntropyGenerator` agit comme un ****alchimiste numérique**** : il transforme la lumière en hasard, et le hasard en matière exploitable.  
Une seule méthode, mais tout un cycle : ****mouvement, observation, transformation, création****.

### LavaLampApp — la vitrine du chaos maîtrisé

`LavaLampApp` donne un visage à la lampe : c’est la fenêtre où la cire virtuelle danse.  
Elle orchestre le rythme de l’animation grâce à un timer, tout en laissant le générateur d’entropie s’exprimer à intervalles réguliers.  
Chaque image peinte à l’écran est une itération vivante du hasard en mouvement — la preuve visuelle que derrière la beauté fluide se cache un moteur cryptographique à l’œuvre.

![](https://www.sfeir.dev/content/images/2025/10/Enregistrementdelecran2025-10-30a17.45.52-ezgif.com-video-to-gif-converter-1.gif)

notre lampe à lave virtuelle

## Conclusion

Cette lampe à lave virtuelle n’est pas qu’un exercice de style : elle incarne la rencontre entre la poésie du mouvement et la rigueur du calcul.  
En transposant le principe du ****Lavarand**** dans un monde purement logiciel, nous rappelons que l’imprévisibilité — qu’elle naisse d’une bulle de cire ou d’un pixel changeant — demeure au cœur de la sécurité et de la beauté du numérique.  
Là où Cloudflare érige un mur de verre pour capter la lumière, notre Java recrée ce même chaos sous forme d’algorithme.  
Ainsi, de la lave réelle à la lave simulée, ****le hasard continue de couler**** — preuve que même dans le code, la vie trouve toujours un moyen de danser.
