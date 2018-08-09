// ==UserScript==
// @name         Hide results
// @namespace    http://www.kopis.de/hide-domain/
// @version      0.1
// @description  Hides domains from search results on DuckDuckGo
// @author       Carsten Ringe <carsten@kopis.de>
// @match        https://duckduckgo.com/html/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let domains = [];

    let elements = document.getElementsByClassName('result__extras__url');
    //console.log(elements.length, 'results found');
    for (let i = 0; i < elements.length; i++) {
        let result = elements[i];
        if (result.children[1]) {
            let url = result.children[1].text.trim();
            //console.log('url', url);
            for (let j in domains) {
                let domain = domains[j];
                if (url.startsWith(domain)) {
                    //console.log('blocking', url, 'in result', result);
                    // remove 3rd parent of result
                    let blocking = result.parentElement.parentElement.parentElement;
                    //console.log('removing', blocking);
                    blocking.remove();
                }
            }
        }
    }
})();
