/*
 * Project: 
 *                eSheep - Webpage
 * 
 * Date:    
 *                13.november 2017
 * 
 * Author:
 *                Adriano Petrucci (http://esheep.petrucci.ch)
 * 
 * Version:       0.6
 * 
 * Introduction:
 *                As "wrapper" for the OpenSource C# project
 *                (see https://github.com/Adrianotiger/desktopPet), 
 *                this javascript "class" was written to get the animations also inside your
 *                webpage. It doesn't work like the Windows version, but show much animations from it.
 * 
 * Description:
 *                Add a walking pet (sheep to your home page) with just a few lines of code!
 *                Will add a lovely sheep (stray sheep) and this will walk around your page and over
 *                all <hr>s and <div>s with a border. You can also select another animation, using your 
 *                personal XML file or one from the database.
 * 
 * How to use:    
 *                Add this line in your <header>:
 *                <script src="http://esheep.petrucci.ch/script/DesktopPet.js"></script>
 *                Add this lines in your <body> (at the end if possible):
 *                <script>
                    var pet = new ESheep();
                    pet.Start('http://esheep.petrucci.ch/script/animation.xml');
                  </script>
 *                That's all!
 * 
 * Requirement:   
 *                Tested on IE11, Edge and Opera 
 * 
 * Changelog:
 *                Version 0.6 - 13.11.2017:
 *                  - better Javascript structure
 *                  - GitHub version (https://github.com/Adrianotiger/web-esheep)
 *                Version 0.5 - 12.07.2017:
 *                  - animations starts only once the image was loaded (thanks RedSparr0w)
 *                Version 0.x:
 *                  - still beta versions...
 */

var DesktopPetVersion = '0.6';

class DesktopPet
{
  start_esheep()
  {
    alert("Deprecated, use new x=eSheep and x.Start() to start new eSheep.");
  }
}
  
class eSheep
{
  constructor()
  {    
    this.DOMdiv = document.createElement("div");
    this.DOMimg = document.createElement("img");
    this.DOMinfo = document.createElement("div");
    
    this.parser = new DOMParser();
    this.xmlDoc = null;
    
    this.tilesX = 1;
    this.tilesY = 1;
    this.imageW = 1;
    this.imageH = 1;
    this.imageX = 1;
    this.imageY = 1;
    this.flipped = false;
    this.dragging = false;
    this.infobox = false;
    this.animationId = 0;
    this.animationStep = 0;
    this.animationNode = null;
    this.sprite = new Image();
    this.HTMLelement = null;
    this.randS = Math.random() * 100;
    
    this.screenW = window.innerWidth
                  || document.documentElement.clientWidth
                  || document.body.clientWidth;
  
    this.screenH = window.innerHeight
                  || document.documentElement.clientHeight
                  || document.body.clientHeight;
  }
    
  Start(animation)
  {
    animation = typeof animation !== 'undefined' ? animation : "http://esheep.petrucci.ch/script/animation.php";
  
    var ajax = new XMLHttpRequest();
    var sheepClass = this;
        
    ajax.open("GET", animation, true);
    ajax.onreadystatechange = function()
    {
      if(this.readyState == 4)
      {
        if(this.status == 200)
        {
          sheepClass._parseXML(this.responseText);
          sheepClass._spawnESheep();
        }
        else{
          alert("XML not available:" + this.statusText);
        }
      }
    }
    ajax.send(null);
  }
  
