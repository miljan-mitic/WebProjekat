export class ClanPorodice{
    constructor(id, ime, srednjeSlovo, prezime, jmbg){
        this.id = id;
        this.ime = ime;
        this.srednjeSlovo = srednjeSlovo;
        this.prezime = prezime;
        this.jmbg = jmbg;
        this.kontejner = null;
    }

    crtaj(host){
        let tr = document.createElement("tr");
        host.appendChild(tr);
        this.kontejner = tr;

        let el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.ime;
        tr.appendChild(el);

        el = document.createElement("td");
        el.classList.add("LabeleGazdinstva");
        el.classList.add("SrednjeSlovoClanaPorodice");
        el.innerHTML = this.srednjeSlovo;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.prezime;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.jmbg;
        tr.appendChild(el);

        let dugmeObrisi = document.createElement("button");
        dugmeObrisi.innerHTML = "Obrisi";
        dugmeObrisi.classList.add("DugmeClanObrisi");
        dugmeObrisi.classList.add("DugmeClanovi");
        tr.appendChild(dugmeObrisi);
        dugmeObrisi.onclick = (ev) =>this.obrisi();
        
    }

    obrisi(){
        fetch("https://localhost:5001/ClanPorodice/IzbrisiClanaPorodice/" + this.jmbg,
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