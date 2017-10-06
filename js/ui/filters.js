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

function filtersInit(dataName, cb) {

  loadFilters(fail, success);

  function success(filters) {
    Techo.filters = filters;
    var database = new MathSet(Techo.db.r2016);

    attachFiltersToDOM();
    cb();
  }

  function fail(err) {
    console.error(err);
    console.error("No se encontraron los filtros");
  }

  log("🔌", "filters module loaded");
}

function filterLayer(layer) {
  layer = new MathSet(layer);
  if (Techo.filters) {
    var createdFilters = {};

    for (var i in appliedFilters) {
      if (!appliedFilters[i]) {
        continue;
      }
      var filter = Techo.filters[i];
      var label = Techo.filters[i].subcategory || Techo.filters[i].category || Techo.filters[i].title
      if (createdFilters[label] === undefined) {
        createdFilters[label] = [];
      }

      if (filter.rules.length == 2) {
        createdFilters[label].push(new Filter({
          property: filter.rules[0].field,
          operator: "fn",
          expected: (function(rules){
            return function(value) {
              var evaluate = true;
              for (var r in rules) {
                var rule = rules[r];
                switch(rule.operator){
                  case "gt":
                    if (value > rule.value ) {
                      evaluate = evaluate && true;
                    } else {
                      evaluate = false;
                    }
                    break;
                  case "lt":
                    if (value < rule.value ) {
                      evaluate = evaluate && true;
                    } else {
                      evaluate = false;
                    }
                    break;
                  case "lte":
                    if (value <= rule.value ) {
                      evaluate = evaluate && true;
                    } else {
                      evaluate = false;
                    }
                    break;
                  case "gte":
                    if (value >= rule.value ) {
                      evaluate = evaluate && true;
                    } else {
                      evaluate = false;
                    }
                    break;
                }
              }

              return evaluate;
            };
          })(filter.rules)
        }));
      } else {
        createdFilters[label].push(new Filter({
          property: filter.rules[0].field,
          operator: filter.rules[0].operator,
          expected: filter.rules[0].value
        }));
      }
    }

    for (var i in createdFilters) {
      var createdFilter = createdFilters[i];
      layer = layer.filter(createdFilter);
    }
  }
  var relevado = new Filter({
    property: "identificar",
    operator: "fn",
    expected: function(v) {return v !== undefined;}
  });

    var r2013 = new Filter({
        property: "id",
        operator: "fn",
        expected: function(v) {return !isNaN(parseInt(v));}
    });

    return layer.filter(relevado, r2013).toObject();
}

function applyFilter(layer, filter) {
  var keys = Object.keys(layer);
  var filteredIndexes = [];
  var createdFilters = [];

  for (var i in keys) {
    var layerItem = layer[keys[i]];
    var passed = true;

    for (var r in filter.rules) {
      var rule = filter.rules[r];

      var valueA = layerItem[rule.field];
      valueA = typeof valueA === "string" ? valueA.toLowerCase() : valueA;
      var valueB = rule.value;
      valueB = typeof valueB === "string" ? valueB.toLowerCase() : valueB;
      var operator = rule.operator;
      passed &= testOperation(valueA, valueB, operator);
    }

    if (passed) {
      filteredIndexes[keys[i]] = layer[keys[i]];
    }
  }
  // return filteredIndexes;
  return (new MathSet(layer)).filter(createdFilters).toObject();
}

function testOperation(valueA, valueB, operator) {
  switch (operator) {
    case "eq":
      return valueA === valueB;
    case "lt":
      return valueA < valueB;
    case "gt":
      return valueA > valueB;
    case "lte":
      return valueA <= valueB;
    case "gte":
      return valueA >= valueB;
    case "not":
      return valueA !== valueB;
    default:
      return false;
  }
}

function loadFilters(fail, success) {
  $.ajax({
    url: "filters.json",
    dataType: 'json'
  })
    .done(success)
    .fail(fail);
}