  _parseXML(text)
  {
    this.xmlDoc = this.parser.parseFromString(text,'text/xml');
    var image = this.xmlDoc.getElementsByTagName('image')[0]; 
    this.tilesX = image.getElementsByTagName("tilesx")[0].textContent;
    this.tilesY = image.getElementsByTagName("tilesy")[0].textContent;
    //this.sprite.src = 'data:image/png;base64,data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';
    this.sprite.addEventListener("load", function(e) 
    {
      //console.log("image loaded");
      var attribute = 
      "width:" + (this.sprite.width) + "px;" +
      "height:" + (this.sprite.height) + "px;" +
      "position:absolute;" + 
      "top:0px;" + 
      "left:0px;";
      this.DOMimg.setAttribute("style", attribute);
      this.DOMimg.ondragstart = function() { return false; };
      this.imageW = this.sprite.width / this.tilesX;
      this.imageH = this.sprite.height / this.tilesY;
      this.imageX = 0;
      this.imageY = this.screenH - this.sprite.height / this.tilesY;
      attribute = 
        "width:" + (this.imageW) + "px;" +
        "height:" + (this.imageH) + "px;" +
        "position:fixed;" + 
        "top:" + (this.imageY) + "px;" + 
        "left:" + (this.imageX) + "px;" + 
        "transform:rotatey(0deg);" +
        "cursor:move;" +
        "z-index:2000;" +
        "overflow:hidden;"; 
      this.DOMdiv.setAttribute("style", attribute);
      this.DOMdiv.appendChild(this.DOMimg);
    }.bind(this));

    this.sprite.src = 'data:image/png;base64,' + image.getElementsByTagName("png")[0].textContent;
    this.DOMimg.setAttribute("src", this.sprite.src);
    
    this.DOMdiv.addEventListener("mousemove", function(e)
    {
      if(!this.dragging && e.buttons==1 && e.button==0)
      {
        this.dragging = true;
        this.HTMLelement = null;
        var childsRoot = this.xmlDoc.getElementsByTagName('animations')[0];
        var childs = childsRoot.getElementsByTagName('animation');
        for(var k=0;k<childs.length;k++)
        {
          if(childs[k].getElementsByTagName('name')[0].textContent == "drag")
          {
            this.animationId = childs[k].getAttribute("id");
            this.animationStep = 0;
            this.animationNode = childs[k];
            break;
          }
        }
      }
    }.bind(this)); 
    document.body.addEventListener("mousemove", function(e)
    {
      if(this.dragging)
      {
        this.imageX = parseInt(e.clientX) - this.imageW/2;
        this.imageY = parseInt(e.clientY) - this.imageH/2;
        this.DOMdiv.style.left = this.imageX + "px";
        this.DOMdiv.style.top = this.imageY + "px";
      }
    }.bind(this)); 
    
    document.body.addEventListener("resize", function(e)
    {
      this.screenW = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

      this.screenH = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
                
      if(this.imageY + this.imageH > this.screenH)
      {
        this.imageY = this.screenH - this.imageH;
        this.DOMdiv.style.top = this.imageY + "px";
      }
      if(this.imageX + this.imageW > this.screenW)
      {
        this.imageX = this.screenW - this.imageW;
        this.DOMdiv.style.left = this.imageX + "px";
      }
    }.bind(this)); 
    
    this.DOMdiv.addEventListener("contextmenu", function(e) {
      e.preventDefault();
      return false;
    });
    
    this.DOMdiv.addEventListener("mouseup", function(e) {
      if(this.dragging)
      {
        this.dragging = false;
      }
      else if(this.infobox)
      {
        this.DOMinfo.style.display = "none";
        this.infobox = false;
      }
      else
      {
        this.DOMinfo.style.left = Math.min(this.screenW-200, Math.max(0, parseInt(this.imageX + this.imageW/2 - parseInt(this.DOMinfo.style.width)/2))) + "px";
        this.DOMinfo.style.top = parseInt(this.imageY - parseInt(this.DOMinfo.style.height)) + "px";
        this.DOMinfo.style.display = "block";
        this.infobox = true;
      }
    }.bind(this));
    
    this.DOMinfo.addEventListener("mouseup", function(e) {
      this.DOMinfo.style.display = "none";
      this.infobox = false;
    }.bind(this));
    
    var attribute =
      "width:200px;" +
      "height:100px;" +
      "position:fixed;" + 
      "top:100px;left:10px;" + 
      "display:none;" +
      "border-width:2px;" + 
      "border-radius:5px;" + 
      "border-style:ridge;" +
      "border-color:#0000ab;" +
      "text-align:center;" +
      "color:black;" +
      "opacity:0.9;" + 
      "z-index:9999;" +
      "overflow:auto;" + 
      "background: linear-gradient(to bottom right, rgba(128,128,255,0.7), rgba(200,200,255,0.4));";
    this.DOMinfo.setAttribute("style",attribute);
    this.DOMinfo.innerHTML = "<b>eSheep</b><sup style='float:right;'>ver: " + DesktopPetVersion + "</sup><br><hr>Visit the home page of this lovely sheep:<br><a href='http://esheep.petrucci.ch' target='_blank'>http://esheep.petrucci.ch</a>";
    document.body.appendChild(this.DOMinfo);
    document.body.appendChild(this.DOMdiv);
  };
  
