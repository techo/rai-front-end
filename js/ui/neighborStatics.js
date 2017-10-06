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

$(document).ready(function () {
  $('.close-ficha-barrio').click(function (ev) {
    ev.preventDefault();
    $('#fichaBarrio').css('display', 'none')
    openedDetails = false;
    deepLink();
  });
});

function neighborStatics(idClicked) {
  idClicked = idClicked.toLowerCase();
  var activeLayer = activeLayers.r2016 ? 'r2016' : 'r2013';
  clickedNeighbor.data = _.findWhere(Techo.db[activeLayer], {id: idClicked});

  // populate the fields

  if (clickedNeighbor.data.identificar.trim() == "no cumple con la definición") {
    $(".hide-no-relevados").hide();
  } else {
    $(".hide-no-relevados").show();
  }
  $('.asentamientotit').text("Relevamiento " + activeLayer.slice(1) + " - ");
  $('#tituloFichaBarrio').text(clickedNeighbor.data.nombre_barrio);
  $('#b_nombre').text(clickedNeighbor.data.nombre_barrio);
  $('#b_nombre_alt').text(clickedNeighbor.data.otros_nombres_barrio);
  $('#b_partido').text(clickedNeighbor.data.departamento);
  $('#b_provincia').text(clickedNeighbor.data.provincia);
  $('#b_localidad').text(clickedNeighbor.data.localidad);
  $('#b_anio').text(clickedNeighbor.data.anio_creo_barrio);
  $('#b_cantfamilias').text(clickedNeighbor.data.cantidad_de_familias);
  $('#b_excretas').text(clickedNeighbor.data.excretas);
  $('#b_agua').text(clickedNeighbor.data.agua);
  $('#b_luz').text(clickedNeighbor.data.luz);
  $('#b_cocina').text(clickedNeighbor.data.energia_cocinar);
  $('#b_calefa').text(clickedNeighbor.data.energia_calefaccion);
  $('#b_pluviales').text('');
  $('#b_alumbrado').text(clickedNeighbor.data.alumbrado);
  $('#b_residuos').text(clickedNeighbor.data.recoleccion_de_residuos);
  $('#b_alias').text(clickedNeighbor.data.id);
  $('#b_poligono').text(clickedNeighbor.data.poligono);
  $('#b_imgs').text(clickedNeighbor.data.foto + ' ' + clickedNeighbor.data.foto2 + ' ' + clickedNeighbor.data.foto3 + ' ' + clickedNeighbor.data.foto4 + ' ' + clickedNeighbor.data.foto5);
  $('#b_sat').text('');

  var available_indicators = clickedNeighbor.data.indicadores !== null;
  $('#b_indice_indice_de_vulnerabilidad_territorial').text(available_indicators ? (+clickedNeighbor.data.indicadores.indice_vulnerabilidad_territorial).toFixed(2) : "No especificado");
  $('#b_indice_servicios_de_energia').text(available_indicators ? (+clickedNeighbor.data.indicadores.energia_electrica).toFixed(2) : "No especificado");
  $('#b_indice_servicios_basicos').text(available_indicators ? (+clickedNeighbor.data.indicadores.servicios).toFixed(2) : "No especificado");
  $('#b_indice_agua').text(available_indicators ? (+clickedNeighbor.data.indicadores.agua).toFixed(2) : "No especificado");
  $('#b_indice_energia_electrica').text(available_indicators ? (+clickedNeighbor.data.indicadores.energia_electrica).toFixed(2) : "No especificado");
  $('#b_indice_eliminacion_de_excretas').text(available_indicators ? (+clickedNeighbor.data.indicadores.eliminacion_de_excretas).toFixed(2) : "No especificado");
  $('#b_indice_emplazamiento_de_riesgo').text(available_indicators ? (+clickedNeighbor.data.indicadores.emplazamientos).toFixed(2) : "No especificado");
  $('#b_indice_inundacion').text(available_indicators ? (+clickedNeighbor.data.indicadores.inundacion).toFixed(2) : "No especificado");
  $('#b_indice_servicios_de_emergencia').text(available_indicators ? (+clickedNeighbor.data.indicadores.servicios_de_emergencia).toFixed(2) : "No especificado");
  $('#b_indice_bomberos').text(available_indicators ? (+clickedNeighbor.data.indicadores.bomberos).toFixed(2) : "No especificado");
  $('#b_indice_policia').text(available_indicators ? (+clickedNeighbor.data.indicadores.policia).toFixed(2) : "No especificado");
  $('#b_indice_ambulancia').text(available_indicators ? (+clickedNeighbor.data.indicadores.ambulancia).toFixed(2) : "No especificado");
  $('#b_indice_tenencia').text(available_indicators ? (+clickedNeighbor.data.indicadores.tenencia).toFixed(2) : "No especificado");
  $('#b_indice_educacion').text(available_indicators ? (+clickedNeighbor.data.indicadores.educacion).toFixed(2) : "No especificado");
  $('#b_indice_jardin_de_infantes').text(available_indicators ? (+clickedNeighbor.data.indicadores.jardin).toFixed(2) : "No especificado");
  $('#b_indice_escuela_primaria').text(available_indicators ? (+clickedNeighbor.data.indicadores.primaria).toFixed(2) : "No especificado");
  $('#b_indice_escuela_secundaria').text(available_indicators ? (+clickedNeighbor.data.indicadores.secundaria).toFixed(2) : "No especificado");
  $('#b_indice_alumbrado').text(available_indicators ? (+clickedNeighbor.data.indicadores.alumbrado).toFixed(2) : "No especificado");
  $('#b_indice_salud').text(available_indicators ? (+clickedNeighbor.data.indicadores.salud).toFixed(2) : "No especificado");
  $('#b_indice_salita_medica').text(available_indicators ? (+clickedNeighbor.data.indicadores.salita).toFixed(2) : "No especificado");
  $('#b_indice_hospital').text(available_indicators ? (+clickedNeighbor.data.indicadores.hospital).toFixed(2) : "No especificado");
  $('#b_indice_recoleccion_de_basura').text(available_indicators ? (+clickedNeighbor.data.indicadores.bomberos).toFixed(2) : "No especificado");
  $('#b_indice_asfalto').text(available_indicators ? (+clickedNeighbor.data.indicadores.asfalto).toFixed(2) : "No especificado");
  $('#b_indice_transporte').text(available_indicators ? (+clickedNeighbor.data.indicadores.transporte).toFixed(2) : "No especificado");
  if (!clickedNeighbor.data.otros_nombres_barrio) { $('#b_nombre_alt').text("-"); }

  // fallback text
  $.each($('.datoficha'), function () {
    if ($(this).text() == "") {
      $(this).text("No disponible")
    }
  });

  mostrarImagenes();
  mostrarImagenesSatelitales();
  $('#fichaBarrio').css('display', 'block');
  twentyInit();
}


