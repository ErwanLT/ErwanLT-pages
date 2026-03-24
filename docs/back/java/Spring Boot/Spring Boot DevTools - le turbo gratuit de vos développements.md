---
layout: "default"
title: "Spring Boot DevTools - le turbo gratuit de vos développements"
permalink: "/back/java/spring-boot/spring-boot-devtools-le-turbo-gratuit-de-vos-developpements/"
tags: [back, java, spring-boot]
status: "Draft"
---
Réduire le cycle « modifier → compiler → redéployer » est au cœur de la productivité des développeurs [Java](https://www.sfeir.dev/back/il-etait-une-fois-java/) depuis des décennies.  
Dans l’écosystème [Spring Boot](https://www.sfeir.dev/back/back-spring-boot/), ****Spring Boot DevTools**** est l’outil officiel et gratuit qui vise à raccourcir ce cycle via un redémarrage rapide et un LiveReload côté navigateur.

Pour des besoins plus avancés (rechargement de modifications structurelles sans perdre l’état), il existe des alternatives [open-source](https://www.sfeir.dev/tag/open-source/) comme ****HotSwapAgent**** et ****DCEVM**** — qui demandent plus d’efforts d’intégration mais peuvent compléter DevTools.

## Présentation

Spring Boot DevTools est un module officiel de Spring Boot destiné exclusivement au développement. Ses fonctions principales :

- **Restart** : Spring Boot DevTools s’appuie sur un mécanisme ingénieux de **redémarrage rapide**. Concrètement, l’application utilise deux **classloaders** distincts : l’un, dit __base__, conserve en mémoire les dépendances stables (frameworks, bibliothèques externes) qui ne changent pas souvent ; l’autre, dit __restart__, ne charge que le code de l’application en cours de développement. Lorsqu’une modification est détectée sur le classpath, DevTools recrée uniquement le classloader __restart__, sans toucher au classloader __base__. Résultat : le redémarrage est bien plus rapide, car seule la partie du code modifiée est rechargée.
- **LiveReload** : serveur LiveReload embarqué qui peut rafraîchir automatiquement le navigateur quand des ressources statiques ou des templates changent (utile lorsque l'on utilise **[[Intégration de Thymeleaf dans une application Spring Boot|thymeleaf]]**).
- **Comportements spécifiques au dev** : désactivation de caches, prise en charge d’une console H2 en dev, autorisation d’options de configuration uniquement pour le profil développement. DevTools est automatiquement désactivé sur une application packagé à moins d’être explicitement réactivé.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Zéro coût et intégration native** : se déclare par une simple dépendance Maven/Gradle ; conçu et maintenu par l’équipe Spring.
- **Simplicité d’usage** : pas d’agent JVM à installer, bonne intégration avec les IDE modernes (notamment IntelliJ) — déclenchements de restart automatiques quand l’IDE met à jour le classpath.
- **LiveReload pratique pour le web** : rafraîchissement automatique du navigateur lors de changements de ressources.
- **Sécurité opérationnelle** : conçu pour ne pas s’exécuter en production par défaut (évite surprises).

### ➖ Inconvénients

- **Ce n’est pas du « true hot-swap »** : DevTools provoque un __restart rapide__ (replacement du classloader) — il ne réécrit pas arbitrairement les classes en mémoire au sens des modifications structurelles (ajout de champs/méthodes/signatures, changements de hiérarchie). Certaines modifications non couvertes demanderont un build + restart complet.
- **Problèmes possibles en multi-module** : l’approche à deux classloaders peut créer des comportements surprenants si des librairies conservent des références aux classes du restart classloader ; il faudra alors affiner la configuration (`spring-devtools.properties`, exclusions).
- **Dépendance au comportement de l’IDE/build** : le déclenchement dépend de la manière dont l’IDE met à jour le classpath (par ex. IntelliJ nécessite généralement un __Build__ explicite ou compilation automatique configurée).

## Installation rapide

### Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

Le flag `optional` évite que DevTools ne se retrouve dans les dépendances transitives. En pratique, on ne l’embarque jamais dans un jar de production.

### Gradle

```gradle
dependencies {
    developmentOnly("org.springframework.boot:spring-boot-devtools")
}
```

## Ce qui redémarre et ce qui ne redémarre pas

Spring Boot DevTools se déclenche **sur les changements de classes** (classpath) et **redémarre** le classloader `restart`.  
Autrement dit, tant que l’IDE ne recompile pas, il ne se passe rien.

Ce qui **redémarre** :

- modifications Java/Kotlin/Groovy/Scala re-compilées,
- changements dans `target/classes` ou `build/classes`.

Ce qui **ne redémarre pas** (mais peut être rechargé côté navigateur) :

- ressources statiques (`/static`, `/public`, `/resources`),
- templates (Thymeleaf, Freemarker, Mustache),
- fichiers de configuration non pris en charge par le classpath.

Pour ces ressources, DevTools s’appuie sur **LiveReload**, ce qui évite un restart complet à chaque changement.

## LiveReload (et pourquoi c’est utile avec Thymeleaf)

DevTools embarque un petit serveur LiveReload. Si une page HTML ou un template change, le navigateur se rafraîchit automatiquement.

Pour que cela fonctionne correctement :

1. On garde `spring.devtools.livereload.enabled=true` (par défaut).
2. On installe l’extension LiveReload dans le navigateur ou on utilise un navigateur compatible.
3. On désactive les caches de templates (DevTools le fait automatiquement).

Ça marche particulièrement bien quand on utilise [[Intégration de Thymeleaf dans une application Spring Boot|Thymeleaf]] : le cycle devient presque instantané.

## Configuration utile en dev

Quelques propriétés pratiques pour affiner le comportement :

```properties
# Activer/désactiver DevTools
spring.devtools.restart.enabled=true

# Exclure des répertoires du restart
spring.devtools.restart.exclude=static/**,public/**,templates/**

# Ajouter des répertoires supplémentaires à surveiller
spring.devtools.restart.additional-paths=../shared-lib/target/classes

# LiveReload
spring.devtools.livereload.enabled=true
spring.devtools.livereload.port=35730
```

Les exclusions permettent d’éviter des redémarrages inutiles pour des fichiers qui ne le nécessitent pas.

## IDE : le vrai point d’attention

Le point qui fait souvent croire que DevTools « ne marche pas », c’est l’IDE.

### IntelliJ

Pour que DevTools redémarre automatiquement, il faut que **la compilation se fasse en arrière‑plan**. Sinon, DevTools attendra un `Build` explicite.

1. `Settings > Build, Execution, Deployment > Compiler`
2. Activer **Build project automatically**

> [!note] Capture d’écran ici  
> `Settings > Build, Execution, Deployment > Compiler` avec **Build project automatically** activé.

Ensuite, il faut autoriser l’auto‑make quand l’appli tourne :

1. `Help > Find Action` puis **Registry...**
2. Activer `compiler.automake.allow.when.app.running`

> [!note] Capture d’écran ici  
> Fenêtre **Registry** avec `compiler.automake.allow.when.app.running` activé.

Optionnel mais pratique selon les habitudes :

- `Settings > Advanced Settings`
  - **Build project automatically** (si présent selon version)
  - **Synchronize files on frame activation**
  - **Save files on frame deactivation**

> [!note] Capture d’écran ici  
> `Settings > Advanced Settings` avec les options de synchronisation.

## Multi‑modules : le cas qui fâche

Dans un projet multi‑module, un module peut compiler sans pour autant déclencher DevTools si ses classes ne sont pas sur le classpath du module lancé.

Deux solutions simples :

- **Ajouter les modules utiles au classpath** du module principal (dépendance classique).
- **Pointer explicitement DevTools** vers des répertoires supplémentaires :

```properties
spring.devtools.restart.additional-paths=../module-a/target/classes,../module-b/target/classes
```

Si certains modules provoquent des redémarrages inutiles, on peut aussi les exclure :

```properties
spring.devtools.restart.exclude=module-legacy/**
```

## DevTools et caches (Thymeleaf, Jackson, etc.)

DevTools active un ensemble de **dev‑defaults** :

- désactivation de caches de templates (Thymeleaf, FreeMarker, Mustache),
- logs plus lisibles,
- comportements adaptés au dev.

C’est pour ça qu’on observe souvent un comportement différent entre **dev** et **prod** : ce n’est pas un bug, c’est volontaire.

## Points d’attention en production

DevTools est **désactivé par défaut** dès que l’application est packagée (jar/war).  
Pour éviter toute surprise :

- on garde la dépendance en `optional` (Maven) ou `developmentOnly` (Gradle),
- on utilise un profil dev explicite,
- on évite d’ajouter DevTools dans les images Docker de prod.

## Troubleshooting rapide

### Le restart ne se déclenche pas

- vérifier que l’IDE compile réellement,
- vérifier que le fichier compilé arrive bien dans `target/classes`,
- vérifier que le module est bien dans le classpath.

### Trop de redémarrages

- exclure les ressources avec `spring.devtools.restart.exclude`,
- vérifier les dossiers surveillés (`additional-paths`).

### LiveReload ne fonctionne pas

- vérifier que l’extension LiveReload est installée,
- vérifier le port `35729` (par défaut),
- éviter les proxies qui filtrent ce port.

## DevTools vs HotSwapAgent / DCEVM

DevTools vise la **simplicité** et la **stabilité**.  
HotSwapAgent + DCEVM visent le **hot‑swap avancé** (modifs structurelles) au prix d’une installation plus lourde.

Dans la majorité des projets, DevTools suffit.  
Quand on travaille sur des gros modèles qui changent souvent, on peut compléter avec HotSwapAgent.

## En résumé

Si l’on cherche un gain immédiat de productivité sans complexité, DevTools est le meilleur point de départ.  
Il ne remplace pas les solutions de hot‑swap avancées, mais il couvre **80% des besoins** avec **0 friction**.

Et quand on le combine avec [[Intégration de Thymeleaf dans une application Spring Boot|Thymeleaf]] ou des outils d’observabilité comme [[Superviser votre application Spring Boot grâce à Prometheus et Grafana]], le confort de dev devient franchement agréable.