  _setPosition(x, y, absolute)
  {
    if(absolute)
    {      
      this.imageX = x;
      this.imageY = y;
    }
    else
    {
      this.imageX = parseInt(this.imageX) + parseInt(x);
      this.imageY = parseInt(this.imageY) + parseInt(y);
    }
    
    this.DOMdiv.style.left = this.imageX + "px";
    this.DOMdiv.style.top = this.imageY + "px"; 
  }
  
  _spawnESheep()
  {
    var spawnsRoot = this.xmlDoc.getElementsByTagName('spawns')[0];
    var spawns = spawnsRoot.getElementsByTagName('spawn');
    var prob = 0;
    for(var i=0;i<spawns.length;i++)
      prob += parseInt(spawns[0].getAttribute("probability"));
    var rand = Math.random() * prob;
    prob = 0;
    for(i=0;i<spawns.length;i++)
    {
      prob += parseInt(spawns[i].getAttribute("probability"));
      if(prob >= rand)
      {
        this._setPosition(
          this._parseKeyWords(spawns[i].getElementsByTagName('x')[0].textContent), 
          this._parseKeyWords(spawns[i].getElementsByTagName('y')[0].textContent),
          true
        ); 
        this.animationId = spawns[i].getElementsByTagName('next')[0].textContent;
        this.animationStep = 0;
        var childsRoot = this.xmlDoc.getElementsByTagName('animations')[0];
        var childs = childsRoot.getElementsByTagName('animation');
        for(var k=0;k<childs.length;k++)
        {
          if(childs[k].getAttribute("id") == this.animationId)
          {
            this.animationNode = childs[k];
            break;
          }
        }
        break;
      }
    }
    this._nextESheepStep();
  }
  
  _parseKeyWords(value)
  {
    value = value.replace(/screenW/g, this.screenW); 
    value = value.replace(/screenH/g, this.screenH); 
    value = value.replace(/areaW/g, this.screenH); 
    value = value.replace(/areaH/g, this.screenH); 
    value = value.replace(/imageW/g, this.imageW); 
    value = value.replace(/imageH/g, this.imageH); 
    value = value.replace(/random/g, Math.random()*100);
    value = value.replace(/randS/g, this.randS);
    return eval(value);
  }
    
  _getNextRandomNode(parentNode)
  {
    var baseNode = parentNode.getElementsByTagName('next');
    var childsRoot = this.xmlDoc.getElementsByTagName('animations')[0];
    var childs = childsRoot.getElementsByTagName('animation');
    var prob = 0;
    
    if(baseNode.length == 0)
    {
      this._spawnESheep();
      return false;
    }
        
    for(var k=0;k<baseNode.length;k++)
    {
      prob += parseInt(baseNode[k].getAttribute("probability"));
    }
    var rand = Math.random() * prob;
    var index = 0;
    prob = 0;
    for(k=0;k<baseNode.length;k++)
    {
      prob += parseInt(baseNode[k].getAttribute("probability"));
      if(prob >= rand)
      {
        index = k;
        break;
      }
    }
    for(k=0;k<childs.length;k++)
    {
      if(childs[k].getAttribute("id") == baseNode[index].textContent)
      {
        this.animationId = childs[k].getAttribute("id");
        this.animationStep = 0;
        this.animationNode = childs[k];
        return true;
      }
    }
    return false;
  }

