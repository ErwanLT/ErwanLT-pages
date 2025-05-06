---
layout: default
title: Memento
tags: [java, tutoriel, design pattern, comportementaux, memento]
---

# Le design pattern Mémento

## Définition

Le pattern Memento, un modèle de conception comportementale, offre la possibilité de sauvegarder et de rétablir l'état interne d'un objet sans compromettre son encapsulation. En Java, ce pattern est fréquemment employé pour mettre en place des fonctionnalités de sauvegarde et de restauration d'état dans les applications.

## Avantages et inconvénients

|   |   |
|---|---|
|- Restauration d'état précis<br>- Encapsulation préservée<br>- Facilité d'extension<br>- Flexibilité|- Consommation de mémoire<br>- Complexité accrue<br>- Performance<br>- Usage approprié|

### Avantages

1. **Restauration d'état précis** : Le pattern Memento permet de restaurer un objet à un état précis précédemment enregistré, ce qui est utile pour annuler des actions ou revenir à un état antérieur.
2. **Encapsulation préservée** : L'objet Originator n'a pas besoin de révéler ses détails d'implémentation pour sauvegarder ou restaurer son état, préservant ainsi son encapsulation.
3. **Facilité d'extension** : Comme le Memento encapsule l'état, il est relativement simple d'ajouter de nouveaux attributs à l'état de l'objet Originator sans modifier son interface.
4. **Flexibilité** : Le pattern Memento permet de conserver plusieurs états passés dans l'historique, offrant ainsi une flexibilité pour restaurer n'importe quel état antérieur.

### Inconvénients

1. **Consommation de mémoire** : Conserver chaque état précédent dans l'historique peut consommer de la mémoire, surtout si les objets Memento sont volumineux.
2. **Complexité accrue** : Si l'objet Originator possède un grand nombre d'attributs ou un état complexe, la gestion des Mementos et de l'historique peut devenir difficile.
3. **Performance** : La sauvegarde et la restauration d'état peuvent avoir un coût en termes de performance, surtout si l'état est volumineux ou si l'historique est long.
4. **Usage approprié** : Le pattern Memento est plus adapté aux scénarios où la gestion de l'historique est nécessaire, ce qui peut ne pas être le cas pour tous les types d'objets.

## Exemple d'implémentation

