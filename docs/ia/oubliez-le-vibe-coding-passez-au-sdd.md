---
layout: "default"
title: "Oubliez le vibe coding, passez au SDD !"
permalink: "/ia/oubliez-le-vibe-coding-passez-au-sdd/"
tags: [ia, ia first, agents, vibe coding, sdd]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/ia/oubliez-le-vibe-coding-passez-au-sdd/"
banner: "https://www.sfeir.dev/content/images/2026/02/20260209_1401_Image-Generation_simple_compose_01kh17v4dgf6mvp112pkrp7jg8.png"
published_at: "2025-10-29"
sfeir_slug: "oubliez-le-vibe-coding-passez-au-sdd"
date: "2025-10-29"
---
Dans le monde de James Bond, **M** définit la mission, **Q** fournit les gadgets, et Bond agit avec précision. Rien n’est laissé au hasard.  
En développement logiciel, le **Specification Driven Development (SDD)** suit la même philosophie : on commence par définir la mission avec clarté — les comportements attendus, les règles et les objectifs — avant d’écrire la moindre ligne de code.

Avec des outils modernes comme GitHub **Spec Kit**, cette mission peut être confiée à une [IA](https://www.sfeir.dev/tag/ia/). Le développeur se concentre sur la stratégie, tandis que l’IA exécute le plan, à la manière d’un Bond numérique utilisant les gadgets fournis par Q. À l’heure du « [vibe coding](https://www.sfeir.dev/front/quest-ce-que-le-vibe-coding/) », le SDD rappelle que **la préparation reste la clé**, même lorsque l’exécution est assistée par l’intelligence artificielle.

## Définition

Le **Specification Driven Development (SDD)** est une méthode où **la spécification guide entièrement le développement**. On définit d’abord le comportement attendu du système, les scénarios utilisateurs et les contraintes techniques, avant toute implémentation.

Dans le contexte actuel, l’IA peut jouer le rôle de Bond : elle transforme les spécifications en code opérationnel. Les développeurs endossent les rôles de M et de Q : ils définissent la mission et fournissent les outils et instructions pour que l’exécution soit fluide et conforme aux attentes. Le SDD assure ainsi **rigueur, clarté et traçabilité**, tout en accélérant le processus de développement.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Rigueur et clarté** : comme le briefing de M, chaque mission est bien définie, ce qui réduit les erreurs et les ambiguïtés.
- **Gain de temps** : l’IA agit comme Bond avec les gadgets de Q, transformant rapidement les spécifications en code fonctionnel.
- **Traçabilité** : chaque fonctionnalité est directement liée à une spécification, ce qui facilite la maintenance et les tests.
- **Alignement avec les attentes** : le produit final correspond exactement à ce qui a été prévu dans la mission.

### **➖ Inconvénients**

- **Dépendance aux spécifications** : une spécification incomplète ou imprécise conduit à un code défaillant, comme un Bond mal briefé sur sa mission.
- **Courbe d’apprentissage** : maîtriser les outils d’IA et rédiger des spécifications claires nécessite de l’expérience.
- **Limitation créative** : si l’IA suit strictement la spécification, elle peut manquer d’initiative ou de solutions alternatives innovantes.

## Mise en pratique : créer une application Todo List avec Specify et Gemini

Pour illustrer le **Specification Driven Development (SDD) avec IA**, nous allons suivre l’exemple d’une mission à la **James Bond**, où chaque étape est planifiée et exécutée avec rigueur. Ici, l’agent est l’IA Gemini, M définit la mission, et Q fournit les outils.

**La cible du jour** : une application TODO list pour plusieurs utilisateurs.

### Présentation de Specify

Avant de se lancer dans la mission, encore faut-il connaître le **Q Branch** du développeur moderne : **Specify**.  
Specify (ou **Speckit**) est un outil conçu pour mettre en œuvre le **Specification Driven Development (SDD)** de manière assistée par l’intelligence artificielle. Là où M définit les objectifs et Q fournit les gadgets, Specify joue les deux rôles à la fois : il structure la pensée du développeur, formalise les besoins, puis confie l’exécution à une IA — ici, **Gemini** — qui agit comme l’agent sur le terrain.

Concrètement, Specify permet de :

- **Créer un projet** à partir d’un simple ordre de mission (commande `specify init`),
- **Définir les principes de développement** pour garantir la qualité du code,
- **Établir les spécifications fonctionnelles et techniques**,
- **Planifier les tâches à exécuter**,
- Et enfin **implémenter automatiquement** le code correspondant, en suivant ces spécifications.

Avec Specify, le développeur ne code plus à l’instinct : il **décrit la mission**, et l’IA se charge de la réaliser dans les règles de l’art.  
C’est une évolution naturelle du métier — une alliance entre la rigueur des méthodes classiques et la puissance des outils modernes. Comme dans **Skyfall**, où les gadgets se font plus discrets mais infiniment plus puissants, Specify modernise la manière de concevoir sans renier la logique et la structure héritées du passé.

### **Initialisation** de la mission

Comme Bond reçoit son briefing de M, nous commençons par définir notre projet et lancer l’assistant IA :

```bash
specify init todo-list-application --ai gemini --script sh
cd todo-list-application
gemini
```

initilisation du projet et lancement de gemini

À ce stade, l’IA est prête et les commandes `/specify` sont disponibles, prêtes à exécuter les directives comme les gadgets fournis par Q.

### Définir les principes de développement

Avant toute action, Bond se prépare et choisit ses gadgets. De même, nous donnons à l’IA les bonnes pratiques à respecter :

```bash
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

définition des bonnes pratiques

Cela permet de garantir que chaque ligne de code générée suit des standards stricts, comme un gadget fiable entre les mains de Bond.

### Spécifier la mission

[![](https://www.sfeir.dev/content/images/2025/10/image-18.png)](https://www.sfeir.dev/content/images/2025/10/image-18.png)

Ralph Fiennes dans le rôle de M

Comme Bond reçoit le briefing détaillé de M, nous définissons le **quoi** et le **pourquoi** de notre application :

```bash
/speckit.specify Build a todo list application that helps me organize my day work. 
The application can have multiple users, so I should log onto it first and only see my tasks.
```

On décrit l'application, rien de technique pour l'instant

L’IA comprend l’objectif et prépare l’exécution, exactement comme Bond suit les instructions de M.

Le fichier **`spec.md`** est alors **créé automatiquement** : il devient le **dossier de mission**, décrivant les besoins, les objectifs et les contraintes.

```md
# Feature Specification: Multi-User Todo List Application

**Feature Branch**: `001-multi-user-todo-app`
**Created**: 2025-10-27
**Status**: Draft
**Input**: User description: "Build a todo list application that helps me organize my daily work. The application should support multiple users, require login, and each user should only see their own tasks."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration and Login (Priority: P1)

As a new user, I want to be able to create an account and log in, so that I can access the application.

**Why this priority**: This is the entry point for any user to start using the application. Without it, no other functionality is accessible.

**Independent Test**: A new user can successfully register, log out, and then log back in.

**Acceptance Scenarios**:

1. **Given** a user is on the registration page, **When** they enter a unique email and a valid password, **Then** their account is created and they are logged in.
2. **Given** a logged-in user, **When** they choose to log out, **Then** they are logged out and redirected to the login page.
3. **Given** a registered user is on the login page, **When** they enter their correct email and password, **Then** they are logged in and can access their tasks.
```

extrait du fichier spec.md

### Définir la stack technologique

[![](https://www.sfeir.dev/content/images/2025/10/image-17.png)](https://www.sfeir.dev/content/images/2025/10/image-17.png)

I can do more damage on my laptop sitting in my pajamas before my first cup of Earl Grey than you can do in a year in the field.

Q fournit les gadgets adaptés à la mission ; nous précisons donc à l’IA les outils à utiliser :

```bash
/speckit.plan The application uses Java Spring Boot + Thymeleaf to render the HTML pages. 
An H2 database is used to store data.
```

On précise la stack technique

Ainsi, l’IA sait avec quels instruments réaliser la mission.

Cette commande génère un fichier **`plan.md`**, véritable **plan tactique de Q**.  
Il décrit **comment** la mission sera accomplie : la stack technique, les composants à créer, les dépendances, et les interactions entre modules.  
Chaque section du plan est liée à une partie du `spec.md` pour assurer la cohérence entre vision et exécution.

```md
# Implementation Plan: Multi-User Todo List Application

**Branch**: `001-multi-user-todo-app` | **Date**: 2025-10-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-multi-user-todo-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The user wants to build a multi-user todo list application using Java Spring Boot, Thymeleaf, and an H2 database. The application will allow users to register, log in, and manage their own tasks, with each user's tasks being private.

## Technical Context

**Language/Version**: Java 17
**Primary Dependencies**: Spring Boot, Spring Security, Spring Data JPA, Thymeleaf, H2 Database
**Storage**: H2 in-memory database
**Testing**: JUnit 5, Mockito
**Target Platform**: Web Browser
**Project Type**: Web application
**Performance Goals**: Respond within 500ms for all task-related operations with 100 concurrent users.
**Constraints**: See [research.md](./research.md) for data persistence decisions.
**Scale/Scope**: 100 concurrent users.
```

Extrait de plan.md

### Créer la liste des tâches

Bond prépare son plan d’action : nous créons maintenant la structure des fonctionnalités à développer :

```bash
/speckit.tasks
```

L’IA organise les étapes nécessaires pour construire notre application Todo List, exactement comme un plan de mission détaillé.

Une fois la stratégie en place, **Specify** crée ou met à jour le fichier **`task.md`**, qui décrit les **opérations concrètes** à mener.  
Chaque tâche est liée à une section du `plan.md`, un peu comme un agent suit un protocole précis transmis par Q avant le départ sur le terrain.

```md
# Tasks: Multi-User Todo List Application

**Input**: Design documents from `/specs/001-multi-user-todo-app/`

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 [P] Create a new Spring Boot project with Maven.
- [X] T002 [P] Add Spring Web, Spring Security, Spring Data JPA, Thymeleaf, and H2 Database dependencies to `pom.xml`.
- [X] T003 [P] Configure the H2 database in `src/main/resources/application.properties`.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T004 Configure Spring Security in `src/main/java/com/example/todolist/config/SecurityConfig.java` to handle user authentication and authorization.
- [X] T005 Create a base Thymeleaf template in `src/main/resources/templates/layout.html` with a common header and footer.

---

## Phase 3: User Story 1 - User Registration and Login (Priority: P1) 🎯 MVP

**Goal**: Allow users to register and log in.

**Independent Test**: A new user can register, log out, and log back in.

### Tests for User Story 1 ⚠️

- [ ] T006 [P] [US1] Write unit tests for `UserService` registration logic in `src/test/java/com/example/todolist/service/UserServiceTest.java`.
- [ ] T007 [P] [US1] Write integration tests for the registration and login endpoints in `src/test/java/com/example/todolist/web/UserControllerIntegrationTest.java`.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create the `User` entity in `src/main/java/com/example/todolist/model/User.java`.
- [X] T009 [P] [US1] Create the `UserRepository` interface in `src/main/java/com/example/todolist/repository/UserRepository.java`.
- [X] T010 [US1] Implement the `UserService` in `src/main/java/com/example/todolist/service/UserService.java` with a method for user registration.
- [X] T011 [US1] Implement the `UserController` in `src/main/java/com/example/todolist/web/UserController.java` with endpoints for registration and login.
- [X] T012 [P] [US1] Create the registration form template in `src/main/resources/templates/register.html`.
- [X] T013 [P] [US1] Create the login form template in `src/main/resources/templates/login.html`.
```

extrait de task.md

### Exécuter la mission

[![](https://www.sfeir.dev/content/images/2025/10/image-19.png)](https://www.sfeir.dev/content/images/2025/10/image-19.png)

Bond prêt à l'action

Enfin, Bond passe à l’action. De même, nous demandons à l’IA de générer et exécuter le code :

```bash
/speckit.implement
```

C’est ici que la magie opère.  
Specify lit les fichiers **`spec.md`**, **`plan.md`** et **`task.md`**, puis transmet ces informations à **Gemini**, qui génère automatiquement le code source correspondant :  
les entités [Java](/back/java/il-etait-une-fois-java/), les contrôleurs [Spring Boot](/springboot/il-etait-une-fois-spring-boot/), les pages Thymeleaf, la base de données H2, et même les tests unitaires si la constitution le prévoit.

## Résultat

[![](https://www.sfeir.dev/content/images/2025/10/image-20.png)](https://www.sfeir.dev/content/images/2025/10/image-20.png)

l'écran de login

[![](https://www.sfeir.dev/content/images/2025/10/image-21.png)](https://www.sfeir.dev/content/images/2025/10/image-21.png)

l'écran d'ajout d'une tache

[![](https://www.sfeir.dev/content/images/2025/10/image-22.png)](https://www.sfeir.dev/content/images/2025/10/image-22.png)

La liste de mes taches

Clairement, nous sommes loin de la perfection, certaines parties du code généré méritent encore des ajustements, mais quand vous avez un POC ou que vous devez aller vite pour une application de démo lors d'un appel d'offre, vous avez ici un puissant allié.

## Conclusion

Dans un monde où le _vibe coding_ a pris le dessus — où l’on code “à l’instinct” en laissant l’IA improviser le scénario — le **Specification Driven Development** nous rappelle la rigueur du métier.  
Comme un agent bien formé, il ne part jamais sans dossier, sans plan, ni sans instructions claires.

Avec **Specify**, l’intelligence artificielle devient un **allié méthodique** plutôt qu’un improvisateur.  
Elle ne remplace pas le développeur ; elle exécute selon ses ordres.  
Le développeur, lui, reste **le stratège**, celui qui conçoit la mission, définit ses objectifs et veille à ce que le résultat final respecte les principes fixés au départ.

En d’autres termes, le SDD ne cherche pas à désacraliser le développement, mais à **le remettre dans un cadre d’excellence**.  
L’IA devient alors le Q de notre époque : une aide précieuse, brillante, mais toujours au service de la mission — jamais au-dessus.

Et quand le code s’exécute parfaitement, propre, documenté et aligné sur la vision initiale,  
M peut enfin dire, avec un sourire rare :

> **Mission accomplie 007**
