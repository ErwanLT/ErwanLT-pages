---
layout: "default"
title: "Planifier des taches avec Spring Boot et Quartz Scheduler"
permalink: "/back/java/spring-boot/planifier-des-taches-avec-spring-boot-et-quartz-scheduler/"
tags: [back, java, spring-boot]
date: "2026-01-21"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/planifier-des-taches-avec-spring-boot-et-quartz-scheduler/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/08/20250821_1344_Pixelated-Taskmaster-Sprint_simple_compose_01k3670q83fyfbdg7ke55nvvy8.png"
published_at: "2026-01-21"
sfeir_slug: "planifier-des-taches-avec-spring-boot-et-quartz-scheduler"
sfeir_tags: [Back, Java, Spring Boot, Quartz Scheduler]
---
Dans les applications modernes, la gestion de tâches planifiées est une nécessité : génération de rapports quotidiens, suppression de données obsolètes, envoi de notifications régulières, etc.  
[Spring Boot fournit une annotation](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) simple `@Scheduled`, mais lorsque les besoins deviennent plus complexes (persistance des tâches, clustering, exécutions dynamiques), **Quartz Scheduler** s’impose comme une solution robuste et éprouvée.

Dans cet article, nous allons explorer comment intégrer Quartz à [un projet Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/), configurer un scheduler persistant, et mettre en place un exemple concret de suppression d’utilisateurs inactifs.

## Installation

Pour ajouter **Quart Scheduler** à votre projet, rien de plus simple, il faut ajouter la dépendance suivante dans votre `pom.xml` :

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```

## Configuration de Quartz

Spring Boot configure Quartz automatiquement via `QuartzAutoConfiguration`.  
Cependant, pour un contrôle plus fin, il est utile de préciser le type de stockage dans `application.properties`

```properties
spring.quartz.job-store-type=jdbc
spring.quartz.jdbc.initialize-schema=always
```

- `job-store-type=jdbc` → Quartz stocke les jobs/triggers en base.
- `initialize-schema=always` → Spring Boot crée automatiquement les tables nécessaires (`QRTZ_*`).

## Exemple pratique : suppression des utilisateurs inactifs

### Le job Quartz

```java
@Component
public class InactiveUserCleanupJob implements Job {

    private final UserService userService;

    public InactiveUserCleanupJob(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void execute(JobExecutionContext context) {
        userService.deleteInactiveUsers();
    }
}
```

- `InactiveUserCleanupJob` implémente `Job`, ce qui en fait une tâche Quartz.
- Le service `UserService` est injecté pour appliquer la logique métier.
- L’appel `execute()` est le point d’entrée du job lors de son exécution planifiée.

### La configuration du job et du trigger

```java
@Configuration
public class JobSchedulerConfig {

    @Bean
    public JobDetail inactiveUserJobDetail() {
        return JobBuilder.newJob(InactiveUserCleanupJob.class)
                .withIdentity("inactiveUserJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger inactiveUserJobTrigger(JobDetail jobDetail) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity("inactiveUserTrigger")
                .withSchedule(CronScheduleBuilder.dailyAtHourAndMinute(13, 0))
                .build();
    }
}
```

- `JobDetail` décrit le job à Quartz (classe cible, identifiant, persistance).
- `Trigger` définit **quand** le job doit être exécuté.
- Dans cet exemple, le job s’exécutera **tous les jours à 13h00**.

### La configuration de l’usine de jobs Quartz

Quartz, par défaut, ne connaît pas Spring et ne sait pas injecter les beans.  
Nous configurons donc une `JobFactory` qui délègue la création des jobs à Spring.

```java
@Configuration
public class QuartzJobFactoryConfig {

    @Bean
    public JobFactory jobFactory(ApplicationContext applicationContext) {
        AutowiringSpringBeanJobFactory jobFactory = new AutowiringSpringBeanJobFactory();
        jobFactory.setApplicationContext(applicationContext);
        return jobFactory;
    }
}
```

Et l’implémentation personnalisée :

```java
public final class AutowiringSpringBeanJobFactory extends SpringBeanJobFactory implements ApplicationContextAware {

    private transient AutowireCapableBeanFactory beanFactory;

    @Override
    public void setApplicationContext(final ApplicationContext context) {
        beanFactory = context.getAutowireCapableBeanFactory();
    }

