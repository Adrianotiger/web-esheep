let myMate = new class
{
    #pngRaw = null;
    #icon = null;
    #xmltemplate = null;
    #xml = null;

    constructor()
    {
        fetch("minecraft/animations_template.xml").then(r=>{
            return r.text();
        }).then(t=>{
            this.#xmltemplate = t;
        });
    }

    createImages(file)
    {
        const td0 = document.getElementsByTagName("table")[0].getElementsByTagName("td")[0];
        const td1 = document.getElementsByTagName("table")[0].getElementsByTagName("td")[1];
        td0.innerHTML = "";

        this.#pngRaw = file;
        const canvas = document.createElement("canvas");
        let img = new Image();
        img.src = file;
        img.onload = ()=>{
            const imgw = img.width;
            const imgh = img.height;
            canvas.width = imgw / 8;
            canvas.height = imgh / 20;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, imgw, imgh);
            td0.appendChild(canvas);

            this.#icon = canvas.toDataURL("image/png");

            td1.getElementsByTagName("button")[0].disabled = false;

            canvas.toBlob(blob=>{
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
        const inputs = document.body.getElementsByTagName("input");
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