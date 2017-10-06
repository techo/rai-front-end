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

function layersInit() {
    countLayersLabel();
    $('#radio1, #radio2').change( function(evt) {
        $(this).addClass("loading");
        setTimeout((function(evt) {
            return function() {
                var isChecked = evt.target.checked;
                for (var i in activeLayers) {
                    activeLayers[i] = false;
                    $('#radio1, #radio2').prop('checked', false);
                    $('#radio1, #radio2').attr('checked', false);
                }
                if (isChecked) {
                    activeLayers[evt.target.value] = true;
                    showLayer(evt.target.value);
                    for (var i in activeLayers) {
                        if (i == evt.target.value) continue;
                        activeLayers[i] = false;
                        hideLayer(i);
                    }
                    $(evt.target).prop('checked', true);
                    $(evt.target).attr('checked', true);
                } else {
                    activeLayers[evt.target.value] = false;
                    hideLayer(evt.target.value);
                }
                countLayersLabel();
                $('#radio1, #radio2').removeClass("loading");
                deepLink();
            };
        })(evt), 100)
    });
    log("🔌", "layers module loaded");
}

function countLayersLabel() {
    $(".layers-count .count-label").text(Object.keys(activeLayers).filter(function(i) {return activeLayers[i];}).length);
}

function showLayer(layer) {
    if (activeLayers.r2016) {
        $(".export-actual-view")
            .removeAttr('disabled')
            .removeProp('disabled')
            .removeClass('inactive');
    } else {
        $(".export-actual-view")
            .attr('disabled', 'disabled')
            .prop('disabled', 'disabled')
            .addClass('inactive');
    }
    if (Techo.db[layer] === undefined) {
        loadData(layer, fail, success);
        return;
    }

    drawPolygons(layer);

    function fail() {
        log("🔥", layer + " data NOT loaded", true);
    }

    function success(data) {
        for (var i in data) {
            data[i].identificar = data[i].identificar || "cumple con la definición";
        }
        Techo.db[layer] = data;
        log("🔌", layer + " data loaded");
        processData(layer);
        drawPolygons(layer);
    }
}

function hideLayer(layer) {
    removePolygons(layer);
}
