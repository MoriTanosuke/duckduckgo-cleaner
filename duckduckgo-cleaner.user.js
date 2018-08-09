// ==UserScript==
// @name         Hide results
// @namespace    http://www.kopis.de/hide-domain/
// @version      0.2
// @description  Hides domains from search results on DuckDuckGo
// @author       Carsten Ringe <carsten@kopis.de>
// @match        https://duckduckgo.com/html/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

function getDomains() {
    let data = GM_getValue('blocked_domains', '[]');
    //console.log('returning', data);
    return JSON.parse(data);
}

function blockDomain(domain) {
    let domains = getDomains();
    domains.push(domain);
    let data = JSON.stringify(domains);
    //console.log('storing', data);
    GM_setValue('blocked_domains', data);
}

function getDomain(url) {
    let pos = url.indexOf('/');
    if (pos <= 0) return url;

    return url.substr(0, pos);
}

function addBlockLink(element, url) {
    let domain = getDomain(url);
    let blockThis = document.createElement('a');
    blockThis.innerHTML = 'block ' + domain;
    blockThis.href = '#';
    blockThis.onclick = function () {
        blockDomain(domain);
        return false;
    };
    element.parentElement.parentElement.appendChild(blockThis);
}

function removeResults() {
    let elements = document.getElementsByClassName('result__extras__url');
    //console.log(elements.length, 'results found');
    for (let i = 0; i < elements.length; i++) {
        let result = elements[i];

        if (result.children[1]) {
            let url = result.children[1].text.trim();

            // add a block link to all elements, we will remove blocked elements anyway
            addBlockLink(result, url);

            //console.log('url', url);
            let domains = getDomains();
            for (let j in domains) {
                let domain = domains[j];
                if (url.startsWith(domain)) {
                    //console.log('blocking', url, 'in result', result);
                    // remove 3rd parent of result
                    removeResult(result);
                }
            }
        }
    }
}

function removeResult(result) {
    let blocking = result.parentElement.parentElement.parentElement;
    //console.log('removing', blocking);
    blocking.remove();
}

function clearBlockList() {
    GM_setValue('blocked_domains', '[]');
}

(function () {
    'use strict';
    GM_registerMenuCommand('clear blocklist', clearBlockList, 'c');

    removeResults();
})();
