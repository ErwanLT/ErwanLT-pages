---
layout: "default"
title: "Validation Spring Boot - du standard au sur-mesure"
permalink: "/back/java/spring-boot/validation-spring-boot-du-standard-au-sur-mesure/"
tags: [back, java, spring-boot]
date: "2026-03-17"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/validation-spring-boot-du-standard-au-sur-mesure/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2026/03/20260317_0931_Image-Generation_simple_compose_01kkxepysjefms44wp8z41m0b1.png"
published_at: "2026-03-17"
sfeir_slug: "validation-spring-boot-du-standard-au-sur-mesure"
sfeir_tags: [Back, Java, Spring Boot, Validation, Jakarta]
---
Dans [l’univers Java](/back/java/il-etait-une-fois-java/) — et plus particulièrement avec [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/) — la ****validation déclarative**** par annotations est une pratique ancrée dans les traditions des projets robustes et maintenables.  
Elle permet d’exprimer, proche du modèle de données, des règles simples et lisibles : « ce champ ne doit pas être vide », « cet e-mail doit être valide », « ce nombre doit être ≥ 18 », etc.

Dans cet article, nous explorons en profondeur les annotations de validation avec [Spring Boot](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/) (Jakarta Bean Validation / Hibernate Validator).  
Vous découvrirez les annotations les plus courantes, leurs forces et limites, un exemple concret pas à pas, ainsi que la création d’annotations personnalisées, comme `@Password`.

## Présentation des annotations

### Contexte technique

- Spring Boot embarque généralement ****Hibernate Validator**** comme implémentation de Jakarta Bean Validation (`jakarta.validation.*`).
- Le démarrage habituel se fait via la dépendance `spring-boot-starter-validation`.
- Les annotations de validation s’appliquent sur : champs d’un DTO/entité, paramètres de méthode, éléments de conteneur (depuis Java 8 avec les __container element constraints__), etc.

### Catégories d’annotations courantes

