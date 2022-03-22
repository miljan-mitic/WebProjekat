import { Gazdinstvo } from "./Gazdinstvo.js"
import { Sajt } from "./Sajt.js";

var listaGazdinstava = [];

fetch("https://localhost:5001/Gazdinstvo/Preuzmi/")
.then(s => {
    if(s.ok){
        s.json().then(gazdinstva => {
            gazdinstva.forEach(gazdinstvo => {
                var g = new Gazdinstvo(gazdinstvo.registracioniBroj, gazdinstvo.status, gazdinstvo.naziv, gazdinstvo.adresa, gazdinstvo.brojVlasnika);
                listaGazdinstava.push(g);
            });
            if(listaGazdinstava.length == 0){
                alert("Nemate gazdinstva!");
            }
            var s = new Sajt(listaGazdinstava);
            s.crtajPregledaj(document.body);
        })
    }
    else{
        s.text().then(data => {
            alert(data);
        })
    }
})
