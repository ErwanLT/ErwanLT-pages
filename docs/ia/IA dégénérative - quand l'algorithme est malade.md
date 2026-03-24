---
layout: "default"
title: "IA dégénérative - quand l'algorithme est malade"
permalink: "/ia/ia-degenerative-quand-l-algorithme-est-malade/"
tags: [ia]
date: "2024-11-04"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/ia/ia-degenerative-quand-lalgorithme-est-malade-2/"
published_at: "2024-11-04"
sfeir_slug: "ia-degenerative-quand-lalgorithme-est-malade-2"
sfeir_tags: [IA, Algorithmes, LLM]
banner: "https://www.sfeir.dev/content/images/size/w1304/2024/10/_d8cafd57-b486-4349-8ab5-3f7aa7772025.jpeg"
banner_y: "0.5"
---
Imaginez un jeu de téléphone arabe, où chaque personne répète ce qu'elle a entendu de la précédente. À mesure que le message est transmis, il devient de plus en plus déformé, jusqu'à n'avoir plus aucun sens. C'est un peu ce qui pourrait arriver avec les modèles d'intelligence artificielle (IA) si on les entraîne à partir de données générées par d'autres IA.  
Ce phénomène, appelé "**IA dégénérative**" ou encore "dégénérescence des modèles d'IA", représente un défi grandissant pour l'avenir de l'intelligence artificielle.

## Quand l'IA tourne en boucle