  _checkOverlapping()
  {
    var divs = document.body.getElementsByTagName('div');
    var hrs = document.body.getElementsByTagName('hr');
    
    var x = this.imageX;
    var y = this.imageY + this.imageH;
    var rect;
    var margin = 20;
    if(this.HTMLelement) margin = 5;
    for(var i=0;i<divs.length;i++)
    {
      rect = divs[i].getBoundingClientRect();
  
      if(y > rect.top - 2 && y < rect.top + margin)
      {
        if(x > rect.left && x < rect.right - this.imageW)
        {
          var style = window.getComputedStyle(divs[i]);
          if((style.borderTopStyle != "" && style.borderTopStyle != "none") && style.display != "none")
          {
            return divs[i];
          }
        }
      }
    }
    for(i=0;i<hrs.length;i++)
    {
      rect = hrs[i].getBoundingClientRect();
  
      if(y > rect.top - 2 && y < rect.top + margin)
      {
        if(x > rect.left && x < rect.right - this.imageW)
        {
          return hrs[i];
        }
      }
    }
    return false;
  }
  
  _getNodeValue(nodeName, valueName, defaultValue)
  {
    if(!this.animationNode || !this.animationNode.getElementsByTagName(nodeName)) return;
    if(this.animationNode.getElementsByTagName(nodeName)[0].getElementsByTagName(valueName)[0])
    {
      var value = this.animationNode.getElementsByTagName(nodeName)[0].getElementsByTagName(valueName)[0].textContent;
        
      return this._parseKeyWords(value);
    }
    else
    {
      return defaultValue;
    }
  }
    
