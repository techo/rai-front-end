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

var selectizeArr = [];

$(document).ready(function () {
  splash();
  searchResultClick();
  showChartsClick();
  showTablesClick();
  summaryButton();
  downloadButton();
  tablesLinkClick();
  idvtMenu();
});

function idvtMenu() {
  var $idvtMainOptions = $(".idvt-main-option");
  var $allIndicatorItems = $(".idvt-wrapper input");
  $idvtMainOptions.each(function(index) {
    var $idvtMainOption = $($idvtMainOptions[index]);
    var $idvtChildOptions = $idvtMainOption.siblings(".idvt-item").find("input");

    $idvtMainOption.click(function() {
      var $this = $(this);
      $allIndicatorItems.not($idvtMainOption)
        .attr("checked", false)
        .prop("checked", false);
      $idvtMainOption.prop("checked", true);
      $idvtMainOption.attr("checked", true);
      $idvtChildOptions.attr("checked", true);
      $idvtChildOptions.prop("checked", true);
      activeIndicator = $this.attr('data-indicator');
      updateLayer();
    });

    $idvtChildOptions.click(function() {
      var $this = $(this);
      var parentId = "#" + $idvtChildOptions.attr("data-parent");
      var $idvtMainOption = $idvtChildOptions.parent().parent().find(parentId);
      $allIndicatorItems.not($this)
        .attr("checked", false)
        .prop("checked", false);
      $idvtMainOption.attr("checked", true);
      $idvtMainOption.prop("checked", true);
      $this.prop("checked", true);
      $this.attr("checked", true);
      activeIndicator = $this.attr('data-indicator');
      updateLayer();
    });
  });
}

function downloadButton() {
  var $downloadForm = $("#downloadForm");
  var $downloadRequest = $("#downloadRequest");
  var $downloadFormButton = $(".form-download-button");
  var $downloadMenu = $(".download-menu");
  var $downloadUserData = $(".download-user-data");

  /* Limpia localstorage */
  localStorage.removeItem("downloadName");
  localStorage.removeItem("downloadEmail");
  localStorage.removeItem("downloadInstitution");
  localStorage.removeItem("downloadComplete");

  $downloadForm.submit(function (evt) {
    var data = filterLayer(getNeighbors(clickedNeighbor));
    var requestData = [];
    for (var i in data) {
      requestData.push(i);
    }
    $downloadRequest.val(requestData.join(','));
  });

  $downloadFormButton.click(function (ev) {
    ev.preventDefault();
    submitDownload();
  })
  $(".download-user-data input").keydown(function (evt) {
    if (evt.keyCode === 13) {
      submitDownload();
    }
  })

  function submitDownload() {
    var name = $("#user_name").val();
    var institution = $("#user_institution").val();
    var email = $("#user_email").val();
    var validEmail = (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).test(email);

    if (name && validEmail) {
      localStorage.setItem("downloadName", name);
      localStorage.setItem("downloadInstitution", institution);
      localStorage.setItem("downloadEmail", email);

      $.ajax({
        url: 'formulario/guardarDatosFormularioDescarga.php',
        type: 'POST',
        data: {
          "nombre": localStorage.downloadName,
          "organizacion": localStorage.downloadInstitution,
          "email": localStorage.downloadEmail
        },
        dataType: 'json'
      })
        .done(function (data) {
          $downloadMenu.addClass("slider");
          $downloadUserData.removeClass("slider");
          localStorage.setItem("downloadCompleted", true);
        })
        .fail(function () {
          $(".request-error").addClass("active");
        });
      return;
    }

    if (name === "") {
      $("#user_name").css("outline", "1px solid red");
    } else {
      $("#user_name").css("outline", "1px solid #d9d9d9");
    }
    if (!validEmail) {
      $("#user_email").css("outline", "1px solid red");
    } else {
      $("#user_email").css("outline", "1px solid #d9d9d9");
    }
  }
}

function searchResultClick() {
  $("#fichaPorcentajes .closePorcentajes, .show-map a, .show-table a").click(function (ev) {
    ev.preventDefault();
    closeCharts();
  });
  $("#fichaTablas .closeTabla, .show-map a, .show-charts a").click(function (ev) {
    ev.preventDefault();
    closeTables();
  });
}