L'intelligence artificielle, lorsqu'elle est bien entraînée, est un outil formidable pour traiter des informations, résoudre des problèmes complexes ou encore générer du contenu de manière créative.  
Cependant, pour maintenir ce niveau de qualité, ces modèles doivent être nourris (entrainés) avec des données de qualité, généralement issues d'humains.  
Le problème survient lorsque des IA commencent à être réentraînées sur des données créées par d'autres IA, ou pire, par elles-mêmes. Des chercheurs de Cambridge ont étudié ce phénomène et ont constaté que l'utilisation de données générées par IA pour enrichir un modèle d'IA conduit progressivement à [l'effondrement de la qualité](https://www.lebigdata.fr/lia-est-en-train-de-sauto-detruire-et-lindustrie-commence-a-paniquer?ref=sfeir.dev) de ses résultats.

  
Dans ce contexte, imaginez que vous donnez à manger à l'IA ses propres prédictions ou généralisations. À chaque génération, la qualité du contenu se détériore un peu plus, au point que les modèles deviennent moins précis, moins pertinents, et génèrent de plus en plus de résultats erronés. Les chercheurs appellent ce processus [une boucle "**autophage**" (qui se consomme elle-même)](https://next.ink/980/les-ia-generatives-tournent-mal-quand-elles-sont-entrainees-sur-leurs-propres-donnees/?ref=sfeir.dev).

## Un problème de données et de feedback

À l’origine, les IA sont entraînées sur des corpus de données massifs, collectés à partir d’actions humaines :

- Des textes
- [Des images](https://www.sfeir.dev/cloud/axolotl-ou-ornithorynque/)
- [Des sons](https://www.sfeir.dev/ia/suno-ai-linnovation-qui-fait-trembler-lindustrie-musicale/)

Ce qui fait la richesse et la diversité de ces données, c'est leur provenance, leur nuance et leur authenticité.Cependant, si le contenu généré par des IA se retrouve dans les ensembles de données pour entraîner d'autres modèles, on risque d'observer un appauvrissement de la qualité des modèles.

> "Tout le sujet est de montrer que nous devons faire vraiment attention à ce que nous utilisons comme donnée pour enrichir les IA". [Zakhar Shumaylov](https://www.linkedin.com/in/zakshumaylov/?originalSubdomain=uk&ref=sfeir.dev), l'un des co-auteurs de [l'étude de Cambridge](https://www.numerama.com/tech/1780810-des-chercheurs-prouvent-que-les-modeles-dia-degenerent-sils-sont-entraines-avec-leurs-propres-resultats.html?ref=sfeir.dev)

## Les risques d'une IA qui se nourrit d'elle-même

Les conséquences de cette dégénérescence peuvent être multiples :

1. **Réduction de la qualité des résultats** : L'IA, à force de se nourrir de ses propres erreurs, devient de moins en moins précise. Les résultats deviennent répétitifs, voire carrément faux.
2. **Amplification des biais** : Si un biais se glisse dans une IA, et que celle-ci est ensuite utilisée pour en former d'autres, ce biais va se répéter et s'intensifier dans les générations suivantes.
3. **Perte de diversité** : En se basant sur des modèles existants pour produire de nouveaux contenus, l'IA perd la variété et la richesse des données humaines, conduisant à une production stéréotypée et appauvrie.

> "Sans suffisamment de données fraîches réelles à chaque génération d'une boucle autophage, les futurs modèles génératifs sont condamnés à voir leur qualité (précision) ou leur diversité (rappel) diminuer progressivement".

## Comment éviter la dégénérescence ?

Pour éviter cette spirale dégénérative, il est essentiel de continuer à nourrir les modèles d'IA avec des données authentiques, issues du monde réel. Voici quelques approches pour y parvenir :

1. **Réentraînement sur des données humaines** : Il est crucial de maintenir un flux constant de données humaines pour garder les IA ancrées dans la réalité.
2. **Filtrage des données** : Les ensembles de données utilisés pour entraîner les modèles doivent être filtrés afin d'exclure les contenus générés par des IA, ou à tout le moins, limiter leur proportion.
3. **Supervision humaine** : Des humains doivent intervenir pour valider les résultats et s'assurer que les modèles d'IA continuent à produire des réponses cohérentes et correctes.

Une proposition des chercheurs de Cambridge pour éviter ce problème serait de parvenir à une sorte de watermark, permettant d'identifier avec certitude un texte ou une image générée, afin de l'exclure de l'enrichissement des modèles.

## GIGO

En 2019, lors de la keynote d'ouverture du DevFest Paris présentée par [Françoise Soulié Fogelman](https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Afsd_profile%3AACoAAAAWmhIBTwuAxOHjljhgnqe9CVVY-J_wA9U&keywords=francoise+soulie-fogelman&origin=RICH_QUERY_SUGGESTION&position=0&searchId=73dd9d4b-06c3-4626-ae0c-5770af7e60a3&sid=Im-&spellCorrectionEnabled=false&ref=sfeir.dev), membre du comité international de [Hub France IA](http://hub-franceia.fr/?ref=sfeir.dev) et [Didier Girard co-CEO chez SFEIR](https://www.sfeir.dev/author/didier/) un terme ressort, celui de **GIGO** (à ne pas confondre avec gigot), mais de quoi ce terme peut-il bien être l'acronyme ?

> Garbage In, Garbage Out

C'est le principe selon lequel la qualité des données d'entrée détermine la qualité des résultats produits par un système **IA ou non**.

IA ou non ? Oui car ce terme est populaire des la naissance de l'informatique et s'applique encore aujourd'hui, d'autant plus que les modèles d'IA brasse une grande quantité de données.  
[Charles Babbage l'un des précurseur de l'informatique](https://www.sfeir.dev/success-story/charles-babbage-et-ada-lovelace-les-parents-de-linformatique-moderne/) a écrit une remarque qui capture l'essence de GIGO :

> "On two occasions I have been asked, 'Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?' I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question."

que l'on pourrait traduire par :

> « À deux reprises on m'a demandé, “Dites-nous, Mr. Babbage, si vous mettez dans la machine des chiffres erronés, est-ce que des bonnes réponses en sortiront ?”... Je ne suis pas en mesure d'imaginer correctement le type de confusion d'idées qui pourrait provoquer une telle question. »

Il s'agit ici d'un passage du livre suivant [**_Passages from the Life of a Philosopher_**](https://www.gutenberg.org/files/57532/57532-h/57532-h.htm?ref=sfeir.dev)**_._**

## Conclusion

L'intelligence artificielle, lorsqu'elle est bien entraînée, offre des possibilités infinies. Toutefois, l'IA dégénérative, ce phénomène où les modèles se nourrissent de leurs propres erreurs, représente un risque sérieux pour la qualité et la fiabilité de ces technologies.  
Si les IA commencent à se former uniquement à partir de contenus générés par d'autres IA, elles risquent de perdre leur richesse et leur pertinence.  

Pour éviter ce piège, il est essentiel de maintenir un lien fort avec les données humaines et de s'assurer que les IA continuent à être alimentées par des informations authentiques et variées.  
L'avenir de l'intelligence artificielle en dépend. Comme le soulignent les chercheurs, "selon un scénario catastrophe, si le **MAD** (Model Autophagy Disorder) n'est pas contrôlé pendant plusieurs générations, il pourrait empoisonner la qualité et la diversité des données de l'ensemble de l'internet".
