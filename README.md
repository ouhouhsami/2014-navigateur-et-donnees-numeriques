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
* et/ou Extraction de sous-ensemble, de parties de ces contenus  
<!-- ex d'un texte que dont on va extraire un paragraphe, et ces manipulations on n'a pas d'outils en lignes pour les faires, -->
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

* Des services *distants* : service web, API RESTful et autres ([The Echo Nest](http://the.echonest.com/), metadonnées sur la musique ...)
* Des calculs *en local* côté client <!-- ce qui ne signifie pas en mode déconnecté --> ([Web Audio API](http://webaudio.github.io/web-audio-api/), suite logique à HTML5) <!-- Ce que cela fournit : un accès au détail du contenu numérique (détail des échantillons), et donc toute la connaissance en traitement du signal disponible dans un navigateur respectueux des standards -->

Coexistence des deux fournisseurs de contenu :

* le serveur
* et/ou le client

Donc les outils de visualisations doivent être adaptés à ces multiples usages combinés (notamment le cas de mashup)
<!-- ex. de récupération de BPM depuis echo nest et d'affichage de ces données sur le fichier audio disponible côté client -->

### Le projet de recherche technologique [WAVE](http://wave.ircam.fr) (ANR ContInt 2012-2015)

Des opérations d'annotation, de visualisation et de manipulation :

* explorées initialement dans le cadre du projet [Ecoute Signées](http://apm.ircam.fr/ecoutes_signees/)
* ont donné lieu à des prototypes et publications interactives

et aujourd'hui le développement d'une librairie d'outils et des transferts de technologies audionumériques vers le navigateur web dans le cadre de ce projet.
<script type="text/javascript" src="./libs/d3.js"></script>
<script type="text/javascript" src="./libs/timeline.js"></script>
<link rel="stylesheet" type="text/css" href="./css/style.css">

<script src="./libs/settings.js"></script>

<script src="./libs/d3.js"></script>
<script src="./libs/d3.chart.min.js"></script>
<script src="./libs/lodash.underscore.js"></script>
<script src="./libs/underscore.string.js"></script>
<script src="./libs/rAF.js"></script>
<script src="./libs/get-set.js"></script>
<script src="./libs/backbone-c.rig.js"></script>
<script src="./libs/bindings.js"></script>


<script src="./libs/wave.utils.js"></script>
<script src="./libs/areavis.js"></script>
<script src="./libs/timeLine.js"></script>
<script src="./libs/segment-vis.js"></script>
<script src="./libs/segment-edit.js"></script>
<script src="./libs/brush-vis.js"></script>
<script src="./libs/breakpoint-edit.js"></script>
<script src="./libs/zoomer.js"></script>
<script src="./libs/waveform-vis.js"></script>


## la Wave lib / Intégration

Exemples de visualisation et d'édition de données dans le navigateur.

### Telemeta, open web audio platform

Visualsation de données issues d'une analyse `aubio onset` (détection d'attaques avec les algorithmes `aubio`) depuis le framework `TimeSide`.

Les donnés sont analysées en python et importées dans le navigateur pour être représentées par les outils de visualisation de WAVE.

<div class="demo">
  <div class="paris-son"></div>
</div>

<script type="text/javascript" src="./parisson/data.js"></script>
<script type="text/javascript" src="./parisson/app.js"></script>### Mubu, conteneur de données sonores et mouvement

Visualisation de données de segmentation issues des analyses des objets `PIPO` en `Max/MSP` (Environnement visuel de dévelopement audionumérique sur _desktop_).

Les donnés sont analysées en `Max/MSP` et importées dans le navigateur pour être représentées par les outils de visualisation de WAVE. 

<div class="demo">
  <div class="soom-mubu"></div>
  <div class="timeline-mubu"></div>
</div>

<script src="./mubu/model.js"></script>
<script src="./mubu/app.js"></script><style type="text/css">
#bachoteque-vis{
  margin-bottom:2em;
}
</style>


### Bachothèque, prototype de comparaison d'interprétation

Différentes visualisations de données d'analyse d'intensité et durée de chacune des notes du premier prélude du _Clavier bien tempéré_ de J-S. Bach interprété par Frédéric Desenclos.

Les donnés sont extraites d'un algorithme d'alignement entre fichier MIDI et fichier audio et importées dans le navigateur par les outils de visualisation de WAVE.

Les visualisation intéragissent avec les élements de la page (dans ce cas la balise `audio`)

<div class="demo">
  <div id="bachoteque-vis"></div>
</div>

<audio class="audio" id="bachoteque-player" src="./snd/desenclos.wav" controls>
  <track kind="metadata" name="segments" src="./bachoteque/desenclos.vtt" default></track>
</audio>

<script src="./bachoteque/desenclos.js"></script>
<script src="./bachoteque/model.js"></script>
<script src="./bachoteque/timeChart.js"></script>
<script src="./bachoteque/segmentv.js"></script>
<script src="./bachoteque/cursor.js"></script>
<script src="./bachoteque/dots.js"></script>
<script src="./bachoteque/app.js"></script>### la Wave lib / Edition de données

<link rel="stylesheet" type="text/css" href="./editing/style.css">

Démonstrateur d'opérations primitives des outils de la librairie WAVE. (_C.R.U.D._)

Les données peuvent être <a class="keep-selection delete" name="delete"> éliminés</a>.<br> et/ou <a class="keep-selection add" name="add">ajoutés</a> facilement à travers une `API` javascript.

<div class="demo">
  <div class="timeline-editing"></div>
  <br>
  <div class="timeline-editing-sg"></div>
</div>

<script src="./editing/app.js"></script>
<script src="./editing/segsapp.js"></script>
## Conclusion

* Librairie WAVE sur GitHub [Ircam-RnD](https://github.com/Ircam-RnD)
* Performance du navigateur qui rendent possible ces manipulations
* Des cas d'usages nouveaux ?

* Plus généralement, un conteneur universel de données vs des adaptateurs singuliers; quelles options ?

* Pour en savoir plus sur l'aspect technique, Web Audio Conference - [wac.ircam.fr](http://wac.ircam.fr), 26/27 Janvier 2015 à l'Ircam.
