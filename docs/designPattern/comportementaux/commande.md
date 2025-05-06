---
layout: default
title: Commande
tags: [java, tutoriel, design pattern, comportementaux, commande]
---

# Le design pattern Commande

## Définition

Le design pattern Commande est une approche qui prend une action à réaliser et la convertit en un objet autonome qui encapsule tous les détails de cette action. Cette conversion permet de paramétrer des méthodes avec différentes actions, de planifier leur exécution, de les mettre en file d'attente ou d'annuler des opérations déjà effectuées.

## Exemple d'implémentation

Pour la suite de cet article, nous utiliserons comme exemple votre éditeur de document / texte préféré (Notepad++, BBEdit, Microsoft Word...) et sa barre de menu contextuel.

[![design pattern command](https://www.sfeir.dev/content/images/2024/01/commande.drawio.png)](https://www.sfeir.dev/content/images/2024/01/commande.drawio.png)

implementation design pattern command

Les composants principaux de ce pattern sont :

- **Commande (ActionListenerCommand)** : interface définissant une méthode _execute()_ qui encapsule l'action à effectuer.

```java
public interface ActionListenerCommand {
    void execute();
}
```

- **Commande Concrete (ActionOpen et ActionSave)**: Implémentation de l'interface commande et la méthode _execute()_

```java
public class ActionOpen implements ActionListenerCommand {

    private Document doc;

    public ActionOpen(Document doc) {
        this.doc = doc;
    }

    @Override
    public void execute() {
        doc.open();
    }
}
```

```java
public class ActionSave implements ActionListenerCommand {

    private Document doc;

    public ActionSave(Document doc) {
        this.doc = doc;
    }

    @Override
    public void execute() {
        doc.save();
    }
}
```

- **Un Expéditeur (MenuOption)** : Demande à la commande d'effectuer une requête.

```java
public class MenuOptions {

    private ActionListenerCommand openCommand;
    private ActionListenerCommand saveCommand;

    public MenuOptions(ActionListenerCommand open, ActionListenerCommand save) {
        this.openCommand = open;
        this.saveCommand = save;
    }

    public void clickOpen(){
        openCommand.execute();
    }

    public void clickSave(){
        saveCommand.execute();
    }
}
```

- **Un Destinataire (Document)** : Objet qui sait comment effectuer l'opération associée à une requête.

```java
public class Document {

    public void open(){
        System.out.println("Document Opened");
    }

    public void save(){
        System.out.println("Document Saved");
    }
}
```

## Utilisation

- Un objet Commande est créé et associé à une action spécifique.

```java
ActionListenerCommand clickOpen = new ActionOpen(doc);
ActionListenerCommand clickSave = new ActionSave(doc);
```

- L'objet Commande est passé à l'expéditeur qui sera responsable de l'orchestration des appels à la méthode _execute()_

```java
MenuOptions menu = new MenuOptions(clickOpen, clickSave);

menu.clickOpen();
menu.clickSave();
```

Le résultat du code ci-dessus en console sera le suivant :

```log
Document Opened
Document Saved
```

## En conclusion

Le design pattern commande offre aux développeurs la possibilité de découper les opérations en objets autonomes, facilitant ainsi la gestion des actions utilisateurs dans les applications logicielles.  
En encapsulant chaque action en tant qu'objet autonome, ce modèle favorise la modularité, la réutilisation et la flexibilité du code.