---
layout: "default"
title: "L'armée des singes du chaos - définition"
permalink: "/definition/l-armee-des-singes-du-chaos-definition/"
tags: [definition]
date: "2025-02-24"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/armee-des-singes-du-chaos-definition/"
banner: "https://www.sfeir.dev/content/images/2025/02/simainArmy.png"
published_at: "2025-02-24"
sfeir_slug: "armee-des-singes-du-chaos-definition"
sfeir_tags: [Késaco, open source, Netflix, DevOps, chaos, Chaos Engineering]
---
Dans un monde où les systèmes informatiques sont de plus en plus distribués et complexes, garantir leur **résilience** est devenu un enjeu majeur.  
Une [panne peut entraîner des pertes financières colossales](https://www.sfeir.dev/cloud/defaillance-globale-de-microsoft-une-crise-revelatrice-des-dependances-numeriques-mondiales/), une dégradation de l’expérience utilisateur et une perte de confiance des clients. Pourtant, tester la robustesse d’une architecture logicielle est souvent négligé, car cela implique de simuler des défaillances en conditions réelles.

C’est dans ce contexte qu’est née la pratique du **Chaos Engineering**, une approche qui consiste à introduire volontairement des perturbations pour identifier et corriger les points faibles d’un système.  
L’un des outils les plus emblématiques de cette philosophie est **Chaos Monkey**, développé par [Netflix](https://www.sfeir.dev/tendances/netflix-fete-ses-10-ans-en-france/), qui permet de tester la tolérance aux pannes d’un environnement en perturbant intentionnellement ses services.

## Origine

Le concept de **Chaos Monkey** trouve ses racines chez Netflix, pionnier du **Chaos Engineering**. Face à l’essor du cloud et des architectures distribuées, Netflix a rapidement compris que la robustesse de son infrastructure [ne pouvait pas se limiter aux seuls tests unitaires et d’intégration classiques](/product/pourquoi-tester-son-code/).

En 2011, [**Yury Izrailevsky**](https://www.linkedin.com/in/yuryizrailevsky/?ref=sfeir.dev) et [**Ariel Tseitlin**](https://www.linkedin.com/in/atseitlin/?ref=sfeir.dev) alors ingénieurs chez Netflix, ont eu l'idée de mettre en place un outil qui provoquerait des pannes dans l’environnement de production.  
L'idée ? Passer d'un modèle où les équipes construisent un logiciel en espérant qu'il n'y aura pas de pannes à un modèle où elles sauront qu'il y aura une panne.  
L’objectif était simple : s’assurer que l’infrastructure pouvait continuer à fonctionner normalement malgré ces interruptions.

> Imaginez un singe s’introduisant dans un centre de données, ces « fermes » de serveurs qui hébergent toutes les fonctions critiques de nos activités en ligne. Le singe arrache au hasard des câbles, détruit des appareils et retourne tout ce qui lui passe sous la main. Le défi pour les responsables informatiques est de concevoir le système d’information dont ils ont la charge pour qu’il puisse fonctionner malgré ces singes, dont personne ne sait jamais ni quand ils arrivent ni ce qu’ils vont détruire.

En 2012, Netflix a rendu le code de cet outil [open source](https://www.sfeir.dev/tag/open-source/).

[

GitHub - Netflix/chaosmonkey: Chaos Monkey is a resiliency tool that helps applications tolerate random instance failures.

Chaos Monkey is a resiliency tool that helps applications tolerate random instance failures. - Netflix/chaosmonkey

![](https://www.sfeir.dev/content/images/icon/pinned-octocat-093da3e6fa40-12.svg)GitHubNetflix

![](https://www.sfeir.dev/content/images/thumbnail/chaosmonkey)

](https://github.com/Netflix/chaosmonkey/tree/master?ref=sfeir.dev)

## L'armée des singes

Cette approche s’est ensuite étendue avec le développement de la **Simian Army**, chaque singe conçu pour tester un aspect spécifique de la résilience des systèmes :

- **Chaos Monkey** : Arrête aléatoirement des instances de services pour tester la tolérance aux pannes.
- **Latency Monkey** : Introduit artificiellement une latence réseau pour tester la capacité d’un service à fonctionner avec des délais élevés.
- **Conformity Monkey** : Vérifie que toutes les instances respectent les règles et bonnes pratiques définies.
- **Doctor Monkey** : Surveille la santé des instances et supprime celles qui présentent des dysfonctionnements.
- **Janitor Monkey** : Nettoie automatiquement les ressources inutilisées ou mal configurées.
- **Security Monkey** : Détecte les failles de sécurité et signale les vulnérabilités potentielles.
- **10-18 Monkey** : Détecte les problèmes de localisation de langage.
- **Chaos Gorilla** : Simule une panne complète d’un centre de données pour tester la capacité de basculement d’un système.
- **Chaos Kong** : Simule une défaillance à grande échelle d’une région entière dans un environnement cloud.

## Pourquoi introduire du chaos ?

Introduire des pannes volontairement dans un système est une idée étrange qui peut paraitre contre-intuitive aux premiers abords, mais cette approche présente son lot d'avantages :

- **Anticiper les pannes** : En simulant des scénarios de défaillance, il est possible d’identifier les faiblesses d’un système avant qu’une vraie panne ne survienne.
- **Améliorer la tolérance aux pannes** : Un système robuste doit être capable de fonctionner même lorsqu’un ou plusieurs composants tombent en panne. Le Chaos Engineering permet de tester cette capacité et d’optimiser la redondance.
- **Optimiser l’architecture** : En testant différents types de pannes, on peut identifier les goulets d’étranglement et les améliorations à apporter aux architectures distribuées.

## Conclusion

Dans un contexte où l’indisponibilité d’un service peut avoir des conséquences désastreuses, la résilience des systèmes est devenue un enjeu stratégique. L’approche du Chaos Engineering, et notamment l’utilisation d’outils comme **Chaos Monkey**, permet de tester et d’améliorer la tolérance aux pannes d’une infrastructure avant qu’un incident réel ne survienne.

Plutôt que de subir les pannes, mieux vaut les provoquer en environnement contrôlé pour en tirer des enseignements. Cette philosophie, adoptée par Netflix et bien d’autres entreprises, s’impose progressivement comme une pratique incontournable du DevOps moderne. Intégrer le chaos dans les tests, c’est finalement s’assurer que l’ordre sera maintenu en cas de crise.
