export class Parcela{
    constructor(id, registracioniBroj, povrsina, tip, naziv, regBrojGazdinstva){
        this.id = id;
        this.registracioniBroj = registracioniBroj;
        this.povrsina = povrsina;
        this.tip = tip;
        this.naziv = naziv;
        this.regBrojGazdinstva = regBrojGazdinstva;
        this.kontejner = null;
    }

    crtaj(host){
        let tr = document.createElement("tr");
        host.appendChild(tr);
        this.kontejner = tr;

        let el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.naziv;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.registracioniBroj;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.povrsina;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.tip;
        tr.appendChild(el);

        let dugmeObrisi = document.createElement("button");
        dugmeObrisi.innerHTML = "Prodaj parcelu";
        dugmeObrisi.classList.add("DugmeParcelaObrisi");
        dugmeObrisi.classList.add("DugmeParcela");
        tr.appendChild(dugmeObrisi);
        dugmeObrisi.onclick = (ev) =>this.obrisi();
        
    }

    obrisi(){
        fetch("https://localhost:5001/Parcela/IzbrisiParcelu/" + this.registracioniBroj + "/" + this.regBrojGazdinstva,
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