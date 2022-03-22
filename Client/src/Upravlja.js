export class Upravlja{
    constructor(id, nadimakRadnika, registracijaVozila, regBrojGazdinstva){
        this.id = id;
        this.nadimakRadnika = nadimakRadnika;
        this.registracijaVozila = registracijaVozila;
        this.regBrojGazdinstva = regBrojGazdinstva;
        this.kontejner = null;
    }

    crtaj(host){
        let tr = document.createElement("tr");
        host.appendChild(tr);
        this.kontejner = tr;

        let el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.nadimakRadnika;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.registracijaVozila;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.regBrojGazdinstva;
        tr.appendChild(el);

        let dugmeObrisi = document.createElement("button");
        dugmeObrisi.innerHTML = "Obrisi upravljanje";
        dugmeObrisi.classList.add("DugmeUpravljanjeObrisi");
        dugmeObrisi.classList.add("DugmeUpravljaju");
        tr.appendChild(dugmeObrisi);
        dugmeObrisi.onclick = (ev) =>this.obrisi();
        
    }

    obrisi(){
        fetch("https://localhost:5001/Upravlja/IzbrisiUpravljanje/" + this.nadimakRadnika + "/" + this.registracijaVozila + "/" + this.regBrojGazdinstva,
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