function setButtonsStatus(hide) {
  if (hide) {
    $(".show-charts, .show-table, .show-charts-summary, .show-tables-summary").addClass("disabled");
  } else {
    $(".show-charts, .show-table, .show-charts-summary, .show-tables-summary").removeClass("disabled");
  }
}

function showChartsClick() {
  $("#show_charts, #show_charts_summary").click(function (ev) {
    ev.preventDefault();
    openChartsModal();
  });
}

function openChartsModal() {
  if ($(".show-charts").hasClass("active")) return;
  $('.filter-compile').removeClass('active');
  $('#fichaBarrio').css('display', 'none');
  $(".show-map").removeClass("active");
  $(".show-table").removeClass("active");
  $(".show-charts").addClass("active");
  $(".ficha-tablas").hide();
  $("li.slider").removeClass("slider");
  neighborPercentages(clickedNeighbor);
  openedCharts = true;
  openedDetails = false;
  deepLink();
}

function showTablesClick() {
  $(".show-table, #show_tables_summary, #show_neighbors").click(function (ev) {
    ev.preventDefault();
    openTableModal();
  });
}

function openTableModal() {
  if ($(".show-table").hasClass("active")) return;
  $('.filter-compile').removeClass('active');
  $('#fichaBarrio').css('display', 'none');
  $(".show-map").removeClass("active");
  $(".ficha-porcentajes").hide();
  $(".show-charts").removeClass("active");
  $(".show-table").addClass("active");
  $("li.slider").removeClass("slider");
  crearTablaDeDatos(clickedNeighbor);
  openedTable = true;
  openedDetails = false;
  deepLink();
}

function tablesLinkClick() {
  $(".ficha-tablas").on("click", ".table-neighbor", function (ev) {
    ev.preventDefault();
    var $el = $(ev.target);
    var clickedNeighbor = {
      id: $el.attr("data-id"),
      type: $el.attr("data-type"),
      provincia: $el.attr("data-provincia"),
      departamento: $el.attr("data-departamento"),
      localidad: $el.attr("data-localidad"),
      nombre_barrio: $el.attr("data-barrio")
    };
    centerZone(clickedNeighbor);
    closeTables();
  });
}

function summaryButton() {
  var $summaryButton = $(".ver-resumen");
  var $summaryCloseButton = $(".filter-compile .closebfc");
  var $editFilters = $(".editf");

  $summaryButton.click(function (ev) {

    ev.preventDefault();

    layerData = Techo.db["r2016"];

    /* filtra los poligonos */
    var EXCLUDE_DEFINITIONS = false;
    var filteredLayerIds = filterLayer(getNeighbors(clickedNeighbor));

    var families = countFamilies(filteredLayerIds, EXCLUDE_DEFINITIONS);

    var settlements = countSettlements(filteredLayerIds, EXCLUDE_DEFINITIONS);

    var $filtersContainer = $(".filtros-aplicados");
    $filtersContainer.html('');

    var DOMFilters = "";

    /* arma el texto de cada filtro aplicado */
    var filterName = "";
    switch (clickedNeighbor.type) {
      case "nombre_barrio":
        filterName += clickedNeighbor.nombre_barrio + ", ";
      case "localidad":
        filterName += clickedNeighbor.localidad + ", ";
      case "departamento":
        filterName += clickedNeighbor.departamento + ", ";
      case "provincia":
        filterName += clickedNeighbor.provincia;
    }

    DOMFilters += "<div class='blkin'><h6>" + filterName + " </h6> </div>"
    for (var i in appliedFilters) {
      if (appliedFilters[i] === false) {
        continue;
      }
      var filter = Techo.filters[i];
      filterName = "";
      if (filter.title) {
        filterName += filter.title + " > "
      }
      if (filter.category) {
        filterName += filter.category + " > "
      }
      if (filter.subcategory) {
        filterName += filter.subcategory + " > "
      }
      if (filter.item) {
        filterName += filter.item
      }
      DOMFilters += "<div class='blkin'><h6>" + filterName + " </h6> </div>"
    }

    /* agrega los datos de los filtros aplicados al resumen */
    $filtersContainer.append($(DOMFilters));

    $(".cantidad-asentamientos").text(settlements)
    $(".cantidad-familias").text(families)

    /* muestra el resumen */
    $(".filter-compile").addClass("active");
    $(".first, .last").removeClass("slider");
  });

  $summaryCloseButton.click(function (ev) {
    ev.preventDefault();
    $(".filter-compile").removeClass("active");
  });

  $editFilters.click(function (ev) {
    ev.preventDefault();
    $(".filter-compile").removeClass("active");
    $(".filters-slider").addClass("slider");
  })
}

