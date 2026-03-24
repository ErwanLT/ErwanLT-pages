---
layout: "default"
title: "Snake - un classique intemporel à redécouvrir par le code"
permalink: "/back/python/snake-un-classique-intemporel-a-redecouvrir-par-le-code/"
tags: [back, python, jeux-videos, snake]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/snake-un-classique-intemporel-a-redecouvrir-par-le-code/"
banner: "https://www.sfeir.dev/content/images/2025/06/20250619_1257_Texte-Retire--_remix_01jy3x9jyhfz89q32ct4wwk7n1-1.png"
published_at: "2025-07-17"
sfeir_slug: "snake-un-classique-intemporel-a-redecouvrir-par-le-code"
date: "2025-07-17"
---
Dans notre [série estivale](https://www.sfeir.dev/front/demineur-angular/) où l'on démonte les jeux de notre enfance pour les reconstruire pièce par pièce en explorant les frameworks modernes, on retrouve SNAKE !

Et oui! Avant les mondes ouverts et les graphismes 3D réalistes, le jeu vidéo se résumait à quelques pixels en mouvement. Et parmi les titres emblématiques de cette époque sobre et inventive, **Snake** tient une place particulière. Né dans les années 1970 et popularisé sur les téléphones Nokia dans les années 1990, il a initié des millions de joueurs aux plaisirs simples du [jeu vidéo](https://www.sfeir.dev/tag/jeux-videos/).

## 🐍 Une histoire enracinée dans le jeu vidéo

Bien avant que Snake ne devienne le compagnon discret de nos téléphones portables, son concept prenait déjà vie dans les salles d’arcade. C’est en **1976** que l’entreprise **Gremlin Industries** lance le jeu **_Blockade_**, souvent considéré comme l’ancêtre direct de Snake.  
Deux joueurs s’y affrontaient, chacun dirigeant une ligne en mouvement qui ne cessait de s’allonger. Le but était d’éviter les murs et la trace laissée par son adversaire.  
Ce principe de **lignes persistantes comme pièges** trouvera un écho fort quelques années plus tard dans le film **Tron.**

[![](https://www.sfeir.dev/content/images/2025/06/image-20.png)](https://www.sfeir.dev/content/images/2025/06/image-20.png)

le jeu Blockade

C’est à la fin des années 1990 que Snake atteint un public mondial, en se glissant dans la poche de millions d’utilisateurs : **le jeu est pré-installé sur le Nokia 6110 en 1997 (**codé par [Taneli Armanto](https://www.linkedin.com/in/taneli-armanto-4242145/?originalSubdomain=fi&ref=sfeir.dev)), puis sur le célèbre **Nokia 3310** en **2000**.

[![](https://www.sfeir.dev/content/images/2025/06/image-22.png)](https://www.sfeir.dev/content/images/2025/06/image-22.png)

Le 3310, un téléphone indestructible

  
Avec son écran monochrome et ses touches directionnelles, ce téléphone bon marché devient un phénomène culturel. **Snake** y est simple, rapide et addictif. Il devient un rituel de salle d’attente, de métro ou de cour de récréation. Aucun téléchargement, aucun tutoriel, juste une pression sur la touche de démarrage, et c’était parti.  
À son apogée, Snake est présent sur **plus de 400 millions de téléphones**, ce qui en fait l’un des jeux vidéo les plus joués de tous les temps.

## Implémenter Snake en Python

L’implémentation que je vous propose repose sur **Pygame**, une bibliothèque [Python](https://www.sfeir.dev/kesaco-python/) bien établie pour créer des jeux 2D de manière simple et structurée.  
Le code s’articule autour de **trois entités principales** : `Serpent`, qui gère le déplacement du joueur, `Nourriture`, qui représente les éléments à collecter, et enfin `Jeu`, qui orchestre l’ensemble du déroulement de la partie.

### 🐍 La classe `Serpent` : le cœur vivant du jeu

La classe `Serpent` représente le joueur lui-même. Elle gère l’état et le comportement du serpent à chaque instant de la partie.  
Elle incarne ainsi le **mécanisme central** du jeu Snake, avec toutes les responsabilités associées à un objet dynamique en mouvement.

#### Position et structure

Le serpent est modélisé comme une liste de segments (`self.segments`), chacun correspondant à une case du plateau. Par convention, le premier élément de la liste représente la tête, tandis que les autres forment le corps.

```python
class Serpent:
    def __init__(self):
        self.segments = [(0, 0), (-20, 0), (-40, 0)]
        self.direction = "DROITE"
        self.derniere_direction = "DROITE"
        self.tete = self.segments[0]
```

À l’initialisation, le serpent est composé de trois segments alignés horizontalement, se déplaçant vers la droite.

#### Déplacement

La méthode `deplacer` assure le mouvement fluide du serpent. Elle repose sur deux étapes :

- Le corps suit la tête en copiant la position du segment précédent.
- La tête avance d’une case dans la direction choisie.

```python
def deplacer(self):
    # Déplacer le corps
    for i in range(len(self.segments) - 1, 0, -1):
        self.segments[i] = self.segments[i-1][:]
    
    # Déplacer la tête
    x, y = self.segments[0]
    if self.direction == "DROITE":
        x += TAILLE_CASE
    elif self.direction == "GAUCHE":
        x -= TAILLE_CASE
    elif self.direction == "HAUT":
        y -= TAILLE_CASE
    elif self.direction == "BAS":
        y += TAILLE_CASE
    
    self.segments[0] = (x, y)
    self.tete = self.segments[0]
    self.derniere_direction = self.direction
```

Le jeu garde en mémoire la dernière direction prise, afin d’interdire les demi-tours instantanés qui provoqueraient une collision immédiate, et donc un game over instantané.

#### Croissance

Lorsqu'une pomme est consommée, la méthode `grandir` est invoquée. Elle ajoute un segment à l’arrière du serpent, prolongeant visuellement son corps.

```python
def grandir(self):
    # Ajouter un segment à la fin
    self.segments.append(self.segments[-1][:])
```

#### Collisions

Deux types de collisions entraînent une fin de partie :

- Collision contre un mur :

```python
def collision_mur(self):
    x, y = self.tete
    return x < 0 or x >= LARGEUR or y < 0 or y >= HAUTEUR
```

- collision avec soi-même :

```python
def collision_soi_meme(self):
    return self.tete in self.segments[1:]
```

#### Affichage

La méthode `dessiner` donne vie au serpent à l’écran.

```python
def dessiner(self, surface):
    for i, segment in enumerate(self.segments):
        x, y = segment
        
        if i == 0:  # Tête du serpent
            # Corps de la tête (cercle vert plus grand)
            pygame.draw.circle(surface, VERT, (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2)
            # Yeux (cercles noirs)
            if self.direction == "DROITE":
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 + 3, y + TAILLE_CASE//2 - 3), 2)
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 + 3, y + TAILLE_CASE//2 + 3), 2)
            elif self.direction == "GAUCHE":
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 - 3, y + TAILLE_CASE//2 - 3), 2)
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 - 3, y + TAILLE_CASE//2 + 3), 2)
            elif self.direction == "HAUT":
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 - 3, y + TAILLE_CASE//2 - 3), 2)
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 + 3, y + TAILLE_CASE//2 - 3), 2)
            elif self.direction == "BAS":
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 - 3, y + TAILLE_CASE//2 + 3), 2)
                pygame.draw.circle(surface, NOIR, (x + TAILLE_CASE//2 + 3, y + TAILLE_CASE//2 + 3), 2)
            # Langue (petit rectangle rouge)
            if self.direction == "DROITE":
                pygame.draw.rect(surface, ROUGE, (x + TAILLE_CASE, y + TAILLE_CASE//2 - 1, 3, 2))
            elif self.direction == "GAUCHE":
                pygame.draw.rect(surface, ROUGE, (x - 3, y + TAILLE_CASE//2 - 1, 3, 2))
            elif self.direction == "HAUT":
                pygame.draw.rect(surface, ROUGE, (x + TAILLE_CASE//2 - 1, y - 3, 2, 3))
            elif self.direction == "BAS":
                pygame.draw.rect(surface, ROUGE, (x + TAILLE_CASE//2 - 1, y + TAILLE_CASE, 2, 3))
        
        else:  # Corps du serpent
            # Corps principal (cercle vert)
            pygame.draw.circle(surface, VERT, (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2 - 1)
            # Détail du corps (petit cercle plus foncé)
            pygame.draw.circle(surface, (0, 200, 0), (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2 - 3)
            pygame.draw.circle(surface, (0, 150, 0), (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2 - 5)
            pygame.draw.circle(surface, (0, 100, 0), (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2 - 7)
            pygame.draw.circle(surface, (0, 50, 0), (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2 - 9)
            pygame.draw.circle(surface, (0, 5, 0), (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2 - 11)
```

### 🍎 La classe `Nourriture` : la récompense du parcours

Dans le jeu Snake, la nourriture est bien plus qu’un simple objet à collecter : **elle rythme la partie**, provoque la croissance du serpent, et définit les objectifs successifs du joueur. La classe `Nourriture` est donc conçue pour représenter cet élément central.

#### Initialisation

Lors de l’instanciation, la pomme se voit attribuer une position **aléatoire sur la grille**, tout en veillant à ne pas apparaître sur le corps du serpent.

```python
def __init__(self, serpent):
    self.position = self.generer_position(serpent)
    self.font = pygame.font.SysFont(None, TAILLE_CASE + 5)
```

Le constructeur prend une instance de `Serpent` en paramètre pour éviter les collisions dès l’apparition de la pomme.

#### Génération d’une position libre

La méthode `generer_position` utilise une boucle `while` pour tirer au sort une position libre sur la grille, c’est-à-dire **en dehors du corps du serpent** :

```python
def generer_position(self, serpent):
    while True:
        x = random.randint(0, (LARGEUR - TAILLE_CASE) // TAILLE_CASE) * TAILLE_CASE
        y = random.randint(0, (HAUTEUR - TAILLE_CASE) // TAILLE_CASE) * TAILLE_CASE
        if (x, y) not in serpent.segments:
            return (x, y)
```

Ce mécanisme garantit une génération toujours valide, même quand le serpent devient très long (ce qui peut arriver si vous n'êtes pas mauvais).

#### Affichage

La méthode `dessiner` met en valeur la pomme avec un soin esthétique particulier (tout est dans le détail). Elle n’est pas simplement un carré rouge, mais une petite pomme stylisée, composée de plusieurs éléments graphiques :

```python
def dessiner(self, surface):
    x, y = self.position
    # Dessiner une pomme stylisée
    # Corps de la pomme (cercle rouge)
    pygame.draw.circle(surface, ROUGE, (x + TAILLE_CASE//2, y + TAILLE_CASE//2), TAILLE_CASE//2 - 2)
    # Tige de la pomme (rectangle marron)
    pygame.draw.rect(surface, (139, 69, 19), (x + TAILLE_CASE//2 - 1, y, 2, 4))
    # Feuille (petit rectangle vert)
    pygame.draw.rect(surface, VERT, (x + TAILLE_CASE//2 + 2, y + 2, 3, 2))
```

### 🎮 La classe `Jeu` : chef d’orchestre de l’expérience Snake

Dans tout projet structuré, il faut une entité centrale, une sorte de **maître de cérémonie**. C’est précisément le rôle de la classe `Jeu`, qui incarne ici la logique principale du programme Snake, de l’affichage au contrôle des événements.

#### Initialisation

Le constructeur pose les fondations du jeu : création de la fenêtre, instanciation des objets principaux et mise en place des états initiaux.

```python
def __init__(self):
    self.ecran = pygame.display.set_mode((LARGEUR, HAUTEUR))
    pygame.display.set_caption("🐍 Snake Game")
    self.horloge = pygame.time.Clock()
    self.font = pygame.font.SysFont(None, 36)
    
    self.serpent = Serpent()
    self.nourriture = Nourriture(self.serpent)
    self.score = 0
    self.en_cours = True
    self.pause = False
```

- Le serpent et la nourriture sont créés.
- Le score est initialisé à zéro.
- Des flags `en_cours` et `pause` permettent de contrôler le flux du jeu.

#### Gestion des événements

Cette méthode surveille les entrées clavier et les événements système (comme la fermeture de la fenêtre).

```python
def gerer_evenements(self):
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            return False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and self.serpent.derniere_direction != "BAS":
                self.serpent.direction = "HAUT"
            elif event.key == pygame.K_DOWN and self.serpent.derniere_direction != "HAUT":
                self.serpent.direction = "BAS"
            elif event.key == pygame.K_LEFT and self.serpent.derniere_direction != "DROITE":
                self.serpent.direction = "GAUCHE"
            elif event.key == pygame.K_RIGHT and self.serpent.derniere_direction != "GAUCHE":
                self.serpent.direction = "DROITE"
            elif event.key == pygame.K_SPACE:
                self.pause = not self.pause
    return True
```

Cela garantit une jouabilité fluide, en empêchant notamment les demi-tours impossibles et en ajoutant une fonction pause.

#### Mise à jour de l’état du jeu

Cette méthode contient le cœur de la logique. Elle est appelée à chaque "tick" du jeu, sauf en pause.

```python
def mettre_a_jour(self):
    if self.pause:
        return
        
    self.serpent.deplacer()
    
    # Vérifier collision avec nourriture
    if self.serpent.tete == self.nourriture.position:
        self.score += 10
        self.serpent.grandir()
        self.nourriture = Nourriture(self.serpent)
    
    # Vérifier collisions
    if self.serpent.collision_mur() or self.serpent.collision_soi_meme():
        self.en_cours = False
```

- Le serpent avance.
- Si une pomme est mangée, il grandit et on en génère une nouvelle.
- Si une collision se produit, le jeu s’arrête.

#### Boucle principale

La méthode `executer` contient la **boucle de vie du jeu**. C’est ici que tout s’enchaîne, tant que le jeu est actif :

```python
def executer(self):
    while self.en_cours:
        if not self.gerer_evenements():
            break
        
        self.mettre_a_jour()
        self.dessiner()
        self.horloge.tick(FPS)
    
    # Attendre un peu avant de fermer
    pygame.time.wait(2000)
    pygame.quit()
    print(f"💀 Game Over - Score final: {self.score}")
```

Elle appelle dans l’ordre :

1. Les événements clavier (direction, pause…)
2. La mise à jour de l’état
3. L’affichage
4. Un temps de pause pour contrôler la vitesse

## Conclusion

Ce Snake codé en Python démontre qu’un **jeu intemporel** peut renaître dans un langage moderne.

Reprogrammer Snake, c’est rendre hommage à un pilier du jeu vidéo, tout en affûtant sa logique, sa rigueur et sa créativité. Le serpent continue de ramper, pixel après pixel, dans l’imaginaire collectif des développeurs.

[![](https://www.sfeir.dev/content/images/2025/06/image-24.png)](https://www.sfeir.dev/content/images/2025/06/image-24.png)

Rendu de notre implémentation