function mostrarImagenes() {
  if (Techo.db.fotos[clickedNeighbor.data.id]) {

    //CALCULO LA CANTIDAD DE FOTOS
    var cantidadDeFotos = $(Techo.db.fotos[clickedNeighbor.data.id].fotos).size();

    //SACO LAS FOTOS PUESTAS POR DEFECTO PARA QUE NO SE ROMPA EL SLIDER DE BOOTSTRAP
    $('.carousel-indicators').find('li').remove();
    $('.carousel-inner').find('div').remove();


    //RECORRO LAS FOTOS QUE PODRÍA LLEGAR A HABER
    $.each(Techo.db.fotos[clickedNeighbor.data.id].fotos, function cadaFoto(key, val) {
      var active = '';
      if (key == 0) {
        active = 'active';
      } else {
      }

      //AGREGO LAS FOTOS AL DIV
      $(".carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="' + key + '" class="' + active + '"></li>');
      $(".carousel-inner").append('<div class="item ' + active + '"><img id="imgBarrio' + key + '" src="' + val + '" height="230" alt="gallery_img"></div>');

    });

    //SI NO HAY FOTOS AGREGO LA FOTO POR DEFECTO
    if (cantidadDeFotos == 0) {
      $(".carousel-inner").append('<div class="item active"><img id="imgBarrio0" src="http://placehold.it/1221x530?text=Foto+no+disponible" height="230" alt="gallery_img"></div>');
    }

  }
}


function mostrarImagenesSatelitales() {
  if (Techo.db.fotos_satelitales[clickedNeighbor.data.id] != "") {

    $('.twentytwenty-container').remove();
    $(".large-12").append('<div class="twentytwenty-container"><img id="antes" src="http://placehold.it/1221x530?text=Imagen+satelital+no+disponible" height="300"/><img id="despues" src="http://placehold.it/1221x530?text=Imagen+satelital+no+disponible" height="300"/></div>');


    var cantidadDeFotosSatelitales = $(Techo.db.fotos_satelitales[clickedNeighbor.data.id]).size();

    if (cantidadDeFotosSatelitales == 0) {
      $('#antes').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
      $('#despues').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
    } else {
      if (
        Techo.db.fotos_satelitales[clickedNeighbor.data.id]["2013"] &&
        Techo.db.fotos_satelitales[clickedNeighbor.data.id]["2016"]
      ) {
        $('#antes').attr("src", Techo.db.fotos_satelitales[clickedNeighbor.data.id]["2013"]);
        $('#despues').attr("src", Techo.db.fotos_satelitales[clickedNeighbor.data.id]["2016"]);
      }
    }
  } else {
    $('#antes').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
    $('#despues').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
  }
}
