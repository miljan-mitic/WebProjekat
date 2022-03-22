export class Sajt{
    constructor(listaGazdinstava){
        this.kontejner = null;
        this.listaGazdinstava = listaGazdinstava;
    }

    crtajGlavna(host){
        if(this.kontejner == null){
            this.kontejner = document.createElement("div");
            host.appendChild(this.kontejner);
        }
        this.kontejner.innerHTML = "";
        this.kontejner.className = "GlavniKontejner"

        let naslov = document.createElement("label");
        naslov.className = "Naslov";
        naslov.innerHTML = "Gazdinstvo";
        this.kontejner.appendChild(naslov);

        let glavna = document.createElement("div");
        glavna.className = "Glavna";
        this.kontejner.appendChild(glavna);

        let dodaj = document.createElement("button");
        dodaj.className = "GlavnaDugme";
        dodaj.innerHTML = "Dodaj";
        dodaj.onclick = () => {
            window.open("http://127.0.0.1:5500/Client/dodaj.html", '_self');
        }
        glavna.appendChild(dodaj);

        let pregledaj = document.createElement("button");
        pregledaj.className = "GlavnaDugme";
        pregledaj.innerHTML = "Pregledaj";
        pregledaj.onclick = () => {
            window.open("http://127.0.0.1:5500/Client/pregledaj.html", '_self');
        }
        glavna.appendChild(pregledaj);

        let obrisi = document.createElement("button");
        obrisi.className = "GlavnaDugme";
        obrisi.innerHTML = "Obrisi";
        obrisi.onclick = (ev) => this.obrisi();
        glavna.appendChild(obrisi);
    }

    obrisi(){
        let zaBrisanje = document.querySelector(".ObrisiGazdinstvo");
        if(zaBrisanje != null){
            let roditelj = zaBrisanje.parentNode;
            roditelj.removeChild(zaBrisanje);
        }
        let divObrisi = document.createElement("div");
        divObrisi.className = "ObrisiGazdinstvo";
        this.kontejner.appendChild(divObrisi);

        let divZaRegBrojGaz = document.createElement("div");
        divZaRegBrojGaz.className = "DivZaRegBrojGaz";
        divObrisi.appendChild(divZaRegBrojGaz)

        let l = document.createElement("label");
        l.className = "labelObrisiGazdinstvo";
        l.innerHTML = "Registracioni broj gazdinstva: ";
        divZaRegBrojGaz.appendChild(l);

        let regBrojGazdinstva = document.createElement("input");
        regBrojGazdinstva.className = "RegBrojGazdinstva";
        regBrojGazdinstva.type = "text";
        divZaRegBrojGaz.appendChild(regBrojGazdinstva);

        let nazad = document.createElement("button");
        nazad.className = "GlavnaDugme";
        nazad.innerHTML = "Nazad";
        nazad.onclick = () => {
            this.crtajGlavna(this.kontejner.parentNode);
        }
        divObrisi.appendChild(nazad);

        let obrisi = document.createElement("button");
        obrisi.className = "GlavnaDugme";
        obrisi.innerHTML = "Obrisi";
        obrisi.onclick = (ev) => this.obrisiGazdinstvo(regBrojGazdinstva.value);
        divObrisi.appendChild(obrisi);
    }

    obrisiGazdinstvo(regBrojGazdinstva){
        if(regBrojGazdinstva === null || regBrojGazdinstva === undefined || regBrojGazdinstva === ""){
            alert("Unesite registracioni broj gazdinstva!");
            return;
        }
        else if(regBrojGazdinstva.length != 10){
            alert("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara!");
            return;
        }

        let validacija = 0;
        fetch("https://localhost:5001/Upravlja/IzbrisiSve/" + regBrojGazdinstva,
        {
            method:"DELETE"
        }).then(s => {
            if(s.ok || (s.status == 302)){
                s.text().then(data => {
                    //alert(data);
                    validacija++;
                })
                fetch("https://localhost:5001/Radnik/IzbrisiSve/" + regBrojGazdinstva,
                {
                    method:"DELETE"
                }).then(s => {
                    s.text().then(data => {
                        //alert(data);
                        validacija++;
                    })
                })
                fetch("https://localhost:5001/VoziloMehanizacija/IzbrisiSve/" + regBrojGazdinstva,
                {
                    method:"DELETE"
                }).then(s => {
                    s.text().then(data => {
                        //alert(data);
                        validacija++;
                    })
                })
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })

        fetch("https://localhost:5001/Parcela/IzbrisiSve/" + regBrojGazdinstva,
        {
            method:"DELETE"
        }).then(s => {
            s.text().then(data => {
                //alert(data);
                validacija++;
            })
        })

        fetch("https://localhost:5001/Vlasnik/IzbrisiSve/" + regBrojGazdinstva,
        {
            method:"DELETE"
        }).then(s => {
            if(s.ok || (s.status == 302)){
                s.text().then(data => {
                    //alert(data);
                    validacija++;
                })
                window.setTimeout(
                    function() {
                        if(validacija === 5)
                        {
                            fetch("https://localhost:5001/Gazdinstvo/Izbrisi/" + regBrojGazdinstva,
                            {
                                method:"DELETE"
                            }).then(s => {
                                s.text().then(data => {
                                    alert(data);
                                })
                            })
                        }
                        else{
                            console.log(validacija);
                            alert("Nije obrisano Gazdinstvo!");
                        }
                    },
                2000)
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })
    }

    crtajDodaj(host){
        this.kontejner = document.createElement("div");
        this.kontejner.className = "KontejnerDodaj";
        host.appendChild(this.kontejner);
        
        let l = document.createElement("label");
        l.className = "Naslov";
        l.innerHTML = "Gazdinstvo";
        this.kontejner.appendChild(l);
        
        let glavnaForma = document.createElement("div");
        glavnaForma.className = "GlavnaForma";
        this.kontejner.appendChild(glavnaForma);
        
        let formaGazdinstvo = document.createElement("div");
        formaGazdinstvo.className = "FormaGazdinstvo";
        glavnaForma.appendChild(formaGazdinstvo);
        
        l = document.createElement("label");
        l.className = "Naslovi";
        l.innerHTML = "Gazdinstvo";
        formaGazdinstvo.appendChild(l);
        
        let divZaRegBroj = document.createElement("div");
        divZaRegBroj.className = "DivZaRegBroj";
        formaGazdinstvo.appendChild(divZaRegBroj);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.innerHTML = "Registracioni broj: ";
        divZaRegBroj.appendChild(l);
        
        let regBroj = document.createElement("input");
        regBroj.className = "inputGazdinstvo";
        regBroj.type = "number";
        divZaRegBroj.appendChild(regBroj);
        
        let divZaRbt = document.createElement("div");
        divZaRbt.className = "DivZaRbt";
        formaGazdinstvo.appendChild(divZaRbt);
        let nizRbt = ["Aktivno", "Stecaj"];
        nizRbt.forEach((el,index) =>
        {
            l = document.createElement("label");
            l.className = "labelDodaj";
            l.innerHTML = el + ":";
            divZaRbt.appendChild(l);
            let rbt = document.createElement("input");
            rbt.className = "radio";
            rbt.type = "radio";
            rbt.value = el;
            rbt.name = "status";
            divZaRbt.appendChild(rbt);
            if(index === 0)
                rbt.checked = true;
        });
        
        let divZaNaziv = document.createElement("div");
        divZaNaziv.className = "DivZaNaziv";
        formaGazdinstvo.appendChild(divZaNaziv);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.innerHTML = "Naziv: ";
        divZaNaziv.appendChild(l);
        
        let naziv = document.createElement("input");
        naziv.className = "inputGazdinstvo";
        naziv.type = "text";
        divZaNaziv.appendChild(naziv);
        
        let divZaAdresu = document.createElement("div");
        divZaAdresu.className = "DivZaAdresu";
        formaGazdinstvo.appendChild(divZaAdresu);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.innerHTML = "Adresa: ";
        divZaAdresu.appendChild(l);
        
        let adresa = document.createElement("input");
        adresa.className = "inputGazdinstvo";
        adresa.type = "text";
        divZaAdresu.appendChild(adresa);
        
        let formaVlasnik = document.createElement("div");
        formaVlasnik.className = "FormaVlasnik";
        glavnaForma.appendChild(formaVlasnik);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.className = "Naslovi";
        l.innerHTML = "Vlasnik gazdinstva";
        formaVlasnik.appendChild(l);
        
        let divZaIme = document.createElement("div");
        divZaIme.className = "DivZaIme";
        formaVlasnik.appendChild(divZaIme);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.innerHTML = "Ime: ";
        divZaIme.appendChild(l);
        
        let ime = document.createElement("input");
        ime.className = "inputGazdinstvo";
        ime.type = "text";
        divZaIme.appendChild(ime);
        
        let divZaSrednjeSlovo = document.createElement("div");
        divZaSrednjeSlovo.className = "DivZaSrednjeSlovo";
        formaVlasnik.appendChild(divZaSrednjeSlovo);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.innerHTML = "Srednje slovo: ";
        divZaSrednjeSlovo.appendChild(l);
        
        let srednjeSlovo = document.createElement("input");
        srednjeSlovo.className = "inputGazdinstvo";
        srednjeSlovo.type = "text";
        divZaSrednjeSlovo.appendChild(srednjeSlovo);
        
        let divZaPrezime = document.createElement("div");
        divZaPrezime.className = "DivZaPrezime";
        formaVlasnik.appendChild(divZaPrezime);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.innerHTML = "Prezime: ";
        divZaPrezime.appendChild(l);
        
        let prezime = document.createElement("input");
        prezime.className = "inputGazdinstvo";
        prezime.type = "text";
        divZaPrezime.appendChild(prezime);
        
        let divZaJMBG = document.createElement("div");
        divZaJMBG.className = "DivZaJMBG";
        formaVlasnik.appendChild(divZaJMBG);
        
        l = document.createElement("label");
        l.className = "labelDodaj";
        l.innerHTML = "JMBG: ";
        divZaJMBG.appendChild(l);
        
        let jmbg = document.createElement("input");
        jmbg.className = "inputGazdinstvo";
        jmbg.type = "number";
        divZaJMBG.appendChild(jmbg);
        
        let divZaDugmad = document.createElement("div");
        divZaDugmad.className = "DivZaDugmad";
        this.kontejner.appendChild(divZaDugmad);
        
        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeSajt";
        dugmeDodaj.innerHTML = "Dodaj";
        dugmeDodaj.onclick = (ev) => this.dodaj(regBroj.value, naziv.value, adresa.value, ime.value, srednjeSlovo.value, prezime.value, jmbg.value);
        divZaDugmad.appendChild(dugmeDodaj);

        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeSajt";
        dugmeNazad.innerHTML = "Nazad";
        dugmeNazad.onclick = () => {
            window.open("http://localhost:5500/Client/glavna.html", "_self");
        }
        divZaDugmad.appendChild(dugmeNazad);
        
    }

    dodaj(regBroj, naziv, adresa, imeVlasnika, sSlovoVlasnika, prezimeVlasnika, JMBGVlasnika){
        let validacija = "";
        if(regBroj === null || regBroj === undefined || regBroj === ""){
            validacija += "Unesite registracioni broj gazdinstva!\n";
        }
        else if(regBroj.length != 10){
            validacija += "Registracioni broj gazdinstva mora sadrzati tacno 10 cifara!\n";
        }

        if(naziv === null || naziv === undefined || naziv === ""){
            validacija += "Unesite naziv gazdinstva!\n";
        }
        else if(naziv.length > 30){
            validacija += "Naziv gazdinstva ne sme biti duzi od 30 karaktera!\n";
        }

        if(adresa === null || adresa === undefined || adresa === ""){
            validacija += "Unesite adresu gazdinstva!\n";
        }
        else if(adresa.length > 50){
            validacija += "Adresa gazdinstva ne sme biti duza od 30 karaktera!\n";
        }

        if(imeVlasnika === null || imeVlasnika === undefined || imeVlasnika === ""){
            validacija += "Unesite ime vlasnika gazdinstva!\n";
        }
        else if(imeVlasnika.length > 30){
            validacija += "Ime vlasnika ne sme biti duze od 30 karaktera!\n";
        }

        if(sSlovoVlasnika === null || sSlovoVlasnika === undefined || sSlovoVlasnika === ""){
            validacija += "Unesite srednje slovo vlasnika gazdinstva!\n";
        }
        else if(sSlovoVlasnika.length != 1){
            validacija += "Srednje slovo vlasnika mora se sastojati od jednog slova!\n";
        }

        if(prezimeVlasnika === null || prezimeVlasnika === undefined || prezimeVlasnika === ""){
            validacija += "Unesite prezime vlasnika gazdinstva!\n";
        }
        else if(prezimeVlasnika.length > 30){
            validacija += "Prezime vlasnika ne sme biti duze od 30 karaktera!\n";
        }
        
        if(JMBGVlasnika === null || JMBGVlasnika === undefined || JMBGVlasnika === ""){
            validacija += "Unesite JMBG vlasnika gazdinstva!\n";
        }
        else if(JMBGVlasnika.length != 13){
            validacija += "JMBG mora se sastojati od tacno 13 cifara!\n";
        }

        if(validacija !== ""){
            alert(validacija);
            return;
        }
        else{
            let status = this.kontejner.querySelector("input[type='radio']:checked").value;
            fetch("https://localhost:5001/Gazdinstvo/Dodaj/" + regBroj + "/" + status +"/" + naziv + "/" + adresa,
            {
                method:"POST"
            }).then(s => {
                if(s.ok){
                    s.text().then(data => {
                        alert(data);
                        fetch("https://localhost:5001/ClanPorodice/Dodaj/" + imeVlasnika + "/" + sSlovoVlasnika + "/" + prezimeVlasnika + "/" + JMBGVlasnika,
                        {
                            method:"POST"
                        }).then(s => {
                            if(s.ok || (s.status == 302)){ //Proveri!!!
                                s.text().then(data => {
                                    alert(data);
                                    fetch("https://localhost:5001/Vlasnik/Dodaj/" + regBroj + "/" + JMBGVlasnika,
                                    {
                                        method:"POST"
                                    }).then(s => {
                                        s.text().then(data => {
                                            alert(data);
                                        })
                                    })
                                })
                            }
                            else{
                                s.text().then(data => {
                                    alert(data);
                                })
                            }
                        })
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
    crtajPregledaj(host){
        this.kontejner = document.createElement("div");
        this.kontejner.className = "KontejnerPregledaj";
        host.appendChild(this.kontejner);

        this.listaGazdinstava.forEach(gazdinstvo => {
            gazdinstvo.crtaj(this.kontejner);
        });
    }
}
