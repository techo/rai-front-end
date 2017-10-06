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

function removePolygons(dataName) {
  if (Techo.db[dataName] && Techo.db[dataName].layer) {
    Techo.db[dataName].layer.remove();
  }
}

function drawPolygons(dataName) {
  var activeColor = layerColors[dataName];
  var layerOpacity = 1;
  var layerStroke = 1;
  var layerColor = null;
  var selectedLayers = getNeighbors(clickedNeighbor);
  layerData = Techo.db[dataName];
  var filteredLayerIds = filterLayer(layerData);
  layerData.geoJson = [];
  layerData.polygon = [];
  layerData.layer = [];
  i = 0;
  for (var key in layerData.poligonos) {
    var value = layerData.poligonos[key];
    var indicators = layerData[key] ? layerData[key].indicadores : null;
    var indicator = getActiveIndicator(indicators);

    if (value.id in filteredLayerIds === false) {
      continue;
    }
    if (i < 9000 && !_.isEmpty(value['poligono']) ) {
      i++;

      var geojson = wellknown.parse(value['poligono']);

      if (geojson !== null) {
        var isInSelected = key in selectedLayers;
        layerOpacity = isInSelected ? 0.6 : 0.6;
        layerStroke = isInSelected ? 1 : 1;
        var hasIndicators = !!indicators;
        layerColor = generateColor(indicator, isInSelected, activeColor, hasIndicators);
        polygon = {
          "type": "Feature",
          "properties": {
            "name": value['id'],
            "id": key,
            "style": {
              "color": layerColor,
              "weight": layerStroke,
              "fillOpacity": layerOpacity
            }
          },
          "geometry": geojson
        };
        layerData.geoJson.push(polygon);
      }
    }
  }

  layerData.layer = L.geoJson(layerData.geoJson, {
    style: function (feature) {
      return feature.properties.style;
    }
  });

  layerData.layer.addData(layerData.geoJson);
  layerData.layer.addTo(Techo.mapa.map);

  layerData.layer.on("click", function (poligonoClicked) {
    openDetails(poligonoClicked.layer.feature.properties.name);
    deepLink();
  });
}

function openDetails(id) {
  nid = id;
  closeCharts();
  $('#fichaBarrio').css('display', 'none');
  $('.filter-compile').removeClass('active');
  $("li.slider").removeClass("slider");
  neighborStatics(id)
  openedDetails = true;
}

function generateColor(indicator, isInSelected, activeColor, hasIndicators) {
  if (!activeIndicator) {
    return isInSelected ? activeColor.selected.medium : activeColor.unselected.medium
  }
  if (!hasIndicators) {
    return "#b2b2b2";
  }
  switch (getIndicator(indicator)) {
    case "low":
      return isInSelected ? activeColor.selected.low : activeColor.unselected.low;
      break;
    case "medium":
      return isInSelected ? activeColor.selected.medium : activeColor.unselected.medium;
      break;
    case "high":
      return isInSelected ? activeColor.selected.high : activeColor.unselected.high;
      break;
    case "critic":
      return isInSelected ? activeColor.selected.critic : activeColor.unselected.critic;
      break;
  }
}

function getIndicator(indicator) {
  if (indicator == null) return "null";
  if (indicator <= 1.75) return "low";
  if (indicator <= 2.5) return "medium";
  if (indicator <= 3.25) return "high";
  if (indicator <= 4) return "critic";
}

function getActiveIndicator(indicators) {
  if (indicators && activeIndicator) return indicators[activeIndicator];
  return null;
}
