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

function generateCharts(options) {
    var data = Techo.db.r2016;

    Highcharts.setOptions({
        colors: options.colors
    });

    var nodes = [];
    for (var n in options.data) {
        nodes.push(options.data[n]);
    }

    var counts = {};
    for (var n in nodes) {
        var node = nodes[n];
        var key = node[options.type].split("(")[0].toLowerCase();
        counts[key] = counts[key] === undefined ? 1 : counts[key] + 1;
    }

    //ACUMULO LOS NODOS EN UN ARRAY NOMBRE/VALOR
    var unifiedValues = [];
    var unifiedSummatory = 0;

    var keys = Object.keys(counts).sort(function(itemA, itemB){
        return counts[itemB] - counts[itemA];

    });
    for (var i in keys) {
        var key = keys[i];
        if (key == "") {continue;}
        unifiedSummatory += counts[key];
        unifiedValues.push([key, counts[key]]);
    }
    //SACO EL PORCENTAJE DE LOS NODOS Y LOS MUESTRO EN UN DIV
    $(".contenedorDatosDe_" + options.type).html('');
    var appendToDOM = "";

    for (var i in unifiedValues) {
        valuePercentage = (unifiedValues[i][1] * 100) / unifiedSummatory;
        appendToDOM += "<span class='leyenda-porcentaje'>" + unifiedValues[i][0] + "</span>" +
            "<span class='valor-porcentaje'>" + valuePercentage.toFixed(1) + " <span class='percentage-symbol'>%</span></span>";
    }

    $(".tituloDe_" + options.type).text(options.title);
    $(".contenedorDatosDe_" + options.type).append(appendToDOM);

    //GENERO EL GRÁFICO
    var contenedor = $("#contenedorGraficoDe_" + options.type);
    Techo.charts[options.type] = contenedor.highcharts({
        chart: {
            type: "pie",
            options3d: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        },
        title: {
            text: options.title,
            style: {
                fontSize: "12px",
                display: "none"
            }
        },
        plotOptions: {
            pie: {
                innerSize: 60,
                depth: 45,
                dataLabels: {
                    enabled: false,
                },
                showInLegend: false,
            },
        },
        series: [{
            name: "Cantidad",
            data: unifiedValues,
            point: {
                events: {
                    mouseOver: function (ev) {
                        var zone = ev.target.index;
                        var chart = ev.target.series.chart.title.textStr;
                        highlightZone(chart, zone);
                    },
                    mouseOut: function (ev) {
                        var zone = ev.target.index;
                        var chart = ev.target.series.chart.title.textStr;
                        highlightZone(chart, zone, false);
                    }
                }
            }
        }],
        tooltip: {
            enabled: false
        },
    });
}

function highlightZone(chart, zone, state) {
    var classes = {
        "Acceso al agua": "contenedorDatosDe_agua",
        "Eliminación de excretas": "contenedorDatosDe_excretas",
        "Energía eléctrica": "contenedorDatosDe_luz",
        "Energía para calefacción": "contenedorDatosDe_energia_calefaccion",
        "Energía para cocinar": "contenedorDatosDe_energia_cocinar",
    };
    var legend = $("." + classes[chart] + " .valor-porcentaje").eq(zone);
    if (state === false) {
        legend.removeClass("hovered");
    } else {
        legend.addClass("hovered");
    }
}
