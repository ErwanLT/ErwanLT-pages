---
layout: "default"
title: "Intégration de Thymeleaf dans une application Spring Boot"
permalink: "/back/java/spring-boot/integration-de-thymeleaf-dans-une-application-spring-boot/"
tags: [back, java, spring-boot]
date: "2026-02-24"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/integration-de-thymeleaf-dans-une-application-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1200/2025/08/20250825_1648_Pixelated-Thymeleaf-Magic_simple_compose_01k3gv4yevegxtf34dwcyy8rs8.png"
published_at: "2026-02-24"
sfeir_slug: "integration-de-thymeleaf-dans-une-application-spring-boot"
sfeir_tags: [Back, Java, Spring Boot, Thymeleaf]
---
Depuis les débuts du développement web avec Java, les développeurs se sont appuyés sur le modèle **MVC (Model-View-Controller)** pour structurer leurs applications. De **JSP** ([Java Server Pages](https://fr.wikipedia.org/wiki/Jakarta_Server_Pages)) à **JSF** ([Java Server Faces](https://fr.wikipedia.org/wiki/JavaServer_Faces)), en passant par des bibliothèques comme **Velocity** ou **Freemarker**, les solutions n’ont pas manqué pour relier une logique métier à une présentation web.  
Toutefois, ces approches avaient souvent leurs limites : syntaxe peu intuitive, séparation incomplète entre logique et vue, ou encore difficulté à produire du HTML “propre” et conforme aux standards du web moderne.

C’est dans ce contexte qu’est né [**Thymeleaf**](https://www.thymeleaf.org/), un moteur de template pensé pour la génération de pages HTML dynamiques.  
Couplé à [**Spring Boot**](/back/java/spring-boot/il-etait-une-fois-spring-boot/), il permet d’allier la puissance et la flexibilité du framework Spring avec une approche simple et élégante de la couche “vue”. Contrairement à ses prédécesseurs, Thymeleaf génère du HTML parfaitement valide, lisible à la fois par un navigateur et par un développeur avant traitement côté serveur.

## Présentation de Thymeleaf

**Thymeleaf** est un moteur de templates côté serveur pour Java. Ses fichiers sont des **HTML valides** enrichis d’attributs `th:*`. S’ils sont ouverts directement dans un navigateur, ils restent lisibles ; rendus via Spring, ils deviennent dynamiques (injection de données, conditions, boucles, formulaires liés aux beans, etc.).

Thymeleaf a été créé par **Daniel Fernández**. Le projet est [open source](https://www.sfeir.dev/tag/open-source/) et largement adopté dans l’écosystème Spring.  
En raison de sa syntaxe claire et de sa compatibilité avec les standards HTML5, Thymeleaf est non seulement utilisé en production, mais également dans un grand nombre de tutoriels, de formations et de projets d’apprentissage autour de Spring Boot. Cela contribue à en faire un incontournable du développement web Java côté serveur.

[

Thymeleaf

A modern server-side Java template engine for both web and standalone environments. - Thymeleaf

![](https://www.sfeir.dev/content/images/icon/pinned-octocat.svg)GitHub

![](https://www.sfeir.dev/content/images/thumbnail/1492367)

](https://github.com/thymeleaf)

projet github Thymeleaf

### Thymeleaf et le modèle MVC

[Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/) repose largement sur le modèle **MVC (Model-View-Controller)**, une architecture qui sépare les responsabilités de l’application en trois couches distinctes :

- **Model** : représente les données et la logique métier (par exemple, une entité `Person` et les services qui la manipulent).
- **View** : s’occupe de la présentation à l’utilisateur (dans notre cas, les pages HTML rendues avec **Thymeleaf**).
- **Controller** : fait l’intermédiaire entre le modèle et la vue. Il reçoit les requêtes HTTP, interroge le service métier, et transmet les données au modèle de la vue.

Thymeleaf s’intègre parfaitement dans ce schéma : les **contrôleurs Spring** envoient les objets Java (modèle) à la vue, et Thymeleaf se charge de les afficher en HTML.

Ainsi, l’utilisateur interagit avec une page web (vue), les données sont traitées par le contrôleur et les services (modèle), et le cycle se répète.

### Comment l’utiliser ?

Dans votre fichier `pom.xml` ajouter la dépendance suivante

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

Spring Boot configure automatiquement Thymeleaf comme moteur de rendu des vues.

Les fichiers HTML doivent être placés dans le répertoire `src/main/resources/templates/` .  
Exemple :

- `templates/authors.html`
- `templates/books/list.html`

Un contrôleur qui retourne `"authors"` redirige automatiquement vers le fichier `templates/authors.html` :

```java
@GetMapping("/authors")
public String showAuthors(Model model, @RequestParam(required = false) String keyword) {
    List<Author> authors;
    if (keyword != null && !keyword.isEmpty()) {
        authors = libraryService.searchAuthors(keyword);
    } else {
        authors = libraryService.getAllAuthors();
    }
    model.addAttribute("authors", authors);
    model.addAttribute("keyword", keyword);
    model.addAttribute("newAuthor", new Author());
    return "authors";
}
```

Les données transmises par le contrôleur sont accessibles en HTML via `${...}` :

```html
<ul>
  <li th:each="a : ${authors}" th:text="${a}"></li>
</ul>
```

Ce code génère une liste `<ul>` avec tous les auteurs.

- **`**${...}**`** **: Variables**  
    Sert à accéder aux attributs du modèle ou aux propriétés d’un objet.

```html
<span th:text="${book.title}"></span>
```

- **`***{...}**`** **: Expressions de sélection**  
    Utilisées dans un formulaire lié à un objet (`th:object`).

```html
<form th:object="${book}">
  <input type="text" th:field="*{title}" />
</form>
```

Ici, `*{title}` pointe automatiquement vers `book.getTitle()`.

- **`**@{...}**`** **: URLs**  
    Génère des liens dynamiques, y compris avec paramètres.

```html
<a th:href="@{/books/{id}(id=${book.id})}">Voir le livre</a>
```

- **`**#{...}**`** **: Messages (i18n)**  
    Permet d’afficher des textes traduits à partir de `messages.properties`.

```html
<h1 th:text="#{page.title}"></h1>
```

Si `messages_fr.properties` contient `page.title=Liste des livres`, Thymeleaf affichera cette traduction.

- **Objets utilitaires** **`**#**`**  
    Thymeleaf fournit des helpers pratiques :
- - `#dates.format(date, 'dd/MM/yyyy')`
    - `#lists.isEmpty(authors)`
    - `#strings.toUpperCase(book.title)`
    - `#fields.hasErrors('title')`

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Intégration native Spring Boot** : model binding, validation (`@Valid` + `BindingResult`), i18n, Spring Security (dialecte dédié).
- **HTML “naturel”** : pas de syntaxe ésotérique ; vos pages restent valides.
- **Formulaires puissants** : `th:object` + `th:field` génèrent `name`, `id`, valeurs et gèrent les erreurs via `#fields`.
- **Apprentissage graduel** : vous pouvez commencer simple (affichage) puis intégrer conditions, boucles, fragments, etc.

### ➖ Inconvénients

- **Moins adapté aux SPA riches** : si le front est très interactif, un framework JS côté client conviendra mieux.
- **Risques classiques JPA** : [accès paresseux et N+1](https://www.sfeir.dev/back/probleme-n-1-en-spring-data-jpa-decouvrez-comment-optimiser-vos-requetes-avec-lannotation-query-2/) si on itère naïvement sur des relations dans les vues (à traiter côté service/repository).
- **Moteur côté serveur** : chaque navigation déclenche un rendu serveur

## Exemple pratique

Prenons un exemple simple, une petite application de gestion de bibliothèque, nous aurons 3 écrans :

- liste des auteurs
- détails d'un auteur
- liste des livres

Un auteurs pouvant écrit plusieurs livres, nous pourrons également lui ajouter des livres dans sa bibliographie.

### Le controleur

```java
@Controller
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/authors";
    }

    @GetMapping("/authors")
    public String showAuthors(Model model, @RequestParam(required = false) String keyword) {
        List<Author> authors;
        if (keyword != null && !keyword.isEmpty()) {
            authors = libraryService.searchAuthors(keyword);
        } else {
            authors = libraryService.getAllAuthors();
        }
        model.addAttribute("authors", authors);
        model.addAttribute("keyword", keyword);
        model.addAttribute("newAuthor", new Author());
        return "authors";
    }

    @GetMapping("/books")
    public String showBooks(Model model, @RequestParam(required = false) String keyword) {
        List<Book> books;
        if (keyword != null && !keyword.isEmpty()) {
            books = libraryService.searchBooks(keyword);
        } else {
            books = libraryService.getAllBooks();
        }
        model.addAttribute("books", books);
        model.addAttribute("keyword", keyword);
        return "books";
    }

    @GetMapping("/author/{id}")
    public String showAuthorDetails(@PathVariable Long id, Model model) {
        libraryService.getAuthorById(id).ifPresent(author -> {
            model.addAttribute("author", author);
            Book newBook = new Book();
            newBook.setAuthor(author);
            model.addAttribute("newBook", newBook);
        });
        return "author-details";
    }

    @PostMapping("/author")
    public String addAuthor(@Valid @ModelAttribute("newAuthor") Author author, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("authors", libraryService.getAllAuthors());
            model.addAttribute("keyword", null);
            return "authors";
        }
        libraryService.saveAuthor(author);
        return "redirect:/authors";
    }

    @PostMapping("/book")
    public String addBook(@Valid @ModelAttribute("newBook") Book book, BindingResult result, @RequestParam Long authorId, Model model) {
        if (result.hasErrors()) {
            libraryService.getAuthorById(authorId).ifPresent(author -> model.addAttribute("author", author));
            return "author-details";
        }
        libraryService.getAuthorById(authorId).ifPresent(book::setAuthor);
        libraryService.saveBook(book);
        return "redirect:/author/" + authorId;
    }
    
    @GetMapping("/delete-author/{id}")
    public String deleteAuthor(@PathVariable Long id) {
        libraryService.deleteAuthor(id);
        return "redirect:/authors";
    }

    @GetMapping("/delete-book/{id}")
    public String deleteBook(@PathVariable Long id) {
        Book book = libraryService.getBookById(id).orElseThrow(() -> new IllegalArgumentException("Invalid book Id:" + id));
        libraryService.deleteBook(id);
        return "redirect:/author/" + book.getAuthor().getId();
    }
}
```

- Le **nom de la vue** (`"authors"`) mappe vers `templates/authors.html`.
- On enrichit le **modèle** (ex. `"authors"`, `"newAuthor"`).
- Le **cycle de validation** (`@Valid` + `BindingResult`) renvoie la même page en cas d’erreurs pour les afficher via Thymeleaf.

### Les vues Thymeleaf : les attributs `th:*` en action

###   

![](https://www.sfeir.dev/content/images/2025/08/image-20.png)

```html
<form th:action="@{/authors}" method="get" class="form-inline mb-3">
  <input type="text" name="keyword" th:value="${keyword}" class="form-control mr-2" placeholder="Search by name"/>
  <button type="submit" class="btn btn-primary">Search</button>
</form>
```

- `th:action="@{/authors}"` : **construction d’URL**. `@{…}` gère le contexte, les variables, etc.
- `th:value="${keyword}"` : **injection de valeur** depuis le modèle (ici l’argument `keyword` reçu du contrôleur).

```html
<tr th:each="author : ${authors}">
    <td th:text="${author.id}"></td>
    <td th:text="${author.name}"></td>
    <td>
        <ul>
            <li th:each="book : ${author.books}" th:text="${book.title}"></li>
        </ul>
    </td>
    <td>
        <a th:href="@{/author/{id}(id=${author.id})}" class="btn btn-primary">View</a>
        <a th:href="@{/delete-author/{id}(id=${author.id})}" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this author?')">Delete</a>
    </td>
</tr>
```

- `th:each` : boucle Thymeleaf ; ici on itère sur la liste `${authors}`.
- `th:text` : texte.
- `th:href="@{/author/{id}(id=${author.id})}"` : URL avec variables de chemin.

![](https://www.sfeir.dev/content/images/2025/08/image-21.png)

```html
<div class="modal-body">
  <form th:action="@{/author}" th:object="${newAuthor}" method="post">
      <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" th:field="*{name}" id="name" class="form-control" required/>
          <div th:if="${#fields.hasErrors('name')}" th:errors="*{name}" class="text-danger"></div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</div>
```

- `th:object="${newAuthor}"` : **contexte de sélection** pour le formulaire. Dès lors, `*{…}` pointe **dans** cet objet.
- `th:field="*{name}"` : **liaison bidirectionnelle** champ ↔ propriété. Génère `name="name"`, `id`, et pré-remplit la valeur. En cas d’erreur, réaffiche la saisie.
- `#fields.hasErrors('name')` et `th:errors="*{name}"` : intégration directe avec **Bean Validation** ; affiche le message défini par l’annotation (ex. `@NotBlank`).

🗣️ **i18n** : placez vos messages dans `messages.properties` (ex. `Author name cannot be empty=Le nom de l’auteur est obligatoire`). Puis utilisez `#{…}` dans la vue si besoin.

**//TODO ajouter lien vers article sur la i18n et l10n**

Je vous passe la logique de la page books, c'est exactement la même chose.

## Les alternatives

Selon le projet et le style d’interface attendu, plusieurs voies existent :

- [**Vaadin**](/definition/vaadin-definition/) **(serveur-side UI en Java) :** Un framework complet d’interface **orienté composants** : on écrit l’UI **en Java**, et Vaadin gère le rendu web (HTML/JS) et l’état côté serveur.

[Papa, je veux un Pokédex - partie 2](/back/java/spring-boot/papa-je-veux-un-pokedex-partie-2/)

- **Mustache :** Minimaliste (logique réduite), rapide, bon pour des besoins simples. Moins de confort sur les formulaires/validation intégrés.
- **FreeMarker :** Moteur de templates puissant, syntaxe différente, très flexible. Moins “HTML naturel” que Thymeleaf.

## Conclusion

**Thymeleaf + Spring Boot** incarne une approche classique et solide du web serveur : claire, maintenable, et parfaitement intégrée à l’écosystème Spring. Les attributs `th:*` permettent de **lier naturellement** vos données Java aux vues HTML, avec un support élégant des **formulaires** et de la **validation**.

  
Pour des applications administratives ou des sites nécessitant un rendu serveur fiable et maîtrisé, c’est un choix sûr. Pour des UI très riches et interactives, regardez du côté des **SPA** ; pour rester intégralement en Java avec des composants haut niveau, **Vaadin** est une alternative de premier plan.
