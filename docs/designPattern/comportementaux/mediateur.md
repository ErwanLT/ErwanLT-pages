---
layout: default
title: Médiateur
tags: [java, tutoriel, design pattern, comportementaux, médiateur]
---

# Le design pattern **Médiateur**

### Définition

Le pattern **Médiateur** est un design pattern comportemental qui favorise le couplage lâche en définissant un objet qui encapsule la manière dont un ensemble d'objets interagit. Plutôt que de permettre à ces objets de communiquer directement entre eux, ils communiquent uniquement à travers le médiateur. Cela réduit la dépendance entre les objets et facilite la modification et l'extension du système, car les interactions sont centralisées dans le médiateur.

## Avantages et inconvénients

|   |   |
|---|---|
|- Découplage des composants<br>- Centralisation des interactions<br>- Facilité d'extension|- Complexité accrue du médiateur<br>- Augmentation de la dépendance sur le médiateur<br>- Surutilisation du pattern<br>- Coût d'initialisation|

### Avantages

1. **Découplage des composants :** Le principal avantage du pattern Médiateur est qu'il favorise un couplage lâche entre les objets en les obligeant à communiquer uniquement via le médiateur. Cela réduit la dépendance entre les composants du système, ce qui rend le code plus modulaire et plus facile à maintenir.
2. **Centralisation des interactions :** En centralisant toutes les interactions entre les objets dans le médiateur, le pattern Médiateur rend le code plus organisé et plus facile à comprendre. Les interactions entre les objets sont clairement définies et encapsulées dans le médiateur, ce qui facilite la gestion des flux de données et des comportements du système.
3. **Facilité d'extension :** Grâce à son architecture modulaire et décentralisée, le pattern Médiateur rend le système plus facile à étendre. Il est relativement simple d'ajouter de nouveaux objets ou de modifier le comportement des objets existants en modifiant le médiateur, sans avoir à modifier directement les autres composants du système.

### Inconvénients

1. **Complexité accrue du médiateur :** Si le médiateur devient trop complexe ou s'il est mal conçu, il peut devenir un point de singularité dans le système, ce qui rendrait le code difficile à maintenir. Il est important de concevoir le médiateur de manière à ce qu'il reste simple et facile à comprendre, même lorsque le système se développe.
2. **Augmentation de la dépendance sur le médiateur :** Comme tous les objets communiquent à travers le médiateur, cela peut entraîner une dépendance accrue sur ce composant. Si le médiateur échoue ou devient indisponible, cela peut affecter la capacité du système à fonctionner correctement.
3. **Surutilisation du pattern :** Il est important de ne pas abuser du pattern Médiateur. Utiliser un médiateur pour chaque interaction entre les objets peut rendre le code difficile à suivre et à comprendre. Il est préférable de réserver l'utilisation du pattern Mediator pour les cas où il offre un réel avantage en termes de modularité et de maintenabilité.
4. **Coût d'initialisation :** La mise en place d'un médiateur peut ajouter un coût d'initialisation au système, surtout si celui-ci doit gérer de nombreux objets et interactions. Il est important de considérer ce coût lors de la conception du système et de s'assurer que le bénéfice en termes de modularité et de maintenabilité justifie ce coût supplémentaire.

## Exemple d'implémentation

Pour la suite de cet article, nous allons prendre comme exemple une application de messagerie instantanée. Les plus vieux d'entre vous se souviendront de MSN, les plus jeunes utilisant sans doute Messenger, WhatsApp ou peut-être Discord.

[![](https://www.sfeir.dev/content/images/2024/02/mediator.png)](https://www.sfeir.dev/content/images/2024/02/mediator.png)

diagramme de classe mediator

Nous aurons ici deux _**Users** :_ Sacha et John

```java
public class User {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User(String name){
        this.name  = name;
    }

    public void sendMessage(String message){
        ChatRoom.showMessage(this,message);
    }
}
```

Nos deux utilisateurs, ne voulant pas déranger leurs collègues avec leur discussion, décident de communiquer via le service de messagerie de la société dans un canal de discussion **_Chatroom_**.

```java
public class ChatRoom {

    public static void showMessage(User user, String message){
        System.out.println(new Date() + " [" + user.getName() + "] : " + message);
    }
}
```

Dans notre exemple de code, la classe **_ChatRoom_** agit comme le **médiateur**. Elle centralise toutes les interactions entre les utilisateurs en fournissant une méthode _showMessage._ Cette dernière permet à un utilisateur d'envoyer un message à tous les autres utilisateurs dans le canal de discussion.

Cette approche présente plusieurs avantages :

- Elle favorise un couplage lâche entre les utilisateurs en les obligeant à communiquer uniquement via le canal de discussion. Cela rend le code plus modulaire et plus facile à maintenir, car les interactions entre les utilisateurs sont encapsulées dans un seul endroit.
- En centralisant toutes les interactions dans la **ChatRoom**, le code devient plus organisé et plus facile à comprendre. Les interactions entre les utilisateurs sont clairement définies et encapsulées, ce qui facilite la gestion des flux de données et des comportements du système.

## Exemple d'utilisation

```java
public static void main(String[] args) {
    User sacha = new User("Sacha");
    User john = new User("John");

    sacha.sendMessage("Hi! John!");
    john.sendMessage("Hello! Sacha!");
}
```

Dans cet exemple, nous créons nos deux **User** Sacha et John et les faisons communiquer ensemble via la méthode `sendMessage()`.

L'exécution du code suivant aura comme résultat en console

```java
Thu Feb 08 15:49:36 CET 2024 [Sacha] : Hi! John!
Thu Feb 08 15:49:36 CET 2024 [John] : Hello! Sacha!
```

## En conclusion

Le design pattern Mediator offre une approche puissante pour gérer les interactions entre objets dans un système logiciel. En favorisant un couplage lâche entre les composants du système et en centralisant toutes les interactions dans un seul endroit, ce pattern simplifie la conception, la maintenance et l'extension du code. Cela en fait un outil précieux pour les développeurs logiciels.

⚠️ Le design pattern Mediator peut également présenter certains inconvénients, comme la complexité potentielle du médiateur et une dépendance accrue sur celui-ci.