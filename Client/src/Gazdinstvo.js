import { ClanPorodice } from "./ClanPorodice.js";
import { Parcela } from "./Parcela.js";
import { Radnik } from "./Radnik.js";
import { Upravlja } from "./Upravlja.js";
import { Vlasnik } from "./Vlasnik.js";
import { VoziloMehanizacija } from "./VoziloMehanizacija.js";

export class Gazdinstvo{
    constructor(registracioniBroj, status, naziv, adresa, brojVlasnika){
        this.registracioniBroj = registracioniBroj;
        this.status = status;
        this.naziv = naziv;
        this.adresa = adresa;
        this.brojVlasnika = brojVlasnika;
        this.kontejner = null;
    }
    
    crtaj(host){
        if(this.kontejner == null){
            this.kontejner = document.createElement("div");
            host.appendChild(this.kontejner);
        }
        this.kontejner.className = "KontejnerGazdinstvo";
        this.kontejner.innerHTML = "";
        
        let divZaNaslov = document.createElement("div");
        divZaNaslov.className = "DivZaNaslov";
        this.kontejner.appendChild(divZaNaslov);

        let naslov = document.createElement("label");
        naslov.classList.add("Naslov");
        naslov.classList.add("NaslovDodaj");
        naslov.innerHTML = "Gazdinstvo";
        divZaNaslov.appendChild(naslov);

        let forma = document.createElement("div");
        forma.className = "FormaGazdinstvoDodaj";
        this.kontejner.appendChild(forma);

        let divZaLabele = document.createElement("div");
        divZaLabele.className = "DivZaLabele";
        forma.append(divZaLabele);

        let nizVrednosti = [this.naziv, this.registracioniBroj, this.adresa, this.brojVlasnika, this.status];
        let nizNaziva = ["Naziv: ", "Registracioni broj: ", "Adresa: ", "Broj vlasnika: ", "Status: "];
        let l;
        nizVrednosti.forEach((el, index) => {
            let pomDiv = document.createElement("div");
            
            l = document.createElement("label");
            l.className = "LabeleGazdinstva";
            l.innerHTML = nizNaziva[index] + el;
            pomDiv.appendChild(l);
            if(index == 4){
                let dugmePromeniStatus = document.createElement("button");
                dugmePromeniStatus.className = "DugmePromeniStatus";
                dugmePromeniStatus.innerHTML = "Promeni status";
                pomDiv.appendChild(dugmePromeniStatus);
                divZaLabele.appendChild(pomDiv);
                dugmePromeniStatus.onclick = () => {
                    if(this.status === "Aktivno"){
                        this.status = "Stecaj";
                    }
                    else{
                        this.status = "Aktivno";
                    }
                    this.promeniStatus();
                    this.crtaj(host);
                }
            }
            else{
                divZaLabele.append(pomDiv);
            }
        });

        
        let divZaDugmad = document.createElement("div");
        divZaDugmad.className = "DivZaDugmadGazdinstvo";
        forma.appendChild(divZaDugmad);

        let nizDugmad = ["clanove porodice", "vlasnike", "radnike", "vozila i mehanizacije", "upravljanje", "parcele"];
        let dugme;
        let div = document.createElement("div");
        div.className = "DivZaPrikaz";
        this.kontejner.appendChild(div);

        nizDugmad.forEach((el, index) => {
            dugme = document.createElement("button");
            dugme.className = "DugmadGazdinstvo";
            dugme.innerHTML = "Prikazi " + el;
            divZaDugmad.appendChild(dugme);

            if(index == 0){
                dugme.onclick = (ev) => this.crtajClanovePorodice(div);
            }
            else if(index == 1){
                dugme.onclick = (ev) => this.crtajVlasnike(div);
            }
            else if(index == 2){
                dugme.onclick = (ev) => this.crtajRadnike(div);
            }
            else if(index == 3){
                dugme.onclick = (ev) => this.crtajVozilaMehanizacije(div);
            }
            else if(index == 4){
                dugme.onclick = (ev) => this.crtajUpravljanje(div);
            }
            else{
                dugme.onclick = (ev) => this.crtajParcele(div);
            }
        });

        dugme = document.createElement("button");
        dugme.className = "DugmadGazdinstvo";
        dugme.innerHTML = "Nazad";
        divZaDugmad.appendChild(dugme);
        dugme.onclick = () => {
            window.open("http://localhost:5500/Client/glavna.html", '_self');
        }

    }

    promeniStatus(){
        fetch("https://localhost:5001/Gazdinstvo/PromeniStatus/" + this.registracioniBroj,
        {
            method:"PUT"
        }).then(s => {
            s.text().then(data => {
                alert(data);
            })
        })
    }

    //////////////////////////////////////////////////
    //Sve za parcele

    crtajParcele(host){
        this.kontejner.className = "KontejnerGazdinstvoNova";
        host.innerHTML = "";
        let kontejnerParcele = document.createElement("div");
        kontejnerParcele.className = "KontejnerParcele";
        host.appendChild(kontejnerParcele);

        let tabela = document.createElement("table");
        tabela.className = "TabelaParcele";
        kontejnerParcele.appendChild(tabela);

        let tabelaHead = document.createElement("thead");
        tabela.appendChild(tabelaHead);

        let tr = document.createElement("tr");
        tabelaHead.appendChild(tr);

        let th;
        let nizZaglavlja = ["Naziv", "Registracioni broj", "Povrsina", "Tip"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.className = "LabeleGazdinstva";
            th.innerHTML = el;
            tr.appendChild(th);
        })

