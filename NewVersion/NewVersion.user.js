// ==UserScript==
// @name         NewVersion
// @namespace    BBE CORP
// @version      0.1
// @description  Marque les nouvelles versions des PDF téléchargés
// @author       Seishin
// @match        http://www.black-book-editions.fr/mon_compte.php?a=pdf*
// @match        https://www.black-book-editions.fr/mon_compte.php?a=pdf*
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://github.com/ank-dev-team/bbe-monkey/raw/main/NewVersion/NewVersion.user.js
// @updateURL   https://github.com/ank-dev-team/bbe-monkey/raw/main/NewVersion/NewVersion.meta.js
// ==/UserScript==

/* global jQuery */
(function($){
    'use strict';
    var re = new RegExp('([0-3][0-9])/([0-1][0-9])/([0-9]{4})');
    $('table.table.table-hover.table-striped tbody tr').each(
        function(){
            let update = $(this).find('td:nth-child(3)').text();
            let download = $(this).find('td:nth-child(6)').text();
            if(download.trim() == ''){
                download = '01-01-1000';
            }
            update = update.replace(re, "$3-$2-$1");
            download = download.replace(re, "$3-$2-$1");

            if(update > download){
                $(this).css('color', 'red');
            }
        }
    );
})(jQuery.noConflict());

