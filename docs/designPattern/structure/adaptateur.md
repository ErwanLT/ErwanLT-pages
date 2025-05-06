---
layout: default
title: Adaptateur
tags: [java, tutoriel, design pattern, structure, adaptateur]
---

# Le design pattern Adaptateur

## Définition

Le design pattern Adaptateur est un modèle structurel qui permet à des interfaces incompatibles de collaborer entre elles. Il agit comme un intermédiaire qui convertit l'interface d'une classe en une autre interface attendue par le client.

Ce design pattern définit un adaptateur qui enveloppe l'objet à adapter, fournissant ainsi une interface conforme aux attentes du client. De cette manière, le client peut utiliser l'adaptateur comme s'il s'agissait de l'interface originale, sans connaître les détails de l'implémentation sous-jacente.

Chaque adaptateur implémente l'interface attendue par le client et utilise l'objet à adapter pour répondre aux appels de méthode. Cela permet d'intégrer des composants existants dans de nouvelles architectures sans avoir à les modifier, favorisant ainsi la réutilisation du code et la compatibilité entre différentes parties d'un système logiciel.

## ⚖️ Avantages et inconvénients

|   |   |
|---|---|
|- Réutilisation de code existant<br>- Inter-opérabilité entre interfaces incompatibles<br>- Séparation des préoccupations<br>- Facilite l'évolution|- Complexité<br>- Surcharge de l'interface<br>- Indirection supplémentaire<br>- Conception|

### ➕Avantages

1. **Réutilisation de code existant** : L'adaptateur permet d'intégrer des classes ou des composants existants dans de nouveaux systèmes sans avoir à les modifier, ce qui favorise la réutilisabilité du code.
2. **Interopérabilité entre interfaces incompatibles** : Il facilite la collaboration entre des classes ou des systèmes qui ont des interfaces incompatibles, en fournissant une interface commune pour la communication.
3. **Séparation des préoccupations** : L'adaptateur isole le client des détails d'implémentation de la classe adaptée, ce qui permet de maintenir une meilleure séparation des préoccupations dans le code.
4. **Facilite l'évolution du système** : En utilisant des adaptateurs, il devient plus facile d'ajouter de nouvelles classes ou de modifier les classes existantes sans impacter le reste du système.

### ➖Inconvénients

1. **Complexité accrue** : L'ajout d'adaptateurs peut introduire de la complexité supplémentaire dans le système, notamment lorsqu'il y a plusieurs adaptateurs pour différentes classes ou interfaces.
2. **Surcharge de l'interface** : Si de nombreux adaptateurs sont utilisés, cela peut entraîner une surcharge d'interfaces et une difficulté à maintenir une cohérence dans tout le système.
3. **Indirection supplémentaire** : L'utilisation d'adaptateurs peut introduire une indirection supplémentaire lors de l'appel de méthodes, ce qui peut affecter les performances dans certains cas.
4. **Potentiel de mauvaise conception** : Si mal utilisé, le pattern Adaptateur peut conduire à une mauvaise conception logicielle, notamment si l'adaptation est faite de manière excessive ou peu claire.

## Exemple d'implémentation

Dans la suite de cet article, nous utiliserons un système de messagerie comme exemple où nous aurons deux services de communication : l'envoi d'e-mails et l'envoi de SMS.

[![](https://www.sfeir.dev/content/images/2024/05/adapter.drawio.png)](https://www.sfeir.dev/content/images/2024/05/adapter.drawio.png)

Diagramme de classe

Chacun de ces services possède sa propre interface et sa propre implémentation :

- **EmailService** : Permet d'envoyer des e-mails.

```java
public interface EmailService {
    void sendEmail(String emailAddress, String subject, String body);
}
```

interface EmailService

```java
public class EmailServiceImpl implements EmailService {
    @Override
    public void sendEmail(String emailAddress, String subject, String body) {
        System.out.println("Sending Email to " + emailAddress + " (Subject: " + subject + "): " + body);
    }
}
```

implémentation EmailService

- **SMSService** : Permet d'envoyer des SMS.

```java
public interface SMSService {
    void sendSMS(String phoneNumber, String message);
}
```

interface SMSService

```java
public class SMSServiceImpl implements SMSService {
    @Override
    public void sendSMS(String phoneNumber, String message) {
        System.out.println("Sending SMS to " + phoneNumber + ": " + message);
    }
}
```

implémentation SMSService

Cependant, nous voulons introduire une abstraction commune, **MessagingService**, pour envoyer des messages indépendamment du canal. C'est là qu'intervient le design pattern Adaptateur avec son avantage de la séparation des préoccupations vu plus haut.

```java
public interface MessagingService {
    void sendMessage(String recipient, String message);
}
```

interface MessagingService

Les implémentations de **MessagingService**, serviront quand à elle **d'adaptateur**.  
Ces **adaptateurs** agiront comme des ponts entre **MessagingService** et les services spécifiques, en permettant à l'application d'utiliser une interface uniforme pour envoyer des messages, quel que soit le canal.

```java
public class EmailServiceAdapter implements MessagingService {
    private final EmailService emailService;

    public EmailServiceAdapter(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void sendMessage(String recipient, String message) {
        String subject = "";
        emailService.sendEmail(recipient, subject, message);
    }
}
```

implémentation MessagingService pour email

```java
public class SMSServiceAdapter implements MessagingService {
    private final SMSService smsService;

    public SMSServiceAdapter(SMSService smsService) {
        this.smsService = smsService;
    }

    @Override
    public void sendMessage(String recipient, String message) {
        smsService.sendSMS(recipient, message);
    }
}
```

implémentation MessagingService pour SMS

## Exemple d'utilisation

```java
public static void main(String[] args) {
    SMSService smsService = new SMSServiceImpl();
    EmailService emailService = new EmailServiceImpl();

    MessagingService smsAdapter = new SMSServiceAdapter(smsService);
    MessagingService emailAdapter = new EmailServiceAdapter(emailService);

    smsAdapter.sendMessage("+1234567890", "Hello from SMS Adapter");
    emailAdapter.sendMessage("user@example.com", "Hello from Email Adapter");
}
```

Dans la méthode `main`, nous initialisons deux services de messagerie : un service SMS et un service e-mail. Ensuite, nous créons des adaptateurs pour chaque service, leur permettant de fonctionner avec l'interface commune `MessagingService`.

En utilisant ces adaptateurs, nous envoyons un message SMS et un e-mail, en appelant simplement la méthode `sendMessage()` de l'interface `MessagingService`. Les adaptateurs se chargent de traduire ces appels en appels appropriés aux méthodes spécifiques de chaque service.

L'exécution du code ci-dessus aura le résultat suivant en console :

```log
Sending SMS to +1234567890: Hello from SMS Adapter
Sending Email to user@example.com (Subject: ): Hello from Email Adapter
```

## En conclusion

Le design pattern Adaptateur permet de simplifier l'intégration de composants hétérogènes dans un système logiciel. En fournissant une interface commune et en traduisant les appels entre différentes interfaces, il permet de rendre le système plus flexible, réutilisable et facile à maintenir.