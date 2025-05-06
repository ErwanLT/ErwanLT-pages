---
layout: default
title: Chaîne de responsabilité
tags: [java, tutoriel, design pattern, comportementaux, chaine de responsabilité]
---

# Le design pattern **Chaîne de responsabilité**

## Définition

Le design pattern **Chaîne de responsabilité** est un modèle comportemental qui permet de traiter une requête à travers une série de gestionnaires, sans connaître à l'avance quel gestionnaire va la traiter.  
Chaque gestionnaire possède une référence vers le gestionnaire suivant dans la chaîne. Lorsqu'une requête est envoyée à la chaîne, chaque gestionnaire décide s'il peut la traiter ou s'il doit la transmettre au gestionnaire suivant.

## Avantages et inconvénients

|   |   |
|---|---|
|- Découplage<br>- Flexibilité<br>- Traitement conditionnel<br>- Gestion des erreurs|- Complexité accrue<br>- Debug plus compliqué<br>- Performance|

## Avantages

1. **Découplage :** La chaîne de responsabilité favorise le découplage entre l'émetteur de la requête et ses destinataires. L'émetteur ne sait pas à l'avance quel gestionnaire va traiter la requête, ce qui rend le système plus flexible et modulaire.
2. **Flexibilité :** Il est facile d'ajouter, de supprimer ou de réorganiser les gestionnaires dans la chaîne sans modifier le code de l'émetteur ou des autres gestionnaires. Cela permet d'adapter facilement le système aux nouvelles exigences ou aux changements dans la logique de traitement des requêtes.
3. **Traitement conditionnel :** Chaque gestionnaire peut prendre des décisions de manière conditionnelle sur la façon de traiter la requête, en fonction de critères tels que le type de requête, ses données ou l'état du système.
4. **Gestion des erreurs :** Il est possible de fournir une gestion des erreurs plus sophistiquée. Il faut ajouter un gestionnaire spécial pour traiter les cas où aucune des responsabilités n'est capable de traiter la requête.

## Inconvénients

1. **Complexité accrue :** La mise en œuvre de la chaîne de responsabilité peut rendre le code plus complexe, en particulier si la logique de traitement des requêtes est dispersée entre plusieurs gestionnaires.
2. **Debug plus compliqué** : La présence de plusieurs gestionnaires pour gérer différents cas peut rendre le debug plus difficile. En effet, il peut être nécessaire de suivre le chemin emprunté par la requête à travers la chaîne pour identifier la source d'une erreur.
3. **Performance :** Si la chaîne de responsabilité est trop longue ou si les gestionnaires effectuent des opérations coûteuses, cela peut affecter les performances du système.

## Exemple d'implémentation

Dans notre exemple d'implémentation, nous allons partir sur le cas d'une demande de remboursement auprès d'un organisme quelconque.

