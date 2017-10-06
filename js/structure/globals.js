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

var env = "DEV";
var api_base = env == "DEV" ? "http://localhost:9292" : "production-server";
var deepLinkState = "";
var canSaveDeepLink = false;
var activeIndicator = "indice_vulnerabilidad_territorial";
var Techo = {
    mapa: {},
    db: {},
    charts: {},
    filters: null
};

var layerColors = {
    "r2016": {
        selected: {
            low: "#61CDFC",
            medium: "#52AEE7",
            high: "#3193CF",
            critic: "#2469B8",
        },
        unselected: {
            low: "#aaaaaa",
            medium: "#aaaaaa",
            high: "#aaaaaa",
            critic: "#aaaaaa",
        }
    },
    "r2013": {
        selected: {
            // low: "#ebf3a9",
            // medium: "#ebe369",
            // high: "#dbc349",
            // critic: "#dba349",
            low: "#61CDFC",
            medium: "#52AEE7",
            high: "#3193CF",
            critic: "#2469B8",
        },
        unselected: {
            low: "#aaaaaa",
            medium: "#aaaaaa",
            high: "#aaaaaa",
            critic: "#aaaaaa",
        }
    },
}

appliedFilters = [];

var activeLayers = {"r2016": true, "r2013": false};

var actualLatLng = [-38.416, -63.642];
var actualZoom = 5;
var actualLayer = "mapa";
var openedCharts = false;
var openedTable = false;
var openedDetails = false;
var openedSatellital = false;
var nid = "";
var clickedNeighbor = {};

var __DEBUG__ = false;

function log(icon, message, error) {
    if (!__DEBUG__) {return;}
    if (error) {
        console.log("%c" + icon + " " + message, "border-left: 2px solid #e33; background:#eee; padding: 2px 4px; border-radius: 2px; color: red");
        return;
    }
    console.log("%c" + icon + " " + message, "border-left: 2px solid #3e8; background:#eee; padding: 2px 4px; border-radius: 2px;");
}
