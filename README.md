# Visualisation et transformation de données audionumériques dans le navigateur web


Samuel Goldszmidt - Victor Saiz (Ircam)

2e rencontres sur les bases de données et les ressources numériques

26 septembre 2014, Ircam


## Introduction

Retour sur la présentation de 2013 "Brahms, Sidney et Archiprod : des données communes et des bases différentes"
* Des bases de données
    * [Brahms](http://brahms.ircam.fr) - Compositeurs / Œuvres
    * [Sidney](http://brahms.ircam.fr/sidney/) - Documentation dispositif électronique des œuvres
    * [Medias](http://medias.ircam.fr) - Archives audiovisuelles de l'Ircam
* Adaptées aux usages et contenus
    * ex. 1 Thésaurus pour les dispositifs électroniques
    * ex. 2 Effectif détaillé adapté aux musiques contemporaines
    * ...
* Interopérabilités
    * entre machines API RESTful, OAI
    * ou manuellement (intégration de contenu dans des systèmes tiers, ex. exports vidéos de [Medias](http://medias.ircam.fr))

* "Expose" des données numériques dans leur intégralité :
    * une biographie de compositeur
    * un parcours de l'œuvre
    * un enregistrement sonore
    * une vidéo
    * ...

## Des bases de données numériques à la manipulation de ces données

Les possibles :
* "Mashup" (Applications composites) - Aggrégation de contenus intégraux
* et/ou Extraction de sous-ensemble, de parties de ces contenus <!-- ex d'un texte que dont on va extraire un paragraphe, et ces manipulations on n'a pas d'outils en lignes pour les faires, -->
... mais des opérations souvent destructives.
<!-- il s'agit d'outils destructifs, et dont on perd alors le lien avec le contenu original -->

### Le sous-ensemble des données audionumériques temporelles

Comment appréhender un sous-ensemble de ces données numériques, celles temporelles, principalement audionumériques, et aller plus en avant dans leur représentation ?
* Visualiser un flux <!-- par rapport à l'entendre, lorsque la machine le décode sur la carte son -->
* Visualiser des métadonnées <!-- pistes d'un cd, index, segment ...-->
* Manipuler les métadonnées <!-- et l'adresser par des sous-ensemble -->
* Manipuler un flux <!-- comme on pourrait manipuler un texte par exemple, de façon sonore ou par manipulation graphique qui ont des conséquences sur le rendu audio -->

On s'interesse à des flux audio / vidéo que l'on va manipuler côté client, ie. dans la navigateur web.

## Pourquoi le navigateur web ?

* Le plus petit commun dénominateur de nos échanges sur Internet <!-- depuis nos appareils connectés, smartphone, tablet etc. -->
* Outil de consultation, de partage de connaissance (depuis HTML5, support de l'audio et de la vidéo en natif <!-- même si problème de format -->)
* Outil d'édition, de travail sur les données et métadonnées, y compris d'expérimentation <!-- depuis GoogleDocs à ... -->
* Les données sont disponibles a minima côté client <!-- lorsque l'on n'a pas accès à un serveur -->

### Quelles données (audio)numériques accessibles pour manipulation ?

* Des service *distants* : service web, API RESTful et autres ([The Echo Nest](http://the.echonest.com/), metadonnées sur la musique ...)
* Des calculs *en local* côté client <!-- ce qui ne signifie pas en mode déconnecté --> ([Web Audio API](http://webaudio.github.io/web-audio-api/), suite logique à HTML5) <!-- Ce que cela fournit : un accès au détail du contenu numérique (détail des échantillons), et donc toute la connaissance en traitement du signal disponible dans un navigateur respectueux des standards -->

Coexistence des deux fournisseurs de contenu :
* le serveur
* et/ou le client

Donc les outils de visualisations doivent être adaptés à ces multiples usages combinés (notamment le cas de mashup)
<!-- ex. de récupération de BPM depuis echo nest et d'affichage de ces données sur le fichier audio disponible côté client -->

### Le projet de recherche technologique [WAVE](http://wave.ircam.fr) (ANR ContInt 2012-2015)

Des opérations d'annotation :
* explorées initialement dans le cadre du projet [Ecoute Signées](http://apm.ircam.fr/ecoutes_signees/)
* ont donné lieu à des prototypes et publications interactives

et aujourd'hui le développement d'une librairie d'outils et des transferts de technologies audionumériques vers le navigateur web dans le cadre de ce projet .


## Exemple de visualisation avec différents services
_(on montre ainsi qu'on est agnostique sur les datas)_

- Telemeta - chaine intégrée, et donc librairies potentiellement intégrable dans une chaîne existante,
- un exemple de Norbert (y compris un exemple de mubu ? pour montrer l'intégration dans le web de ce type d'interface, et comment il n'y a pas besoin de réinventer la roue pour les boutons... qui sont dans le navigateur, les standards)
- *Bachothèque* (issu d'algo de recherche et visualisé dans le navigateur)
- Edition: avec les opérations élémentaires directement SUR GITHUB (segment-vis)
- Echo NEst : provider potentiel de données que l'on visualise / édite

A la fois un outil pour la recherche
Et pour la mise à disposition des résultats de recherche (directement accessible, standard, un navigateur suffit)
Pas de changement d'outil entre ces deux mondes.

Idée d'intégration à un wordpress (ou tout autre widget)

## Conclusion

* Librairie WAVE sur GitHub [Ircam-RnD](https://github.com/Ircam-RnD)
* Performance du navigateur qui rendent possible ces manipulations
* Des cas d'usages nouveaux ?

* Plus généralement, comment on organiser la sauvegarde des "Mashup" ?

* Pour en savoir plus sur l'aspect technique, Web Audio Conference - http://wac.ircam.fr, 26/27 Janvier 2015 à l'Ircam.
