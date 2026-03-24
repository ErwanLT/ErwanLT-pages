---
layout: "default"
title: "Avoir un profil GitHub qui claque"
permalink: "/product/avoir-un-profil-github-qui-claque/"
tags: [product, github, markdown, bonnes pratiques, developpeur]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/product/avoir-un-profil-github-qui-claque/"
banner: "https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDExfHxnaXRodWJ8ZW58MHx8fHwxNzIzNTUxOTYwfDA&ixlib=rb-4.0.3&q=80&w=2000"
published_at: "2024-08-26"
sfeir_slug: "avoir-un-profil-github-qui-claque"
date: "2024-08-26"
---
Au commencement, il n'y avait rien... et ce n'est pas rien de le dire !  
Quand vous démarrez sur [GitHub](https://github.blog/?ref=sfeir.dev), ou même si ça fait déjà un moment que vous êtes dessus, si vous n'avez jamais créé de "_README de profil_", il y a de fortes chances que votre profil ressemble à ceci :

[![](https://www.sfeir.dev/content/images/2024/08/image-19.png)](https://www.sfeir.dev/content/images/2024/08/image-19.png)

Profil d'un compte github lambda

Si ça fait déjà un moment que vous avez des projets hébergés sur la plateforme ou que vous contribuez à des projets [Open Source](https://www.sfeir.dev/open-source-pourquoi-faire/), la section **Popular repositories** sera plus fournie et la partie "Contribution" ressemblera à une partie de Tetris.

[![](https://www.sfeir.dev/content/images/2024/08/image-20.png)](https://www.sfeir.dev/content/images/2024/08/image-20.png)

Représentation graphique de vos contributions sur Github

Aujourd'hui, je vous propose de remplacer ce grand vide par quelque chose de plus personnalisé. Vous êtes prêts ? Suivez le guide !

## Le README de profil

Le README de profil (`README.md`) est la première chose que les visiteurs voient lorsqu'ils consultent votre profil GitHub.  
Le README de profil est une opportunité unique de faire du [**personal branding**](https://www.sfeir.dev/recrutement-rh/les-8-soft-skills-indispensables-pour-booster-sa-carriere-de-dev/) : présenter qui vous êtes, ce que vous faites et ce que vous cherchez à accomplir.

Mais du coup, comment en avoir un ?  
Eh bien, il suffit de **créer un nouveau repository** qui aura pour nom **votre nom de profil GitHub**. Si l'on reprend l'image du profil en début de cet article, il faudra créer un repository qui s'appellera _LeTutourErwan_.

### Création du repository

Pour créer votre nouveau repository, rien de plus simple, il vous suffit d'aller dans l'onglet repositories et de cliquer sur le **bouton New**.

[![](https://www.sfeir.dev/content/images/2024/08/image-21.png)](https://www.sfeir.dev/content/images/2024/08/image-21.png)

Cliquez sur ce bouton-ci

Vous arriverez ensuite sur un formulaire et il n'y aura plus qu'à renseigner les différents champs en faisant bien attention à la valeur du champ _nom_.  
Pour rappel il faut qu'elle ait la même valeur que votre nom de profil.

[![](https://www.sfeir.dev/content/images/2024/08/image-22.png)](https://www.sfeir.dev/content/images/2024/08/image-22.png)

Le choix du nom va permettre à GitHub d'identifier le repository comme une page de profil

Comme vous pouvez le constater, une fois le nom correctement renseigné, une zone d'information apparaît pour vous signifier qu'il s'agira d'un repository ✨spécial✨ qui sera utilisé pour votre profil.  
Et comme il s'agit d'un **README** profil, il est important de l'initialiser avec un fichier **README.md** et qu'il soit **public**.

[![](https://www.sfeir.dev/content/images/2024/08/image-23.png)](https://www.sfeir.dev/content/images/2024/08/image-23.png)

Il est nécessaire de bien choisir les options

Il ne vous reste plus qu'à valider le formulaire.

### Avoir un profil GitHub qui claque

Maintenant que votre nouveau repository est créé avec son fichier **README.md**, vous devriez avoir quelque chose comme ça :

[![](https://www.sfeir.dev/content/images/2024/08/image-24.png)](https://www.sfeir.dev/content/images/2024/08/image-24.png)

Les étapes suivantes seront tout aussi simples

Et si vous retournez sur votre profil, vous verrez qu'il y a déjà du changement :

[![](https://www.sfeir.dev/content/images/2024/08/image-25.png)](https://www.sfeir.dev/content/images/2024/08/image-25.png)

On commence à avoir quelque chose

### L'extension .md

Depuis tout à l'heure je vous parle du fichier README**.md**, mais c'est quoi cette extension au juste ?  
Eh bien, le md correspond au [**Markdown**](/definition/markdown-definition/)(https://fr.wikipedia.org/wiki/Markdown?ref=sfeir.dev), un langage de balisage créé en 2004 (un petit jeune comparé à d'autres langages), qui offre une [syntaxe facile à lire et écrire](https://docs.github.com/fr/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax?ref=sfeir.dev).

Voici pour la petite aparté, maintenant entrons dans le vif du sujet.

### **Introduction Personnelle**

Commencez par une introduction qui donne un aperçu de votre identité professionnelle :

- **Nom et titre :** Indiquez votre nom et votre titre professionnel (ex. : Développeur Full Stack, Ingénieur DevOps).
- **Photo ou avatar :** Une image de vous ou un avatar

```markdown
# Bonjour, je suis [Votre Nom] 👋
## Développeur Full Stack | Passionné de Tech et Open Source

![Profile Banner](https://linktoyourimage.com/banner.png)
```

### **Contact et Réseaux Sociaux**

Ajoutez des liens vers vos autres profils professionnels et moyens de contact :

- LinkedIn
- Twitter
- Email

```markdown
## Contactez-Moi

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/votreprofil)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/votreprofil)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:votremail@example.com)
```

### **Compétences Techniques**

Listez vos compétences techniques sous forme de badges ou de liste pour un impact visuel fort :

- Langages de Programmation
- Frameworks et Bibliothèques
- Outils et Technologies

```markdown
## Compétences Techniques

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node-dot-js&logoColor=white)
```

### **Statistiques GitHub**

Affichez vos statistiques GitHub pour démontrer votre activité et vos contributions

- **Contributions :** Un graphique de vos contributions annuelles.
- **Langages utilisés :** Un diagramme des langages de programmation que vous utilisez le plus.

```markdown
## Statistiques GitHub
![Contributions](https://github-readme-stats.vercel.app/api?username=votre-nom-d-utilisateur&show_icons=true&theme=radical)
![Langues](https://github-readme-stats.vercel.app/api/top-langs/?username=votre-nom-d-utilisateur&layout=compact&theme=radical)
```

Vous pouvez générer [les images de ces statistiques via des actions GitHub](https://github.com/marketplace/actions/github-profile-summary-cards?ref=sfeir.dev), ou suivre les indications du README.md de ce projet :

[

GitHub-Profile-Summary-Cards - GitHub Marketplace

Generate profile summary cards and commit to default branch

![](https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg)GitHub

![](https://avatars.githubusercontent.com/u/20241522?s=400&v=4)

](https://github.com/marketplace/actions/github-profile-summary-cards?ref=sfeir.dev)

### Vos articles

Si jamais vous aussi vous écrivez des articles, n'hésitez pas à rajouter des [liens vers ces derniers](https://www.sfeir.dev/author/erwan/) dans votre profil.

[![](https://www.sfeir.dev/content/images/2024/08/image-26.png)](https://www.sfeir.dev/content/images/2024/08/image-26.png)

Faites la promotion de vos articles auprès des autres développeurs

Voilà pour ce qui était de remplir votre fichier **README.md** de profil.

Si vous avez fait attention aux morceaux de code que je vous ai fourni, vous remarquerez qu'ils contiennent pour la grande majorité, des liens vers [https://img.shields.io/badge](https://img.shields.io/badge?ref=sfeir.dev).

Mais à quoi servent les badges exactement ?

### Les badges

Les badges GitHub sont des éléments visuels qui permettent de communiquer rapidement des informations clés sur vos projets, compétences, et contributions.

[![](https://www.sfeir.dev/content/images/2024/08/image-27.png)](https://www.sfeir.dev/content/images/2024/08/image-27.png)

Démonstration de l'intérêt des badges

Entre ces 2 blocs qui véhiculent exactement les mêmes informations, lequel a tout de suite attiré votre regard ?  
Il y a de grandes chances pour que ce soit le premier.  
  
Les badges sont un excellent moyen de rendre votre profil GitHub plus attractif. Ils permettent aux visiteurs de comprendre rapidement les aspects clés de vos projets et de vos compétences.  
En intégrant des badges de manière stratégique, vous pouvez créer un profil GitHub qui non seulement claque, mais qui parle de votre professionnalisme et de votre engagement dans le monde du développement.

---

Pour les plus paresseux d'entre vous, il existe des générateurs de README.md profil, je vous en propose 2 :

[

GitHub Profile Readme Generator

Prettify your github profile using this amazing readme generator.

![](https://rahuldkjain.github.io/gh-profile-readme-generator/icons/icon-192x192.png?v=040f54e2f6c858e0a3dcf568c3f2b6f1)GitHub Profile Readme Generator

![](https://rahuldkjain.github.io/gh-profile-readme-generator/static/mdg-040f54e2f6c858e0a3dcf568c3f2b6f1.png)

](https://rahuldkjain.github.io/gh-profile-readme-generator/?ref=sfeir.dev)

[

GitHub profile readme generator

GitHub profile readme generator is a tool that allows you to create simple and beautiful readme that you can copy/paste and include in your profile repository as profile preview.

![](https://arturssmirnovs.github.io/github-profile-readme-generator/images/github-light.png)artuurs.smirnovs

![](https://arturssmirnovs.github.io/github-profile-readme-generator/images/banner.png)

](https://arturssmirnovs.github.io/github-profile-readme-generator/?ref=sfeir.dev)

---

Si jamais vous souhaitez agrémenter votre profil de la mascotte GitHub (l'octocat) mais personnalisée à votre image, c'est par [ici](https://myoctocat.com/?ref=sfeir.dev).

[![](https://www.sfeir.dev/content/images/2024/08/image-28.png)](https://www.sfeir.dev/content/images/2024/08/image-28.png)

## Conclusion

En soignant votre README de profil GitHub, vous vous présentez sous votre meilleur jour et montrez ce que vous avez à offrir à [la communauté](https://www.sfeir.dev/success-story/annabelle-koster-la-communaute-tech-est-incroyable-pour-le-partage-et-la-curiosite/).  
Un README bien structuré et complet peut grandement améliorer votre visibilité et attirer l'attention [des bonnes personnes](https://www.sfeir.dev/recrutement-rh/recruteur-tech-et-pourquoi-pas/). Investir du temps dans la création de ce document peut se révéler être un atout majeur dans votre carrière de développeur.

Si jamais vous êtes en mal d'inspiration, vous pouvez également consulter [mon README.md profil](https://github.com/ErwanLT?ref=sfeir.dev), j'ai essayé de le faire le plus complet possible.
