---
layout: "default"
title: "Papa, je veux un Pokédex - Partie 1"
permalink: "/back/java/spring-boot/papa-je-veux-un-pokedex-partie-1/"
tags: [back, java, spring-boot]
date: "2024-11-08"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/papa-je-veux-un-pokedex-partie-1/"
banner: "https://images.unsplash.com/photo-1638613067237-b1127ef06c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDh8fHBva2ViYWxsfGVufDB8fHx8MTcyNzI0ODY4OXww&ixlib=rb-4.0.3&q=80&w=2000"
published_at: "2024-11-08"
sfeir_slug: "papa-je-veux-un-pokedex-partie-1"
sfeir_tags: [Back, postman, html, CSS, JavaScript, pokédex]
---
Ah, nos chères petites têtes blondes ! Dès que le petit a compris que papa n'était pas [[Papa, dessine-moi un programme|créateur de bugs, mais bel et bien un créateur d'applications magiques]], il a tout de suite cherché comment cela pouvait servir ses intérêts (malin, la guêpe).

Et comme la majorité des enfants de son âge, il a pour centre d'intérêt les petites (et les grandes) créatures d'une firme nippone : les Pokémon.

Et s'il y'a bien un objet de cette franchise autre que la [poké ball](https://fr.wikipedia.org/wiki/Pok%C3%A9_Ball?ref=sfeir.dev) qui fait rêver les enfants, c'est bien le [pokédex](https://fr.wikipedia.org/wiki/Pok%C3%A9dex?ref=sfeir.dev), cette encyclopédie qui contient toutes les informations sur ces monstres et qui tient dans la poche.

Vous voyez où je veux en venir ? Il ne lui a pas fallut 30 secondes pour qu'il me regarde comme ceci,

[![Pikachu Cute GIF - Pikachu Cute Pokemon - Discover & Share GIFs](https://media.tenor.com/hdDOeKyj2oUAAAAM/pikachu-cute.gif)](https://media.tenor.com/hdDOeKyj2oUAAAAM/pikachu-cute.gif)

Et me dise avec tout son sérieux : **Papa, je veux un pokédex!**

## Première solution : Postman

Bien qu'il existe [une alternative à Postman : Bruno](https://www.sfeir.dev/back/use-bruno/), je reste attaché à celui-ci et décide donc de trouver une API me permettant d'aller à la pèche aux infos sur ces petite bête.  
Google étant le meilleur ami des développeurs, je n'ai pas eu à chercher longtemps avant de trouver mon bonheur.  
Le contrat d'API est simple, je passe en paramètre le numéro et hop j'ai ma réponse.  
Plus qu'a créer un template HTML dans les scripts de test Postman pour avoir une mise en forme.

**Résultat :**

[![](https://www.sfeir.dev/content/images/2024/07/image-7.png)](https://www.sfeir.dev/content/images/2024/07/image-7.png)

Et la première réflexion de mon fils, "**c'est moche !"**

[![](https://media.tenor.com/ihqN6a3iiYEAAAAC/pikachu-shocked-face-stunned.gif)](https://media.tenor.com/ihqN6a3iiYEAAAAC/pikachu-shocked-face-stunned.gif)

piqué dans mon orgueil

OK, je l'avoue c'est loin d'être beau (voir très loin).

## Deuxième solution : Postman Flows

[Comme expliqué dans cet article](https://www.sfeir.dev/product/presentation-postman-flows/), Postman Flows permet d'organiser ses requêtes en workflow et de visualiser et manipuler le contenu de vos réponses afin de pouvoir consolider la sortie de vos flux.

Donc c'est parti pour un tour :

- requête
- résultat
- consolidation dans un template markdown.

[![](https://www.sfeir.dev/content/images/2024/08/image.png)](https://www.sfeir.dev/content/images/2024/08/image.png)

Là encore rien de bien joli, j'ai même droit à une remarque acide.

> Papa ! C'est encore plus moche !

[![](https://media.tenor.com/fZN_B3_DRE4AAAAC/pokemon-pikachu.gif)](https://media.tenor.com/fZN_B3_DRE4AAAAC/pokemon-pikachu.gif)

il commence à me chercher le petit

## Troisième solution : HTML + Javascript

Sans doute la solution la plus simple, surtout qu'avec un peu de recherche google on peut trouver des codepen assez sympa pour avoir un rendu fidèle à celui du dessin animé :

Mais comme je suis curieux, je préfère continuer à chercher voir si je ne trouve pas quelque chose de moins front, quelque chose qui me permettrait de faire tout ça sans le faire directement.

Découvrez la suite de la création d'un Pokédex dans [[Papa, je veux un Pokédex - partie 2|le prochain article]] !
