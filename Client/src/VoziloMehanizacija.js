export class VoziloMehanizacija{
    constructor(id, tip, marka, registracija, regBrojGazdinstva){
        this.id = id;
        this.tip = tip;
        this.marka = marka;
        this.registracija = registracija;
        this.regBrojGazdinstva = regBrojGazdinstva;
        this.kontejner = null;
    }

    crtaj(host){
        let tr = document.createElement("tr");
        host.appendChild(tr);
        this.kontejner = tr;
        
        let el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.tip;
        tr.appendChild(el);
        
        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.marka;
        tr.appendChild(el);
        
        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.registracija;
        tr.appendChild(el);
        
        let dugmeObrisi = document.createElement("button");
        dugmeObrisi.innerHTML = "Prodaj vozilo/mehanizaciju";
        dugmeObrisi.classList.add("DugmeVoziloMehanizacijaObrisi");
        dugmeObrisi.classList.add("DugmeVozilaMehanizacije");
        tr.appendChild(dugmeObrisi);
        dugmeObrisi.onclick = (ev) =>this.obrisi();
        
    }

    obrisi(){
        fetch("https://localhost:5001/VoziloMehanizacija/IzbrisiVoziloMehanizaciju/" + this.registracija + "/" + this.regBrojGazdinstva,
        {
            method:"DELETE"
        }).then(s => {
            if(s.ok){
                let roditelj = this.kontejner.parentNode;
                roditelj.removeChild(this.kontejner);
                s.text().then(data => {
                    alert(data);
                })
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })
    }
}