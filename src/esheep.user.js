// ==UserScript==
// @name         web eSheep
// @namespace    http://esheep.petrucci.ch/
// @version      0.3
// @description  Add a sheep on your Google and Bing page!
// @author       Adriano
// @include      http*://*.google.*/*
// @include      http*://*.bing.*/*
// @icon         http://esheep.petrucci.ch/favicon.gif
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
