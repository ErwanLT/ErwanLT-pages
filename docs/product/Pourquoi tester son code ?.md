---
layout: "default"
title: "Pourquoi tester son code ?"
permalink: "/product/pourquoi-tester-son-code/"
tags: [product]
date: "2023-06-16"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/product/pourquoi-tester-son-code/"
banner: "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDR8fHRlc3R8ZW58MHx8fHwxNjg2NDA5NDE4fDA&ixlib=rb-4.0.3&q=80&w=2000"
published_at: "2023-06-16"
sfeir_slug: "pourquoi-tester-son-code"
sfeir_tags: [Product]
---
# Quels sont les buts des tests

Qui n'a jamais entendu le fameux :

> Tester c'est douter!

En développement logiciel il est important de tester pour garantir la **fiabilité** et la **qualité** de ce que nous produisons.  
Il est important de toujours nous remettre en question, car nous sommes humains et l'erreur est humaine.  
Les tests permettent de détecter les **erreurs**, les **bugs** et les **comportements indésirables**, et de s'assurer du bon fonctionnement de nos applications.

Exemples d'erreurs qui auraient pu être évitées grâce à des tests :

- [le vol 501 d'ariane 5](https://fr.wikipedia.org/wiki/Vol_501_d%27Ariane_5?ref=sfeir.dev)
- [le crash de la sonde Mars Polar Lander](https://fr.wikipedia.org/wiki/Mars_Polar_Lander?ref=sfeir.dev#R%C3%A9sultats_de_l'enqu%C3%AAte_sur_la_perte_de_la_sonde_spatiale)
- [Panne de courant nord-américaine de 2003](https://fr.wikipedia.org/wiki/Panne_de_courant_nord-am%C3%A9ricaine_de_2003?ref=sfeir.dev)

# Les avantages des tests

## Détection des erreurs

Les tests sont essentiels pour **identifier les erreurs** potentielles dans le code. Même les programmeurs les plus expérimentés peuvent commettre des erreurs, et les tests aident à les trouver avant qu'elles ne deviennent des problèmes majeurs.

## Amélioration de la qualité

Tester son code de manière approfondie contribue à **améliorer la qualité globale** du logiciel. En identifiant les erreurs et les comportements indésirables, les tests permettent de corriger rapidement les problèmes et d'**améliorer la stabilité du logiciel**. Cela permet également de s'assurer que le logiciel répond aux spécifications et aux exigences fonctionnelles définies initialement.

## Réduction des coûts

Tester son code dès le début du processus de développement permet de **réduire les coûts** associés à la correction des erreurs à un stade ultérieur. En détectant et en corrigeant les problèmes tôt dans le processus, on **évite les surcoûts** liés à la correction de bugs dans un logiciel déjà déployé. De plus, les tests automatisés permettent d'économiser du temps et des ressources en automatisant le processus de vérification du code.

# Les différents types de test

[![Pyramide des tests](https://www.sfeir.dev/content/images/2023/06/image-1.png)](https://www.sfeir.dev/content/images/2023/06/image-1.png)

La pyramide de tests est un concept largement utilisé dans le domaine du développement logiciel pour hiérarchiser et organiser les différents types de tests à effectuer sur un projet. Elle propose une approche stratégique pour la planification des tests, en mettant l'accent sur l'équilibre entre les différents niveaux de tests. Voici les principaux niveaux de la pyramide de tests, du bas vers le haut :

## Tests unitaires

Les tests unitaires sont les tests les plus **fondamentaux** et sont effectués au niveau des composants individuels du logiciel, tels que les fonctions, les classes ou les modules. Ils sont généralement écrits et exécutés par les développeurs eux-mêmes pour vérifier le bon fonctionnement des parties isolées du code. Les tests unitaires visent à **valider le comportement des unités de code** de manière indépendante et à identifier les erreurs dès que possible.

## Tests d'intégration

Les tests d'intégration sont réalisés pour vérifier le bon fonctionnement des **interactions entre les différentes unités de code**, une fois celles-ci intégrées. Ils s'assurent que les composants fonctionnent correctement ensemble et que les données sont transmises de manière adéquate entre les différentes parties du système. Les tests d'intégration permettent de détecter les problèmes liés à la **communication** et à la **compatibilité** entre les modules.

## Tests fonctionnels

Les tests fonctionnels sont des tests plus larges qui vérifient le bon fonctionnement du logiciel du **point de vue de l'utilisateur final**. Ils s'assurent que le logiciel répond aux spécifications et aux exigences fonctionnelles. Les tests fonctionnels peuvent être automatisés ou effectués manuellement, et ils couvrent **les cas d'utilisation principaux** du logiciel pour valider ses fonctionnalités de manière complète.

## Témoignages de bonnes pratiques rencontrées

> Dans une de mes précédentes mission, les merges request envoyées au lead tech devaient absolument avoir les tests unitaires mis à jour sous peine de ne pas être approuvées.  
> [LE TUTOUR Erwan](https://www.linkedin.com/in/erwan-le-tutour-32904972/?ref=sfeir.dev) - développeur back

# Les mauvaises pratiques dans la réalité des projets

[![Pyramide de tests inversée](https://www.sfeir.dev/content/images/2023/06/image-2.png)](https://www.sfeir.dev/content/images/2023/06/image-2.png)

La pyramide des tests inversée est l'un des plus beaux exemples de **mauvaises pratiques**. Cela se produit souvent lorsque les tests unitaires ont été négligés dans les premières phases du projet. Pour remédier à cette lacune, les développeurs se retrouvent à créer rapidement des tests fonctionnels et d'intégration afin de couvrir le plus de code possible en un laps de temps réduit.

Cette répartition des tests entraîne une diminution significative de la maintenabilité du produit développé. Il devient plus difficile pour les développeurs de le faire évoluer dans le temps.  
Très rapidement, les tests déjà mis en place deviennent obselètes ce qui entraine :

- Des **surcoûts** liés à leurs corrections et à l'ajout de nouveaux tests.
- La mise en place de tests manuels souvent **peu efficace**.

## Témoignages de mauvaises pratiques rencontrées

> Lors d'une de mes missions, certains tests qui n'étaient plus à jour étaient annotés comme ignorés pour ne pas bloquer les builds.  
> BENKERROU Noreddine - developpeur PHP

> Les tests mis en place étaient difficilement maintenables et contenaient trop de duplica de code souvent non utilisé correctement.  
> [MAMECHE Ismael](https://www.linkedin.com/in/ismael-mameche-79857171/?ref=sfeir.dev) - développeur back

> En pleine période de NAO (Négociation Annuelle Obligatoire) qui est une période avec un timing très serré, des évolutions sont nécessaires, mais non seulement l'ingénieur applicatif en charge de ses évolutions est tombé malade, mais le code applicatif n'avait pas de tests, ce qui fait que son remplaçant son code apporté des modification et livrait en prod sans testé, ce qui entrainait à chaque fois des régressions : perte de temps + surcoûts  
> [LE TUTOUR Amélie](https://www.linkedin.com/in/am%C3%A9lie-le-tutour-39350180/?ref=sfeir.dev) - Manager Consultant RH & SIRH

# Pour résumer

Les tests permettent de :

- Réduire le nombre de vérifications manuelles
- Garantir la qualité et la stabilité de ce qui est développé
- Vérifier les intéractions entre les différents composants logiciels
- Éviter des potentiels surcoûts futurs
