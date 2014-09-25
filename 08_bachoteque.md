<style type="text/css">
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
<script src="./bachoteque/app.js"></script>