function countFamilies(layerIds, excludeDefinitions) {
  /* cuenta las familias de esos poligonos filtrados */
  var families = 0;

  for (var f in layerIds) {
    if (excludeDefinitions && layerIds[f].identificar !== "cumple con la definición") {
      continue;
    }
    families += parseInt(layerIds[f].cantidad_de_familias) || 0;
  }
  return families;
}

function countSettlements(layerIds, excludeDefinitions) {
  /* cuenta la cantidad de poligonos filtrados */
  var calc = Object.keys(layerIds).filter(function (index) {
    return !excludeDefinitions || layerIds[index].identificar === "cumple con la definición";
  }).length;
  /* fix numero asentamientos para nacion */
  $('.nacion-fix-alert').hide();
  $('.caba-fix-alert').hide();
  if (clickedNeighbor.type === undefined || clickedNeighbor.type === 'pais') {
    // return calc-6;
    if (appliedFilters.filter(function(item) {return item}).length == 1 && appliedFilters[2] == true) {
        $('.nacion-fix-alert').show();
    }
  }
  /* fix numero asentamientos para ciudad de buenos aires */
  if (clickedNeighbor.type === "provincia" && clickedNeighbor.provincia.toLowerCase() === "ciudad autónoma de buenos aires") {
      if (appliedFilters.filter(function(item) {return item}).length == 1 && appliedFilters[2] == true) {
          $('.caba-fix-alert').show();
      }

  }

  return calc;
}

function splash() {

  var splashScreen = $(".homepopup");
  var splashClose = $(".homepopup .closep");
  var splashGoToMap = $(".btns.btns1");

  splashClose.click(function (ev) {
    ev.preventDefault();
    splashScreen.fadeOut();
  });

  splashGoToMap.click(function (ev) {
    ev.preventDefault();
    splashScreen.fadeOut();
  });
}

function hideLoader() {
  $(".homepopupin .btns1").html('<i class="icon-location-1 icon"></i><span>Ingresar al mapa</span>');
}

function showSplashFirstTime() {
  var splashScreen = $(".homepopup");
  if (localStorage.notFirstTime !== "true") {
    splashScreen.show();
    localStorage.setItem("notFirstTime", true);
  }
  $(".main-container").fadeIn(1000);
}

function closeCharts() {
  if ($(".show-map").hasClass("active")) {
    return;
  }
  if ($(".show-table").hasClass("active")) {
    return;
  }
  $('#fichaPorcentajes').css("display", "none")
  $(".show-map").addClass("active");
  $(".show-charts").removeClass("active");
  Techo.charts.agua.highcharts().destroy();
  Techo.charts.luz.highcharts().destroy();
  Techo.charts.energia_calefaccion.highcharts().destroy();
  Techo.charts.energia_cocinar.highcharts().destroy();
  Techo.charts.excretas.highcharts().destroy();
  openedCharts = false;
  deepLink();
}

function closeTables() {
  if ($(".show-map").hasClass("active")) {
    return;
  }
  if ($(".show-charts").hasClass("active")) {
    return;
  }
  $('#fichaTablas').css("display", "none")
  $(".show-map").addClass("active");
  $(".show-table").removeClass("active");
  Techo.tables.destroy();
  openedTable = false;
  deepLink();
}

