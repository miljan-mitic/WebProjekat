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
    public class VoziloMehanizacijaController : ControllerBase
    {
        public GazdinstvoContext Context { get; set; }
        public VoziloMehanizacijaController(GazdinstvoContext context)
        {
            Context = context;
        }

        [Route("Dodaj/{tip}/{marka}/{registracija}/{regBrojGazdinstva}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string tip, string marka, string registracija, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(tip) || tip.Length > 30)
            {
                return BadRequest("Tip vozila/mehanizacije ne sme biti duzi od 30 karaktera! " + tip.Length);
            }
            if(string.IsNullOrWhiteSpace(marka) || marka.Length > 30)
            {
                return BadRequest("Marka vozila/mehanizacije ne sme biti duza od 30 karaktera! " + marka.Length);
            }
            if(string.IsNullOrWhiteSpace(registracija) || registracija.Length < 9 || registracija.Length > 10)
            {
                return BadRequest("Registracija vozila/mehanizacije ne sme biti kraca od 9 a duza od 10 karaktera!");
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }

            try
            {
                var voziloMehanizacija = Context.VozilaMehanizacije.Where(p => p.Registracija == registracija).FirstOrDefault();
                if(voziloMehanizacija != null)
                {
                    return BadRequest("Vozilo sa zadatom registracijom vec postoji!");
                }
                var gazdinstvo = await Context.Gazdinstva.Where(p => p.RegistracioniBroj == regBrojGazdinstva).FirstOrDefaultAsync();
                var novoVoziloMehanizacija = new VoziloMehanizacija
                {
                    Tip = tip,
                    Marka = marka,
                    Registracija = registracija,
                    Gazdinstvo = gazdinstvo
                };
                Context.VozilaMehanizacije.Add(novoVoziloMehanizacija);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno dodato novo vozilo/mehanizacija sa registracijom: {registracija}, u gazdinstvu sa registracionim brojem: {regBrojGazdinstva}!");
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
                var vozilaMehanizacije = Context.VozilaMehanizacije
                        .Include(p => p.Gazdinstvo)
                        .Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva);

                if(vozilaMehanizacije.FirstOrDefault() == null)
                {
                    return BadRequest($"Gazdinstvo sa registracionim brojem: {regBrojGazdinstva}, ne poseduje vozila/mehanizacije!");
                }
                var voziloMehanizacija = await vozilaMehanizacije.ToListAsync();

                return Ok
                (
                    vozilaMehanizacije.Select(p =>
                    new
                    {
                        ID = p.ID,
                        Tip = p.Tip,
                        Marka = p.Marka,
                        Registracija = p.Registracija
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiVoziloMehanizaciju/{registracija}/{regBrojGazdinstva}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiVoziloMehanizaciju(string registracija, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(registracija) || registracija.Length < 9 || registracija.Length > 10)
            {
                return BadRequest("Registracija vozila/mehanizacije ne sme biti kraca od 9 a duza od 10 karaktera!");
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var voziloMehanizacija = await Context.VozilaMehanizacije
                        .Include(p => p.Gazdinstvo)
                        .Where(p => p.Registracija == registracija && p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva)
                        .FirstOrDefaultAsync();
                if(voziloMehanizacija == null)
                {
                    return BadRequest("Vozilo/mehanizacija za prodaju nije pronadjeno!");
                }
                var upravlja = await Context.Upravljanje.Where(p => p.VoziloMehanizacija.Registracija == registracija).FirstOrDefaultAsync();
                if(upravlja != null)
                {
                    return BadRequest($"Ne mozete obrisati vozilo/mehanizaciju kojom radnik upravlja!");
                }
                Context.VozilaMehanizacije.Remove(voziloMehanizacija);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno prodato vozilo/mehanizacija sa registracijom: {registracija}, gazdinstva sa registracionim brojem: {regBrojGazdinstva}!");
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
                var vozilaMehanizacije = await Context.VozilaMehanizacije.Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).ToListAsync();
                if(vozilaMehanizacije.FirstOrDefault() == null)
                {
                    return BadRequest("Vozila/mehanizacije je prazno!");
                }
                Context.VozilaMehanizacije.RemoveRange(vozilaMehanizacije);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisana vozila/mehanizacije!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}