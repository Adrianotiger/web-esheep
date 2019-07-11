
# web eSheep
Can you remember the nice sheep from the '90 years?<br />[![eSheep for 64bit systems](https://img.youtube.com/vi/xN90p16tKGE/0.jpg)](https://www.youtube.com/watch?v=xN90p16tKGE)

After a [C# project](https://github.com/Adrianotiger/desktopPet/) to see it again on Windows 64 bits, I wrote a simple script to see it again on the webpages.<br/>
It is only a script to import, so it is really simple to implement in your page. You have to write this to see the pet walking around your page:
```javascript
<head>
...
<script src="https://adrianotiger.github.io/web-esheep/dist/esheep.min.js"></script>
</head>
<body>
...
<script>
var sheep = new eSheep(); 
sheep.Start(); 
</script>
</body>
```


### And now?
Check out the demo, to see how integrate it in your webpage:
[https://adrianotiger.github.io/web-esheep/samples/](https://adrianotiger.github.io/web-esheep/samples/)

If you want create your animation, you can use the editor or find some other already-created animations on my webpage: [ehseep.petrucci.ch](http://esheep.petrucci.ch)

### Tampermonkey script
Do you have Firefox, Chrome, Opera or Edge? Add this sheep to Google and Bing search machines over this simple Tampermonkey script:
[esheep.user.js](https://adrianotiger.github.io/web-esheep/src/esheep.user.js)

### Browser limits
The most recent browsers doesn't allows cross requests over Javascript. So the script and the animation xml have to be on the same server. If you want load an xml from esheep, you have to insert the php script instead of the xml (it will create some special headers, so that the xml will be loaded).

### Credits
**Tatsutoshi Nomura** is the creator of the esheep and designed it for Fuji Television. This is only a copy, using some images found in the web.

# Build GitHub project
eSheep uses `yarn` to build it.  
### Set up build environment  
`yarn install --dev`  
### Build the files in `dist`
`yarn build`
