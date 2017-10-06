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

function fotosInit(cb) {

  Techo.db.fotos = new Array();
  var apiUrl = api_base + "/api/v1/pictures";
  $.ajax({
    //url: 'results.json',
    url: apiUrl,
    type: 'GET',
    dataType: 'json'
  })
    .done(function (data) {
      Techo.db.fotos = data;
      cb();
    })
    .fail(function () {
      console.log("error");
      // TO-DO: informar algo en la ui
      // TO-DO: logeamos esto xlas?
    })
    .always(function () {
      //console.log("complete");
    });

  log("🔌", "fotos json loaded");

}
