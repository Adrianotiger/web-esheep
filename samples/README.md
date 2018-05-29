## Demos

\* You can see all working demos directly on the GitHub webpage:
[https://adrianotiger.github.io/web-esheep/samples/](https://adrianotiger.github.io/web-esheep/samples/)

### Demo 1
[https://adrianotiger.github.io/web-esheep/samples/demo1.html](https://adrianotiger.github.io/web-esheep/samples/demo1.html)

Load and play the sheep on a webpage with 4 TAG-elements.
``
var esheep = new eSheep();
esheep.Start();
``

### Demo 2
[https://adrianotiger.github.io/web-esheep/samples/demo2.html](https://adrianotiger.github.io/web-esheep/samples/demo2.html)

Same as Demo 1, but with a custom animation. 
``
var esheep = new eSheep();
esheep.Start("https://[DOMAIN]/[PATH]/[SCRIPTNAME].xml");
``

### Demo 3
[https://adrianotiger.github.io/web-esheep/samples/demo3.html](https://adrianotiger.github.io/web-esheep/samples/demo3.html)

Same as Demo 1, but with some script parameters:
- allowPets will give the possibility to change pet directly over the popup window
- allowPopup flag can hide the popup, if you don't want see any credits
``
var esheep = new eSheep({allowPets:"all", allowPopup:"yes"});
esheep.Start();
``

