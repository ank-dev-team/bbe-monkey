// ==UserScript==
// @name        command_mark
// @namespace    BBE CORP
// @version      1.0
// @description  Marque les commandes reçues
// @author       Seishin
// @match       https://black-book-editions.fr/mon_compte.php?a=commande*
// @match       http://black-book-editions.fr/mon_compte.php?a=commande*
// @match       https://www.black-book-editions.fr/mon_compte.php?a=commande*
// @match       http://www.black-book-editions.fr/mon_compte.php?a=commande*
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://github.com/ank-dev-team/bbe-monkey/raw/main/CommandMark/CommandMark.user.js
// @updateURL   https://github.com/ank-dev-team/bbe-monkey/raw/main/CommandMark/CommandMark.meta.js
// ==/UserScript==




window.BASEURL = 'https://api.rpgservices.eu/bbe/api.php?type=command&action=';
window.SETURL = window.BASEURL + 'set&ref=';
window.UNSETURL = window.BASEURL + 'unset&ref=';
window.GETURL = window.BASEURL + 'get&ref=';


/* global jQuery */
(function($){
  'use strict';

  let head = $('head');

  let mycss = $('<style></style>');
  mycss.attr('type', 'text/css');
  mycss.text(`
  .delivered{
    background-color:#f77 !important;
    display:none;
  }
  .delivered:hover{
    background-color:red !important;
    color:white;
  }
  `);

  let myscript = $('<script></script>');

  myscript.attr('type', 'text/javascript');
  myscript.text(`
  function deliver(elem){
    let commande = $(elem).parent().parent().children().first().text();
    if($(elem).prop('checked')){
      $(elem).parent().parent().addClass('delivered');
      $.ajax({
        type: 'GET',
        url: window.SETURL + commande,
        crossDomain: true,
        dataType: 'json',
        success: function(responseData, textStatus, jqXHR){},
        error: function (responseData, textStatus, errorThrown){}
      });
    }
    else{
      $(elem).parent().parent().removeClass('delivered');
      $.ajax({
        type: 'GET',
        url: window.UNSETURL + commande,
        crossDomain: true,
        dataType: 'json',
        success: function(responseData, textStatus, jqXHR){},
        error: function (responseData, textStatus, errorThrown){}
      });

    }
  }
  function toggleDeliveredCommands(){
    let toggle = $('#toggleCheck');
    if(toggle.prop('checked')){
      $('table input[type=checkbox]:checked').parent().parent().toggleClass('delivered');
    }
    else{
      $('.delivered').toggleClass('delivered');
    }
  }
  `);

  head.append(mycss);
  head.append(myscript);

  let header = $('<th></th>');
  header.attr('class', 'aC');
  $('#main_content table thead tr:first').append(header);

  $('#main_content table tbody tr')
    .each(function(){
      let commande = $($(this)[0].firstChild).text();
      let delivery = $('<td></td>');
      let check = $('<input></input>');
      check.attr('type', 'checkbox');
      check.attr('value', commande);
      check.attr('onchange', 'deliver(this)');
      delivery.append(check);
      $(this).append(delivery);
      console.log(window.GETURL + commande);
      $.ajax({
        type: 'GET',
        url: window.GETURL + commande,
        crossDomain: true,
        // data: '{"some":"json"}',
        dataType: 'json',
        success: function(responseData, textStatus, jqXHR) {
          if(responseData.delivered){
            check.prop('checked', true);
            deliver(check);
          }
        },
        error: function (responseData, textStatus, errorThrown) {
          // console.log('GET failed !');
        }
      });

    }
  );
  let toggleCheck = $('<input type="checkbox" id="toggleCheck" onchange="toggleDeliveredCommands()" checked> <label for="toggleCheck"> Seulement les commandes non livrées</label>');
  $('#main_content h2.subtitle').append(' ').append(toggleCheck);
})(jQuery.noConflict());

