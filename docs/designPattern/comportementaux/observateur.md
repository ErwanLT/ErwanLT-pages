---
layout: default
title: Observateur
tags: [java, tutoriel, design pattern, comportementaux, observateur]
---

# Le design pattern Observateur

## Définition

Le design Pattern **Observateur** fait partie de la famille des design patterns comportementaux.  
Il définît une relation **observateurs** / **observé** où l’observé informe de tout changement ses observateurs via l’une de leurs méthodes.

### Avantages et inconvénients

|   |   |
|---|---|
|- Découplage fort<br>- Extensibilité<br>- Modularité|- Mise à jour inefficace<br>- Risque de fuites de mémoire|

### Avantages

1. **Découplage fort**: Le pattern Observateur permet de séparer le sujet et les observateurs, réduisant ainsi le couplage entre les composants.
2. **Extensibilité**: Il est facile d'ajouter de nouveaux observateurs sans modifier le sujet.
3. **Modularité**: Les observateurs peuvent être réutilisés dans différents contextes sans modification.

### Inconvénients

1. **Mise à jour inefficace**: Si le sujet a de nombreux observateurs et que les mises à jour sont fréquentes, cela peut entraîner des performances inefficaces.
2. **Risque de fuites de mémoire**: Si les observateurs ne sont pas correctement gérés, cela peut entraîner des fuites de mémoire.

## Exemple d'implémentation

Pour la suite de cet article, nous allons reprendre l'exemple du chat d'équipe comme vu lors de l'article sur le design pattern Médiateur

[![](https://www.sfeir.dev/content/images/2024/02/observer.drawio.png)](https://www.sfeir.dev/content/images/2024/02/observer.drawio.png)

exemple d'implémentation du pattern observateur

Nous aurons ici deux **TeamMember** : Erwan et Alan, qui dans notre implémentation seront les **observateurs**.

```java
class TeamMember implements Observer {
    private String name;
    private ChatTeam chatTeam;

    public TeamMember(String name, ChatTeam chatTeam) {
        this.name = name;
        this.chatTeam = chatTeam;
    }

    public void joinChat() {
        chatTeam.addObserver(this);
        System.out.println(name + " a rejoint le chat d'équipe.");
        update("Bienvenue dans le chat d'équipe !");
    }

    public void leaveChat() {
        chatTeam.removeObserver(this);
        System.out.println(name + " a quitté le chat d'équipe.");
    }

    public void sendMessage(String message) {
        chatTeam.sendMessage(name + ": " + message);
    }

    @Override
    public void update(String message) {
        if (!message.startsWith(name)) {
            System.out.println(message);
        }
    }
}
```

Nos 2 collaborateurs peuvent choisir de rejoindre ou de quitter le chat d'équipe à tout moment à l'aide des méthodes _joinChat()_et _leaveChat()_.

- Lorsqu'un membre rejoint le chat, il est automatiquement ajouté à la liste des observateurs du chat.
- Lorsqu'un membre quitte le chat, il est retiré de la liste des observateurs.
- Lorsqu'un message est envoyé dans le chat, chaque membre recevra la notification et affichera le message reçu.

Nous avons ensuite la classe **ChatTeam** qui, quand à lui, sera **l'observé**.

```java
public class ChatTeam {
    private List<Observer> observers = new ArrayList<>();

    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    public void sendMessage(String message) {
        System.out.println("Message envoyé: " + message);
        notifyObservers(message);
    }

    private void notifyObservers(String message) {
        observers.forEach(
                o -> o.update(message)
        );
    }
}
```

C'est cette classe qui permet de fournir les méthodes afin d'ajouter et de retirer des **observateurs**, ainsi que de notifier ces derniers en cas de mise à jour.

### Exemple d'utilisation

```java
public static void main(String[] args){
    ChatTeam chatTeam = new ChatTeam();

    TeamMember member1 = new TeamMember("Erwan", chatTeam);
    TeamMember member2 = new TeamMember("Alan", chatTeam);

    member1.joinChat();
    member2.joinChat();

    chatTeam.sendMessage("Bonjour à tous !");

    member1.sendMessage("je pense que je vais partir manger");
    member1.leaveChat();

    member2.leaveChat();
}
```

Dans cet exemple, nous créons nos deux **TeamMember** Erwan et Alan. Dès que l'un d'entre eux entrera dans le chat, une notification sera envoyé à tous les observateurs. Idem quand l'un d'entre eux quittera le canal de discussion.

L'exécution du code suivant aura comme résultat en console :

```log
Erwan a rejoint le chat d'équipe.
Bienvenue dans le chat d'équipe !
Alan a rejoint le chat d'équipe.
Bienvenue dans le chat d'équipe !
Message envoyé: Bonjour à tous !
Bonjour à tous !
Bonjour à tous !
Message envoyé: Erwan: je pense que je vais partir manger
Erwan: je pense que je vais partir manger
Erwan a quitté le chat d'équipe.
Alan a quitté le chat d'équipe.
```

## En conclusion

Le Design Pattern Observateur est un outil puissant pour la gestion des événements et la communication entre objets dans les applications logicielles. En utilisant ce pattern, les développeurs peuvent concevoir des systèmes flexibles, modulaires et extensibles, tout en réduisant le couplage entre les composants.

⚠️ Il est important de prendre en compte les performances et la gestion des ressources lors de l'implémentation de ce pattern dans des systèmes complexes.