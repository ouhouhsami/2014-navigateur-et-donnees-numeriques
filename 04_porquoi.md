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
