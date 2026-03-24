---
layout: "default"
title: "Les commandes git essentielles démystifiées"
permalink: "/product/les-commandes-git-essentielles-demystifiees/"
tags: [product]
date: "2024-04-05"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/product/draft-les-commande-git/"
banner: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDF8fGdpdHxlbnwwfHx8fDE3MDk1MzM4NDB8MA&ixlib=rb-4.0.3&q=80&w=2000"
published_at: "2024-04-05"
sfeir_slug: "draft-les-commande-git"
sfeir_tags: [Product, git, Tips]
---
## Mais dis-moi Jammy, c'est quoi Git ?

Et bien Fred, Git c'est comme un gros bouton "annuler" pour ton projet. Imagine que tu dessines un beau dessin et que tu veux essayer quelque chose de nouveau, mais que tu as peur de gâcher ce que tu as déjà fait.  
Avec Git, tu peux enregistrer ton dessin tel qu'il est maintenant et essayer de nouvelles choses. Si tu n'aimes pas ce que tu as fait, tu peux appuyer sur le bouton "annuler" et revenir à ton dessin précédent.  
Tu peux aussi partager ton dessin avec tes amis et travailler dessus ensemble, et Git les aidera à combiner tous les changements.

## Mais plus sérieusement ?

Git est un système de contrôle de version décentralisé et open source, largement utilisé pour la gestion de projets, en particulier dans le développement de logiciels.  
Git permet de créer des dépôts locaux et distants, de cloner des dépôts existants, et de gérer les droits d'accès et les workflows de collaboration. En utilisant Git, les développeurs peuvent travailler sur des branches isolées les unes des autres, fusionner leurs modifications ultérieurement et résoudre les conflits éventuels de manière efficace.  
Il est conçu pour être efficace, fiable et capable de gérer des projets de toutes tailles.

## Les commandes de base

### git init

```bash
git init
```

commande git init

Cette commande initialise un nouveau dépôt Git dans le répertoire courant. Elle crée un nouveau sous-répertoire nommé `.git` qui contient tous les fichiers nécessaires pour la gestion de version Git. Après avoir exécuté cette commande, vous pouvez commencer à suivre les modifications apportées aux fichiers dans le répertoire.

````
master -- master -- master -- master
             \-- local (nouveau dépôt Git)
```

schéma explicatif git init

Dans cet exemple, `master` est la branche principale du dépôt distant. Lorsque vous exécutez `git init`, Git crée un nouveau dépôt Git local dans le répertoire courant, qui est représenté par la branche `local`.

### git clone

```bash
git clone <URL_du_dépôt>
```

commande git clone

Cette commande crée une copie locale d'un dépôt Git distant. Elle copie tous les fichiers du dépôt distant dans un nouveau répertoire local et crée une connexion entre le dépôt local et le dépôt distant. Vous pouvez utiliser cette commande pour obtenir une copie de travail d'un projet existant hébergé sur un dépôt Git distant.

### git add

```bash
git add <nom_du_fichier>
```

commande git add

Cette commande ajoute les modifications apportées aux fichiers à la zone de préparation pour le prochain commit.  
Vous pouvez spécifier un fichier particulier ou utiliser "." pour ajouter tous les fichiers modifiés.

````
master -- master -- master -- master
             \-- local -- local (fichiers modifiés)
```

schéma explicatif git add

Prenons un exemple où **fichier1.txt** et **fichier2.txt** ont été modifiés dans la branche `local`.  
Lorsque vous exécutez `git add fichier1.txt fichier2.txt`, Git ajoute les modifications apportées à ces fichiers à la zone de préparation.

### git commit

```bash
git commit -m "Message de commit"
```

commande git commit

Cette commande enregistre les modifications apportées aux fichiers dans l'historique du dépôt Git.  
Elle crée un nouveau commit qui contient les modifications sélectionnées à l'aide de la commande `git add`. Lorsque vous exécutez cette commande, vous devez fournir un message de commit décrivant les modifications apportées.

````
master -- master -- master -- master
             \-- local -- local (commit)
```

schéma explicatif git commit

les modifications apportées à **fichier1.txt** et **fichier2.txt** ont été ajoutées à la zone de préparation à l'aide de la commande `git add`.  
Lorsque vous exécutez `git commit`, Git crée un nouveau commit qui contient les modifications apportées aux fichiers.  
Le nouveau commit est ajouté à la branche `local`.

### git status

```bash
git status
```

commande git status

Cette commande affiche l'état des fichiers dans le répertoire de travail et la zone de préparation. Elle vous indique quels fichiers ont été modifiés, quels fichiers sont prêts à être validés et quels fichiers sont non suivis par Git.

### git log

```bash
git log
```

commande git log

Cette commande affiche l'historique des commits dans le dépôt Git. Elle vous permet de voir tous les commits que vous avez effectués dans votre dépôt, ainsi que les messages de commits associés.

### git branch

```bash
git branch
```

commande git branch

Cette commande affiche la liste des branches locales et indique la branche sur laquelle vous vous trouvez actuellement. L'astérisque (*) est placé à côté de la branche actuelle.

### git checkout

```bash
git checkout <branche>
```

commande git checkout

Cette commande bascule vers une autre branche ou restaure des fichiers dans l'état d'un commit. Elle vous permet de passer d'une branche à une autre et de modifier les fichiers de votre répertoire de travail pour qu'ils correspondent à l'état d'un commit spécifique.

### git merge

```bash
git merge <branche>
```

commande git merge

Cette commande fusionne les modifications d'une autre branche dans la branche courante. Elle combine les modifications apportées dans deux branches distinctes en une seule branche.

### git push

```bash
git push <remote> <branche>
```

commande git push

Cette commande envoie les commits locaux vers un dépôt Git distant. Elle transfère les modifications que vous avez commises localement vers le dépôt distant, de sorte que d'autres utilisateurs puissent les récupérer et les fusionner dans leur propre copie locale du dépôt.  
Vous devez spécifier le dépôt distant et la branche que vous souhaitez pousser.

````
master -- master -- master -- master
             \-- local -- local --/
```

schéma explicatif git push

vous avez créé un nouveau commit dans la branche `local` à l'aide de la commande `git commit`.  
Lorsque vous exécutez `git push`, Git envoie les commits locaux vers la branche `master` du dépôt distant.  
La branche `master` du dépôt distant est mise à jour avec les nouveaux commits. La branche `local` est également mise à jour pour refléter l'état de la branche `master` du dépôt distant.

### git pull

```bash
git pull <remote> <branche>
```

commande git pull

Cette commande récupère les commits distants et les fusionne dans votre branche locale. Cela met à jour votre dépôt local avec les dernières modifications du dépôt distant.

### Organisation

[![](https://www.sfeir.dev/content/images/2024/03/git.drawio.png)](https://www.sfeir.dev/content/images/2024/03/git.drawio.png)

git workflow

Voici comment s'organisent les différentes commandes mentionnées ci-dessus.

### Tester les commandes

Si Git vous parait toujours obscur, vous pouvez aller ici :

[

Explain Git with D3

![](https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://github.io/explain-git-with-d3/&size=128)

![](https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png)

](https://onlywei.github.io/explain-git-with-d3/?ref=sfeir.dev)

Sur ce site vous aurez la possibilité de taper des commandes dans une interface de ligne de commande et de voir immédiatement des graphiques représentant le résultat de ces dernières.
