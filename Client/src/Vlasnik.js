export class Vlasnik{
    constructor(id, nazivGazdinstva, ime, srednjeSlovo, prezime, jmbg, regBrojGazdinstva){
        this.id = id;
        this.nazivGazdinstva = nazivGazdinstva;
        this.ime = ime;
        this.srednjeSlovo = srednjeSlovo;
        this.prezime = prezime;
        this.jmbg = jmbg;
        this.regBrojGazdinstva = regBrojGazdinstva;
        this.kontejner = null;
    }

    crtaj(host){
        let tr = document.createElement("tr");
        host.appendChild(tr);
        this.kontejner = tr;

        let el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.nazivGazdinstva;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.ime + " " + this.srednjeSlovo + " " + this.prezime;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.jmbg;
        tr.appendChild(el);

        let dugmeObrisi = document.createElement("button");
        dugmeObrisi.innerHTML = "Prodaj gazdinstvo";
        dugmeObrisi.classList.add("DugmeVlasnikObrisi");
        dugmeObrisi.classList.add("DugmeVlasnici");
        tr.appendChild(dugmeObrisi);
        dugmeObrisi.onclick = (ev) =>this.obrisi();
        
    }

    obrisi(){
        fetch("https://localhost:5001/Vlasnik/IzbrisiVlasnika/" + this.jmbg + "/" + this.regBrojGazdinstva,
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