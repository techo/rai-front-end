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

function neighborPercentages(clickedNeighbor) {
  breadcrumbsSetText(clickedNeighbor);

  if (clickedNeighbor.type === "nombre_barrio") return;
  var arrayConDatos = filterLayer(getNeighbors(clickedNeighbor));
  var fichaPorcentajes = $('#fichaPorcentajes');
  fichaPorcentajes.css('display', 'block');
  calculateFamiliesAndSettlements(arrayConDatos);
  generateCharts({type: "agua", title: "Acceso al agua", data: arrayConDatos, colors: generateColors("#D64329")});
  generateCharts({type: "excretas", title: "Eliminación de excretas", data: arrayConDatos, colors: generateColors("#0D61A8")});
  generateCharts({type: "luz", title: "Energía eléctrica", data: arrayConDatos, colors: generateColors("#F58238")});
  generateCharts({type: "energia_calefaccion", title: "Energía para calefacción", data: arrayConDatos, colors: generateColors("#83B728")});
  generateCharts({type: "energia_cocinar", title: "Energía para cocinar", data: arrayConDatos, colors: generateColors("#F0A600")});
}

function breadcrumbsSetText(clickedNeighbor) {
  var breadcrumbs = $(".breadcrumbs-zone");
  var breadcrumbsText = "";
  switch (clickedNeighbor.type) {
    case "nombre_barrio":
      breadcrumbsText += clickedNeighbor.nombre_barrio;
    case "localidad":
      breadcrumbsText += " | " + clickedNeighbor.localidad;
    case "departamento":
      breadcrumbsText += " | " + clickedNeighbor.departamento;
    case "provincia":
      breadcrumbsText += " | " + clickedNeighbor.provincia;
  }

  if (breadcrumbsText == "") {
    breadcrumbsText = " Argentina";
  }
  breadcrumbs.text(breadcrumbsText);
}
function calculateFamiliesAndSettlements(arrayConDatos) {
  var EXCLUDE_DEFINITIONS = true;
  var families = countFamilies(arrayConDatos);
  var familiesLabel = $(".count-families");
  familiesLabel.text(families);

  var settlements = countSettlements(arrayConDatos);
  var settlementsLabel = $(".count-settlements");
  settlementsLabel.text(settlements);
}

function getNeighbors(properties) {
  var data_r2016 = new MathSet(Techo.db.r2016);
  var data_r2013 = new MathSet(Techo.db.r2013);
  var data = data_r2016.union(data_r2013).toObject();
  var type = properties.type;
  var name = properties[type];
  if (properties.type == 'pais') return data;

  var filteredKeys = Object.keys(data).filter(function (index) {
    var isOkToAppend = true;
    if (!name || !type) {
      return true
    }
    switch (type) {
      case "nombre_barrio":
        isOkToAppend &= data[index].nombre_barrio === properties.nombre_barrio;
      case "localidad":
        isOkToAppend &= data[index].localidad === properties.localidad;
      case "departamento":
        isOkToAppend &= data[index].departamento === properties.departamento;
      case "provincia":
        isOkToAppend &= data[index].provincia === properties.provincia;
    }

    return isOkToAppend;
  });

  var neighbors = [];
  for (var index in filteredKeys) {
    var id = filteredKeys[index];
    neighbors[id] = (data[id]);
  }
  return neighbors;
}

function generateColors(hexa) {
  var colors = [];
  var count = 7;
  var step = Math.round(100 / count);
  for (var i = 0; i < 100; i += step) {
    var color = Highcharts.Color(hexa).brighten(i / 100 * 0.7).get()
    colors.push(color);
  }
  return colors;
}