Comme lors de [l'article sur le design pattern Commande](https://www.sfeir.dev/back/design-patterns-comportementaux-commande/), nous allons utiliser l'exemple d'un éditeur de texte et des actions de sauvegarde (Ctrl+S/Cmd+S) et de retour arrière (Ctrl+Z/Cmd+Z).

[![](https://www.sfeir.dev/content/images/2024/02/memento.png)](https://www.sfeir.dev/content/images/2024/02/memento.png)

implémentation du design pattern memento

Nous allons diviser notre implémentation en trois classes principales : `TextEditor`, `TextWindow`, et `TextWindowState`.

1. **TextWindowState** : Cette classe représente l'état sauvegardé d'une fenêtre de texte à un moment donné. Elle stocke simplement le texte actuel de la fenêtre.

```java
public class TextWindowState {
    private String text;

    public TextWindowState(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
```

2. **TextWindow** : La classe `TextWindow` représente la fenêtre de texte elle-même. Elle contient un `StringBuilder` pour stocker le texte. Elle peut sauvegarder son état actuel dans un objet `TextWindowState` et restaurer son état à partir d'un objet `TextWindowState` donné.

```java
public class TextWindow {
    private StringBuilder currentText;

    public TextWindow() {
        this.currentText = new StringBuilder();
    }

    public String getCurrentText() {
        return currentText.toString();
    }

    public void addText(String text) {
        currentText.append(text);
    }

    public TextWindowState save() {
        return new TextWindowState(currentText.toString());
    }

    public void restore(TextWindowState save) {
        currentText = new StringBuilder(save.getText());
    }
}
```

3. **TextEditor** : La classe `TextEditor` représente l'éditeur de texte qui interagit avec la fenêtre de texte. Il peut écrire du texte dans la fenêtre, sauvegarder l'état actuel de la fenêtre et annuler la dernière action effectuée sur la fenêtre.

```java
public class TextEditor {
    private TextWindow textWindow;
    private TextWindowState savedTextWindow;

    public TextEditor(TextWindow textWindow) {
        this.textWindow = textWindow;
    }

    public void write(String text) {
        textWindow.addText(text);
    }

    public String print() {
        return textWindow.getCurrentText();
    }

    public void hitSave() {
        savedTextWindow = textWindow.save();
    }

    public void hitUndo() {
        textWindow.restore(savedTextWindow);
    }
}
```

### Exemple d'utilisation

```java
public static void main(String[] args) {
    TextEditor textEditor = new TextEditor(new TextWindow());
    textEditor.write("The Memento Design Pattern\n");
    textEditor.write("How to implement it in Java?\n");
    textEditor.hitSave();
    System.out.println(textEditor.print());

    textEditor.write("Buy milk and eggs before coming home\n");
    System.out.println(textEditor.print());
    textEditor.hitUndo();
    System.out.println(textEditor.print());
}
```

Dans cet exemple, nous créons un éditeur de texte, nous écrivons quelques lignes, nous sauvegardons l'état, nous ajoutons plus de texte, puis nous annulons la dernière action pour revenir à l'état précédent.

Le code de la méthode main fera apparaitre en console le texte suivant :

```log
The Memento Design Pattern
How to implement it in Java?

The Memento Design Pattern
How to implement it in Java?
Buy milk and eggs before coming home

The Memento Design Pattern
How to implement it in Java?
```

### Allons plus loin

Dans les exemples précédents, nous n'annulions que l'état précédent, mais si nous voulons annuler plusieurs états ?  
Pour ce faire nous allons modifier les classes _TextEditor_ et _TextWindow_ :

```java
public class TextEditor {

    private TextWindow textWindow;

    public TextEditor(TextWindow textWindow) {
        this.textWindow = textWindow;
    }

    public void write(String text) {
        textWindow.addText(text);
    }

    public String print() {
        return textWindow.getCurrentText();
    }

    public void hitSave() {
        textWindow.saveAndPush();
    }

    public void hitUndo() {
        textWindow.undo();
    }
}
```

```java
public class TextWindow {

    private StringBuilder currentText;

    private Stack<TextWindowState> history;

    public TextWindow() {
        this.currentText = new StringBuilder();
        this.history = new Stack<>();
    }

    public String getCurrentText() {
        return currentText.toString();
    }

    public void addText(String text) {
        currentText.append(text);
    }

    public TextWindowState save() {
        return new TextWindowState(currentText.toString());
    }

    public void restore(TextWindowState save) {
        currentText = new StringBuilder(save.getText());
    }

    public void undo() {
        if (!history.isEmpty()) {
            TextWindowState previousState = history.pop();
            restore(previousState);
        }
    }

    public void saveAndPush() {
        history.push(save());
    }
}
```

Dans cette version, la classe _TextWindow_ a une stack qui stocke les états précédents sous forme d'objets **TextWindowState**. Lorsqu'une action de sauvegarde est effectuée, l'état actuel est sauvegardé dans la pile. Lorsqu'une action d'annulation est effectuée, le dernier état sauvegardé est récupéré de la pile et restauré.

exemple :

```java
public static void main(String[] args) {
    TextEditor textEditor = new TextEditor(new TextWindow());
    textEditor.write("The Memento Design Pattern\n");
    textEditor.write("How to implement it in Java?\n");
    textEditor.hitSave();
    System.out.println(textEditor.print());

    textEditor.write("Buy milk and eggs before coming home\n");
    textEditor.hitSave();
    textEditor.write("And some sugar\n");
    System.out.println(textEditor.print());
    textEditor.hitUndo();
    System.out.println(textEditor.print());
    textEditor.hitUndo();
    System.out.println(textEditor.print());
}
```

En exécutant le code ci-dessus, nous aurons en sortie console le résultat suivant :

```log
The Memento Design Pattern
How to implement it in Java?

The Memento Design Pattern
How to implement it in Java?
Buy milk and eggs before coming home
And some sugar

The Memento Design Pattern
How to implement it in Java?
Buy milk and eggs before coming home

The Memento Design Pattern
How to implement it in Java?
```

## En conclusion

Le design pattern Memento est un outil précieux pour gérer l'état des objets dans une application Java. En utilisant le pattern Memento, nous avons pu implémenter avec succès un éditeur de texte avec des fonctionnalités de sauvegarde et d'annulation d'actions.