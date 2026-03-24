---
layout: "default"
title: "Cloud, souveraineté et droit extraterritorial"
permalink: "/cloud/cloud-souverainete-et-droit-extraterritorial/"
tags: [cloud, souverainete, souverainete numerique]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/cloud/cloud-souverainete-et-droit-extraterritorial/"
banner: "https://www.sfeir.dev/content/images/2026/02/20260209_0913_Image-Generation_simple_compose_01kh0qbjjqep3s5za4x0wrpacy.png"
published_at: "2026-02-24"
sfeir_slug: "cloud-souverainete-et-droit-extraterritorial"
date: "2026-02-24"
---
**⚠️ Avertissement**  
Cet article a pour objectif d’éclairer les enjeux juridiques et techniques liés au cloud computing et au droit extraterritorial, notamment le CLOUD Act américain.  
Il ne constitue ni un avis juridique, ni une analyse de sécurité exhaustive, ni une prise de position politique.

## Ce que le CLOUD Act change réellement pour les données européennes

Depuis une quinzaine d’années, le [cloud](https://www.sfeir.dev/tag/cloud/) computing est devenu une infrastructure centrale des économies modernes. Administrations, banques, hôpitaux, entreprises industrielles et services numériques reposent désormais sur des plateformes mutualisées, souvent opérées par de grands acteurs internationaux :

- [Google Cloud Plateform](https://www.sfeir.dev/tag/gcp/)
- [AWS](https://www.sfeir.dev/tag/aws/)
- [Microsoft Azure](https://www.sfeir.dev/tag/azure/)

Cette évolution, d’abord guidée par des considérations de coût, de flexibilité et d’innovation, soulève aujourd’hui des questions plus profondes, liées à la souveraineté juridique et à la sécurité stratégique des données.

Parmi les textes qui cristallisent ces interrogations figure le **CLOUD Act** américain, régulièrement cité dans les débats européens sur la dépendance aux hyperscalers américains.

## Origine et portée du CLOUD Act

Adopté en 2018, le _Clarifying Lawful Overseas Use of Data Act_ modifie le _Stored Communications Act_ de 1986, un texte rédigé à une époque où le cloud computing n’existait pas. Le problème juridique est apparu de manière concrète lors de l’affaire **Microsoft Corp. v. United States**, portée jusqu’à la Cour suprême américaine. Le FBI réclamait l’accès à des emails stockés sur des serveurs situés en Irlande, tandis que Microsoft soutenait que le droit américain ne s’appliquait pas à des données hébergées hors du territoire des États-Unis.

Avant que la Cour ne tranche, le Congrès a adopté le CLOUD Act, mettant fin au litige. Le principe posé est simple dans son énoncé : une entreprise soumise à la juridiction américaine peut être contrainte de fournir des données qu’elle contrôle, indépendamment du lieu physique de stockage de ces données.

Ce point est central. Le CLOUD Act ne repose pas sur la localisation des serveurs, mais sur la **juridiction applicable au fournisseur** (le nœud du problème).

## Données européennes et fournisseurs américains

Les grands acteurs du cloud public — Amazon Web Services, Microsoft Azure et Google Cloud — proposent depuis longtemps des régions européennes, parfois présentées comme une réponse aux [**exigences du RGPD**](https://www.sfeir.dev/ia/qui-protege-vos-donnees-des-ia-le-rgpd-en-action/) et aux attentes de souveraineté. D’un point de vue technique, les données peuvent effectivement être stockées et traitées exclusivement dans l’Union européenne.

D’un point de vue juridique, la situation est plus complexe. Ces entreprises restent des sociétés de droit américain ou contrôlées par une maison-mère américaine. À ce titre, elles entrent dans le champ du CLOUD Act. Les autorités américaines peuvent donc, sous certaines conditions, exiger la transmission de données, même si celles-ci sont hébergées en Europe.

Il ne s’agit toutefois ni d’un accès direct aux serveurs européens, ni d’une procédure discrétionnaire. La demande passe par une injonction judiciaire et vise le fournisseur, non l’infrastructure elle-même.

## Garde-fous juridiques et tensions normatives

Le CLOUD Act intègre des mécanismes de limitation. Le fournisseur peut contester une demande s’il démontre que la divulgation des données violerait le droit d’un État étranger et que la personne concernée n’est pas citoyenne américaine. Le juge doit alors procéder à une mise en balance des intérêts, prenant en compte la gravité de l’enquête, la nationalité des personnes concernées et les atteintes potentielles à la souveraineté étrangère.

En parallèle, le **RGPD** continue de s’appliquer pleinement aux données personnelles des résidents européens. Toute transmission de données vers un État tiers doit reposer sur une base légale valide. La décision **Schrems II** de la Cour de justice de l’Union européenne, qui a invalidé le Privacy Shield en 2020, a précisément mis en lumière l’incompatibilité structurelle entre certains mécanismes de surveillance américains et le niveau de protection exigé par le droit européen.

Le résultat est une situation de **tension juridique permanente**, où deux ordres normatifs légitimes poursuivent des objectifs différents.

## Enjeux stratégiques au-delà du droit

Au-delà du cadre légal, la question du cloud touche à des considérations plus larges. Les infrastructures numériques sont désormais assimilées à des actifs stratégiques, au même titre que l’énergie ou les télécommunications. Dans ce contexte, la dépendance à des acteurs soumis à une juridiction étrangère peut être perçue comme un facteur de vulnérabilité, notamment pour les secteurs qualifiés comme critiques.

Les stratégies nationales et européennes récentes reflètent cette prise de conscience. En France, les travaux de l’ANSSI et la qualification **SecNumCloud** visent à garantir un haut niveau de contrôle juridique et technique. À l’échelle européenne, des initiatives comme **GAIA-X** cherchent à structurer un écosystème de cloud conforme aux valeurs et aux normes européennes, même si leur mise en œuvre reste débattue.

## Approches actuelles des organisations

Dans la pratique, peu d’acteurs adoptent une logique binaire opposant cloud américain et cloud européen. Les architectures hybrides ou multi-cloud se généralisent. Les données les plus sensibles sont isolées, parfois hébergées chez des fournisseurs européens ou sur des infrastructures internes, tandis que des services non critiques ou fortement élastiques continuent de s’appuyer sur des hyperscalers internationaux.

Le chiffrement, et en particulier la maîtrise des clés par le client, est également devenu un levier central. Lorsque le fournisseur ne détient pas les clés de déchiffrement, sa capacité à répondre à une injonction judiciaire est mécaniquement limitée.

## Conclusion

Le CLOUD Act ne signifie pas que les données européennes hébergées dans le cloud américain sont systématiquement accessibles aux autorités des États-Unis. Il ne signifie pas non plus que la localisation des données est juridiquement neutre. Il révèle surtout une réalité plus large : dans un monde interconnecté, les infrastructures numériques se trouvent à l’intersection du droit, de la technique et de la géopolitique.

Informer sur ces mécanismes ne revient pas à trancher le débat. Cela permet en revanche aux organisations, publiques comme privées, de faire des choix éclairés, en connaissance des contraintes juridiques, des risques potentiels et des leviers techniques existants.
