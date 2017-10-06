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

function initData(cb) {
    var initialDataName = "r2016";
    var cb = cb || function () {};

    loadData(initialDataName, fail, success);

    function fail() {
        log("🔥", "r2016 data NOT loaded", true);
    }

    function success(data) {
        var apiUrl = api_base + "/api/v1/missing";
        $.ajax({
            url: apiUrl,
            dataType: 'json'
        })
            .done(function(norelevados) {
                for (var i in norelevados) {
                    data[i] = norelevados[i]
                }
                Techo.db[initialDataName] = (new MathSet(data)).toObject();
                log("🔌", "r2016 data loaded");
                processData(initialDataName);
                drawPolygons(initialDataName);
                cb();
            }).fail(function(err){
                console.log(err)
        });

    }
}

function loadData(dataName, fail, success) {
    apiUrl = api_base + "/api/v1/surveys/" + dataName.slice(1);

    $.ajax({
        url: apiUrl,
        dataType: 'json'
    })
        .done(success)
        .fail(fail);
}


function processData(dataName) {
    var neighbors = Techo.db[dataName];
    neighbors.localidades = [];
    neighbors.localidadesTemp = [];
    neighbors.poligonos = [];
    for (var n in neighbors) {
        var neighbor = neighbors[n];
        if (neighbor.constructor === Array) continue;
        row = toTitleCase(neighbor.localidad) + ' (' + toTitleCase(neighbor.provincia) + ')';
        neighbors.localidadesTemp.push(row);
        neighbors.poligonos[neighbor.id] = {
            nid: neighbor.nid,
            id: neighbor.id,
            poligono: neighbor.poligono
        };
    }

    neighbors.localidades = _.uniq(neighbors.localidadesTemp);
    log("🔌", dataName + " data processed");
}