function deepLink() {
  if (!canSaveDeepLink) {
    return;
  }

  var filters = appliedFilters;
  filters = filters.map(function (item, index) {return item ? index : null;});
  filters = filters.filter(function (item) {return item !== null;});
  var layers = activeLayers;
  layers = Object.keys(layers);
  layers = layers.filter(function (i) {return activeLayers[i];});
  var link = [];

  link.push("latlng=" + actualLatLng.join(','));
  link.push("z=" + actualZoom);
  link.push("l=" + actualLayer);
  link.push("f=" + filters.join(","));
  link.push("y=" + layers.join(","));
  link.push("chart=" + +openedCharts);
  link.push("table=" + +openedTable);
  link.push("details=" + +openedDetails);
  link.push("detailsTab=" + +openedSatellital);
  link.push("nid=" + nid);

  if (clickedNeighbor.type) {
    link.push("type=" + btoa(clickedNeighbor.type));
    switch (clickedNeighbor.type) {
      case "nombre_barrio":
        if (clickedNeighbor.nombre_barrio) link.push("ba=" + btoa(clickedNeighbor.nombre_barrio));
      case "localidad":
        if (clickedNeighbor.localidad) link.push("lc=" + btoa(clickedNeighbor.localidad));
      case "departamento":
        if (clickedNeighbor.departamento) link.push("dp=" + btoa(clickedNeighbor.departamento));
      case "provincia":
        if (clickedNeighbor.provincia) link.push("pr=" + btoa(clickedNeighbor.provincia));
    }
  }
  var strLink = "?" + link.join("&");
  window.history.pushState(null, "Relevamiento de Asentamientos Informales - Techo 2016", strLink);
}

function saveDeepLinkState() {
  deepLinkState = location.search ? location.search.split("?")[1].split("&") : "";
}

function loadDeepLinkState() {
  var link = deepLinkState;
  if (!link) {
    /* TODO: Hack allowing for show only neighbors applying the definition */
    (function showSettlementsByDefault() {
        $('*[data-checked=true]').each(function (index, item) {
            $(item).attr('checked', true);
            filterClickedEvent({target: item});
        });
    })();
    centerMap();
    canSaveDeepLink = true;
    return;
  }

  var params = {};
  for (var i in link) {
    var pair = link[i].split("=");
    params[pair[0]] = pair[1];
  }

  var latlng = params.latlng ? params.latlng.split(",") : actualLatLng;
  var zoom = params.z ? +params.z : actualZoom;
  var filterIndexes = params.f ? params.f.split(",") : "";
  var layers = params.y ? params.y.split(",") : ['r2016'];
  var mapLayer = params.l || "mapa";
  var openedCharts = params.chart;
  var openedTable = params.table;
  var openedSatellital = params.detailsTab;
  var openedDetails = params.details;
  var nid = params.nid;

  if (+openedCharts) openChartsModal();
  if (+openedTable) openTableModal();

  if (+openedDetails) openDetails(nid);
  if (+openedSatellital) $(".fotoSatelital a").click();

  changeMapLayerStyle(mapLayer);

  clickedNeighbor = {
    type: params.type ? atob(params.type) : null,
    provincia: params.pr ? atob(params.pr) : null,
    departamento: params.dp ? atob(params.dp) : null,
    localidad: params.lc ? atob(params.lc) : null,
    nombre_barrio: params.ba ? atob(params.ba) : null
  };

  setButtonsStatus(clickedNeighbor.type === 'nombre_barrio');

  $("#search_input").val(clickedNeighbor[clickedNeighbor.type]);

  for (var i in activeLayers) {
    if (layers && layers.filter(function (item) {return item === i;}).length) {
      $("[value=" + i + "]").prop("checked", true);
      activeLayers[i] = true;
    } else {
      activeLayers[i] = false;
      $("[value=" + i + "]").prop("checked", false);
      hideLayer(i);
    }
  }

  countLayersLabel();
  Techo.mapa.map.setView([latlng[0] || actualLatLng[0], latlng[1] || actualLatLng[0]], zoom);
  for (var i in filterIndexes) {
    var index = filterIndexes[i];
    $($("#check_" + index)).prop("checked", true);
    appliedFilters[index] = true;
  }

  for (var i in appliedFilters) {
    if (filterIndexes.filter(function (item) {return item == i}).length == 0) {
      $($("#check_" + i)).prop("checked", false);
      appliedFilters[i] = false;
    }
  }

  filterClickedEvent(null, true);
  canSaveDeepLink = true;
}

