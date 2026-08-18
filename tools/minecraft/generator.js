let myMate = new class
{
    #pngRaw = null;
    #icon = null;
    #image = null;
    #xmltemplate = null;
    #xml = null;
    #options = {cutL:0, cutR:0, zoom:1};
    #CONST = {COLS:8, ROWS:20};

    constructor()
    {
        fetch("minecraft/animations_template.xml").then(r=>{
            return r.text();
        }).then(t=>{
            this.#xmltemplate = t;
        });
        setTimeout(()=>{
            fetch("minecraft/chibi-steve-spritesheet.png").then(r=>{
                return r.blob();
            }).then(fb=>{
                const reader = new FileReader();
                reader.readAsDataURL(new File([fb], "spritesheet.png", { type: fb.type }));
                reader.onloadend = () => {
                    this.createImages(reader.result);
                    //const base64String = reader.result;
                    //console.log(base64String); // Ausgabe: data:image/png;base64,iVBORw0KG...
                };
            });
        }, 200);
    }

    updateCanvas(image)
    {
        if(!this.#image && !image) return;

        const canvas = document.getElementsByTagName("canvas")[0];
        const ctx = canvas.getContext("2d");
        if(image)
        {
            this.#image = image;
        }

        const inputs = document.getElementById("divoptions").getElementsByTagName("input");

        const w = this.#image.width;
        const h = this.#image.height;
        const f = parseInt(inputs[2].value);

        canvas.width = this.#image.width * f;
        canvas.height = this.#image.height * f;
        
        ctx.clearRect(0, 0, w*f, h*f);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.#image, 0, 0, w*f, h*f);
        if(inputs[0].value > 0)
        {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            for(let j=0;j<this.#CONST.COLS;j++)
            {
                for(let k=0;k<inputs[0].value;k++)
                {
                    ctx.beginPath();
                    ctx.moveTo(j*(w*f / this.#CONST.COLS)+k, 0);
                    ctx.lineTo(j*(w*f / this.#CONST.COLS)+k, h*f);
                    ctx.stroke();
                }
            }
        }
        if(inputs[1].value > 0)
        {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            for(let j=0;j<this.#CONST.COLS;j++)
            {
                for(let k=0;k<inputs[1].value;k++)
                {
                    ctx.beginPath();
                    ctx.moveTo((j+1)*(w*f / this.#CONST.COLS)-k - 1, 0);
                    ctx.lineTo((j+1)*(w*f / this.#CONST.COLS)-k - 1, h*f);
                    ctx.stroke();
                }
            }
        }

        this.#pngRaw = canvas.toDataURL();

        ["Icon", "Idle", "Walk", "Run", "Skip", "Jump", "Wave", "Nod", "Head", "Clap", "Cheer", "Sulk", "Joy", "Surp.", "Bow", "Bounce", "Dance", "Shiver", "Turn", "Spin"].forEach((a, j)=>{
            ctx.fillText(a, w*f-5-(5*a.length), j*h*f/this.#CONST.ROWS+15);
        });
    }

    createImages(file)
    {
        const td0 = document.getElementsByTagName("table")[0].getElementsByTagName("td")[0];
        const td1 = document.getElementsByTagName("table")[0].getElementsByTagName("td")[1];        
        td0.innerHTML = "";

        const canvasIco = document.createElement("canvas");
        let img = new Image();
        img.src = file;
        img.onload = ()=>{
            const imgw = img.width;
            const imgh = img.height;
            this.updateCanvas(img);
            canvasIco.width = imgw / this.#CONST.COLS;
            canvasIco.height = imgh / this.#CONST.ROWS;
            const ctxIco = canvasIco.getContext("2d");
            ctxIco.drawImage(img, 0, 0, imgw, imgh);
            td0.appendChild(canvasIco);

            this.#icon = canvasIco.toDataURL("image/png");

            td1.getElementsByTagName("button")[0].disabled = false;

            canvasIco.toBlob(blob=>{
                //const blob2 = PngIcoConverter.toBlob(blob, "image/png");
                const inputs = [{png: blob}];
                //const file2 = new File([blob], "image.png", { type: "image/png" });
                PngIcoConverter.convertToBlobAsync(inputs).then((icons)=>{
                    const reader = new FileReader();
                    reader.onload = ()=>{
                        this.#icon = reader.result;
                    };
                    reader.readAsDataURL(icons);
                });
            }, "image/png");
        };

        console.log(file.substring(file.indexOf(",")+1));
    }

    loadFile(file)
    {
        console.log(file);
        const reader = new FileReader();
        reader.onload = () => {
            this.createImages(reader.result);
        };
        reader.readAsDataURL(file);
    }

    mergeFiles()
    {
        this.#xml = this.#xmltemplate;
        this.#xml = this.#xml.replace("-IMAAA-", this.#icon.substring(this.#icon.indexOf(",")+1));
        this.#xml = this.#xml.replace("-IMBBB-", this.#pngRaw.substring(this.#pngRaw.indexOf(",")+1));
        const inputs = document.getElementById("tablegen").getElementsByTagName("input");
        this.#xml = this.#xml.replace("-IAAA-", inputs[0].value);
        this.#xml = this.#xml.replace("-IBBB-", inputs[1].value + " - Minecraft");
        this.#xml = this.#xml.replace("-ICCC-", inputs[1].value);
        this.#xml = this.#xml.replace("-IDDD-", inputs[2].value);
        const td2 = document.getElementsByTagName("table")[0].getElementsByTagName("td")[2];
        td2.getElementsByTagName("button")[0].disabled = false;
        return this.#xml;
    }

    getXMLUrl()
    {
        let b = new Blob([this.#xml], {type:"text/xml"});
        let burl = URL.createObjectURL(b);
        return burl;
    }
};

function pagedragover(event)
{
    document.body.style.opacity = 0.2;
    event.preventDefault();
}

function pagedragend(event)
{
    document.body.style.opacity = 1.0;
}

function pagedrop(event)
{
    console.log(event);
    document.body.style.opacity = 1.0;
    event.preventDefault();
    if(event.dataTransfer.items[0])
    {
        myMate.loadFile(event.dataTransfer.items[0].getAsFile());
    }
}

function generatePet()
{
    const xml = myMate.mergeFiles();
    const pet = new eSheep();
    pet.Start(xml); 
}

function downloadPet()
{
    const xml = myMate.getXMLUrl();
    const a = document.createElement("a");
    a.href = xml;
    a.download = "animations.xml";
    document.body.appendChild(a);
    a.click();
}

function editCanvas()
{
    myMate.updateCanvas();
}