export class Radnik{
    constructor(id, ime, prezime, nadimak, plata, regBrojGazdinstva){
        this.id = id;
        this.ime = ime,
        this.prezime = prezime;
        this.nadimak = nadimak;
        this.plata = plata;
        this.regBrojGazdinstva = regBrojGazdinstva;
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
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.prezime;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.nadimak;
        tr.appendChild(el);

        el = document.createElement("td");
        el.className = "LabeleGazdinstva";
        el.innerHTML = this.plata;
        tr.appendChild(el);

        let dugmeObrisi = document.createElement("button");
        dugmeObrisi.innerHTML = "Otpusti radnika";
        dugmeObrisi.classList.add("DugmeRadnikObrisi");
        dugmeObrisi.classList.add("DugmeRadnici");
        tr.appendChild(dugmeObrisi);
        dugmeObrisi.onclick = (ev) =>this.obrisi();
        
    }

    obrisi(){
        fetch("https://localhost:5001/Radnik/IzbrisiRadnika/" + this.nadimak + "/" + this.regBrojGazdinstva,
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