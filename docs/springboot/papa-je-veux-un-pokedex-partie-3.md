---
layout: "default"
title: "Papa, je veux un Pokédex - partie 3"
permalink: "/springboot/papa-je-veux-un-pokedex-partie-3/"
tags: [back, java, vaadin, pokedex, spring-boot, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/papa-je-veux-un-pokedex-partie-3/"
banner: "https://images.unsplash.com/photo-1698921973797-01021d536345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDE0fHxwb2tlYmFsbHxlbnwwfHx8fDE3MjcyNDg2ODl8MA&ixlib=rb-4.0.3&q=80&w=2000"
published_at: "2024-11-22"
sfeir_slug: "papa-je-veux-un-pokedex-partie-3"
date: "2024-11-22"
---
[Précédemment](/springboot/papa-je-veux-un-pokedex-partie-2/), nous avons vu comment créer un projet [Springboot](/springboot/il-etait-une-fois-spring-boot/) + [Vaadin](/definition/vaadin-definition/), et avoir notre première vue après démarrage de l'application, il est temps de voir ce que nous pouvons faire d'autre.

## Pimentons un peu les choses

Nous venons de voir comment créer une vue "simple", et comme vous avez pu le constater, ce n'était pas compliqué, loin de là.  
Il est temps de pimenter un tantinet les choses en ajoutant des composants plus complexes que du texte et leur ajouter des events listener.

Pour ce faire, nous allons créer une nouvelle vue qui nous servira à afficher les 151 premiers Pokémon dans un tableau.

```java
@Route("firstGen")
@PageTitle("1ere génération")
public class FirstGenView extends HorizontalLayout {

    public FirstGenView(){
        add(new H1("1ere génération"));
    }
}
```

initialisation vue

[![](https://www.sfeir.dev/content/images/2024/08/image-5.png)](https://www.sfeir.dev/content/images/2024/08/image-5.png)

rendu

Pour l'instant c'est un peu vide, voyons comment je peux ajouter du contenu.

### Le service de récupération des informations

Comme je suis dans une application spring boot, je peux très bien créer un service qui me permettra d'aller lire le contenu d'un fichier json avec toutes les informations concernant nos chers petits monstres.

```java
@Service
public class PokemonService {

    @Autowired
    private ResourceLoader resourceLoader;

    List<Pokemon> firstGen = new ArrayList<>();

    @PostConstruct
    private void init() throws IOException {
        firstGen = getFirstGen();
    }

    public List<Pokemon> getFirstGen() throws IOException {
        if (firstGen.isEmpty()) {
            Resource resource = resourceLoader.getResource("classpath:static/gen/gen1.json");
            ObjectMapper objectMapper = new ObjectMapper();
            Pokemon[] pokemonsArray = objectMapper.readValue(resource.getInputStream(), Pokemon[].class);
            return Arrays.asList(pokemonsArray);
        } else {
            return firstGen;
        }
    }
}
```

Service de récupération des informations de la première génération

Je vous épargne l'implémentation de toutes les classes qui permettent de décrire un Pokémon (spoiler, il y'en a 13), mais vous trouverez en fin d'article un lien vers le code qui vous permettra d'y jeter un oeil.

Ici à l'instantiation de mon service, j'alimente une liste avec le contenu du fichier JSON ci joint :


Pour éviter d'aller le lire le contenu de mon fichier à chaque appel à ma page, je le fais seulement à la création du service. Après tout, ce ne sont pas des données qui vont changer tous les jours.

### Alimentons notre vue

#### Ajout du service à la vue

Maintenant que nous avons notre service, il nous reste à l'utiliser.  
Pour ce faire, je modifie le code de ma vue afin d'injecter mon service en tant que propriété de cette dernière.

```java
@Route("firstGen")
@PageTitle("1ere génération")
public class FirstGenView extends HorizontalLayout {

    private final PokemonService service;

    public FirstGenView(PokemonService service) throws IOException {
        this.service = service;
        add(new H1("1ere génération"));

        List<Pokemon> pokemons = service.getFirstGen();
        pokemons.forEach(pokemon -> add(new Span(pokemon.getName().getFr())));
    }
}
```

Attention, Il y a un piège

[![](https://www.sfeir.dev/content/images/2024/08/image-6.png)](https://www.sfeir.dev/content/images/2024/08/image-6.png)

j'avais bien dit qu'il y avait un piège

Et là, quelque chose cloche... Tous les noms sont alignés les uns après les autres à l'horizontale. Nous avons spécifié que notre vue étendait la classe `HorizontalLayout`, ce qui n'est pas terrible pour une liste.  
Changeons cela en `VerticalLayout`et observons le résultat.

```java
@Route("firstGen")
@PageTitle("1ere génération")
public class FirstGenView extends VerticalLayout {

    private final PokemonService service;

    public FirstGenView(PokemonService service) throws IOException {
        this.service = service;
        add(new H1("1ere génération"));

        List<Pokemon> pokemons = service.getFirstGen();
        pokemons.forEach(pokemon -> add(new Span(pokemon.getName().getFr())));
    }
}
```

on précise le type de layout

[![](https://www.sfeir.dev/content/images/2024/08/image-7.png)](https://www.sfeir.dev/content/images/2024/08/image-7.png)

c'est mieux !

Voilà qui est mieux, mais plus haut je vous avais parlé d'un tableau, et l'on en est encore loin.  
Enfin pas vraiment, pour cela nous allons faire appel à l'élément `Grid` de Vaadin.

#### Ajout de l'élément Grid

L'élément `Grid` dans Vaadin est un composant de tableau utilisé pour afficher et manipuler des données. Il offre de nombreuses fonctionnalités pour permettre aux développeurs de créer des interfaces utilisateur riches et interactives.

Ses principales caractéristique sont les suivantes :

- `Grid` permet d'afficher des données sous forme de tableau avec des colonnes et des lignes.
- Chaque ligne représente un élément de données et chaque colonne représente une propriété de cet élément.
- Vous pouvez définir quelles propriétés des objets de données doivent être affichées dans quelles colonnes.
- Les colonnes peuvent être ajoutées, enlevées, ou réorganisées.
- Vous pouvez ajouter des filtres pour permettre aux utilisateurs de trouver rapidement les données qu'ils recherchent.
- `Grid` supporte la sélection simple ou multiple des lignes, permettant des actions basées sur la sélection des utilisateurs.

⚠️ L'élément `Grid` de Vaadin doit être typé pour plusieurs raisons qui sont liées à la sécurité, la clarté du code et les fonctionnalités offertes par le langage Java.

Voilà pour les explications concernant ce composant, maintenant place à la pratique :

```java
@Route("firstGen")
@PageTitle("1ere génération")
public class FirstGenView extends VerticalLayout {

    private final PokemonService service;

    Grid<Pokemon> grid = new Grid<>(Pokemon.class);

    public FirstGenView(PokemonService service) throws IOException {
        this.service = service;
        add(new H1("1ere génération"));
        configureGrid();
        add(grid);
    }

    private void configureGrid() throws IOException {
        List<Pokemon> pokemons = service.getFirstGen();
        grid.setItems(pokemons);
    }
}
```

Je modifie ma classe Java correspondant à ma vue en lui ajoutant un élément `Grid` typé avec mon objet `Pokemon`.  
J'ai créé une méthode `configureGrid` qui me servira à alimenter cette dernière avec les données de notre service, et j'ajoute via la méthode `add` notre grid à la vue.

[![](https://www.sfeir.dev/content/images/2024/08/image-9.png)](https://www.sfeir.dev/content/images/2024/08/image-9.png)

Résultat ajout de la grid

Houla que c'est moche ! On peut voir que si on ne fait que le minimum en ajoutant uniquement nos données, toutes les propriétés de mon objet seront affichées dans le tableau et par ordre alphabétique.

Voyons comment nous pouvons customisé cela.

#### Personnalisons l'élément Grid

Avec Vaadin, il existe trois manières principales d'ajouter des éléments (colonnes) à une `Grid`. Chaque méthode a ses propres usages et avantages, selon le niveau de personnalisation et de complexité souhaité.

- **Utilisation de `setColumns`** : La méthode `setColumns` est une manière rapide et directe de définir les colonnes d'une `Grid` en spécifiant simplement les noms des propriétés des objets de données à afficher. Cette méthode est particulièrement utile pour les scénarios où vous souhaitez afficher plusieurs propriétés sans avoir besoin de personnalisation supplémentaire.
- **Utilisation de `addColumn`** : La méthode `addColumn` permet d'ajouter des colonnes une par une avec un haut degré de personnalisation. En utilisant des références de méthode ou des expressions lambda, vous pouvez définir précisément comment les données doivent être affichées dans chaque colonne. De plus, `addColumn` permet de configurer des en-têtes personnalisés, de rendre les colonnes triables, et d'appliquer d'autres configurations avancées.
- **Utilisation de `addComponentColumn`** : La méthode `addComponentColumn` permet d'ajouter des colonnes contenant des composants Vaadin, tels que des boutons, des champs de texte, des labels, et plus encore. Cette méthode est particulièrement utile pour intégrer des éléments interactifs directement dans les cellules de la `Grid`, offrant ainsi une interface utilisateur riche et interactive.

Voyons cela plus en détail :

```java
private void configureGrid() throws IOException {
    List<Pokemon> pokemons = service.getFirstGen();
    grid.setSizeFull();
    grid.setColumns("pokedexId"); // ajout de la propriété pokedexId de l'objet pokemon triable par défaut
    grid.addColumn(pokemon -> pokemon.getName().getFr())
            .setHeader("Nom")
            .setSortable(true); // ajout de la colonne Nom, triable, issue du sous objet name
    grid.addComponentColumn(pokemon -> {
        Div div = new Div();
        pokemon.getTypes().forEach(t -> div.add(new Image(t.getImage(), t.getName())));
        return div;
    }).setHeader("Types"); // ajout d'une colonne composant avec des images
    grid.addComponentColumn(pokemon ->
    {
        Image img = new Image(pokemon.getSprites().getRegular(), String.valueOf(pokemon.getPokedexId()));
        img.setHeight(150, Unit.PIXELS);
        img.setWidth(150, Unit.PIXELS);
        return img;
    }).setHeader("Image");
    grid.getColumns().forEach(col -> col.setAutoWidth(true));
    grid.setItems(pokemons);
}
```

Comme vous pouvez le constater, j'ai ajouté mes données après avoir configuré ma grid, il est recommandé de définir les colonnes du `Grid` avant d'alimenter la `Grid` avec des données.  
Cela permet de s'assurer que la configuration des colonnes est en place avant que les données ne soient ajoutées, ce qui peut éviter des comportements inattendus et garantir que la `Grid` est correctement configuré dès le début.

Voyons voir maintenant le résultat de notre configuration :

[![](https://www.sfeir.dev/content/images/2024/08/image-10.png)](https://www.sfeir.dev/content/images/2024/08/image-10.png)

Grid personnalisée

C'est encore rudimentaire, mais on commence à avoir un début de quelque chose.

#### Ajoutons un event listener

Le but premier d'un Pokédex est quand même d'être une encyclopédie des Pokémon et de montrer toutes les informations les concernant.  
Pour ce faire, nous allons ajouter une action au clic sur un bouton, pour voir les détails d'un Pokémon en particulier.

```java
grid.addComponentColumn(pokemon -> {
    Button button = new Button("Voir Détails");
    button.addClickListener(e -> {
        navigationService.setSelectedPokemon(pokemon);
        UI.getCurrent().navigate(PokemonDetailView.class);
    });
    return button;
}).setHeader("Détails");
```

Ici nous avons ajouté un colonne dans notre `grid` avec à l'intérieur un bouton.  
Sur ce bouton nous avons ajouté un `ClickListener`, à comprendre une action qui se déclenchera lors du clic sur ce dernier.  
Ici, ça sera une navigation vers une vue concernant les détails sur le Pokémon sélectionné.  

[![](https://www.sfeir.dev/content/images/2024/08/image-11.png)](https://www.sfeir.dev/content/images/2024/08/image-11.png)

bouton ajouté à la grid

[![](https://www.sfeir.dev/content/images/2024/08/image-12.png)](https://www.sfeir.dev/content/images/2024/08/image-12.png)

vue détails

Ici pour passer le Pokémon en paramètre à ma nouvelle vue, je suis passé par l'injection de dépendance avec un service commun à mes 2 vues : `NavigationService`

```java
@Service
public class NavigationService {

    private Pokemon selectedPokemon;

    public Pokemon getSelectedPokemon() {
        return selectedPokemon;
    }

    public void setSelectedPokemon(Pokemon selectedPokemon) {
        this.selectedPokemon = selectedPokemon;
    }
}
```

Mais il existe de nombreuses autres manières de procéder pour passer des paramètres lors de la navigation :

- **Path parameter** : les paramètres présents dans le chemin de l'url  
    exemple : [http://localhost:8080/pokemon-detail/Bulbizarre](http://localhost:8080/pokemon-detail/Bulbizarre?ref=sfeir.dev)
- **Query parameter** : les paramètre ajoutés à l'URL après un `?`  
    exemple : [http://localhost:8080/pokemon-detail?name=Bulbizarre](http://localhost:8080/pokemon-detail/Bulbizarre?ref=sfeir.dev)
- **Stockage en session** : Le stockage de session où la session UI peut être utilisée pour passer des données entre les vues sans inclure ces données dans l'URL.  
    exemple : `UI.getCurrent().getSession().setAttribute("name", "Bulbizarre");`

Chacune de ces méthodes a ses propres avantages et inconvénients en termes de simplicité, sécurité et flexibilité. Le choix de la méthode dépend du contexte de votre application et des besoins spécifiques de votre logique métier.

Les plus attentifs d'entre vous auront remarqué que la vue de détail n'a pas l'air d'avoir le thème par défaut des autres vues que nous avons pu créer jusqu'à présent.  
Et bien c'est normal ! Plus haut, je vous avais dit que Vaadin permettait le développement en full-stack Java, en réduisant la nécessité de basculer entre différents langages (comme JavaScript, HTML, CSS). Réduire ne veut pas dire que vous n'aurez pas à en faire, mais juste moins.

#### Le CSS

[CSS (Cascading Style Sheets)](https://www.sfeir.dev/front/state-of-css/) est un langage de style utilisé pour définir la présentation des documents HTML. Il permet de contrôler l'apparence visuelle des pages web, incluant la mise en page, les couleurs, les polices et les espacements.

Par défaut, au démarrage d'un projet Vaadin, vous trouverez un fichier CSS à cet emplacement :

[![](https://www.sfeir.dev/content/images/2024/08/image-13.png)](https://www.sfeir.dev/content/images/2024/08/image-13.png)

votre CSS perso ici

Le fichier est vide, mais vous être libre de l'éditer pour y ajouter vos propre style.  
Vous pouvez également à l'intérieur de ce fichier [importer d'autre fichier CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/@import?ref=sfeir.dev)⚠️ Attention, il s'agit ici du fichier de style global de l'application.  
Si jamais vous souhaitez un style particulier pour une page, il faudra utiliser l'annotation `@CssImport()` et indiquer le chemin vers le fichier de style voulu.

[![](https://www.sfeir.dev/content/images/2024/08/image-14.png)](https://www.sfeir.dev/content/images/2024/08/image-14.png)

la même vue, mais sans CSS

Comme vous pouvez le constater, le CSS apporte une touche plus perso à notre application.

---

Après avoir peaufiné un peu notre application, ajouté d'autre layout dans la vue de détail, enrichi le service de recherche des Pokémon, voici à quoi peut ressembler au final notre application:

0:00

/0:11

1×

  
J'ai ici plusieurs vues de type liste :

- Une première vue qui contient la liste des 1080 Pokémon existant.
- Une seconde similaire, mais avec un filtre de recherche via liste déroulante pour n'afficher que ceux d'une génération en particulier.
- Une troisième qui me donne la liste des types possibles pour ces petites bêtes.

Il nous reste plus qu'à soumettre le résultat à mini nous pour validation. Et là miracle, il est content !

[![](https://media.tenor.com/2wEmgwPNLbEAAAAC/pikachu-dance.gif)](https://media.tenor.com/2wEmgwPNLbEAAAAC/pikachu-dance.gif)

danse de la victoire, le résultat est à la hauteur de ses attentes
