---
layout: default
title: Pokédex
permalink: /projects/pokedex/
tags: [java, projet, pokédex]
---
<h1>Pokédex</h1>

## Features

<table>
  <thead>
    <tr>
      <th>Fonctionnalité</th>
      <th>Description</th>
      <th>Illustrations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Vue par génération</td>
      <td>
        <table class="sub-table">
          <tr><td>Affichage des informations des Pokémon sous forme de grille</td></tr>
          <tr><td>Filtrage par génération</td></tr>
          <tr><td>Filtrage par nom</td></tr>
          <tr><td>Nombre d’éléments affichés dans la grille</td></tr>
          <tr><td>Accès à la vue détaillée</td></tr>
        </table>
      </td>
      <td>
        <table class="sub-table">
          <tr><td><img src="{{ '/assets/pokedex/img/gridView.png' | relative_url }}" alt="Grille" /></td></tr>
          <tr><td><img src="{{ '/assets/pokedex/img/filtering.png' | relative_url }}" alt="Filtrage" /></td></tr>
          <tr><td><img src="{{ '/assets/pokedex/img/name.png' | relative_url }}" alt="Filtrage par nom" /></td></tr>
          <tr><td><img src="{{ '/assets/pokedex/img/number.png' | relative_url }}" alt="Nombre d’éléments" /></td></tr>
        </table>
        </td>
    </tr>
    <tr>
      <td>Vue détaillée</td>
      <td>
        <table class="sub-table">
          <tr><td>Affichage des informations du Pokémon sélectionné</td></tr>
          <tr><td>Affichage des sprites du Pokémon :</td></tr>
          <tr><td>
            <table class="sub-table">
              <tr><td>Forme classique (normale / chromatique)</td></tr>
              <tr><td>Forme régionale (normale / chromatique)</td></tr>
            </table>
          </td></tr>
          <tr><td>Affichage des évolutions :</td></tr>
          <tr><td>
            <table class="sub-table">
              <tr><td>Pré-évolution</td></tr>
              <tr><td>Évolution suivante</td></tr>
              <tr><td>Évolution méga</td></tr>
            </table>
          </td></tr>
          <tr><td>Affichage de la forme Gigamax si disponible</td></tr>
        </table>
      </td>
      <td>
        <table class="sub-table">
          <tr><td><img src="{{ '/assets/pokedex/img/detailsView1.png' | relative_url }}" alt="Détails" /></td></tr>
          <tr><td><img src="{{ '/assets/pokedex/img/shiny.png' | relative_url }}" alt="Shiny" /></td></tr>
          <tr><td><img src="{{ '/assets/pokedex/img/region.png' | relative_url }}" alt="Région" /></td></tr>
          <tr><td><img src="{{ '/assets/pokedex/img/detailsView2.png' | relative_url }}" alt="Détails supplémentaires" /></td></tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

## Fait avec
* [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework
* [Vaadin](https://vaadin.com/) - Web framework for building modern user interfaces

## Liens vers le projet

[Pokédex](https://github.com/ErwanLT/Pokedex)