        let tabelaBody = document.createElement("tbody");
        tabelaBody.className = "TabelaParcelePodaci";
        tabela.appendChild(tabelaBody);

        let divZaDugmadParcela = document.createElement("div");
        divZaDugmadParcela.className = "DivZaDugmadParcela";
        kontejnerParcele.appendChild(divZaDugmadParcela);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeParcela";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmadParcela.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let roditelj = this.kontejner.parentNode;
            this.kontejner.innerHTML = "";            
            this.crtaj(roditelj);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeParcela";
        dugmeDodaj.innerHTML = "Dodaj parcelu";
        divZaDugmadParcela.appendChild(dugmeDodaj);
        if(this.status === "Aktivno"){
            dugmeDodaj.onclick = (ev) => this.dodajParcelu(host);
        }
        else{
            dugmeDodaj.onclick = () => {
                alert("Ne mozete kupovati parcele dok je gazdinstvo u stecaju!");
            }
        }

        this.ucitajParcele(tabela);
    }
    
    dodajParcelu(host){
        let obrisi = host.querySelector(".FormaDodajParcelu");
        if(obrisi !== null){
            host.removeChild(obrisi);
        }
        let formaDodajParcelu = document.createElement("div");
        formaDodajParcelu.className = "FormaDodajParcelu";
        host.appendChild(formaDodajParcelu);
        
        let l = document.createElement("label");
        l.className = "NaslovParcela";
        l.innerHTML = "Parcela";
        formaDodajParcelu.appendChild(l);
        
        let divZaRegBroj = document.createElement("div");
        divZaRegBroj.className = "DivZaRegBrojParcele";
        formaDodajParcelu.appendChild(divZaRegBroj);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Registracioni broj: ";
        divZaRegBroj.appendChild(l);
        
        let regBroj = document.createElement("input");
        regBroj.className = "inputParcela";
        regBroj.type = "number";
        divZaRegBroj.appendChild(regBroj);

        let divZaPovrsinu = document.createElement("div");
        divZaPovrsinu.className = "DivZaPovrsinuParcele";
        formaDodajParcelu.appendChild(divZaPovrsinu);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Povrsina u ari: ";
        divZaPovrsinu.appendChild(l);
        
        let povrsina = document.createElement("input");
        povrsina.className = "inputParcela";
        povrsina.type = "number";
        divZaPovrsinu.appendChild(povrsina);

        let divZaRbt = document.createElement("div");
        divZaRbt.className = "DivZaRbtParcele";
        formaDodajParcelu.appendChild(divZaRbt);
        let nizRbt = ["Obradiva", "Neobradiva"];
        nizRbt.forEach((el,index) =>
        {
            l = document.createElement("label");
            l.className = "LabeleGazdinstva";
            l.innerHTML = el + ":";
            divZaRbt.appendChild(l);
            let rbt = document.createElement("input");
            rbt.className = "radio";
            rbt.type = "radio";
            rbt.value = el;
            rbt.name = "tip";
            divZaRbt.appendChild(rbt);
            if(index === 0)
                rbt.checked = true;
        });

        let divZaNaziv = document.createElement("div");
        divZaNaziv.className = "DivZaNazivParcele";
        formaDodajParcelu.appendChild(divZaNaziv);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Naziv: ";
        divZaNaziv.appendChild(l);
        
        let naziv = document.createElement("input");
        naziv.className = "inputParcela";
        naziv.type = "text";
        divZaNaziv.appendChild(naziv);

        let divZaDugmeDodajParcelu = document.createElement("div");
        divZaDugmeDodajParcelu.className = "DivZaDugmadParcela";
        formaDodajParcelu.appendChild(divZaDugmeDodajParcelu);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeParcela";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmeDodajParcelu.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let div = this.kontejner.querySelector(".DivZaPrikaz");
            this.crtajParcele(div);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeParcela";
        dugmeDodaj.innerHTML = "Sacuvaj";
        divZaDugmeDodajParcelu.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.snimiParcelu(regBroj.value, povrsina.value, naziv.value, formaDodajParcelu);

    }

    snimiParcelu(regBroj, povrsina, naziv, host){
        let validacija = "";
        if(regBroj === null || regBroj === undefined || regBroj === ""){
            validacija += "Unesite registracioni broj parcele!\n";
        }
        else if(regBroj.length != 10){
            validacija += "Registracioni broj parcele mora sadrzati tacno 10 cifara!\n";
        }
        
        if(povrsina === null || povrsina === undefined || povrsina === ""){
            validacija += "Unesite povrsinu parcele!\n";
        }
        else if(povrsina < 1 || povrsina > 1000000){
            validacija += "Povrsina parcele je u rangu od 1 do 1000000 ari!\n";
        }
        
        if(naziv === null || naziv === undefined || naziv === ""){
            validacija += "Unesite naziv parcele!\n";
        }
        else if(naziv.length > 30){
            validacija += "Naziv parcele ne sme biti duzi od 30 karaktera!\n";
        }

        if(validacija !== ""){
            alert(validacija);
            return;
        }
        else{
            let tip = host.querySelector("input[type='radio']:checked").value;
            fetch("https://localhost:5001/Parcela/Dodaj/" + regBroj + "/" + povrsina + "/" + tip + "/" + naziv + "/" + this.registracioniBroj,
            {
                method:"POST"
            }).then(s => {
                if(s.ok){
                    s.text().then(data => {
                        alert(data);
                        let divZaPrika = this.kontejner.querySelector(".DivZaPrikaz");
                        divZaPrika.innerHTML = "";
                        this.crtajParcele(divZaPrika);
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

    ucitajParcele(tabela){
        fetch("https://localhost:5001/Parcela/Preuzmi/" + this.registracioniBroj,
        {
            method:"Get"
        }).then(s => {
            if(s.ok){
                s.json().then(parcele => {
                    parcele.forEach(parcela => {
                        let p = new Parcela(parcela.id, parcela.registracioniBroj, parcela.povrsina, parcela.tip, parcela.naziv, this.registracioniBroj);
                        p.crtaj(tabela);
                    });
                })
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })
    }

    //////////////////////////////////////////////////
    //Sve za vozila i mehanizacije
    
    crtajVozilaMehanizacije(host){
        this.kontejner.className = "KontejnerGazdinstvoNova";
        host.innerHTML = "";
        let kontejnerVozilaMehanizacije = document.createElement("div");
        kontejnerVozilaMehanizacije.className = "KontejnerVozilaMehanizacije";
        host.appendChild(kontejnerVozilaMehanizacije);

        let tabela = document.createElement("table");
        tabela.className = "TabelaVozilaMehanizacije";
        kontejnerVozilaMehanizacije.appendChild(tabela);

        let tabelaHead = document.createElement("thead");
        tabela.appendChild(tabelaHead);

        let tr = document.createElement("tr");
        tabelaHead.appendChild(tr);

        let th;
        let nizZaglavlja = ["Tip", "Marka", "Registracija"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.className = "LabeleGazdinstva";
            th.innerHTML = el;
            tr.appendChild(th);
        })

        let tabelaBody = document.createElement("tbody");
        tabelaBody.className = "TabelaVozilaMehanizacijePodaci";
        tabela.appendChild(tabelaBody);

        let divZaDugmadVozilaMehanizacije = document.createElement("div");
        divZaDugmadVozilaMehanizacije.className = "DivZaDugmadVozilaMehanizacije";
        kontejnerVozilaMehanizacije.appendChild(divZaDugmadVozilaMehanizacije);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeVozilaMehanizacije";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmadVozilaMehanizacije.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let roditelj = this.kontejner.parentNode;
            this.kontejner.innerHTML = "";            
            this.crtaj(roditelj);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeVozilaMehanizacije";
        dugmeDodaj.innerHTML = "Dodaj vozilo/mehanizaciju";
        divZaDugmadVozilaMehanizacije.appendChild(dugmeDodaj);
        if(this.status === "Aktivno"){
            dugmeDodaj.onclick = (ev) => this.dodajVoziloMehanizaciju(host);
        }
        else{
            dugmeDodaj.onclick = () => {
                alert("Ne mozete kupovati vozila/mehanizacije dok je gazdinstvo u stecaju!");
            }
        }

        this.ucitajVozilaMehanizacije(tabela);
    }

    dodajVoziloMehanizaciju(host){
        let obrisi = host.querySelector(".FormaDodajVoziloMehanizaciju");
        if(obrisi !== null){
            host.removeChild(obrisi);
        }
        let formaDodajVoziloMehanizaciju = document.createElement("div");
        formaDodajVoziloMehanizaciju.className = "FormaDodajVoziloMehanizaciju";
        host.appendChild(formaDodajVoziloMehanizaciju);
        
        let l = document.createElement("label");
        l.className = "NaslovVoziloMehanizacija";
        l.innerHTML = "Vozilo/Mehanizacija";
        formaDodajVoziloMehanizaciju.appendChild(l);
        
        let divZaTip = document.createElement("div");
        divZaTip.className = "DivZaTipVozilaMehanizacije";
        formaDodajVoziloMehanizaciju.appendChild(divZaTip);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Tip: ";
        divZaTip.appendChild(l);
        
        let tip = document.createElement("input");
        tip.className = "inputVoziloMehanizacija";
        tip.type = "text";
        divZaTip.appendChild(tip);

        let divZaMarku = document.createElement("div");
        divZaMarku.className = "DivZaMarkuVozilaMehanizacije";
        formaDodajVoziloMehanizaciju.appendChild(divZaMarku);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Marka: ";
        divZaMarku.appendChild(l);
        
        let marka = document.createElement("input");
        marka.className = "inputVoziloMehanizacija";
        marka.type = "text";
        divZaMarku.appendChild(marka);

        let divZaRegistraciju = document.createElement("div");
        divZaRegistraciju.className = "DivZaRegistracijuVozilaMehanizacije";
        formaDodajVoziloMehanizaciju.appendChild(divZaRegistraciju);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Registracija: ";
        divZaRegistraciju.appendChild(l);
        
        let registracija = document.createElement("input");
        registracija.className = "inputVoziloMehanizacija";
        registracija.type = "text";
        divZaRegistraciju.appendChild(registracija);

        let divZaDugmeDodajVoziloMehanizaciju = document.createElement("div");
        divZaDugmeDodajVoziloMehanizaciju.className = "DivZaDugmadVozilaMehanizacije";
        formaDodajVoziloMehanizaciju.appendChild(divZaDugmeDodajVoziloMehanizaciju);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeVozilaMehanizacije";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmeDodajVoziloMehanizaciju.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let div = this.kontejner.querySelector(".DivZaPrikaz");
            this.crtajVozilaMehanizacije(div);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeVozilaMehanizacije";
        dugmeDodaj.innerHTML = "Sacuvaj";
        divZaDugmeDodajVoziloMehanizaciju.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.snimiVoziloMehanizaciju(tip.value, marka.value, registracija.value);

    }

    snimiVoziloMehanizaciju(tip, marka, registracija){
        let validacija = "";
        if(tip === null || tip === undefined || tip === ""){
            validacija += "Unesite tip vozila/mehanizacije!\n";
        }
        else if(tip.length > 30){
            validacija += "Tip vozila/mehanizacije ne sme biti duzi od 30 karaktera!\n";
        }
        
        if(marka === null || marka === undefined || marka === ""){
            validacija += "Unesite marku vozila/mehanizacije!\n";
        }
        else if(marka.length > 30){
            validacija += "Marka vozila/mehanizacije ne sme biti duza od 30 karaktera!\n";
        }
        
        
        


        if(validacija !== ""){
            alert(validacija);
            return;
        }
        else{
            fetch("https://localhost:5001/VoziloMehanizacija/Dodaj/" + tip + "/" + marka + "/" + registracija + "/" + this.registracioniBroj,
            {
                method:"POST"
            }).then(s => {
                if(s.ok){
                    s.text().then(data => {
                        alert(data);
                        let divZaPrika = this.kontejner.querySelector(".DivZaPrikaz");
                        divZaPrika.innerHTML = "";
                        this.crtajVozilaMehanizacije(divZaPrika);
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

    ucitajVozilaMehanizacije(tabela){
        fetch("https://localhost:5001/VoziloMehanizacija/Preuzmi/" + this.registracioniBroj,
        {
            method:"Get"
        }).then(s => {
            if(s.ok){
                s.json().then(vozilaMehanizacije => {
                    vozilaMehanizacije.forEach(voziloMehanizacija => {
                        let vm = new VoziloMehanizacija(voziloMehanizacija.id, voziloMehanizacija.tip, voziloMehanizacija.marka, voziloMehanizacija.registracija, this.registracioniBroj);
                        vm.crtaj(tabela);
                    });
                })
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })
    }

    //////////////////////////////////////////////////
    //Sve za vlasnike

    crtajVlasnike(host){
        this.kontejner.className = "KontejnerGazdinstvoNova";
        host.innerHTML = "";
        let kontejnerVlasnici = document.createElement("div");
        kontejnerVlasnici.className = "KontejnerVlasnici";
        host.appendChild(kontejnerVlasnici);

        let tabela = document.createElement("table");
        tabela.className = "TabelaVlasnici";
        kontejnerVlasnici.appendChild(tabela);

        let tabelaHead = document.createElement("thead");
        tabela.appendChild(tabelaHead);

        let tr = document.createElement("tr");
        tabelaHead.appendChild(tr);

        let th;
        let nizZaglavlja = ["Gazdinstvo", "Vlasnik", "JMBG vlasnika"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.className = "LabeleGazdinstva";
            th.innerHTML = el;
            tr.appendChild(th);
        })

        let tabelaBody = document.createElement("tbody");
        tabelaBody.className = "TabelaVlasniciPodaci";
        tabela.appendChild(tabelaBody);

        let divZaDugmadVlasnici = document.createElement("div");
        divZaDugmadVlasnici.className = "DivZaDugmadVlasnici";
        kontejnerVlasnici.appendChild(divZaDugmadVlasnici);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeVlasnici";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmadVlasnici.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let roditelj = this.kontejner.parentNode;
            this.kontejner.innerHTML = "";            
            this.crtaj(roditelj);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeVlasnici";
        dugmeDodaj.innerHTML = "Dodaj vlasnika";
        divZaDugmadVlasnici.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.dodajVlasnika(host);

        this.ucitajVlasnike(tabela);
    }

    dodajVlasnika(host){
        let obrisi = host.querySelector(".FormaDodajVlasnika");
        if(obrisi !== null){
            host.removeChild(obrisi);
        }
        let formaDodajVlasnika = document.createElement("div");
        formaDodajVlasnika.className = "FormaDodajVlasnika";
        host.appendChild(formaDodajVlasnika);
        
        let l = document.createElement("label");
        l.className = "NaslovVlasnik";
        l.innerHTML = "Vlasnik";
        formaDodajVlasnika.appendChild(l);
        
        let divZaJMBG = document.createElement("div");
        divZaJMBG.className = "DivZaJMBGVlasnika";
        formaDodajVlasnika.appendChild(divZaJMBG);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "JMBG: ";
        divZaJMBG.appendChild(l);
        
        let jmbg = document.createElement("input");
        jmbg.className = "inputVlasnik";
        jmbg.type = "text";
        divZaJMBG.appendChild(jmbg);

        let divZaDugmeDodajVlasnika = document.createElement("div");
        divZaDugmeDodajVlasnika.className = "DivZaDugmadVlasnici";
        formaDodajVlasnika.appendChild(divZaDugmeDodajVlasnika);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeVlasnici";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmeDodajVlasnika.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let div = this.kontejner.querySelector(".DivZaPrikaz");
            this.crtajVlasnike(div);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeVlasnici";
        dugmeDodaj.innerHTML = "Sacuvaj";
        divZaDugmeDodajVlasnika.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.snimiVlasnika(jmbg.value);

    }

    snimiVlasnika(jmbg){
        let validacija = "";
        if(jmbg === null || jmbg === undefined || jmbg === ""){
            validacija += "Unesite jmbg vlasnika!\n";
        }
        else if(jmbg.length !== 13){
            validacija += "JMBG se mora sastojati od tacno 13 cifara!\n";
        }

        if(validacija !== ""){
            alert(validacija);
            return;
        }
        else{
            fetch("https://localhost:5001/Vlasnik/Dodaj/" + this.registracioniBroj + "/" + jmbg,
            {
                method:"POST"
            }).then(s => {
                if(s.ok){
                    s.text().then(data => {
                        alert(data);
                        let divZaPrika = this.kontejner.querySelector(".DivZaPrikaz");
                        divZaPrika.innerHTML = "";
                        this.crtajVlasnike(divZaPrika);
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

    ucitajVlasnike(tabela){
        fetch("https://localhost:5001/Vlasnik/Preuzmi/" + this.registracioniBroj,
        {
            method:"Get"
        }).then(s => {
            if(s.ok){
                s.json().then(vlasnici => {
                    vlasnici.forEach(vlasnik => {
                        let v = new Vlasnik(vlasnik.id, vlasnik.nazivGazdinstva, vlasnik.ime, vlasnik.srednjeSlovo, vlasnik.prezime, vlasnik.jmbg, this.registracioniBroj);
                        v.crtaj(tabela);
                    });
                })
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })
    }

    //////////////////////////////////////////////////
    //Sve za clanove porodice

    crtajClanovePorodice(host){
        this.kontejner.className = "KontejnerGazdinstvoNova";
        host.innerHTML = "";
        let kontejnerClanovi = document.createElement("div");
        kontejnerClanovi.className = "KontejnerClanovi";
        host.appendChild(kontejnerClanovi);

        let tabela = document.createElement("table");
        tabela.className = "TabelaClanovi";
        kontejnerClanovi.appendChild(tabela);

        let tabelaHead = document.createElement("thead");
        tabela.appendChild(tabelaHead);

        let tr = document.createElement("tr");
        tabelaHead.appendChild(tr);

        let th;
        let nizZaglavlja = ["Ime", "Srednje slovo", "Prezime", "JMBG"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.className = "LabeleGazdinstva";
            th.innerHTML = el;
            tr.appendChild(th);
        })

        let tabelaBody = document.createElement("tbody");
        tabelaBody.className = "TabelaClanoviPodaci";
        tabela.appendChild(tabelaBody);

        let divZaDugmadClanovi = document.createElement("div");
        divZaDugmadClanovi.className = "DivZaDugmadClanovi";
        kontejnerClanovi.appendChild(divZaDugmadClanovi);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeClanovi";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmadClanovi.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let roditelj = this.kontejner.parentNode;
            this.kontejner.innerHTML = "";            
            this.crtaj(roditelj);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeClanovi";
        dugmeDodaj.innerHTML = "Dodaj clana porodice";
        divZaDugmadClanovi.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.dodajClanaPorodice(host);

        this.ucitajClanovePorodice(tabela);
    }

    dodajClanaPorodice(host){
        let obrisi = host.querySelector(".FormaDodajClana");
        if(obrisi !== null){
            host.removeChild(obrisi);
        }
        let formaDodajClana = document.createElement("div");
        formaDodajClana.className = "FormaDodajClana";
        host.appendChild(formaDodajClana);
        
        let l = document.createElement("label");
        l.className = "NaslovClanPorodice";
        l.innerHTML = "Clan porodice";
        formaDodajClana.appendChild(l);
        
        let divZaIme = document.createElement("div");
        divZaIme.className = "DivZaImeClana";
        formaDodajClana.appendChild(divZaIme);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Ime: ";
        divZaIme.appendChild(l);
        
        let ime = document.createElement("input");
        ime.className = "inputClan";
        ime.type = "text";
        divZaIme.appendChild(ime);

        let divZaSrednjeSlovo = document.createElement("div");
        divZaSrednjeSlovo.className = "DivZaSrednjeSlovoClana";
        formaDodajClana.appendChild(divZaSrednjeSlovo);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Srednje slovo: ";
        divZaSrednjeSlovo.appendChild(l);
        
        let srednjeSlovo = document.createElement("input");
        srednjeSlovo.className = "inputClan";
        srednjeSlovo.type = "text";
        divZaSrednjeSlovo.appendChild(srednjeSlovo);

        let divZaPrezime = document.createElement("div");
        divZaPrezime.className = "DivZaPrezimeClana";
        formaDodajClana.appendChild(divZaPrezime);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Prezime: ";
        divZaPrezime.appendChild(l);
        
        let prezime = document.createElement("input");
        prezime.className = "inputClan";
        prezime.type = "text";
        divZaPrezime.appendChild(prezime);

        let divZaJMBG = document.createElement("div");
        divZaJMBG.className = "DivZaJMBGClana";
        formaDodajClana.appendChild(divZaJMBG);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "JMBG: ";
        divZaJMBG.appendChild(l);
        
        let jmbg = document.createElement("input");
        jmbg.className = "inputClan";
        jmbg.type = "text";
        divZaJMBG.appendChild(jmbg);

        let divZaDugmeDodajClana = document.createElement("div");
        divZaDugmeDodajClana.className = "DivZaDugmadClanovi";
        formaDodajClana.appendChild(divZaDugmeDodajClana);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeClanovi";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmeDodajClana.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let div = this.kontejner.querySelector(".DivZaPrikaz");
            this.crtajClanovePorodice(div);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeClanovi";
        dugmeDodaj.innerHTML = "Sacuvaj";
        divZaDugmeDodajClana.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.snimiClanaPorodice(ime.value, srednjeSlovo.value, prezime.value, jmbg.value);

    }

    snimiClanaPorodice(ime, srednjeSlovo, prezime, jmbg){
        let validacija = "";
        if(ime === null || ime === undefined || ime === ""){
            validacija += "Unesite ime clana porodice!\n";
        }
        else if(ime.length > 30){
            validacija += "Ime clana porodice ne sme biti duze od 30 karaktera!\n";
        }

        if(srednjeSlovo === null || srednjeSlovo === undefined || srednjeSlovo === ""){
            validacija += "Unesite srednje slovo clana porodice!\n";
        }
        else if(srednjeSlovo.length != 1){
            validacija += "Srednje slovo clana porodice mora se sastojati od jednog slova!\n";
        }

        if(prezime === null || prezime === undefined || prezime === ""){
            validacija += "Unesite prezime clana porodice!\n";
        }
        else if(prezime.length > 30){
            validacija += "Prezime clana porodice ne sme biti duze od 30 karaktera!\n";
        }

        if(jmbg === null || jmbg === undefined || jmbg === ""){
            validacija += "Unesite jmbg clana porodice!\n";
        }
        else if(jmbg.length !== 13){
            validacija += "JMBG se mora sastojati od tacno 13 cifara!\n";
        }

        if(validacija !== ""){
            alert(validacija);
            return;
        }
        else{
            fetch("https://localhost:5001/ClanPorodice/Dodaj/" + ime + "/" + srednjeSlovo + "/" + prezime + "/" + jmbg,
            {
                method:"POST"
            }).then(s => {
                if(s.ok){
                    s.text().then(data => {
                        alert(data);
                        let divZaPrika = this.kontejner.querySelector(".DivZaPrikaz");
                        divZaPrika.innerHTML = "";
                        this.crtajClanovePorodice(divZaPrika);
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

    ucitajClanovePorodice(tabela){
        fetch("https://localhost:5001/ClanPorodice/Preuzmi")
        .then(s => {
            if(s.ok){
                s.json().then(clanovi => {
                    clanovi.forEach(clan => {
                        let cp = new ClanPorodice(clan.id, clan.ime, clan.srednjeSlovo, clan.prezime, clan.jmbg);
                        cp.crtaj(tabela);
                    });
                })
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })
    }

    //////////////////////////////////////////////////
    //Sve za radnike

    crtajRadnike(host){
        this.kontejner.className = "KontejnerGazdinstvoNova";
        host.innerHTML = "";
        let kontejnerRadnici = document.createElement("div");
        kontejnerRadnici.className = "KontejnerRadnici";
        host.appendChild(kontejnerRadnici);

        let tabela = document.createElement("table");
        tabela.className = "TabelaRadnici";
        kontejnerRadnici.appendChild(tabela);

        let tabelaHead = document.createElement("thead");
        tabela.appendChild(tabelaHead);

        let tr = document.createElement("tr");
        tabelaHead.appendChild(tr);

        let th;
        let nizZaglavlja = ["Ime", "Prezime", "Nadimak", "Plata"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.className = "LabeleGazdinstva";
            th.innerHTML = el;
            tr.appendChild(th);
        })

        let tabelaBody = document.createElement("tbody");
        tabelaBody.className = "TabelaRadniciPodaci";
        tabela.appendChild(tabelaBody);

        let divZaDugmadRadnici = document.createElement("div");
        divZaDugmadRadnici.className = "DivZaDugmadRadnici";
        kontejnerRadnici.appendChild(divZaDugmadRadnici);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeRadnici";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmadRadnici.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let roditelj = this.kontejner.parentNode;
            this.kontejner.innerHTML = "";            
            this.crtaj(roditelj);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeRadnici";
        dugmeDodaj.innerHTML = "Zaposli radnika";
        divZaDugmadRadnici.appendChild(dugmeDodaj);
        if(this.status === "Aktivno"){
            dugmeDodaj.onclick = (ev) => this.dodajRadnika(host);
        }
        else{
            dugmeDodaj.onclick = () => {
                alert("Ne mozete zaposljavati radnike dok je gazdinstvo u stecaju!");
            }
        }

        this.ucitajRadnike(tabela);
    }

    dodajRadnika(host){
        let obrisi = host.querySelector(".FormaDodajRadnika");
        if(obrisi !== null){
            host.removeChild(obrisi);
        }
        let formaDodajRadnika = document.createElement("div");
        formaDodajRadnika.className = "FormaDodajRadnika";
        host.appendChild(formaDodajRadnika);
        
        let l = document.createElement("label");
        l.className = "NaslovRadnik";
        l.innerHTML = "Radnik";
        formaDodajRadnika.appendChild(l);
        
        let divZaIme = document.createElement("div");
        divZaIme.className = "DivZaImeRadnika";
        formaDodajRadnika.appendChild(divZaIme);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Ime: ";
        divZaIme.appendChild(l);
        
        let ime = document.createElement("input");
        ime.className = "inputRadnika";
        ime.type = "text";
        divZaIme.appendChild(ime);

        let divZaPrezime = document.createElement("div");
        divZaPrezime.className = "DivZaPrezimeRadnika";
        formaDodajRadnika.appendChild(divZaPrezime);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Prezime: ";
        divZaPrezime.appendChild(l);
        
        let prezime = document.createElement("input");
        prezime.className = "inputRadnika";
        prezime.type = "text";
        divZaPrezime.appendChild(prezime);

        let divZaNadimak = document.createElement("div");
        divZaNadimak.className = "DivZaNadimakRadnika";
        formaDodajRadnika.appendChild(divZaNadimak);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Nadimak: ";
        divZaNadimak.appendChild(l);
        
        let nadimak = document.createElement("input");
        nadimak.className = "inputRadnika";
        nadimak.type = "text";
        divZaNadimak.appendChild(nadimak);

        let divZaPlatu = document.createElement("div");
        divZaPlatu.className = "DivZaPlatuRadnika";
        formaDodajRadnika.appendChild(divZaPlatu);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Plata: ";
        divZaPlatu.appendChild(l);
        
        let plata = document.createElement("input");
        plata.className = "inputRadnik";
        plata.type = "number";
        divZaPlatu.appendChild(plata);

        let divZaDugmeDodajRadnika = document.createElement("div");
        divZaDugmeDodajRadnika.className = "DivZaDugmadRadnici";
        formaDodajRadnika.appendChild(divZaDugmeDodajRadnika);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeRadnici";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmeDodajRadnika.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let div = this.kontejner.querySelector(".DivZaPrikaz");
            this.crtajRadnike(div);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeRadnici";
        dugmeDodaj.innerHTML = "Sacuvaj";
        divZaDugmeDodajRadnika.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.snimiRadnika(ime.value, prezime.value, nadimak.value, plata.value);

    }

    snimiRadnika(ime, prezime, nadimak, plata){
        let validacija = "";
        if(ime === null || ime === undefined || ime === ""){
            validacija += "Unesite ime radnika!\n";
        }
        else if(ime.length > 30){
            validacija += "Ime radnika ne sme biti duze od 30 karaktera!\n";
        }

        if(prezime === null || prezime === undefined || prezime === ""){
            validacija += "Unesite prezime radnika!\n";
        }
        else if(prezime.length > 30){
            validacija += "Prezime radnika ne sme biti duze od 30 karaktera!\n";
        }

        if(nadimak === null || nadimak === undefined || nadimak === ""){
            validacija += "Unesite nadimak radnika!\n";
        }
        else if(nadimak.length > 30){
            validacija += "Nadimak radnika ne sme biti duzi od 20 karaktera!\n";
        }

        if(plata === null || plata === undefined || plata === ""){
            validacija += "Unesite platu radnika!\n";
        }
        else if(plata < 35000 || plata > 1000000){
            validacija += "Plata radnika ne moze biti manja od minimalca(35000 dinara) a ni veca od 1000000 dinara!\n";
        }

        if(validacija !== ""){
            alert(validacija);
            return;
        }
        else{
            fetch("https://localhost:5001/Radnik/Dodaj/" + ime + "/" + prezime + "/" + nadimak + "/" + plata + "/" + this.registracioniBroj,
            {
                method:"POST"
            }).then(s => {
                if(s.ok){
                    s.text().then(data => {
                        alert(data);
                        let divZaPrika = this.kontejner.querySelector(".DivZaPrikaz");
                        divZaPrika.innerHTML = "";
                        this.crtajRadnike(divZaPrika);
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

    ucitajRadnike(tabela){
        fetch("https://localhost:5001/Radnik/Preuzmi/" + this.registracioniBroj,
        {
            method:"GET"
        }).then(s => {
            if(s.ok){
                s.json().then(radnici => {
                    radnici.forEach(radnik => {
                        let r = new Radnik(radnik.id, radnik.ime, radnik.prezime, radnik.nadimak, radnik.plata, this.registracioniBroj);
                        r.crtaj(tabela);
                    });
                })
            }
            else{
                s.text().then(data => {
                    alert(data);
                })
            }
        })
    }

    //////////////////////////////////////////////////
    //Sve za Upravljanje

    crtajUpravljanje(host){
        this.kontejner.className = "KontejnerGazdinstvoNova";
        host.innerHTML = "";
        let kontejnerUpravljanje = document.createElement("div");
        kontejnerUpravljanje.className = "KontejnerUpravljanje";
        host.appendChild(kontejnerUpravljanje);

        let tabela = document.createElement("table");
        tabela.className = "TabelaUpravljanje";
        kontejnerUpravljanje.appendChild(tabela);

        let tabelaHead = document.createElement("thead");
        tabela.appendChild(tabelaHead);

        let tr = document.createElement("tr");
        tabelaHead.appendChild(tr);

        let th;
        let nizZaglavlja = ["Nadimak radnika", "Reg vozila/ mehanizacije", "Reg broj gazdinstva"];
        nizZaglavlja.forEach(el => {
            th = document.createElement("th");
            th.classList.add("LabeleGazdinstva");
            th.classList.add("labeleUpravlja");
            th.innerHTML = el;
            tr.appendChild(th);
        })

        let tabelaBody = document.createElement("tbody");
        tabelaBody.className = "TabelaUpravljanjePodaci";
        tabela.appendChild(tabelaBody);

        let divZaDugmadUpravljanje = document.createElement("div");
        divZaDugmadUpravljanje.className = "DivZaDugmadUpravljanje";
        kontejnerUpravljanje.appendChild(divZaDugmadUpravljanje);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeUpravljaju";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmadUpravljanje.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let roditelj = this.kontejner.parentNode;
            this.kontejner.innerHTML = "";            
            this.crtaj(roditelj);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeUpravljaju";
        dugmeDodaj.innerHTML = "Dodaj upravljanje radnika";
        divZaDugmadUpravljanje.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.dodajUpravljanje(host);

        this.ucitajUpravljanje(tabela);
    }

    dodajUpravljanje(host){
        let obrisi = host.querySelector(".FormaDodajUpravljanje");
        if(obrisi !== null){
            host.removeChild(obrisi);
        }
        let formaDodajUpravljanje = document.createElement("div");
        formaDodajUpravljanje.className = "FormaDodajUpravljanje";
        host.appendChild(formaDodajUpravljanje);
        
        let l = document.createElement("label");
        l.className = "NaslovUpravljanje";
        l.innerHTML = "Upravljanje";
        formaDodajUpravljanje.appendChild(l);

        let divZaNadimak = document.createElement("div");
        divZaNadimak.className = "DivZaNadimakRadnika";
        formaDodajUpravljanje.appendChild(divZaNadimak);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Nadimak: ";
        divZaNadimak.appendChild(l);
        
        let nadimak = document.createElement("input");
        nadimak.className = "inputRadnika";
        nadimak.type = "text";
        divZaNadimak.appendChild(nadimak);

        let divZaRegistraciju = document.createElement("div");
        divZaRegistraciju.className = "DivZaRegistracijuVozilaMehanizacije";
        formaDodajUpravljanje.appendChild(divZaRegistraciju);
        
        l = document.createElement("label");
        l.className = "LabeleGazdinstva";
        l.innerHTML = "Registracija: ";
        divZaRegistraciju.appendChild(l);
        
        let registracija = document.createElement("input");
        registracija.className = "inputVoziloMehanizacija";
        registracija.type = "text";
        divZaRegistraciju.appendChild(registracija);
        
        let divZaDugmeDodajUpravljanje = document.createElement("div");
        divZaDugmeDodajUpravljanje.className = "DivZaDugmadUpravljanje";
        formaDodajUpravljanje.appendChild(divZaDugmeDodajUpravljanje);
        
        let dugmeNazad = document.createElement("button");
        dugmeNazad.className = "DugmeUpravljaju";
        dugmeNazad.innerHTML = "Nazad";
        divZaDugmeDodajUpravljanje.appendChild(dugmeNazad);
        dugmeNazad.onclick = () => {
            let div = this.kontejner.querySelector(".DivZaPrikaz");
            this.crtajUpravljanje(div);
        }

        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.className = "DugmeUpravljaju";
        dugmeDodaj.innerHTML = "Sacuvaj";
        divZaDugmeDodajUpravljanje.appendChild(dugmeDodaj);
        dugmeDodaj.onclick = (ev) => this.snimiUpravljanje(nadimak.value, registracija.value);

    }

    snimiUpravljanje(nadimak, registracija){
        let validacija = "";
        if(nadimak === null || nadimak === undefined || nadimak === ""){
            validacija += "Unesite nadimak radnika!\n";
        }
        else if(nadimak.length > 30){
            validacija += "Nadimak radnika ne sme biti duzi od 20 karaktera!\n";
        }

        if(registracija === null || registracija === undefined || registracija === ""){
            validacija += "Unesite registraciju vozila/mehanizacije!\n";
        }
        else if(registracija.length < 9 || registracija.length > 10){
            validacija += "Registracija ne sme biti duza od 10 karaktera!\n";
        }

        if(validacija !== ""){
            alert(validacija);
            return;
        }
        else{
            fetch("https://localhost:5001/Upravlja/Dodaj/" + nadimak + "/" + registracija + "/" + this.registracioniBroj,
            {
                method:"POST"
            }).then(s => {
                if(s.ok){
                    s.text().then(data => {
                        alert(data);
                        let divZaPrika = this.kontejner.querySelector(".DivZaPrikaz");
                        divZaPrika.innerHTML = "";
                        this.crtajUpravljanje(divZaPrika);
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

    ucitajUpravljanje(tabela){
        fetch("https://localhost:5001/Upravlja/Preuzmi/" + this.registracioniBroj,
        {
            method:"GET"
        }).then(s => {
            if(s.ok){
                s.json().then(upravljaju => {
                    upravljaju.forEach(upravlja => {
                        let u = new Upravlja(upravlja.id, upravlja.nadimak, upravlja.registracija, this.registracioniBroj);
                        u.crtaj(tabela);
                    });
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