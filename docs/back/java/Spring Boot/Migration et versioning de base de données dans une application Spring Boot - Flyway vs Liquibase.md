---
layout: "default"
title: "Migration et versioning de base de données dans une application Spring Boot - Flyway vs Liquibase"
permalink: "/back/java/spring-boot/migration-et-versioning-de-base-de-donnees-dans-une-application-spring-boot-flyway-vs-liquibase/"
tags: [back, java, spring-boot]
date: "2025-02-13"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/migration-versioning-de-base-de-donnees-dans-une-application-spring-boot/"
banner: "https://www.sfeir.dev/content/images/2025/08/20250828_0919_Pixelated-Migration-Magic_simple_compose_01k3qrkk75f3zre4bn67r4x8q8.png"
published_at: "2025-02-13"
sfeir_slug: "migration-versioning-de-base-de-donnees-dans-une-application-spring-boot"
sfeir_tags: [Back, Spring Boot, Database, flyway, liquibase]
---
Qui n'est jamais arrivé en cours de route sur un projet et a découvert une base de données avec une quinzaine de tables, chacune avec un certain nombre de colonnes. Mais comment cette base de données en est-elle arrivée à ce stade ? Quels ont été les besoins qui l'ont fait évoluer ?  
C'est ce que nous allons voir dans cet article.

## Migration et versioning

Pour bien commencer, posons les bases de ce que nous entendons par migration et versioning :

