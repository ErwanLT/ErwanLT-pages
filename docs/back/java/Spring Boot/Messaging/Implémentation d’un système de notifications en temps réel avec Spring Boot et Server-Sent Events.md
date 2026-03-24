---
layout: "default"
title: "Implémentation d’un système de notifications en temps réel avec Spring Boot et Server-Sent Events"
permalink: "/back/java/spring-boot/messaging/implementation-d-un-systeme-de-notifications-en-temps-reel-avec-spring-boot-et-server-sent-events/"
tags: [back, java, spring-boot, messaging]
date: "2026-03-03"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/implementation-dun-systeme-de-notifications-en-temps-reel-avec-spring-boot-et-server-sent-events/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/08/20250822_0916_8-Bit-Notification-Wonderland_simple_compose_01k38a31s7e8n85ezxbha5em2h.png"
published_at: "2026-03-03"
sfeir_slug: "implementation-dun-systeme-de-notifications-en-temps-reel-avec-spring-boot-et-server-sent-events"
sfeir_tags: [Back, Java, Spring Boot, SSE, Notifications]
---
Les applications modernes, qu’il s’agisse de tableaux de bord en entreprise, de plateformes e-commerce ou de systèmes de suivi en temps réel, nécessitent de fournir aux utilisateurs des informations instantanées. L’attente d’un rafraîchissement manuel de page ou d’un polling classique entraîne souvent une expérience utilisateur médiocre et une consommation réseau inutile.

Deux solutions principales existent pour pousser des données du serveur vers le client : **WebSocket** et **Server-Sent Events (SSE)**.

- WebSocket offre une communication bidirectionnelle.
- SSE, en revanche, se concentre sur une diffusion **unidirectionnelle** (du serveur vers le client), parfaitement adaptée aux cas d’usage comme les alertes, notifications, ou mises à jour d’état.

SSE repose sur le protocole HTTP standard, est plus simple à mettre en œuvre et bénéficie d’une compatibilité native dans les navigateurs modernes.

## Configuration de SSE avec Spring Boot

[[Il était une fois... Spring Boot|Spring Boot]] expose SSE via la classe `SseEmitter`. L’idée est :

1. Le client s’abonne via une URL (`/notifications/subscribe`).
2. Le serveur garde une liste d’abonnés actifs.
3. Lorsqu’un événement survient (par ex. mise à jour de commande), il est envoyé à tous les abonnés.

### Contrôleur d’abonnement SSE

```java
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/subscribe")
    public SseEmitter subscribe() {
        // 0L = pas de timeout (connexion ouverte tant que le client reste actif)
        SseEmitter emitter = new SseEmitter(0L);
        notificationService.addEmitter(emitter);
        return emitter;
    }
}
```

Le client ouvre une connexion SSE via `/notifications/subscribe`.

### Service de notifications

```java
@Service
public class NotificationService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;

    public NotificationService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void addEmitter(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    }

    public void sendNotification(Object data) {
        for (SseEmitter emitter : emitters) {
            try {
                String jsonData = objectMapper.writeValueAsString(data);
                emitter.send(SseEmitter.event()
                        .name("message")
                        .data(jsonData));
            } catch (Exception ex) {
                emitters.remove(emitter);
            }
        }
    }
}
```

- Les `SseEmitter` sont stockés dans une `CopyOnWriteArrayList` (thread-safe).
- Chaque notification est sérialisée en JSON pour faciliter son traitement côté client.

## Exemple pratique : suivi de commandes

Imaginons que vous vous trouviez dans un célèbre fast food, devant vous se trouve une borne de ce type :

