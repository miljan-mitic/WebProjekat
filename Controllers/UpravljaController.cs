using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Projekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UpravljaController : ControllerBase
    {
        public GazdinstvoContext Context { get; set; }
        public UpravljaController(GazdinstvoContext context)
        {
            Context = context;
        }

        [Route("Dodaj/{nadimakRadnika}/{registracijaVozila}/{regBrojGazdinstva}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string nadimakRadnika, string registracijaVozila, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(nadimakRadnika) || nadimakRadnika.Length > 20)
            {
                return BadRequest($"Nadimak radnika nije ispravan! {nadimakRadnika}");
            }
            if(string.IsNullOrWhiteSpace(registracijaVozila) || registracijaVozila.Length < 9 || registracijaVozila.Length > 10)
            {
                return BadRequest("Registracija vozila/mehanizacije ne sme biti kraca od 9 a duza od 10 karaktera!");
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var voziloMehanizacija = Context.VozilaMehanizacije.Where(p => p.Registracija == registracijaVozila && p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).FirstOrDefault();
                if(voziloMehanizacija == null)
                {
                    return BadRequest($"Vozilo sa zadatom registracijom: {registracijaVozila}, ne postoji u gazdinstvu sa registracionim brojem: {regBrojGazdinstva}!");
                }
                var radnik = Context.Radnici.Where(p => p.Nadimak == nadimakRadnika && p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).FirstOrDefault();
                if(radnik == null)
                {
                    return BadRequest($"Radnik sa zadatim nadimkom: {nadimakRadnika}, ne postoji u gazdinstvu sa registracionim brojem: {regBrojGazdinstva}!");
                }
                var upravlja = Context.Upravljanje.Where(p => p.Radnik.Nadimak == nadimakRadnika && p.VoziloMehanizacija.Registracija == registracijaVozila).FirstOrDefault();
                if(upravlja != null)
                {
                    return BadRequest($"Radnik sa nadimkom: {nadimakRadnika}, vec upravlja vozilom sa registracijom: {registracijaVozila}!");
                }
                var novoUpravljanje = new Upravlja
                {
                    VoziloMehanizacija = voziloMehanizacija,
                    Radnik = radnik
                };
                Context.Upravljanje.Add(novoUpravljanje);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno dodato novo upravljanje sa registracijom: {registracijaVozila}, od strane radnika sa nadimkom: {nadimakRadnika}, u gazdinstvu sa registracionim brojem: {regBrojGazdinstva}!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Preuzmi/{regBrojGazdinstva}")]
        [HttpGet]
        public async Task<ActionResult> Preuzmi(string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var upravljaju = Context.Upravljanje
                        .Include(p => p.Radnik)
                        .Include(p => p.VoziloMehanizacija)
                        .ThenInclude(p => p.Gazdinstvo)
                        .Where(p => p.VoziloMehanizacija.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva);

                if(upravljaju.FirstOrDefault() == null)
                {
                    return BadRequest($"U gazdinstvu sa registracionim brojem: {regBrojGazdinstva}, radnici ne upravljaju vozilima/mehanizacijom!");
                }
                var upravlja = await upravljaju.ToListAsync();

                return Ok
                (
                    upravlja.Select(p =>
                    new
                    {
                        ID = p.ID,
                        Nadimak = p.Radnik.Nadimak,
                        Registracija = p.VoziloMehanizacija.Registracija
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiUpravljanje/{nadimakRadnika}/{registracijaVozila}/{regBrojGazdinstva}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiVoziloMehanizaciju(string nadimakRadnika, string registracijaVozila, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(nadimakRadnika) || nadimakRadnika.Length > 20)
            {
                return BadRequest("Nadimak radnika nije ispravan!");
            }
            if(string.IsNullOrWhiteSpace(registracijaVozila) || registracijaVozila.Length < 9 || registracijaVozila.Length > 10)
            {
                return BadRequest("Registracija vozila/mehanizacije ne sme biti kraca od 9 a duza od 10 karaktera!");
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var upravlja = await Context.Upravljanje
                        .Include(p => p.Radnik)
                        .Include(p => p.VoziloMehanizacija)
                        .ThenInclude(p => p.Gazdinstvo)
                        .Where(p => p.Radnik.Nadimak == nadimakRadnika && p.VoziloMehanizacija.Registracija == registracijaVozila && p.VoziloMehanizacija.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva)
                        .FirstOrDefaultAsync();
                if(upravlja == null)
                {
                    return BadRequest("Upravljanje nije pronadjeno!");
                }
                Context.Upravljanje.Remove(upravlja);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisano upravljanje vozila/mehanizacije sa registracijom: {registracijaVozila}, od strane radnika sa nadimkom: {nadimakRadnika}, gazdinstva sa registracionim brojem: {regBrojGazdinstva}!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiSve/{regBrojGazdinstva}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiSve(string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var upravljaju = await Context.Upravljanje.Where(p => p.VoziloMehanizacija.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).ToListAsync();
                if(upravljaju.FirstOrDefault() == null)
                {
                    return StatusCode(302, "Upravljanje je prazno!");
                }
                Context.Upravljanje.RemoveRange(upravljaju);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisano upravljanje!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}