- **Migration de base de données** :
    - Cela consiste à **modifier progressivement la structure de la base** (tables, index, contraintes, etc.) via des scripts versionnés.
    - Les outils comme [**Liquibase**](https://www.liquibase.com/?ref=sfeir.dev) et [**Flyway**](https://documentation.red-gate.com/flyway?ref=sfeir.dev) permettent d'appliquer ces migrations de manière contrôlée.
- **Versioning de la base de données** :
    - C’est le principe de **suivre et gérer les différentes versions du schéma de la base** au fil du temps.
    - Chaque changement est **historisé**, permettant de revenir en arrière (rollback) ou d’avancer proprement.

## Flyway : un versioning basé sur des scripts SQL

### Présentation de Flyway

Flyway est un outil de **migration de base de données** qui fonctionne en appliquant **des scripts SQL versionnés** dans un ordre déterminé. Il suit une approche simple :

- Les scripts SQL sont placés dans le dossier `src/main/resources/db/migration/`.
- Chaque script doit respecter un format de nommage :
    - `V{{numero de version}}__{{description}}.{{suffixe}}` : `V1__create_users.sql`
- Lors du démarrage de l’application, Flyway détecte les nouvelles migrations et les applique **dans l’ordre croissant**.
- Une table `flyway_schema_history` est créée pour enregistrer les migrations exécutées, évitant ainsi qu’un même script soit rejoué plusieurs fois.

### Installation et configuration dans Spring Boot

Pour ajouter Flyway à une application [**Spring Boot**](https://www.sfeir.dev/back/back-spring-boot/), il suffit d’inclure la dépendance suivante dans `pom.xml` :

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

[Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/) **auto-configure****Flyway** dès qu’il détecte cette dépendance. Ensuite, dans `application.properties` :

```properties
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.validate-on-migrate=true
```

- `spring.flyway.enabled` : permet d'activer flyway pour que ce dernier exécute les scripts de migration au démarrage de l'application.
- `spring.flyway.baseline-on-migrate` : permet d'initialiser la base de données si elle ne contient pas encore de suivi Flyway.
- `spring.flyway.validate-on-migrate` : vérifie si les scripts déjà exécutés dans la base de données n'ont pas été **modifiés** depuis leur exécution.

Enfin il suffit de placer les scripts SQL dans le répertoire `src/main/resources/db/migration/` pour que ces derniers soient exécutés au démarrage de l'application.

[![](https://www.sfeir.dev/content/images/2025/01/image-16.png)](https://www.sfeir.dev/content/images/2025/01/image-16.png)

```log
Schema history table "PUBLIC"."flyway_schema_history" does not exist yet
Successfully validated 3 migrations (execution time 00:00.017s)
Creating Schema History table "PUBLIC"."flyway_schema_history" ...
Current version of schema "PUBLIC": << Empty Schema >>
Migrating schema "PUBLIC" to version "1 - init"
Migrating schema "PUBLIC" to version "2 - table-user"
Migrating schema "PUBLIC" to version "3 - ajout colonne email"
Successfully applied 3 migrations to schema "PUBLIC", now at version v3 (execution time 00:00.020s)
```

Si en cours de développement j'ajoute un nouveau script, ce dernier sera détecté au prochain démarrage de l'application et exécuté :

```log
Successfully validated 4 migrations (execution time 00:00.026s)
Current version of schema "PUBLIC": 3
Migrating schema "PUBLIC" to version "4 - table-books"
Successfully applied 1 migration to schema "PUBLIC", now at version v4 (execution time 00:00.009s)
```

Et si je vais voir en base de données, je retrouve la table `flyway_schema_history` qui garde l'historique des scripts joués :

[![](https://www.sfeir.dev/content/images/2025/01/image-15.png)](https://www.sfeir.dev/content/images/2025/01/image-15.png)

### Gestion du rollback avec Flyway

Flyway **ne supporte pas le rollback automatique**. Si une migration a été appliquée, elle ne peut pas être annulée directement.  
Il faut **écrire un script correctif** et l’exécuter avec une nouvelle version.

## Liquibase : un système de migration basé sur des changelogs

### Présentation de Liquibase

Contrairement à Flyway, Liquibase fonctionne en utilisant **des fichiers de changelog** au format **XML, YAML, JSON ou SQL**. Chaque changement est défini sous forme d’un `changeSet`, qui peut inclure :

- La création de tables
- L’ajout ou la suppression de colonnes
- L’ajout d’index, de contraintes, etc.

Liquibase suit une approche similaire à Flyway :

1. Il détecte les nouveaux `changeSets` non encore appliqués.
2. Il exécute ces changements sur la base de données.
3. Il enregistre l’historique dans une table `DATABASECHANGELOG` pour éviter les doublons.

### Installation et configuration dans Spring Boot

Pour ajouter Liquibase à une application [**Spring Boot**](https://www.sfeir.dev/back/back-spring-boot/), il suffit d’inclure la dépendance suivante dans `pom.xml` :

```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

Ensuite dans `application.properties` :

```properties
spring.liquibase.enabled=true
spring.liquibase.change-log=classpath:db/changelog/changelog-master.xml
```

- `spring.liquibase.enabled` : permet **d’activer ou de désactiver** Liquibase dans une application **Spring Boot**.
- `spring.liquibase.change-log` : permet de **spécifier le fichier principal** qui contient les migrations Liquibase

Exemple de fichier `changelog-master.xml` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">

    <changeSet id="001-create-book-table" author="admin">
        <sqlFile path="db/changelog/changesets/001_create_tables.sql" />
    </changeSet>
    <include file="db/changelog/changesets/002_add_users_table.xml"/>

</databaseChangeLog>
```

Il s'agit ici d'un **mauvais** exemple car j'ai mélangé des **changeSet** sql et xml, mais c'est avant tout pour montrer que c'est possible. Dans un projet, il sera préférable de rester sur le même format pour avoir quelque chose d'uniforme.

Au démarrage de l'application, Liquibase jouera les scripts dans l'ordre dans lequel ils sont décrits dans le fichier master.

```log
Creating database history table with name: PUBLIC.DATABASECHANGELOG
Reading from PUBLIC.DATABASECHANGELOG
Successfully acquired change log lock
Using deploymentId: 8225847034
Reading from PUBLIC.DATABASECHANGELOG
Running Changeset: db/changelog/changelog-master.xml::001-create-book-table::admin
SQL in file db/changelog/changesets/001_create_tables.sql executed
ChangeSet db/changelog/changelog-master.xml::001-create-book-table::admin ran successfully in 22ms
Running Changeset: db/changelog/changesets/002_add_users_table.xml::002-create-users-table::admin
Table users created
ChangeSet db/changelog/changesets/002_add_users_table.xml::002-create-users-table::admin ran successfully in 9ms
UPDATE SUMMARY
Run:                          2
Previously run:               0
Filtered out:                 0
-------------------------------
Total change sets:            2
Update summary generated
Update command completed successfully.
Liquibase: Update has been successful. Rows affected: 2
Successfully released change log lock
Command execution complete
```

Ajoutons maintenant un nouveau script pour ajouter une colonne à la table users dans le fichier master :

```json
{
  "databaseChangeLog": [
    {
      "changeSet": {
        "id": "003-add-mail-column",
        "author": "admin",
        "changes": [
          {
            "addColumn": {
              "tableName": "users",
              "columns": [
                {
                  "name": "mail",
                  "type": "VARCHAR(255)",
                  "constraints": {
                    "nullable": false,
                    "unique": true
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}
```

Et l'ajouter dans le ficher master

```xml
<include file="db/changelog/changesets/003_add_mail_column.json"/>
```

Au prochain démarrage de l'application j'aurais le résultat suivant dans les traces de log :

```log
Running Changeset: db/changelog/changesets/003_add_mail_column.json::003-add-mail-column::admin
Columns mail(JSON) added to users
ChangeSet db/changelog/changesets/003_add_mail_column.json::003-add-mail-column::admin ran successfully in 19ms
UPDATE SUMMARY
Run:                          1
Previously run:               2
Filtered out:                 0
-------------------------------
Total change sets:            3
Update summary generated
Update command completed successfully.
Liquibase: Update has been successful. Rows affected: 1
Successfully released change log lock
Command execution complete
```

Et si je vais voir en base de données, je retrouve une table avec l'historique des changeSet qui ont été joués :

[![](https://www.sfeir.dev/content/images/2025/01/image-17.png)](https://www.sfeir.dev/content/images/2025/01/image-17.png)

### Gestion du rollback avec Liquibase

Contrairement à Flyway, **Liquibase supporte les rollbacks automatiques**. Chaque `changeSet` peut être annulé grâce à un `rollback`.

```json
{
  "databaseChangeLog": [
    {
      "changeSet": {
        "id": "003-add-mail-column",
        "author": "admin",
        "changes": [
          {
            "addColumn": {
              "tableName": "users",
              "columns": [
                {
                  "name": "mail",
                  "type": "VARCHAR(255)",
                  "constraints": {
                    "nullable": false,
                    "unique": true
                  }
                }
              ]
            }
          }
        ],
        "rollback": [
          {
            "dropColumn": {
              "tableName": "users",
              "columnName": "mail"
            }
          }
        ]
      }
    }
  ]
}
```

Pour cela, il faut de nouveau modifier notre fichier `pom.xml` pour lui ajouter le plugin Liquibase

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.liquibase</groupId>
            <artifactId>liquibase-maven-plugin</artifactId>
            <version>4.31.0</version> 
            <configuration>
                <changeLogFile>db/changelog/changelog-master.xml</changeLogFile>
                <url>jdbc:h2:file:~/data/liquibase</url>
                <driver>org.h2.Driver</driver>
                <username>sa</username>
                <password>password</password>
            </configuration>
        </plugin>
    </plugins>
</build>
```

et de jouer la commande suivante :

```bash
liquibase:rollback -Dliquibase.rollbackCount=1
```

Ici, nous indiquons avec rollbackCount combien de rollback nous voulons jouer à partir du changeSet le plus récent.

```log
####################################################
##   _     _             _ _                      ##
##  | |   (_)           (_) |                     ##
##  | |    _  __ _ _   _ _| |__   __ _ ___  ___   ##
##  | |   | |/ _` | | | | | '_ \ / _` / __|/ _ \  ##
##  | |___| | (_| | |_| | | |_) | (_| \__ \  __/  ##
##  \_____/_|\__, |\__,_|_|_.__/ \__,_|___/\___|  ##
##              | |                               ##
##              |_|                               ##
##                                                ## 
##  Get documentation at docs.liquibase.com       ##
##  Get certified courses at learn.liquibase.com  ## 
##                                                ##
####################################################
Starting Liquibase at 10:07:14 using Java 21.0.2 (version 4.29.2 #3683 built at 2024-08-29 16:45+0000)
Set default schema name to PUBLIC
Executing on Database: jdbc:h2:file:~/data/liquibase
Reading from DATABASECHANGELOG
Successfully acquired change log lock
Reading from DATABASECHANGELOG
Rolling Back Changeset: db/changelog/changesets/003_add_mail_column.json::003-add-mail-column::admin
Rollback command completed successfully.
Successfully released change log lock
Command execution complete
```

## Comparaison entre Flyway et Liquibase

|Critère|Flyway|Liquibase|
|---|---|---|
|**Type de migrations**|SQL|XML, YAML, JSON ou SQL|
|**Facilité d’utilisation**|Très simple|Plus flexible mais plus complexe|
|**Gestion des rollbacks**|Script correctif|Native|
|**Apprentissage**|Très rapide|Plus long à maîtriser|

## Conclusion

Dans un projet **Spring Boot**, il est crucial de **versionner et gérer les migrations** de base de données.

- **Flyway** est simple et rapide, mais nécessite une **gestion manuelle des rollbacks**.
- **Liquibase** est plus complet et permet des **rollbacks automatiques**, mais demande plus d’apprentissage.

Le choix entre **Flyway et Liquibase** dépend donc des besoins du projet :  
✔ Pour un projet **simple**, Flyway est suffisant.  
✔ Pour un projet **évolutif et complexe**, Liquibase est préférable.