    @Override
    protected Object createJobInstance(final TriggerFiredBundle bundle) throws Exception {
        final Object job = super.createJobInstance(bundle);
        beanFactory.autowireBean(job);
        return job;
    }
}
```

- `SpringBeanJobFactory` est étendu pour permettre l’injection Spring (`@Autowired`, services, repositories).
- Chaque job Quartz créé passe par le `beanFactory` de Spring qui injecte ses dépendances.

### La logique métier

```java
@Service
public class UserService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void deleteInactiveUsers() {
        int deleted = userRepository.deleteByStatus("inactive");
        LOG.info("Suppression de {} utilisateurs inactifs.", deleted);
    }
}
```

- `UserService` contient la logique métier pour supprimer les utilisateurs inactifs.
- `@Transactional` garantit que la suppression est exécutée dans une transaction sécurisée.

## Gestion dynamique des tâches

Spring Boot facilite grandement le suivi et la gestion de Quartz grâce aux **Actuators**, un endpoint dédié `quartz` est disponible, permettant d’inspecter et d’interagir avec les jobs Quartz directement via HTTP.

### Configuration des Actuators

Pour activer l’endpoint `quartz`, il faut l’ajouter explicitement dans les propriétés de configuration :

```properties
management.endpoints.web.exposure.include=quartz
management.endpoint.quartz.enabled=true
```

### Exemples de requêtes

Reprenons notre job de suppression des users inactifs `inactiveUserJob`

#### Lister les jobs

```bash
curl http://localhost:8080/actuator/quartz/jobs
```

Réponse :

```json
{
  "groups": {
    "DEFAULT": {
      "jobs": [
        "inactiveUserJob"
      ]
    }
  }
}
```

#### Détails d’un job

Pour obtenir les détails du job `InactiveUserJob` appartenant au groupe `DEFAULT` :

```bash
curl http://localhost:8080/actuator/quartz/jobs/DEFAULT/inactiveUserJob
```

Réponse :

```json
{
  "data": {

  },
  "triggers": [
    {
      "group": "DEFAULT",
      "name": "inactiveUserTrigger",
      "nextFireTime": "2025-08-19T11:00:00.000+00:00",
      "priority": 5
    }
  ],
  "group": "DEFAULT",
  "name": "inactiveUserJob",
  "description": "Suppression des users inactifs",
  "className": "fr.eletutour.quartz.tutorial.job.InactiveUserCleanupJob",
  "durable": true,
  "requestRecovery": false
}
```

#### Déclencher manuellement un job

il est également possible de déclencher manuellement un job Quartz via Actuator :

```http
POSt http://localhost:8080/actuator/quartz/jobs/DEFAULT/inactiveUserJob

{
    "state": "running"
}
```

ce qui donnera la réponse suivante

```json
{
    "group": "DEFAULT",
    "name": "inactiveUserJob",
    "className": "fr.eletutour.quartz.tutorial.job.InactiveUserCleanupJob",
    "triggerTime": "2025-08-18T17:47:34.057570Z"
}
```

## Quartz Scheduler vs Spring Batch

Dans un précédent article, nous avions vu comment planifier des tâches en utilisant Spring Batch

[Planifier des tâches avec Spring Batch](/back/java/spring-boot/planifier-des-taches-avec-spring-batch/)

Bien que Quartz et Spring Batch soient deux briques de l’écosystème Spring, leurs objectifs diffèrent.

|Caractéristique|Quartz Scheduler|Spring Batch|
|---|---|---|
|**Objectif principal**|Planifier et exécuter des tâches récurrentes ou ponctuelles.|Traiter de grands volumes de données en lots (batch processing).|
|**Gestion du temps**|Exécution basée sur le temps (cron, intervalle, calendrier).|Exécution déclenchée à la demande, souvent par un planificateur externe (Quartz, cron Linux, etc.).|
|**Exemple typique**|Envoi quotidien d’emails, purge de données obsolètes, rappels planifiés.|Migration de données, génération de rapports volumineux, calculs massifs.|
|**Persistance**|Stocke l’état des jobs et triggers dans une base de données.|Stocke l’état des exécutions de batchs (métadonnées, état des steps, reprise après erreur).|
|**Scalabilité**|Support du clustering natif (plusieurs nœuds peuvent exécuter des tâches).|Support du partitionnement et du parallélisme pour traiter de gros volumes.|
|**Simplicité d’usage**|Très adapté pour la planification flexible et dynamique.|Plus complexe, mais idéal pour orchestrer des traitements longs et critiques.|

🔎 On peut retenir que :

- **Quartz** est centré sur _quand_ exécuter une tâche.
- **Spring Batch** est centré sur _comment_ exécuter un traitement de données en plusieurs étapes.

Dans un projet réel, il n’est pas rare de **combiner les deux** : Quartz planifie, et Spring Batch exécute le traitement.

## Conclusion

**Quartz Scheduler**, couplé à Spring Boot, offre une solution robuste pour la gestion avancée des tâches planifiées.  
Il convient particulièrement lorsque :

- les tâches doivent survivre à un redémarrage,
- l’application fonctionne en cluster,
- ou lorsque les utilisateurs doivent définir leurs propres horaires.

Pour des besoins plus simples, `@Scheduled` ou `TaskExecutor` peuvent suffire.  
Pour du traitement de masse, **Spring Batch** est le choix adapté, éventuellement orchestré par Quartz.

---

Tout le code relatif à cet article est trouvable ici, si vous souhaitez approfondir le sujet et faire des tests
