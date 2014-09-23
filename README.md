# Visualisation et transformation de données audionumériques dans le navigateur web


Samuel Goldszmidt - Victor Saiz (Ircam)
2e rencontres sur les bases de données et les ressources numériques
26 septembre 2014, Ircam


## Introduction

Rappels sur la présentation de l'an passé "Brahms, Sidney et Archiprod : des données communes et des bases différentes"
* Des bases de données
    * [Brahms](http://brahms.ircam.fr)
    * [Sidney](http://brahms.ircam.fr/sidney/)
    * [Medias](http://medias.ircam.fr)
* Adaptées aux usages et contenus
    * ex.1 Thésaurus pour les dispositifs électroniques
    * ex.2 Effectif détaillé adapté aux musiques contemporaines
    * ...
* Interopérabilités
    * entre machines API RESTful, OAI
    * ou manuellement (intégration de contenu dans des systèmes tiers, ex. exports vidéos de Medias.ircam.fr)

* "Expose" des données numériques dans leur intégralité :
    * une biographie de compositeur
    * un parcours de l'œuvre
    * un enregistrement sonore
    * une vidéo
    * ...

Comment appréhender un sous-ensemble de ces données, celles temporelles, principalement audionumériques, et aller plus en avant dans leur représentation ?
* Visualiser un flux
* Visualiser des métadonnées
* Manipuler les métadonnées <!-- comme on pourrait manipuler un texte par exemplz -->

### Des bases de données numériques vers l'exploitation des données

On s'interesse à des des flux audio / video que l'on va les manipuler côté client, ie. dans la navigateur web.
Le navigateur :
* outil de consultation
* outil d'édition, outil de travail des données (et outil de partage de connaissance, d'expérimentation)

## Les données (audio)numériques accessibles aujourdhui

* par un service web (The Echo Nest, metadonnées sur la musique)
* par un calcul côté client (Web Audio API)

Ce que ça peut vous apporter :
* comprendre le contenu numérique (détail des sample)
* toute la connaissance en traitement du signal disponible dans un navigateur respectueux des standards,

côté client : on peut visualiser des choses clientes et provenant de serveurs.

Co-existance des deux modèles, donc les outils de visualisations doivent être adaptés à ces multiples usages, notamment le cas du mashup.

### Le projet technologique

Des opérations d'annotation qui ont été explorées initialement dans le cadres du projet Ecoute Signées, qui ont donné lieu à des prototypes,
et aujourd'hui le développement d'une librairie d'outil (et de transfert de technologies) dans le cadre du projet WAVE. (http://wave.ircam.fr)


## Exemple de visualisation avec différents services
_(on montre ainsi qu'on est agnostique sur les datas)_

- Telemeta - chaine intégrée, et donc librairies potentiellement intégrable dans une chaîne existante,
- un exemple de Norbert (y compris un exemple de mubu ? pour montrer l'intégration dans le web de ce type d'interface, et comment il n'y a pas besoin de réinventer la roue pour les boutons... qui sont dans le navigateur, les standards)
- Bachoteque (issu d'algo de recherche et visualisé dans le navigateur)
- Edition: avec les opérations élémentaires directement SUR GITHUB (segment-vis)
- Echo NEst : provider potentiel de données que l'on visualise / édite

A la fois un outil pour la recherche
Et pour la mise à disposition des résultats de recherche (directement accessible, standard, un navigateur suffit)
Pas de changement d'outil entre ces deux mondes.

Idée d'intégration à un wordpress (ou tout autre widget)

## Conclusion

* Librairies disponible sur github https://github.com/Ircam-RnD
* Performance du navigateur
* Question ouverte => Comment on organiser la sauvegarde du mahsup - (RDF ex.)
