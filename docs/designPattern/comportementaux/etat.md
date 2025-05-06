---
layout: default
title: Etat
tags: [java, tutoriel, design pattern, comportementaux, etat]
---

# Le design pattern Etat

## Définition

Le design pattern **État** est un design pattern comportemental qui permet à un objet de modifier son comportement en fonction de son état interne.  
Plutôt que de gérer directement les transitions entre les différents états, l'objet délègue cette responsabilité à des objets État spécialisés.  
Chaque objet État encapsule le comportement spécifique à un état particulier, ce qui permet à l'objet principal de déléguer dynamiquement ses actions en fonction de son état actuel.

## Avantages et inconvénients

|   |   |
|---|---|
|- Modularité et extensibilité<br>- Séparation des préoccupations<br>- Fléxibilité|- Complexité accrue<br>- Surcoût initial<br>- La cohérence|

## Avantages

1. **Modularité et extensibilité** : Le pattern État permet d'encapsuler chaque état dans une classe distincte, favorisant ainsi la modularité du code. Cela rend également l'ajout de nouveaux états ou la modification des comportements existants plus facile et moins risqué.
2. **Séparation des préoccupations** : Ce pattern permet de séparer les différents comportements en fonction des états, ce qui rend le code plus facile à comprendre et à maintenir. Chaque classe État est responsable de son propre comportement, ce qui réduit le couplage entre les différentes parties du système.
3. **Flexibilité** : Le pattern État permet aux objets de modifier dynamiquement leur comportement en fonction de leur état interne. Cela offre une grande flexibilité dans la gestion des transitions entre les états et permet d'adapter le comportement de l'objet en fonction du contexte.

## Inconvénients

1. **Complexité accrue** : L'usage du pattern État peut rendre le code plus complexe, en particulier dans les systèmes avec de nombreux états et transitions. La multiplication des classes État peut rendre le code plus difficile à comprendre pour les développeurs, en particulier s'ils ne sont pas familiers avec le pattern.
2. **Surcoût initial** : La mise en place du pattern État peut nécessiter un surcoût initial en termes de conception et de développement. Il faut créer des classes État pour chaque état possible, ce qui peut prendre du temps et de l'effort.
3. **La cohérence** : Si les transitions entre les états ne sont pas correctement gérées, cela peut conduire à des problèmes de cohérence dans le système. Il est important de s'assurer que les transitions entre les états sont correctement gérées pour éviter les comportements imprévus.

## Exemple d'implémentation

Comme lors des [articles sur le design pattern Commande](https://www.sfeir.dev/back/design-patterns-comportementaux-commande/), ou celui du [design pattern Memento](https://www.sfeir.dev/back/design-patterns-comportementaux-memento/) nous allons utiliser l'exemple d'un éditeur de texte dans lequel nous allons modifier notre document, et donc par extension ses états.  
Dans cet exemple nous avons :

[![diagramme de classe](https://www.sfeir.dev/content/images/2024/03/state.drawio.png)](https://www.sfeir.dev/content/images/2024/03/state.drawio.png)

diagramme de clase

- Une interface `DocumentState` avec une méthode _display()_ pour indiquer l'état du document.

```java
public interface DocumentState {
    void display();
    void insertText(String text);
    void save();
}
```

- Deux états plus concrets `EmptyDocumentState` et `NonEmptyDocumentState` qui représenteront deux états choisis arbitrairement pour cet article. Il pourrait très bien en avoir plus.

```java
public class EmptyDocumentState implements DocumentState{
    private Document document;

    public EmptyDocumentState(Document document) {
        this.document = document;
    }

    @Override
    public void display() {
        System.out.println("Le document est vide.");
    }

    @Override
    public void insertText(String text) {
        System.out.println("Le document n'est plus vide, on change d'état");
        document.setState(new NonEmptyDocumentState(document, text));
    }

    @Override
    public void save() {
        System.out.println("Impossible de sauvegarder : le document est vide.");
    }
}

public class NonEmptyDocumentState implements DocumentState{
    private Document document;
    private StringBuilder content;

    public NonEmptyDocumentState(Document document, String initialContent) {
        this.document = document;
        this.content = new StringBuilder(initialContent);
    }

    @Override
    public void display() {
        System.out.println("Contenu du document : \n" + content.toString());
    }

    @Override
    public void insertText(String text) {
        content.append(text);
    }

    @Override
    public void save() {
        System.out.println("Sauvegarde du document...");
    }
}
```

Dans la classe `EmptyDocumentState`, la méthode _insertText()_ change l'état du document vers `NonEmptyDocumentState` lorsqu'un texte est inséré.

Maintenant, lorsqu'un texte est inséré dans un document vide, l'état du document change vers un document non vide, et les actions ultérieures seront effectuées dans le nouvel état.

## Exemple d'utilisation

```java
public static void main(String[] args){
    Document document = new Document();
    document.display();

    // Insertion de texte dans le document
    document.insertText("Smoothie mangue / fruit du dragon");
    document.insertText(
            """
            Complexité : *
            Pour : 2 personnes
            Temps de préparation : 5 minutes
            Ingrédients :
                - 2 fruits du dragon
                - 1 mangue
                - 25cl de lait de coco
                - 1g de wasabi
            Préparation :
                1. Epluchez la mangue et mettre la chair dans un mixeur
                2. Coupez les chapeaux des fruits du dragon et évidez-les, réservez les coques. Mettre la chair dans le mixeur.
                3. Dans le mixeur rajoutez le lait de coco et le wasabi, puis mixez.
                4. Versez dans les fruits du dragons évidés et dégusté.
            """);

    // Affichage du document non vide
    document.display();

    // Sauvegarde du document
    document.save();
}
```

code méthode main

Dans cet exemple, je commence un nouveau document dans le but de sauvegarder les différentes recettes de cuisine que je teste pour ne pas les perdre.  
Je démarre d'une page blanche, et commence à écrire ma recette dans mon document.  
A la fin, je sauvegarde mon document afin de ne pas perdre les modifications apportées. On pourrait très bien utiliser dans la [sauvegarde le design pattern memento](https://www.sfeir.dev/back/design-patterns-comportementaux-memento/) si jamais je veux faire des retours arrière.

En exécutant le code ci-dessus, nous aurons en sortie console le résultat suivant :

```log
Le document est vide.
Le document n'est plus vide, on change d'état
Contenu du document : Smoothie mangue / fruit du dragonComplexité : *
Pour : 2 personnes
Temps de préparation : 5 minutes
Ingrédients :
    - 2 fruits du dragon
    - 1 mangue
    - 25cl de lait de coco
    - 1g de wasabi
Préparation :
    1. Epluchez la mangue et mettre la chair dans un mixeur
    2. Coupez les chapeaux des fruits du dragon et évidez-les, réservez les coques. Mettre la chair dans le mixeur.
    3. Dans le mixeur rajoutez le lait de coco et le wasabi, puis mixez.
    4. Versez dans les fruits du dragons évidés et dégusté.

Sauvegarde du document...
```

## En conclusion

Le design pattern État offre une solution efficace pour gérer les différents états d'un objet dans un système logiciel. En encapsulant chaque état dans une classe distincte, ce pattern favorise la modularité, la flexibilité et la séparation des préoccupations.

⚠️ Cependant, il est important de noter que l'utilisation du pattern État peut introduire une complexité supplémentaire dans le système, notamment dans la gestion des transitions entre les états. Une conception soigneuse et une gestion appropriée des transitions sont essentielles pour éviter les comportements imprévus et maintenir la cohérence du système.