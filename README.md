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

## Des bases de données numériques vers la manipulation de ces données

Comment appréhender un sous-ensemble de ces données numériques, celles temporelles, principalement audionumériques, et aller plus en avant dans leur représentation ?
* Visualiser un flux <!-- par rapport à l'entendre, lorsque la machine le décode -->
* Visualiser des métadonnées <!-- pistes d'un cd, index, segment ...-->
* Manipuler les métadonnées <!-- et l'adresser par des sous-ensemble -->
* Manipuler un flux <!-- comme on pourrait manipuler un texte par exemple, de façon sonore ou par manipulation graphique qui ont des conséquences sur le rendu audio -->

On s'interesse à des flux audio / vidéo que l'on va manipuler côté client, ie. dans la navigateur web.

## Pourquoi le navigateur ?

* Techniquement, c'est aujourd'hui le plus petit commun dénominateur à nos échanges sur Internet <!-- depuis nos appareils connectés, smartphone, tablet etc. -->
* Outil de consultation, de partage de connaissance
* Outil d'édition, de travail sur les données et métadonnées, y compris d'expérimentation
* Les données sont disponibles a minima côté client, lorsque l'on a pas accès à un serveur, que l'on fait des *mashup* (Applications composites)

### Quelles données (audio)numériques accessibles ?

* Des service web via "API RESTful" ou autres ([The Echo Nest](http://the.echonest.com/), metadonnées sur la musique ...)
* Des calculs côté client ([Web Audio API](http://webaudio.github.io/web-audio-api/))
    * Ce que cela fournit : un accès au détail du contenu numérique (détail des échantillons), et donc toute la connaissance en traitement du signal disponible dans un navigateur respectueux des standards


Co-existance des deux fournisseur de contenu : le serveur et/ou le client, donc les outils de visualisations doivent être adaptés à ces multiples usages combinés (notamment le cas du mashup <!-- ex. de récupération de BPM depuis echo nest et d'affichage de ces données sur le fichier audio disponible côté client -->).

## Le projet de recherche technologique WAVE (ANR ContInt 2012-2015)

Des opérations d'annotation qui ont été explorées initialement dans le cadre du projet Ecoute Signées, qui ont donné lieu à des prototypes,
et aujourd'hui le développement d'une librairie d'outil et des transferts de technologies audionumériques vers le navigateur dans le cadre du projet [WAVE](http://wave.ircam.fr).


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

* Pour en savoir plus, la Web Audio Conference : http://wac.ircam.fr, 26/27 Janvier 2015 à l'Ircam.