[![](https://www.sfeir.dev/content/images/2024/02/chain.drawio.png)](https://www.sfeir.dev/content/images/2024/02/chain.drawio.png)

diagramme de classe

Pour ce faire nous allons avoir besoin d'une `RequeteRemboursement` cette classe sera porteuse du montant que nous souhaiterons nous faire rembourser.

```java
public record RequeteRemboursement(double montant) {
}
```

Nous avons ensuite notre interface `GestionnaireRemboursement` qui définira le comportement de nos gestionnaires

```java
public interface GestionnaireRemboursement {
    void traiterRemboursement(RequeteRemboursement requete);
}
```

Suivi de l'implémentation de base GestionnaireRemboursementBase qui portera la chaîne de responsabilité :

- L'objet **suivant** est une référence vers le gestionnaire suivant dans la chaîne
- La méthode `traiterRemboursement` est responsable de traiter les requêtes de remboursement. Si le gestionnaire actuel peut traiter la requête, il le fait. Sinon, il transmet la requête au gestionnaire suivant dans la chaîne, si disponible.
- `peutTraiter` et `traiter`, sont deux méthodes abstraites que les classes dérivées doivent implémenter. Cela permet à chaque gestionnaire spécifique de décider s'il peut traiter la requête et de définir le traitement spécifique à appliquer.

```java
public abstract class GestionnaireRemboursementBase implements GestionnaireRemboursement{
    private GestionnaireRemboursement suivant;

    public GestionnaireRemboursementBase(GestionnaireRemboursement suivant) {
        this.suivant = suivant;
    }

    public void traiterRemboursement(RequeteRemboursement requete) {
        if (peutTraiter(requete)) {
            traiter(requete);
        } else if (suivant != null) {
            suivant.traiterRemboursement(requete);
        } else {
            System.out.println("Aucun gestionnaire disponible pour traiter la requête.");
        }
    }

    protected abstract boolean peutTraiter(RequeteRemboursement requete);
    protected abstract void traiter(RequeteRemboursement requete);
}
```

Nous avons ensuite nos implémentations de `GestionnaireRemboursementBase` :

- GestionnaireRemboursementPetit
- GestionnaireRemboursementMoyen
- GestionnaireRemboursementGrand

Chacune de ces implémentations représente un niveau de gestionnaire qui peut traiter jusqu'à un certain montant de remboursement et qui passe la balle au prochain maillon de la chaîne de responsabilité dans le cas contraire.

```java
public class GestionnaireRemboursementPetit extends GestionnaireRemboursementBase{
    public GestionnaireRemboursementPetit(GestionnaireRemboursement suivant) {
        super(suivant);
    }

    @Override
    protected boolean peutTraiter(RequeteRemboursement requete) {
        return requete.montant() <= 100;
    }

    @Override
    protected void traiter(RequeteRemboursement requete) {
        System.out.println("Remboursement approuvé par le gestionnaire de petits montants.");
    }
}

public class GestionnaireRemboursementMoyen extends GestionnaireRemboursementBase{
    public GestionnaireRemboursementMoyen(GestionnaireRemboursement suivant) {
        super(suivant);
    }

    @Override
    protected boolean peutTraiter(RequeteRemboursement requete) {
        return requete.montant() <= 1000;
    }

    @Override
    protected void traiter(RequeteRemboursement requete) {
        System.out.println("Remboursement approuvé par le gestionnaire de moyens montants.");
    }
}

public class GestionnaireRemboursementGrand extends GestionnaireRemboursementBase{
    public GestionnaireRemboursementGrand(GestionnaireRemboursement suivant) {
        super(suivant);
    }

    @Override
    protected boolean peutTraiter(RequeteRemboursement requete) {
        return requete.montant() <= 10000;
    }

    @Override
    protected void traiter(RequeteRemboursement requete) {
        System.out.println("Remboursement approuvé par le gestionnaire de grands montants.");
    }
}
```

Maintenant, que se passerait-il si l'on demandait un montant de remboursement qui excède la limite du dernier maillon de notre chaîne ?  
Ce dernier cas ne serait pas traiter et tomberait dans l'oubli de notre algorithme. Il faut donc à ce moment gérer les cas d'erreurs. C'est ici qu'intervint `GestionnaireRemboursementInvalide` qui sera l'ultime maillon de notre chaîne et garant du traitement de tous les cas.

```java
public class GestionnaireRemboursementInvalide extends GestionnaireRemboursementBase{
    public GestionnaireRemboursementInvalide() {
        super(null);
    }

    @Override
    protected boolean peutTraiter(RequeteRemboursement requete) {
        return true;
    }

    @Override
    protected void traiter(RequeteRemboursement requete) {
        System.out.println("Erreur : Aucun gestionnaire disponible pour traiter la requête.");
    }
}
```

## Exemple d'utilisation

```java
public static void main(String[] args){
    GestionnaireRemboursement gestionnaireInvalide = new GestionnaireRemboursementInvalide();
    GestionnaireRemboursement gestionnaireGrand = new GestionnaireRemboursementGrand(gestionnaireInvalide);
    GestionnaireRemboursement gestionnaireMoyen = new GestionnaireRemboursementMoyen(gestionnaireGrand);
    GestionnaireRemboursement gestionnairePetit = new GestionnaireRemboursementPetit(gestionnaireMoyen);

    // Simulation de différentes requêtes de remboursement
    RequeteRemboursement req1 = new RequeteRemboursement(50);
    RequeteRemboursement req2 = new RequeteRemboursement(500);
    RequeteRemboursement req3 = new RequeteRemboursement(5000);
    RequeteRemboursement req4 = new RequeteRemboursement(20000);

    // Traitement des requêtes
    gestionnairePetit.traiterRemboursement(req1);
    gestionnairePetit.traiterRemboursement(req2);
    gestionnairePetit.traiterRemboursement(req3);
    gestionnairePetit.traiterRemboursement(req4);
}
```

Dans cet exemple, nous créons nos différents gestionnaires de remboursement, chacun avec une référence vers le prochain maillon de la chaîne, et pour le dernier vers la gestion du cas d'erreur.  
Nous envoyons ensuite plusieurs requêtes de remboursement avec des montants différents au premier maillon. Nous pouvons ensuite suivre leurs passages à travers la chaîne avec la sortie en console suivante :

```log
Remboursement approuvé par le gestionnaire de petits montants.
Remboursement approuvé par le gestionnaire de moyens montants.
Remboursement approuvé par le gestionnaire de grands montants.
Erreur : Aucun gestionnaire disponible pour traiter la requête.
```

## En conclusion

Le design pattern **Chaîne de responsabilité** offre une solution pour le traitement des requêtes de manière flexible et modulaire. En permettant à une série de gestionnaires de traiter une requête, ce pattern favorise le découplage, la flexibilité et la gestion des erreurs.

⚠️ Ce pattern peut introduire de la complexité et des problèmes de performance s'il est mal utilisé. Il est donc important de peser les pour et les contre lors de la décision d'utiliser ce pattern dans un système.