[![](https://www.sfeir.dev/content/images/2025/08/image-10.png)](https://www.sfeir.dev/content/images/2025/08/image-10.png)

Vous passez votre commande, et cette dernière part en cuisine.

### Contrôleur REST des commandes

```java
@RestController
@RequestMapping("/commands")
public class CommandController {

    private final CommandService commandService;

    public CommandController(CommandService commandService) {
        this.commandService = commandService;
    }

    @PostMapping
    public ResponseEntity<Command> createCommand(@RequestBody Command command) {
        Command createdCommand = commandService.createCommand(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommand);
    }

    @GetMapping
    public Collection<Command> getAllCommands() {
        return commandService.getAllCommands();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Command> updateStatusCommand(@PathVariable Long id, @RequestParam CommandStatus status) {
        return commandService.updateStatusCommand(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

Ce contrôleur expose :

- `POST /commands` : création d’une commande.
- `GET /commands` : récupération des commandes.
- `PUT /commands/{id}/status` : mise à jour du statut.

### Service métier des commandes

```java
@Service
public class CommandService {

    private static final Logger log = LoggerFactory.getLogger(CommandService.class);

    private final CommandRepository commandRepository;
    private final NotificationService notificationService;

    public CommandService(CommandRepository commandRepository, NotificationService notificationService) {
        this.commandRepository = commandRepository;
        this.notificationService = notificationService;
    }

    public Command createCommand(Command command) {
        log.info("Creating new command for customer: {}", command.getCustomerName());
        command.setStatus(CommandStatus.PENDING);
        Command savedCommand = commandRepository.save(command);
        notificationService.sendNotification(savedCommand);
        log.info("Command {} created with status PENDING", savedCommand.getId());
        return savedCommand;
    }

    public Collection<Command> getAllCommands() {
        log.info("Fetching all commands");
        return commandRepository.findAll();
    }

    public Optional<Command> updateStatusCommand(Long id, CommandStatus status) {
        log.info("Updating command {} to status {}", id, status);
        Optional<Command> commandOpt = commandRepository.findById(id);

        if (commandOpt.isEmpty()) {
            log.warn("Command with id {} not found", id);
            return Optional.empty();
        }

        Command command = commandOpt.get();
        command.setStatus(status);
        Command updatedCommand = commandRepository.save(command);
        notificationService.sendNotification(updatedCommand);
        log.info("Successfully updated command {} to status {}", id, status);

        return Optional.of(updatedCommand);
    }
}
```

- Lors de la **création** ou **mise à jour** d’une commande, le service appelle `notificationService.sendNotification`.
- Tous les clients abonnés reçoivent immédiatement l’objet commande (au format JSON).

### Simulation côté client

Pour suivre les commande, nous pouvons imaginer que derrière le comptoir du restaurant se trouve un écran qui se met à jour quand une commande arrive.

Pour simuler cet écran j'ai créer une simple page HTML :

[![](https://www.sfeir.dev/content/images/2025/08/image-11.png)](https://www.sfeir.dev/content/images/2025/08/image-11.png)

La colonne de gauche se met à jour quand une commande est faite via l'endpoint `POST /commands` .

[![](https://www.sfeir.dev/content/images/2025/08/image-12.png)](https://www.sfeir.dev/content/images/2025/08/image-12.png)

## Bonnes pratiques

1. **Limiter le nombre de connexions simultanées** : éviter qu’un trop grand nombre de clients ne surcharge le serveur.
2. [**Sécuriser les endpoints**](https://www.sfeir.dev/tag/spring-security/) :  
    Exemple avec un filtre simple ([[Sécurisez vos API avec Spring Security - JWT|JWT]], token ou [[Sécurisez vos API avec Spring Security - Basic Auth|Basic Auth]] selon le contexte)
3. **Superviser avec Actuator** : Spring Boot Actuator fournit des métriques (nombre de threads, mémoire, etc.) utiles pour surveiller les connexions SSE.

## Conclusion

L’implémentation de **Server-Sent Events (SSE)** avec Spring Boot offre une solution élégante et efficace pour mettre en place des **notifications en temps réel**. Grâce à une API simple (`SseEmitter`), un mécanisme de sérialisation universel (JSON) et la prise en charge native des navigateurs via `EventSource`, SSE permet d’apporter aux utilisateurs une expérience fluide, sans recourir à des bibliothèques ou protocoles complexes.

Cette approche convient parfaitement aux cas d’usage **descendants** (du serveur vers le client) comme :

- le suivi du statut d’une commande,
- l’affichage en direct de métriques ou tableaux de bord,
- la diffusion d’alertes ou de messages système.

Bien entendu, SSE n’est qu’une des options disponibles pour le temps réel. Lorsque les besoins évolueront vers des interactions **bidirectionnelles** ou une charge massive, d’autres solutions comme **WebSocket**, ou encore des architectures orientées événements avec [[Intégration de Kafka dans une application Spring Boot|**Kafka**]] ou **RabbitMQ**, pourront être envisagées.