function selectSelectize() {
  var $select = $('#search_input').selectize({

    options: [{value:'argentina', provincia:'Argentina', indexValue:'argentina', type:'pais'}].concat(objToArr(Techo.db.r2016)),
    searchField: 'value',
    valueField: 'indexValue',
    labelField: 'value',
    optgroups: [
      {value: 'pais', label: 'País'},
      {value: 'provincia', label: 'Provincia'},
      {value: 'departamento', label: 'Departamento'},
      {value: 'localidad', label: 'Localidad'},
      {value: 'nombre_barrio', label: 'Asentamiento'},
    ],
    optgroupField: 'type',
    maxItems: 1,
    maxOptions: 100000,
    lockOptgroupOrder: true,
    onFocus: function() {
      setTimeout(function(){

      closeCharts();
      closeTables();
      $('#fichaBarrio').css('display', 'none');
      $('.sidebar .topc ul li.slider').removeClass('slider');
      $('.sidebar .bottomc ul li.slider').removeClass('slider');
      $('.filter-compile').removeClass('active');
      },0);
    },
    onChange: function (ev) {
      var item = selectizeArr[ev];
      if (item) {
          clickedNeighbor = {
              id: item.id,
              type: item.type,
              provincia: item.provincia,
              departamento: item.departamento,
              localidad: item.localidad,
              nombre_barrio: item.nombre_barrio
          };
      }

      if (item == undefined) {
          clickedNeighbor = {value:'argentina', provincia:'Argentina', indexValue:'argentina', type:'pais'};
      } else if (item.no_relevado) {
          return;
      }

      setButtonsStatus(clickedNeighbor.type === 'nombre_barrio');
      $("#search_input").val(clickedNeighbor[clickedNeighbor.type]);
      centerZone(clickedNeighbor);
      actualZoom = Techo.mapa.map._zoom;
      actualLatLng = [Techo.mapa.map._lastCenter.lat, Techo.mapa.map._lastCenter.lng];

      for (var i in activeLayers) {
        if (!activeLayers[i]) {
          continue;
        }
        hideLayer(i);
        showLayer(i);
      }
      deepLink();
    },
    onType: function (chars) {
      if (chars.length > 3) return;
      $(".optgroup").each(function (index, optgroup) {
        $(optgroup).find(".selectize-result").each(function (index, option) {
          if (index > 2) {
            option.remove();
          }
        })
      });
    },
    render: {
      item: function (item, escape) {
        var head = "";
        var description = "";
        switch (item.type) {
          case "nombre_barrio":
            head = item.nombre_barrio;
            description = item.localidad + ", " + item.departamento + ", " + item.provincia;
            break;
          case "localidad":
            head = item.localidad;
            description = item.departamento + ", " + item.provincia;
            break;
          case "departamento":
            head = item.departamento;
            description = item.provincia;
            break;
          case "provincia":
            head = item.provincia;
            break;
          case "pais":
            head = "Argentina";
            break;
        }
        var norelevado = item.no_relevado ? 'no-relevado' : '';
        return '<div class="selectize-result '+ norelevado +'"' +
          ' data-id="' + item.id + '"' +
          ' data-type="' + item.type + '"' +
          ' data-provincia="' + item.provincia + '"' +
          ' data-departamento="' + item.departamento + '"' +
          ' data-localidad="' + item.localidad + '"' +
          ' data-barrio="' + item.barrio + '"' +
          '><span class="head-search">' + head + ' </span></span></div>';
      },
      option: function (item, escape) {
        var head = "";
        var description = "";
        switch (item.type) {
          case "nombre_barrio":
            head = item.nombre_barrio;
            description = item.localidad + ", " + item.departamento + ", " + item.provincia;
            break;
          case "localidad":
            head = item.localidad;
            description = item.departamento + ", " + item.provincia;
            break;
          case "departamento":
            head = item.departamento;
            description = item.provincia;
            break;
          case "provincia":
            head = item.provincia;
            break;
          case "pais":
            head = "Argentina";
            break;
        }
        var norelevado = item.no_relevado ? 'no-relevado' : '';
        return '<div class="selectize-result '+ norelevado +'"><span class="head-search">' + head + ' </span><span class="description-search">' + description + '</span></div>';
      },
      optgroup_header: function (data, escape) {
        return '<div class="optgroup-header opt-' + escape(data.label) + '">' + escape(data.label) + '</span></div>';
      }
    }
  });
}

