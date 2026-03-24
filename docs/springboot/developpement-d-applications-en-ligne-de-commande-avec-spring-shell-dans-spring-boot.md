---
layout: "default"
title: "Développement d’applications en ligne de commande avec Spring Shell dans Spring Boot"
permalink: "/springboot/developpement-d-applications-en-ligne-de-commande-avec-spring-shell-dans-spring-boot/"
tags: [back, java, spring-boot, shell, cli, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/developpement-dapplications-en-ligne-de-commande-avec-spring-shell-dans-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2026/03/20260316_1158_Image-Generation_simple_compose_01kkv4qch2f8frbemqfbxqz77y.png"
published_at: "2026-03-01"
sfeir_slug: "developpement-dapplications-en-ligne-de-commande-avec-spring-shell-dans-spring-boot"
date: "2026-03-01"
---
Les interfaces en ligne de commande (CLI) représentent depuis longtemps un outil privilégié pour piloter efficacement des applications. Dans le monde professionnel, elles servent aussi bien aux tâches d’administration qu’à l’intégration continue ou encore à des utilitaires internes destinés à automatiser des traitements récurrents. Leur force réside dans leur rapidité d’exécution, leur faible consommation de ressources et leur capacité à être intégrées dans des scripts ou orchestrateurs plus complexes.

Avec l’essor des frameworks modernes, il est devenu plus simple d’enrichir ces CLI de mécanismes avancés tout en restant proche des bonnes pratiques du développement d’applications. C’est dans ce contexte que ****Spring Shell**** prend toute sa place.  
Ce projet de l’écosystème Spring permet de concevoir des interfaces en ligne de commande en conservant le modèle de développement déjà bien connu : gestion des composants, injection de dépendances, configuration via propriétés, intégration avec les autres briques de Spring, et bien sûr la possibilité d’écrire des tests unitaires et d’intégration.

L’association avec [Spring Boot](/springboot/il-etait-une-fois-spring-boot/)renforce encore l’intérêt de cette approche. En effet, [Spring Boot simplifie la mise en place d’applications](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/) non web, en fournissant une configuration par défaut efficace, un support natif pour la gestion des dépendances, ainsi qu’une structure de projet claire et extensible.  
En partant d’un projet Spring Boot minimal, il est ainsi possible d’activer Spring Shell et de bénéficier rapidement d’une CLI robuste, extensible et intégrée à l’écosystème Spring.

## Présentation de Spring Shell

****Spring Shell**** est une bibliothèque de l’écosystème Spring conçue pour faciliter la création d’interfaces en ligne de commande modernes et robustes. Elle met à disposition plusieurs fonctionnalités clés qui simplifient grandement le travail du développeur :

- une infrastructure permettant de définir des commandes à l’aide [d’annotations dédiées](/springboot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) (`@ShellComponent`, `@ShellMethod`), avec le support de l’injection de dépendances propre à Spring,
- un environnement interactif de type ****REPL**** (Read–Eval–Print Loop), activable par simple configuration (`spring-shell.interactive.enabled=true`),
- un ensemble de composants TUI (tableaux, sélecteurs, flux, vues de progression, etc.) pour enrichir l’expérience utilisateur directement dans le terminal,
- une intégration naturelle avec les autres briques Spring, qu’il s’agisse de la configuration centralisée, des beans métiers ou encore des mécanismes de tests.

Certains composants se révèlent particulièrement utiles pour construire des interactions avancées.  
On peut citer `ComponentFlow`, qui permet d’orchestrer et de chaîner différents éléments d’interface, `ViewComponentBuilder`, qui facilite la création d’écrans textuels structurés, ainsi que `ProgressView`, pensé pour afficher des barres de progression dynamiques.  
Ces outils offrent une alternative élégante au traditionnel `System.out` et permettent de proposer une CLI plus ergonomique et engageante.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- ****Intégration Spring :**** mêmes annotations et modèle de composants que pour une application Spring classique.
- ****Composants TUI :**** progress bars, tableaux, flows pour de l’UX terminale plus riche.
- ****Rapidité pour des outils d’administration**** (pas d’UI graphique à développer).

### ➖ Inconvénients

- ****Terminal variabilité :**** certains composants TUI requièrent un terminal « complet » ; sur des terminals minimalistes (DumbTerminal) ils peuvent ne pas s’afficher correctement. Il faut prévoir un fallback ou détecter le type de terminal. (problèmes remontés sur des environnements CI/PTY).
- ****Erreurs d’intégration:**** l’usage de composants interactifs dans des environnements non-interactifs (scripts, CI) doit être géré.
- ****Complexité pour état partagé / concurrence**** (les commandes exécutent du code métier : bien séparer la logique métier du code d’affichage).

## Exemple d’implémentation

Dans cet exemple nous utiliserons un système de gestion de stock dans un entrepôt.

### Dépendances Maven

Pour commencer, il nous faut importer la dépendance `spring-shell-starter` dans notre fichier `pom.xml`

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.shell</groupId>
        <artifactId>spring-shell-starter</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.shell</groupId>
            <artifactId>spring-shell-dependencies</artifactId>
            <version>${spring-shell.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

- `spring-shell-starter` est le point d’entrée : il apporte la configuration auto pour exécuter une application CLI Spring.
- `dependencyManagement` permet d’aligner les versions des modules Spring Shell via un BOM (`spring-shell-dependencies`) si vous gérez plusieurs artefacts.

### Les properties

```properties
spring.main.web-application-type=none
spring.shell.interactive.enabled=true
spring.main.log-startup-info=false
logging.level.root=WARN
```

- `spring.main.web-application-type=none` : on indique que ce n’est pas une application web — démarrage plus léger, pas de serveur embarqué.
- `spring.shell.interactive.enabled=true` : active le mode interactif (REPL).
- `spring.main.log-startup-info=false` et `logging.level.root=WARN` : règles de logging pour garder la console propre lors de l’utilisation du shell.

### Le modèle `Product`

```java
public class Product {
    private final String id;
    private final String name;
    private int quantity;

    public Product(String id, String name) {
        this.id = id;
        this.name = name;
        this.quantity = 0;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "Product{"
                + "id='" + id + "'"
                + ", name='" + name + "'"
                + ", quantity=" + quantity
                + "}";
    }
}
```

Voici l'objet Product qui représentera les différents produits présent dans notre entrepôt et que l'on gérera.

### Le service `WarehouseService`

```java
@Service
public class WarehouseService {

    private final Map<String, Product> products = new ConcurrentHashMap<>();

    @PostConstruct
    private void loadInitialData() {
        addProduct("L001", "Laptop Pro");
        updateStock("L001", 15);

        addProduct("S001", "Smartphone X");
        updateStock("S001", 30);

        addProduct("M001", "Wireless Mouse");
        updateStock("M001", 75);
    }

    public Product addProduct(String id, String name) {
        if (products.containsKey(id)) {
            throw new IllegalArgumentException("Product with ID '" + id + "' already exists.");
        }
        Product newProduct = new Product(id, name);
        products.put(id, newProduct);
        return newProduct;
    }

    public Optional<Product> findProduct(String id) {
        return Optional.ofNullable(products.get(id));
    }

    public Collection<Product> getAllProducts() {
        return products.values();
    }

    public Product updateStock(String id, int quantityChange) {
        Product product = findProduct(id)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID '" + id + "' not found."));

        int newQuantity = product.getQuantity() + quantityChange;
        if (newQuantity < 0) {
            throw new IllegalStateException("Not enough stock for product '" + product.getName() + "'. Current stock: " + product.getQuantity());
        }
        product.setQuantity(newQuantity);
        return product;
    }
}
```

Un simple service de création / modification, ici j'ai pré alimenté mes produits via l'annotation `@PostConstruct`, mais j'aurais très bien put avoir un repository et une base de données derrière.

### Les commandes

Nous rendrons maintenant dans le coeur du sujet, les commandes, après tout que serais une application CLI sans ses commandes à exécuter ?

Avant même d’ajouter des commandes personnalisées, Spring Shell met à disposition un ensemble de commandes prêtes à l’emploi. Elles servent de socle pour naviguer dans l’environnement REPL et pour découvrir les possibilités offertes par le framework. Parmi les plus utiles, on retrouve :

- ****help**** : affiche la liste des commandes disponibles avec leur description. C’est généralement le point d’entrée pour découvrir une application en ligne de commande.
- ****clear**** : efface l’écran du terminal, facilitant la lisibilité des interactions.
- ****quit**** (ou ****exit****) : permet de quitter proprement l’application Spring Shell.
- ****version**** : affiche la version de votre application.
- ****script**** : exécute un ensemble de commandes stockées dans un fichier script, pratique pour automatiser des scénarios.
- ****stacktrace**** : active ou désactive l’affichage détaillé des erreurs lorsque des exceptions surviennent, utile pour le débogage.

Ces commandes par défaut constituent un environnement de base immédiatement fonctionnel, où l’utilisateur peut explorer, tester et s’orienter. Elles illustrent également la manière dont une application CLI construite avec Spring Shell peut être enrichie progressivement de commandes métier adaptées aux besoins spécifiques.

Ainsi, Spring Shell offre à la fois une expérience utilisateur immédiate et un cadre extensible, combinant convivialité et puissance.

![](https://www.sfeir.dev/content/images/2025/09/image-12.png)

Maintenant il est temps de créer nos commandes qui permettront de gérer le stock de notre entrepôt

```java
@ShellComponent("Warehouse Commands") 
public class WarehouseCommands { 
  private final WarehouseService warehouseService; 
  private final AsyncService asyncService; 
  private final ViewComponentBuilder viewComponentBuilder; 
  
  public WarehouseCommands(WarehouseService warehouseService, AsyncService asyncService, ComponentFlow componentFlow, ViewComponentBuilder viewComponentBuilder) { 
    this.warehouseService = warehouseService; 
    this.asyncService = asyncService; 
    this.viewComponentBuilder = viewComponentBuilder; 
  } 
}
```

Ici, l’annotation `@ShellComponent` enregistre cette classe comme fournisseur de commandes Spring Shell. Le constructeur injecte plusieurs services :

- ****WarehouseService**** : la logique métier pour gérer les produits et les stocks.
- ****AsyncService**** : l’exécution de tâches longues en arrière-plan.
- ****ViewComponentBuilder**** : la création de composants d’interface textuelle enrichis (par exemple, des barres de progression).

En tapant help dans notre terminal nous aurons une nouvelle section Warehouse Commands qui apparaitra qui contiendra l'ensemble des commandes définies dans cette classe.

![](https://www.sfeir.dev/content/images/2025/09/image-13.png)

Il est maintenant tant d'implementer nos commandes à proprement parlé

****Ajouter un produit****

```java
@ShellMethod(key = "add-product", value = "Add a new product to the warehouse.")
public String addProduct(
        @ShellOption(help = "The unique ID of the product.") String id,
        @ShellOption(help = "The name of the product.") String name) {
    try {
        Product product = warehouseService.addProduct(id, name);
        return "Product added: " + product.getName() + " (ID: " + product.getId() + ")";
    } catch (IllegalArgumentException e) {
        return "Error: " + e.getMessage();
    }
}
```

- L'annotation `@ShellMethod` nous permet de définir la ****clé**** de notre commande (la commande que l'on rentrera dans le terminal) et sa ****description**** qui est visible lors d'un ****help****.
- `@ShellOption` permet de contextualiser les paramètre de cette dernière

![](https://www.sfeir.dev/content/images/2025/09/image-14.png)

****Lister les produits****

```java
@ShellMethod(key = "list-products", value = "List all products in the warehouse.")
public Table listProducts() {
    Collection<Product> products = warehouseService.getAllProducts();
    if (products.isEmpty()) {
        System.out.println("No products in warehouse.");
        return null;
    }

    LinkedHashMap<String, Object> headers = new LinkedHashMap<>();
    headers.put("id", "ID");
    headers.put("name", "Name");
    headers.put("quantity", "Quantity");

    TableModel model = new BeanListTableModel<>(products, headers);
    TableBuilder tableBuilder = new TableBuilder(model);
    tableBuilder.addHeaderAndVerticalsBorders(BorderStyle.fancy_light);
    // Set a width for the 'Name' column (index 1) to prevent wrapping
    tableBuilder.on(org.springframework.shell.table.CellMatchers.column(1)).addSizer(new org.springframework.shell.table.AbsoluteWidthSizeConstraints(20));
    return tableBuilder.build();
}
```

Ici, Spring Shell permet de créer un ****tableau formaté**** grâce aux utilitaires `TableModel` et `TableBuilder`. Les colonnes sont définies explicitement, et la largeur de la colonne __Name__ est contrainte pour une meilleure lisibilité.

![](https://www.sfeir.dev/content/images/2025/09/image-15.png)

****Lancer un inventaire asynchrone****

Cette méthode lancera un traitement asynchrone afin de montrer comment mettre en place un loader "****artisanal****"

```java
@ShellMethod(key = "run-inventory", value = "Run a long-running inventory check.")
public String runInventory() throws Exception {
    Future<String> future = asyncService.longRunningTask();

    // Display a simple spinner while the task is running
    char[] spinner = {'|', '/', '-', '\\'};
    int i = 0;
    while (!future.isDone()) {
        System.out.print("\rRunning inventory check... " + spinner[i++ % spinner.length]);
        TimeUnit.MILLISECONDS.sleep(100);
    }
    System.out.print("\r                                 \r"); // Clear the line

    return future.get(); // Get the result from the future
}
```

Cette commande illustre l’intégration d’une ****tâche longue**** avec un retour utilisateur. Un simple __spinner__ (| / - \) est affiché en attendant la fin de l’opération. Le résultat final est récupéré via le `Future`.

![](https://www.sfeir.dev/content/images/2025/09/image-16.png)

****Inventaire avec interface textuelle****

Ici, on va plus loin avec une ****progress bar textuelle**** intégrée à l’interface. La classe `ProgressView` fournit une structure de suivi : description, spinner et pourcentage d’avancement. Même si la tâche ne fournit pas de progression réelle, une méthode utilitaire (`runProgress`) simule une incrémentation régulière jusqu’à la complétion.

```java
@ShellMethod(key = "run-inventory-ui", value = "Run a long-running inventory check with a TUI progress bar.")
public String runInventoryUi() throws Exception {
    // Start the asynchronous long-running task.
    Future<String> future = asyncService.longRunningTask();

    // Build the ProgressView component.
    ProgressView view = new ProgressView(
            ProgressView.ProgressViewItem.ofText(30, HorizontalAlign.LEFT),
            ProgressView.ProgressViewItem.ofSpinner(3, HorizontalAlign.LEFT),
            ProgressView.ProgressViewItem.ofPercent(0, HorizontalAlign.RIGHT)
    );
    view.setDescription("Running inventory check...");

    // Wrap the view in a ViewComponent to handle terminal and event loop.
    ViewComponent component = viewComponentBuilder.build(view);

    // Run the view component asynchronously so it doesn't block the command.
    ViewComponent.ViewComponentRun run = component.runAsync();

    try {
        // Run and manage the progress view until the future is done.
        runProgress(view, future);
    } finally {
        // Request the component to close and wait for it to terminate.
        component.exit();
        run.await();
    }

    // Return the result from the asynchronous task.
    return future.get();
}

private void runProgress(ProgressView view, Future<?> future) throws InterruptedException {
    // Start the ProgressView's internal logic (e.g., spinner animation).
    view.start();

    // Since the async task doesn't report progress, we simulate it.
    // The loop updates the progress bar until the task is complete.
    int progress = 0;
    while (!future.isDone()) {
        // Update the progress bar. This is thread-safe for this use case.
        view.setTickValue(Math.min(100, progress));
        progress += 2; // Simulate a 2% progress increment.
        Thread.sleep(150); // Refresh at a reasonable rate.
    }

    // Ensure the progress bar shows 100% and stop the view.
    view.setTickValue(100);
    view.stop();
}
```

![](https://www.sfeir.dev/content/images/2025/09/image-17.png)

## Limites des terminaux simples (dits « dumb terminals »)

Lorsqu’on exécute une application Spring Shell, le confort d’utilisation peut varier fortement en fonction du terminal utilisé.  
Dans un ****terminal avancé**** (par exemple iTerm2, Windows Terminal, ou un shell moderne avec prise en charge des séquences ANSI), l’auto-complétion, la coloration et les composants textuels enrichis (comme les barres de progression) fonctionnent de manière fluide.

À l’inverse, certains environnements plus basiques – comme les consoles intégrées dans certains IDE (Eclipse, NetBeans ou parfois même IntelliJ selon la configuration) – se comportent comme des ****dumb terminals****. Ces derniers :

- ne gèrent pas toujours l’auto-complétion des commandes ;
- affichent mal les tables ou les bordures de style ;
- ignorent parfois les animations (spinners, barres de progression).

Dans ces cas, l’expérience utilisateur reste fonctionnelle mais appauvrie. Il est donc recommandé, lorsque l’on développe ou déploie une application basée sur Spring Shell, de tester les commandes dans un terminal avancé pour tirer parti de toutes les fonctionnalités offertes.

## Conclusion

Le développement d’applications en ligne de commande avec ****Spring Shell****, intégré à l’écosystème [Spring Boot](https://www.sfeir.dev/tag/spring-boot/), ouvre la voie à une approche moderne et robuste des outils CLI. Grâce à son intégration fluide avec l’infrastructure Spring, il devient possible de créer des commandes interactives, enrichies de fonctionnalités avancées comme l’autocomplétion, la validation des entrées ou encore le mode REPL, tout en conservant la puissance de configuration et l’extensibilité propres à Spring Boot.

Si les solutions classiques en ligne de commande restent pertinentes pour des usages simples, Spring Shell se distingue par sa capacité à industrialiser ces outils, à les structurer et à les rendre facilement maintenables. Les exemples de services, de commandes personnalisées et de gestion asynchrone illustrent concrètement comment ce framework peut transformer une application Spring Boot en véritable console interactive.

Au final, Spring Shell se présente comme une solution pour enrichir l’écosystème Spring, permettant aux développeurs de proposer à leurs utilisateurs des outils en ligne de commande modernes, adaptés aux besoins actuels de l’automatisation et de l’administration applicative.

---

Et en bon gros geek que je suis, j'ai tenté de faire un terminal à la fallout :  

![](https://www.sfeir.dev/content/images/2025/10/image-3.png)

![](https://media.tenor.com/6fpC80BmM88AAAAC/fall-out.gif)
