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

$('#nav ul').addClass('first_level');
$('#nav ul li ul').addClass('second_level');
$('#nav ul li ul li ul').addClass('third_level');
$('#nav ul li ul').removeClass('first_level');
$('#nav ul li ul li ul').removeClass('first_level');
$('#nav ul li ul li ul').removeClass('second_level');
$('a.menubtn').click(function(){
  $('ul.first_level').toggle();
});

if (window.innerWidth < 601) {
  $('ul.first_level li:has(ul)').on('click',function(){
    $(this).find('ul.second_level').slideToggle();
    return false;
  });

  $('ul.second_level li:has(ul)').on('click',function(){
    $(this).find('ul.third_level').slideToggle();
    return false;
  });

}