function objToArr(obj) {
  var objProv = {};
  var objDep = {};
  var objLoc = {};
  var objBa = {};
  var arrProv = [];
  var arrDep = [];
  var arrLoc = [];
  var arrBa = [];

  for (var i in obj) {
    if (obj[i].id === undefined) {
      continue;
    }
    var provincia = obj[i].provincia;
    var departamento = obj[i].departamento;
    var localidad = obj[i].localidad;
    var nombre_barrio = obj[i].nombre_barrio;
    var no_relevado = obj[i].no_relevado;
    var index = CryptoJS.MD5(provincia).toString();
    objProv[index] = {
      type: "provincia",
      value: provincia,
      nombre_barrio: nombre_barrio,
      localidad: localidad,
      departamento: departamento,
      provincia: provincia,
      no_relevado: no_relevado
    };
    var index = CryptoJS.MD5(provincia + departamento).toString();
    objDep[index] = {
      type: "departamento",
      value: departamento,
      nombre_barrio: nombre_barrio,
      localidad: localidad,
      departamento: departamento,
      provincia: provincia,
      no_relevado: no_relevado
    };
    var index = CryptoJS.MD5(provincia + departamento + localidad).toString();
    objLoc[index] = {
      type: "localidad",
      value: localidad,
      nombre_barrio: nombre_barrio,
      localidad: localidad,
      departamento: departamento,
      provincia: provincia,
      no_relevado: no_relevado
    };

    var index = CryptoJS.MD5(provincia + departamento + localidad + nombre_barrio).toString();
    objBa[index] = {
      type: "nombre_barrio",
      value: nombre_barrio,
      nombre_barrio: nombre_barrio,
      localidad: localidad,
      departamento: departamento,
      provincia: provincia,
      no_relevado: no_relevado,
      id: obj[i].id
    };
  }

  for (var i in objProv) {
    if (objProv[i].value === "") continue;
    selectizeArr.push(objProv[i])
  }

  for (var i in objDep) {
    if (objDep[i].value === "") continue;
    selectizeArr.push(objDep[i])
  }

  for (var i in objLoc) {
    if (objLoc[i].value === "") continue;
    selectizeArr.push(objLoc[i])
  }

  for (var i in objBa) {
    if (objBa[i].value === "") continue;
    selectizeArr.push(objBa[i])
  }

  selectizeArr.sort(function (itemA, itemB) {
    if (itemA.value > itemB.value) return 1
    if (itemA.value < itemB.value) return -1
    return 0;
  });


  selectizeArr.sort(function (itemA, itemB) {
    if (itemA.type == itemB.type) return 0;
    if (itemA.type == "provincia") return 1;
    if (itemB.type == "provincia") return -1;
    if (itemA.type == "departamento") return 1;
    if (itemB.type == "departamento") return -1;
    if (itemA.type == "localidad") return 1;
    if (itemB.type == "localidad") return -1;
    if (itemA.type == "nombre_barrio") return 1;
    return -1;
  });
  selectizeArr.reverse()

  for (var i in selectizeArr) {
    selectizeArr[i].indexValue = i;
  }

  return selectizeArr
}

function centerMap() {
  var initialMapCenter = {
    id: "",
    type: "provincia",
    provincia: "Buenos Aires",
    departamento: "",
    localidad: "",
    nombre_barrio: ""
  };
  centerZone(initialMapCenter);
}

function updateLayer() {
  for (var i in activeLayers) {
    if (!activeLayers[i]) {
      continue;
    }
    hideLayer(i);
    showLayer(i);
  }
}
