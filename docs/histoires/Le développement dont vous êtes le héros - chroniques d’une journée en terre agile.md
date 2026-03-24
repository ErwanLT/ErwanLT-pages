---
layout: "default"
title: "Le développement dont vous êtes le héros - chroniques d’une journée en terre agile"
permalink: "/histoires/le-developpement-dont-vous-etes-le-heros-chroniques-d-une-journee-en-terre-agile/"
tags: [histoires]
date: "2025-12-05"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/tendances/le-developpement-dont-vous-etes-le-heros-chroniques-dune-journee-en-terre-agile/"
banner: "https://www.sfeir.dev/content/images/2025/12/Screenshot-2025-12-04-at-15.52.29.png"
published_at: "2025-12-05"
sfeir_slug: "le-developpement-dont-vous-etes-le-heros-chroniques-dune-journee-en-terre-agile"
sfeir_tags: [calendrier de l'avent, Agile, Tendances]
---
**Variables initiales :**

- **Stress** = 0
- **Backlog** = 0
- **Build cassé** = false

---

### 1. Réveil et café

[![](https://www.sfeir.dev/content/images/2025/11/image-3.png)](https://www.sfeir.dev/content/images/2025/11/image-3.png)

Le développement dont vous êtes le héros

Le réveil vibre doucement, comme un vieux gadget qui a déjà trop servi. Tu tends la main vers ton mug encore chaud : première gorgée, première étincelle.  
  
Ton téléphone s’illumine déjà : un message du PO.  
  
La lumière froide du matin se pose sur ton bureau, où repose ton laptop comme une épée prête pour une nouvelle quête — rien de bien héroïque, mais suffisamment pour remplir une journée complète en Terre Agile.

**Choix :**

- Vérifier Slack maintenant → **2**
- Consulter le backlog d’abord → **3**

---

### 2. Slack urgent

Un message sec du PO : **_build cassé depuis hier soir_**.  
  
Tu ouvres le terminal et les logs défilent en cascade. Une impression légère de déjà-vu, comme ces moments où un détail invisible te bloquait pendant des heures.  
Tu sens ton rythme cardiaque accélérer. Pas question de laisser le chaos s’installer dès le matin.

**Choix :**

- Corriger immédiatement → **4**
- Contacter l’auteur de la PR (qui a mergé hier) → **5**

---

### 3. Backlog tranquille

Jira se charge lentement, révélant ses colonnes comme un vieux tableau stratégique.  
Des bugs anciens dorment dans les coins, des features attendent patiemment, et la dette technique te regarde avec l’air d’un compagnon que tu repousses trop souvent — un vrai « on verra plus tard ».  
Deux cartes attirent ton attention : l’une essentielle, l’autre urgente.

**Choix :**

- Nettoyer la dette technique → **6**
- Vérifier Slack → **2**

---

### 4. Correctif rapide

Tu repères le problème rapidement : un DTO vide glissé là où il ne devrait pas être.  
Tu corriges, relances les tests… et le build passe au vert comme un feu qui t’invite à continuer.  
Le soulagement est discret mais réel.

**Conséquence :** Stress +1 (tu sens quand même la pression)

**Choix :**

- Aller au daily → **9**
- Refactorer le code proprement avant le daily → **8**

---

### 5. Auteur absent

Tu ping ton collègue pour comprendre l’origine du bug… mais un message automatique apparaît : **_en congés aujourd’hui_**.  
Tu fermes les yeux une seconde. Pas de renfort sur cette bataille-ci — c’est à ton tour de jouer.

**Conséquence :** Stress +1

**Choix :**

- Retour au diagnostic → **4**

---

### 6. Dette technique

Les fichiers s’ouvrent les uns après les autres, révélant une zone du code que personne n’a vraiment visitée depuis longtemps.  
Tu t’attends presque à voir un commentaire oublié d’un dev d’une autre époque — ce genre de relique qui fait sourire et grimacer à la fois.

> Ne surtout pas toucher !

Un travail méthodique s’impose.

**Choix :**

- Nettoyer méthodiquement → **8**, Stress +1
- Reporter → **3**, Backlog +1, Stress +1

---

### 7. Patch express

Tu appliques le correctif avec la précision d’un artisan qui connaît son outil. Quelques secondes plus tard, les tests passent tous au vert.  
Le PO te remercie rapidement, un simple message, mais suffisant pour te donner l’impression d’avoir évité une petite catastrophe dès le matin.

**Choix :**

- Aller au daily → **9**

---

### 8. Refactorisation

Tu prends une grande inspiration et plonges dans le refactoring.  
Petites méthodes éclatées, noms clarifiés, responsabilités mieux distribuées…

Le code retrouve une respiration, comme un moteur que tu viens de remettre en état après trop d’heures de route.  
La satisfaction est réelle, même si la fatigue commence à poindre.

**Conséquence :** Stress +1

**Choix :**

- Aller au daily → **9**
- Continuer nettoyage → **6**

---

### 9. Daily

L’équipe se rassemble en cercle, microphones allumés, caméras parfois éteintes.  
Chacun évoque ses avancées, ses obstacles, ses victoires du jour.

Le moment a quelque chose de rituel, un rendez-vous ancré dans le quotidien, presque comme une sauvegarde automatique dans une partie longue.

**Choix :**

- Partager ton succès → **10**, Stress -1
- Souligner la dette technique → **11**, Backlog +1

---

### 10. Présentation fière

Tu expliques calmement ce que tu as corrigé.  
Le PO hoche la tête, satisfait, pendant que ton équipe t’envoie quelques réactions positives.  
L’atmosphère se détend légèrement, comme si la journée venait de gagner un bonus de moral collectif.

**Choix :**

- Commencer feature stratégique → **12**
- Corriger bug mobile → **13**

---

### 11. Avertissement dette

Tu prends la parole pour rappeler qu’une dette technique critique attend dans un coin sombre du backlog.  
L’équipe l’ajoute à la liste, mais tu sens que la charge mentale augmente un peu, comme lorsqu’une quête secondaire se transforme soudain en quête principale.

**Choix :**

- Commencer feature → **12**
- Nettoyer le code → **6**

---

### 12. Feature stratégique

Tu te lances dans la fonctionnalité stratégique, celle inscrite sur la roadmap depuis des semaines.  
Le code s’assemble progressivement, les concepts s’alignent — un moment où tu sens l’élégance du métier, presque comme lorsque deux pièces de puzzle s’emboîtent sans effort.

**Choix :**

- Lancer les tests → **14**
- Commencer UI → **15**

---

### 13. Bug mobile fantôme

Le bug sur mobile revient par intermittence, comme une apparition imprévisible.  
Crashs erratiques, comportements étranges… tu sais que si tu ignores ce problème, il pourrait casser l’intégration finale.

**Choix :**

- Corriger le bug → **14**, Stress +1
- Reporter → **3**, Backlog +1, **Build cassé = true**

---

### 14. Tests unitaires

Tu lances les tests unitaires et observes leur progression.  
Les lignes vertes défilent comme des confirmations successives : ton travail tient debout, solide.  
Tu ressens une petite étincelle de fierté intérieure, calme et simple.

**Choix :**

- Intégration → **16**
- Tests end-to-end → **17**

---

### 15. UI

Tu passes à l’interface.  
Les composants s’alignent, les interactions deviennent fluides, et l’ensemble commence à ressembler à quelque chose que tu serais fier de montrer.  
Travail subtil, mais satisfaisant — un peu comme peaufiner son inventaire avant un combat important.

**Choix :**

- Ajouter validations → **18**
- Commencer intégration → **16**

---

### 16. Intégration

Tu lances l’intégration : la compilation est silencieuse quelques secondes… puis le verdict tombe.

Build vert ou rouge selon variable **Build cassé**.

Ce bref instant te rappelle ces moments de suspense où l’écran charge juste avant la résolution d’une quête.

**Choix :**

- Push final → **19**
- Vérifier E2E → **17**

---

### 17. Tests end-to-end

Un scénario rare échoue, l’un de ceux que personne ne rencontre vraiment… sauf quand tu l’ignores.  
Rien de dramatique, mais suffisamment pour t’obliger à refaire un passage que tu pensais terminé.

**Choix :**

- Corriger → **16**, Stress +1
- Ignorer → **19**, Stress +1, **Build cassé = true**

---

### 18. Validation UI

Tu finalises quelques comportements, des validations qui rendent l’ensemble plus robuste.  
C’est du détail, mais du détail qui compte — la finition d’une œuvre, même modeste.

**Choix :**

- Intégration → **16**

---

### 19. Fin de journée

Tu enregistres, pushes, observes le pipeline avancer…  
Si **Build cassé = false**, tout est vert : la journée s’achève avec satisfaction.  
Si **Build cassé = true**, le build final a échoué quelque part : backlog maîtrisé ou non, la journée laisse un goût d’inachevé, et tu sens que tu devras revenir demain pour réparer ce qui a été laissé en suspens.

**Conséquence :**

- Stress < 3 **et** Build cassé = false → **FIN** : journée maîtrisée, sourire satisfait.
- Stress ≥ 3 **ou** Build cassé = true → **FIN** : journée éprouvante, mais accomplie avec quelques cicatrices.

[![](https://www.sfeir.dev/content/images/2025/11/image-4.png)](https://www.sfeir.dev/content/images/2025/11/image-4.png)

Le développement dont vous êtes le héros
