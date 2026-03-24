---
layout: "default"
title: "DDD - Définition"
permalink: "/definition/ddd-definition/"
tags: [definition]
date: "2025-02-12"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/ddd-definition/"
banner: "https://www.sfeir.dev/content/images/2025/01/B9723937725Z.1_20200706154017_000-GJKG9MMEQ.1-0.png.jpg"
published_at: "2025-02-12"
sfeir_slug: "ddd-definition"
sfeir_tags: [Késaco, design, bonnes pratiques, Définition, DDD]
---
Dans le monde du développement, on entend souvent parler de **DDD**, mais cela peut prêter à confusion, car ce terme peut désigner deux concepts distincts :

- **Domain-Driven Design** (Conception pilotée par le domaine)
- **Design-Driven Development** (Développement piloté par le design)

Ces deux approches ont des objectifs différents et sont appliquées dans des contextes variés. Cet article explore leurs différences et leurs implications.

Et pour ceux qui n'ont pas la référence de l'image de couverture, on vous présente Dédé !

## Domain-Driven Design

### Qu'est-ce que le Domain-Driven Design ?

Le **Domain-Driven Design (DDD)** est une approche de conception logicielle introduite par [**Eric Evans**](https://www.linkedin.com/in/ericevansddd/?ref=sfeir.dev) en [2003](https://fabiofumarola.github.io/nosql/readingMaterial/Evans03.pdf?ref=sfeir.dev). Son objectif principal est de modéliser les logiciels en se basant sur le domaine métier, en mettant l'accent sur une collaboration étroite entre les développeurs et les experts métier.

### Principes clés

1. **Modèle du domaine** : une représentation logique du problème métier dans le code.
2. **Langage omniprésent** : un vocabulaire commun entre développeurs et experts métier pour décrire le domaine.
3. **Contextes bornés** : des sous-domaines bien définis pour segmenter la complexité du système.
4. **Entités et Valeurs objets** : distinction entre objets ayant une identité unique et objets définis par leurs propriétés.
5. **Agrégats** : groupes d'objets cohérents qui assurent la cohérence des opérations.
6. **Dépôts et Services** : gestion des objets et logique métier externalisée.

### Quand utiliser le Domain-Driven Design ?

- Applications complexes avec une forte logique métier (ERP, logiciels de gestion).
- Projets nécessitant une compréhension approfondie du domaine métier.
- Logiciels évolutifs qui doivent refléter fidèlement les règles métier.

## Design-Driven Development

### Qu'est-ce que le Design-Driven Development ?

Le **Design-Driven Development (DDD)** est une approche de développement qui place la conception (UX/UI et architecture logicielle) au centre du processus de création d'un logiciel.

### Principes clés

1. **Expérience utilisateur avant tout** : la conception est guidée par les besoins des utilisateurs finaux.
2. **Prototypage rapide** : création de maquettes et tests précoces pour valider l'ergonomie.
3. **Retour utilisateur continu** : amélioration constante basée sur les retours des utilisateurs.
4. **Pensée design** : approche centrée sur la résolution de problèmes et l'innovation.
5. **Itération et amélioration progressive** : cycle de développement adaptatif et agile.

### Quand utiliser le Design-Driven Development ?

- Applications grand public avec une forte exigence en UX/UI (applications mobiles, plateformes web).
- Produits innovants où l'expérience utilisateur est déterminante.
- Projets qui nécessitent une validation rapide des idées et concepts.

## Comparaison entre Domain-Driven Design et Design-Driven Development

|Critère|Domain-Driven Design|Design-Driven Development|
|---|---|---|
|**Objectif**|Alignement du code avec les règles métier|Priorité à l'expérience utilisateur|
|**Focus**|Domaine métier, architecture et code|UX, ergonomie, interactions utilisateur|
|**Méthodologie**|Modélisation du domaine, entités, agrégats, dépôts|Pensée design, prototypage rapide, retour utilisateur|
|**Utilisation**|Applications métier complexes (ERP, logiciels de gestion)|Interfaces web et mobiles orientées utilisateur|

## Conclusion

Les deux approches **DDD** sont complémentaires et peuvent coexister dans un même projet. **Domain-Driven Design** est idéal pour structurer un système autour du domaine métier, tandis que **Design-Driven Development** est crucial pour assurer une expérience utilisateur optimale.

En fonction du projet, il est possible d'utiliser l'un, l'autre, ou une combinaison des deux pour créer des applications à la fois robustes et intuitives.