  _nextESheepStep()
  {
    var x1 = this._getNodeValue('start','x',0);
    var y1 = this._getNodeValue('start','y',0);
    var off1 = this._getNodeValue('start','offsety',0);
    var opa1 = this._getNodeValue('start','opacity',1);
    var del1 = this._getNodeValue('start','interval',1000);
    var x2 = this._getNodeValue('end','x',0);
    var y2 = this._getNodeValue('end','y',0);
    var off2 = this._getNodeValue('end','offsety',0);
    var opa2 = this._getNodeValue('end','interval',1);
    var del2 = this._getNodeValue('end','interval',1000);
    
    var repeat = this._parseKeyWords(this.animationNode.getElementsByTagName('sequence')[0].getAttribute('repeat'));
    var repeatfrom = this.animationNode.getElementsByTagName('sequence')[0].getAttribute('repeatfrom');
    var gravity = this.animationNode.getElementsByTagName('gravity');
    var border = this.animationNode.getElementsByTagName('border');
    
    var steps = this.animationNode.getElementsByTagName('frame').length + 
                (this.animationNode.getElementsByTagName('frame').length - repeatfrom) * repeat;
      
    var index;
    
    if(this.animationStep < this.animationNode.getElementsByTagName('frame').length)
      index = this.animationNode.getElementsByTagName('frame')[this.animationStep].textContent;
    else if(repeatfrom == 0)
      index = this.animationNode.getElementsByTagName('frame')[this.animationStep % this.animationNode.getElementsByTagName('frame').length].textContent;
    else 
      index = this.animationNode.getElementsByTagName('frame')[parseInt(repeatfrom) + parseInt((this.animationStep - repeatfrom) % (this.animationNode.getElementsByTagName('frame').length - repeatfrom))].textContent;
    
    this.DOMimg.style.left = (- this.imageW * (index % this.tilesX)) + "px";
    this.DOMimg.style.top = (- this.imageH * parseInt(index / this.tilesX)) + "px";
    
    if(this.dragging || this.infobox)
    {
      this.animationStep++;
      window.setTimeout(function(){this._nextESheepStep();}.bind(this), 50);
      return;    
    } 
     
    if(this.flipped)
    {
      x1 = -x1;
      x2 = -x2;
    } 
      
    if(this.animationStep == 0)
      this._setPosition(x1, y1, false);
    else
      this._setPosition(
                          parseInt(x1) + parseInt((x2-x1)*this.animationStep/steps), 
                          parseInt(y1) + parseInt((y2-y1)*this.animationStep/steps), 
                          false);
    
    this.animationStep++;
        
    if(this.animationStep >= steps)
    {
      if(this.animationNode.getElementsByTagName('action')[0])
      {
        switch(this.animationNode.getElementsByTagName('action')[0].textContent)
        {
          case "flip":
            if(this.DOMdiv.style.transform == "rotateY(0deg)")
            {
              this.DOMdiv.style.transform = "rotateY(180deg)";
              this.flipped = true;
            }
            else
            {
              this.DOMdiv.style.transform = "rotateY(0deg)";
              this.flipped = false;
            }
            break;
          default:
            
            break;
        } 
      }
      if(!this._getNextRandomNode(this.animationNode.getElementsByTagName('sequence')[0])) return;
    }
    
    var setNext = false;
    
    if(border && border[0] && border[0].getElementsByTagName('next'))
    {
      if(x2<0 && this.imageX < 0)
      {
        this.imageX = 0;
        setNext = true;
      }
      else if(x2 > 0 && this.imageX > this.screenW - this.imageW)
      {
        this.imageX = this.screenW - this.imageW;
        this.DOMdiv.style.left = parseInt(this.imageX) + "px";
        setNext = true;
      }
      else if(y2 < 0 && this.imageY < 0)
      {
        this.imageY = 0;
        setNext = true;
      }
      else if(y2 > 0 && this.imageY > this.screenH - this.imageH)
      {
        this.imageY = this.screenH - this.imageH;
        setNext = true;
      }
      else if(y2 > 0)
      {
        if(this._checkOverlapping())
        {
          if(this.imageY > this.imageH)
          {
            this.HTMLelement = this._checkOverlapping();
            this.imageY = this.HTMLelement.getBoundingClientRect().top - this.imageH;
            setNext = true;
          }
        }
      }
      else if(this.HTMLelement)
      {
        if(!this._checkOverlapping())
        {
          if(this.imageY + this.imageH > this.HTMLelement.getBoundingClientRect().top + 3 ||
             this.imageY + this.imageH < this.HTMLelement.getBoundingClientRect().top - 3)
          {
            this.HTMLelement = null;
          }
          else if(this.imageX < this.HTMLelement.getBoundingClientRect().left)
          {
            this.imageX = parseInt(this.imageX + 3);
            setNext = true;
          }
          else
          {
            this.imageX = parseInt(this.imageX - 3);
            setNext = true;
          }
          this.DOMdiv.style.left = parseInt(this.imageX) + "px";
        }
      }
      if(setNext)
      {
        if(!this._getNextRandomNode(border[0])) return;
      }
    }
    if(!setNext && gravity && gravity[0] && gravity[0].getElementsByTagName('next'))
    {
      if(this.imageY < this.screenH - this.imageH - 2)
      {
        if(this.HTMLelement == null)
        {
          setNext = true;
        }
        else
        {
          if(!this._checkOverlapping())
          {
            setNext = true;
            this.HTMLelement = null;
          }
        }
        
        if(setNext)
        {
          if(!this._getNextRandomNode(gravity[0])) return;
        }
      }
    }
    if(!setNext)
    {
      if(this.imageX < - this.imageW && x2 < 0 || 
        this.imageX > this.screenW && x2 > 0 ||
        this.imageY < - this.imageH && y1 < 0 ||
        this.imageY > this.screenH && y2 > 0)
      {
        setNext = true;
        this._spawnESheep();
        return; 
      }
    }
    
    window.setTimeout(function(){this._nextESheepStep();}.bind(this), (parseInt(del1) + parseInt((del2-del1)*this.animationStep/steps)));             
  }
};












