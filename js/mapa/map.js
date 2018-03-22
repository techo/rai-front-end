/***************************************************************************
* Project Mapa de Asentamientos 2016 - Techo Argentina
* Copyright (C) 2016 - 2017, Techo Argentina, <cis.argentina@techo.org>.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.

* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.

* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software Foundation,
* Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
***************************************************************************/

function initMap() {
  var mapboxURI = "https://api.mapbox.com/styles/v1/username...";
  var mapboxSatellitalURI = "https://api.mapbox.com/styles/v1/username...";

  Techo.mapa.capagrayscale = L.tileLayer(mapboxURI, {
    id: "MapID",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. Desarrollado por <a href="http://www.winguweb.org" target="_blank">Wingu</a>. Accede a los términos y condiciones del uso del relevamiento <a href="terminos.html" target="_blank" >acá</a>.',
    edgeBufferTiles: 2
  });

  Techo.mapa.capasat = L.tileLayer(mapboxSatellitalURI, {
    id: "MapSat",
    attribution: 'Imágenes de <a href="http://www.mapbox.com/">Mapbox</a>. Desarrollado por <a href="http://www.winguweb.org" target="_blank">Wingu</a>. Accede a los términos y condiciones del uso del relevamiento <a href="terminos.html" target="_blank" >acá</a>.',
    edgeBufferTiles: 1
  });

  Techo.mapa.map = L.map("map", {
    center: [-38.416, -63.642], zoom: 5,
    layers: [Techo.mapa.capagrayscale],
    zoomControl: false,
    maxBounds: new L.LatLngBounds(new L.LatLng(-60, -40), new L.LatLng(-16, -90)),
    maxBoundsViscosity: 0.1,
    maxZoom: 17
  });

  var baseMaps = {
    "Mapa": Techo.mapa.capagrayscale,
    "Satelital": Techo.mapa.capasat
  };


  Techo.mapa.status = 'mapa';
  $('#zoomin').click(function zoomInButton(ev) {
    ev.preventDefault();
    Techo.mapa.map.zoomIn();
  });

  $('#zoomout').click(function zoomOutButton(ev) {
    ev.preventDefault();
    Techo.mapa.map.zoomOut();
  });

  $('#satbutton').click(function zoomOutButton(ev) {
    ev.preventDefault();
    if (Techo.mapa.status == 'mapa') {
      changeMapLayerStyle("sat");
    } else if (Techo.mapa.status == 'sat') {
      changeMapLayerStyle("mapa");
    }
    deepLink();
    return true;
  });

  Techo.mapa.map.on("moveend", function (ev) {
    var data = ev.target;
    actualZoom = data._zoom;
    var latLng = Techo.mapa.map.getCenter();
    actualLatLng = [latLng.lat, latLng.lng];
    deepLink();
  });

  log("🔌", "map module loaded");
}

function changeMapLayerStyle(value) {
  if (value == 'sat') {
    Techo.mapa.map.removeLayer(Techo.mapa.capagrayscale);
    Techo.mapa.capasat.addTo(Techo.mapa.map);
    Techo.mapa.status = 'sat';
    actualLayer = "sat";
  } else if (value == 'mapa') {
    Techo.mapa.map.removeLayer(Techo.mapa.capasat);
    Techo.mapa.capagrayscale.addTo(Techo.mapa.map);
    Techo.mapa.status = 'mapa';
    actualLayer = "mapa";
  }
}

function centerZone(zones) {
  var zonesArray = getNeighbors(zones);
  var zonesArrayCoords = Object.keys(zonesArray).map(function (index) {
    var poligono = zonesArray[index].poligono
    if (!poligono || poligono == "POLYGON EMPTY") return [];
    var geojson = wellknown.parse(poligono);
    if (geojson.type == "MultiPolygon")
        return geojson.coordinates.map(function (p) { return p[0].splice(-1,1).map( function (c) { return [c[1], c[0]] }) });
    return geojson.coordinates[0].splice(-1,1).map(function(coord){ return [ coord[1], coord[0] ]; });
  })

  var multiPolygon = L.polygon(zonesArrayCoords);
  Techo.mapa.map.fitBounds(multiPolygon.getBounds());
  var zoom = Techo.mapa.map.getZoom();
  Techo.mapa.map.setZoom(Object.keys(zonesArray).length === 1 ? zoom - 1 : zoom);

}
