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

function crearTablaDeDatos(clickedNeighbor) {
  breadcrumbsSetText(clickedNeighbor);
  var arrayConDatos = filterLayer(getNeighbors(clickedNeighbor));
  var nodos = [];

  var data = Techo.db.r2016;

  for (var i in arrayConDatos) {
    var acumuladorDeNodosPorParametro = data[i];
    if (!acumuladorDeNodosPorParametro.id) continue;

    nodos.push([
      '<a class="table-neighbor table-field" href="#" ' +
      'data-id="' + acumuladorDeNodosPorParametro.id + '" ' +
      'data-type="nombre_barrio" ' +
      'data-provincia="' + acumuladorDeNodosPorParametro.provincia + '" ' +
      'data-departamento="' + acumuladorDeNodosPorParametro.departamento + '" ' +
      'data-localidad="' + acumuladorDeNodosPorParametro.localidad + '" ' +
      'data-barrio="' + acumuladorDeNodosPorParametro.nombre_barrio + '">' +
      acumuladorDeNodosPorParametro.nombre_barrio || null+'</a>',
      '<span class="table-field">' + acumuladorDeNodosPorParametro.provincia || null+'</span>',
      '<span class="table-field">' + acumuladorDeNodosPorParametro.departamento || null+'</span>',
      '<span class="table-field">' + acumuladorDeNodosPorParametro.localidad || null+'</span>',
      '<span class="table-field">' + acumuladorDeNodosPorParametro.tipo_de_barrio || null+'</span>',
      '<span class="table-field">' + acumuladorDeNodosPorParametro.cantidad_de_familias || null+'</span>',
      '<span class="table-field">' + acumuladorDeNodosPorParametro.anio_creo_barrio || null+'</span>'
    ]);
  }


  calculateFamiliesAndSettlements(arrayConDatos);

  var fichaTablas = $('#fichaTablas');
  fichaTablas.css('display', 'block');
  Techo.tables = $('.data-table').DataTable({
    data: nodos,
    columns: [
      {title: "Nombre de barrio"},
      {title: "Provincia"},
      {title: "Departamento"},
      {title: "Localidad"},
      {title: "Tipo"},
      {title: "Familias"},
      {title: "Año creación"}
    ],
    language: {
      paginate: {
        previous: "Anterior",
        next: "Siguiente",
      },
      lengthMenu: "Mostrar _MENU_ resultados"
    },
    responsive: true,
    pageLength: 13
  });
}
