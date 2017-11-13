// ==UserScript==
// @name         web eSheep
// @namespace    http://esheep.petrucci.ch/
// @version      0.1
// @description  Add a sheep on your Google and Bing page!
// @author       Adriano
// @match        http*://*.google.com/*
// @match        http*://*.google.ch/*
// @match        http*://*.google.it/*
// @match        http*://*.google.de/*
// @match        http*://*.google.co.uk/*
// @match        http*://*.bing.com/*
// @match        http*://*.bing.ch/*
// @match        http*://*.bing.it/*
// @match        http*://*.bing.de/*
// @match        http*://*.bing.co.uk/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function() {
      var s = document.createElement("script");
      s.addEventListener("load", function() {var sheep = new eSheep(); sheep.Start("https://adrianotiger.github.io/web-esheep/src/animation.xml"); });
      s.setAttribute("src", "https://adrianotiger.github.io/web-esheep/src/esheep.js");
      document.getElementsByTagName('head')[0].appendChild(s);
    });
})();