- ****Nullité / vide / taille****
- - `@NotNull`, `@NotBlank`, `@NotEmpty`, `@Size`
- ****Formats standards****
- - `@Email`, `@Pattern` ([regex](https://www.sfeir.dev/back/demystifier-les-regex/)), `@URL`, `@CreditCardNumber`
- ****Bornes numériques et dates****
- - `@Min`, `@Max`, `@Positive`, `@Past`, `@PastOrPresent`, `@Future`
- ****Validation de conteneurs / éléments****
- - `List<@NotBlank String>`, `@Valid` sur objets imbriqués, `@Size` sur collection
- ****Validation paramétrique / méthode****
- - `@Validated` (spring), contraintes sur paramètres de méthode, `@Constraint` pour créer ses propres contraintes
- ****Composés / personnalisés****
- - `@Constraint(validatedBy = ...)` + implémentation `ConstraintValidator`

Pour en savoir plus, n'hésitez pas à lire notre article sur les annotations :

[Comprendre les annotations dans Spring Boot - guide et exemples](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/)

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- ****Déclaratif et proche du modèle**** : on lit la règle directement sur le champ.
- ****Réutilisable**** : création d’annotations personnalisées partageables.
- ****Internationalisation**** : messages externalisables (messages.properties).
- ****Intégration Spring**** : `@Valid` / `@Validated` s’intègrent naturellement aux contrôleurs, binding, et exceptions gérées par Spring.
- ****Séparation**** : règles de validation séparées de la logique métier.

### ➖ Inconvénients

- ****Complexité croissante**** : pour des règles métier complexes (ex. cohérence entre plusieurs champs) il faudra souvent un validateur de classe ou de service distinct.
- ****Risque de doublons**** : validation côté client + côté serveur ; il faut garder une autorité unique (le serveur).
- ****Fausse sécurité**** : `@CreditCardNumber` vérifie un format ([Luhn](https://fr.wikipedia.org/wiki/Formule_de_Luhn)) mais n’assure pas la conformité PCI-DSS ni la sécurisation du stockage.
- ****Performance**** : regex très lourdes peuvent coûter ; privilégier validations simples et lisibles.

## Exemple pratique

Prenons une classe `UserDTO` :

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @Password(message = "Password must contain at least one digit, one lowercase, one uppercase, one special character, and be between 8 and 20 characters long")
    private String password;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @Min(value = 18, message = "Age should not be less than 18")
    @Max(value = 100, message = "Age should not be greater than 100")
    private int age;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @URL(message = "Website URL should be valid")
    private String website;

    @PastOrPresent(message = "Registration date cannot be in the future")
    private LocalDate registrationDate;

    @CreditCardNumber(message = "Credit card number should be valid")
    private String creditCardNumber;

    @NotEmpty(message = "Hobbies cannot be empty")
    @Size(min = 1, max = 5, message = "User must have between 1 and 5 hobbies")
    private List<String> hobbies;

    @NotNull(message = "Preferences cannot be null")
    private List<String> preferences;

}
```

ça en fait des annotations

### Explication détaillée

- **`**@NotBlank**`** : garantit que la chaîne n’est ni nulle ni vide (après suppression des espaces).
- **`**@Size(min, max)**`** : impose une taille minimale et maximale pour une chaîne ou une collection.
- **`**@Email**`** : valide que le champ contient une adresse e-mail au format standard.
- **`**@Min**`** / **`**@Max**`** : définissent des bornes numériques minimales et maximales.
- **`**@Pattern**`** : applique une expression régulière pour contrôler le format (ici, un numéro de téléphone sur 10 chiffres).
- **`**@URL**`** : valide qu’une chaîne est une URL correcte.
- **`**@PastOrPresent**`** : impose que la date ne soit pas dans le futur.
- - il existe d'autre annotation de validation de date comme :
    - - `@Past`
        - `@Future`
        - `@FutureOrPresent`
- **`**@CreditCardNumber**`** : valide la structure d’un numéro de carte bancaire.
- **`**@NotEmpty**`** : garantit qu’une collection ou chaîne contient au moins un élément/caractère.
- **`**@NotNull**`** : impose qu’un champ ne soit pas `null`.

---

- **`**@Password**`** il s'agit d'une annotation personnalisée (on va y venir)

---

## Créer ses propres annotations — pourquoi et comment ?

### Pourquoi créer une annotation personnalisée ?

- ****Concision et réutilisation**** : encapsuler une règle récurrente (ex. mot de passe, NIR, SIREN).
- ****Lisibilité**** : `@Password` est plus parlant que répéter la même regex partout.
- ****Testabilité**** : on isole la logique de validation dans un `ConstraintValidator`.
- ****Composition**** : une annotation peut être composée d’autres contraintes (via `@ConstraintComposition` avec Hibernate Validator) pour des comportements avancés.

### Créons notre annotation

```java
@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Password {
    String message() default "Invalid password";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

****Explication des annotations :****

- **`**@Documented**`** : rend l’annotation visible dans la Javadoc.
- **`**@Constraint(validatedBy = PasswordValidator.class)**`** : indique que cette contrainte est validée par `PasswordValidator`.
- **`**@Target(ElementType.FIELD)**`** : restreint l’utilisation de l’annotation aux champs.
- **`**@Retention(RetentionPolicy.RUNTIME)**`** : rend l’annotation disponible à l’exécution, indispensable pour la validation.

Les méthodes `message`, `groups` et `payload` sont imposées par la spécification Bean Validation. Elles permettent de personnaliser le message d’erreur et d’intégrer la contrainte dans des scénarios avancés (groupes de validations, charges associées).

```java
public class PasswordValidator implements ConstraintValidator<Password, String> {

    private static final String PASSWORD_PATTERN =
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    @Override
    public void initialize(Password constraintAnnotation) {
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isBlank()) {
            return false;
        }
        return pattern.matcher(password).matches();
    }
}
```

- **`**implements ConstraintValidator<Password, String>**`** : fait le lien entre l’annotation `@Password` et le type de données à valider (`String`).
- Le validateur applique une expression régulière pour contrôler la complexité du mot de passe (majuscule, minuscule, chiffre, caractère spécial, longueur entre 8 et 20).

## Conclusion

Les annotations de validation forment une brique essentielle et traditionnelle du développement d’applications robustes en Java et Spring Boot. Elles permettent d’exprimer de manière concise et lisible, directement sur le modèle de données, des règles simples et répétables, telles que la non-nullité d’un champ, le format d’un e-mail ou la complexité d’un mot de passe.

Grâce à leur intégration étroite avec Spring, ces annotations peuvent être appliquées aux DTO, aux entités, et même aux paramètres de méthode, et elles s’insèrent naturellement dans le cycle de vie des requêtes HTTP et des services métiers. L’utilisation d’annotations standards comme `@NotBlank`, `@Size`, `@Email` ou `@PastOrPresent` assure un niveau de validation immédiat et lisible, tandis que la création d’annotations personnalisées, comme `@Password`, permet d’étendre ces règles aux besoins spécifiques de l’application.

En combinant annotations standard et personnalisées, il devient possible de centraliser la logique de validation, d’améliorer la maintenabilité du code et de garantir la cohérence des données à travers toutes les couches de l’application. Ainsi, maîtriser ces annotations et leur fonctionnement est non seulement un gage de qualité technique, mais aussi une manière de respecter les conventions éprouvées et la robustesse attendue dans le développement Java moderne.