function attachFiltersToDOM() {
  var $container = $(".filters-menu");
  var filters = Techo.filters;
  var structure = filterDOMStructure(filters);
  var titles = structure.titles;
  var categories = structure.categories;
  var subcategories = structure.subcategories;
  var items = structure.items;
  $parent = $container;
  for (var t in titles) {
    var title = titles[t];
    var $title = $("*[data-title='" + title.title + "']");
    if ($title[0]) {
      continue;
    }
    var $title = $("<div class='rows'><div class='toprow clickeable'><h6>" + title.title + "</h6> <span class='rowarrow'> </span></div><div class='botrow clickeable'><div data-title='" + title.title + "' class='blockin'></div></div></div></div>");
    $parent.append($title);
  }

  for (var c in categories) {
    var category = categories[c];
    var $category = $("*[data-category='" + category.category + "']");
    if ($category[0]) {
      continue;
    }
    $parent = $("*[data-title='" + category.title + "']");
    var $category = $("<div class='blockins'><div class='blocktops'><span>" + category.category + "</span><em class='arrowin'></em></div><div data-category='" + category.category + "' class='blockbots'></div></div>");
    $parent.append($category);
  }

  for (var s in subcategories) {
    var subcategory = subcategories[s];
    var $subcategory = $("*" + (subcategory.category ? "[data-category='" + subcategory.category + "'] " : "") + "[data-subcategory='" + subcategory.subcategory + "']");
    if ($subcategory[0]) {
      continue;
    }
    $parent = $("* [data-title='" + subcategories[s].title + "'] " +
      (subcategory.category ? " [data-category='" + subcategory.category + "']" : ""));
    var $subcategory = $("<div data-subcategory='" + subcategory.subcategory + "'><h6>" + subcategory.subcategory + "</h6></div>");
    $parent.append($subcategory);
  }

  for (var i in items) {
    var item = items[i];
    $parent = $("* [data-title='" + item.title + "'] " +
      (item.category ? "  [data-category='" + item.category + "'] " : "") +
      (item.subcategory ? "  [data-subcategory='" + item.subcategory + "']" : ""));

    var $item = $("<div class='checkbox'> <input type='checkbox' " + (item.checked ? "data-checked='true'" : "") + " value='" + item.filter + "' id='check_" + item.filter + "' class='fltrChkbx'> <label for='check_" + item.filter + "'>" + item.item + "</label> </div>");
    $parent.append($item);
  }

  initUI();
  countFiltersLabel();
  $(".f_chckbx").click(function () {
    $("#verresumen").css("background", "#FC6C44");
  });

  $(".fltrChkbx").click(function fltrChkbxClicked(evt) {
    $(this).addClass("loading");
    setTimeout((function(evt) {
      return function() {
        filterClickedEvent(evt);
      };
    })(evt), 100)
  });
}

function filterClickedEvent(evt) {
  /* TODO: Esta lógica necesita mejorar cuando este definido
   * el comportamiento de los filtros */

  if (evt) {
    appliedFilters = [];
    var checkStatus = evt.target.checked;
    evt.target.checked = checkStatus;
    $(".fltrChkbx").each(function (key, item) {
      appliedFilters[item.value] = item.checked;
    });
  }

  for (var i in activeLayers) {
    if (!activeLayers[i]) {
      continue;
    }
    hideLayer(i);
    showLayer(i);
  }
  countFiltersLabel();
  $(".fltrChkbx").removeClass("loading");
  deepLink();
}

function countFiltersLabel() {
  $(".filters-count .count-label").text(appliedFilters.filter(function (state) {return state}).length);
}

function filterDOMStructure(filters) {
  var filter;
  var structure = {
    titles: [],
    categories: [],
    subcategories: [],
    items: [],
    checked: false
  };

  for (var f in filters) {
    filter = filters[f];
    if (filter.title) {
      structure.titles.push({
        title: filter.title
      });
    }
    if (filter.category) {
      structure.categories.push({
        title: filter.title,
        category: filter.category
      })
    }
    if (filter.category && filter.subcategory) {
      structure.subcategories.push({
        title: filter.title,
        category: filter.category,
        subcategory: filter.subcategory
      })
    } else if (filter.subcategory) {
      structure.subcategories.push({
        title: filter.title,
        subcategory: filter.subcategory
      })
    }
    if (filter.item) {
      structure.items.push({
        title: filter.title,
        category: filter.category,
        subcategory: filter.subcategory,
        checked: filter.checked,
        item: filter.item,
        filter: f
      })
    }
    ;
  }
  return structure;
}
