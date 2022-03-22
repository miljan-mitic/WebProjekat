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
    public class RadnikController : ControllerBase
    {
        public GazdinstvoContext Context { get; set; }
        public RadnikController(GazdinstvoContext context)
        {
            Context = context;
        }

        [Route("Dodaj/{ime}/{prezime}/{nadimak}/{plata}/{regBrojGazdinstva}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string ime, string prezime, string nadimak, int plata, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(ime) || ime.Length > 30)
            {
                return BadRequest("Ime radnika nije ispravno!");
            }
            if(string.IsNullOrWhiteSpace(prezime) || prezime.Length > 30)
            {
                return BadRequest("Prezime radnika nije ispravno!");
            }
            if(string.IsNullOrWhiteSpace(nadimak) || nadimak.Length > 20)
            {
                return BadRequest("Nadimak radnika nije ispravan!");
            }
            if(plata < 35000 || plata > 1000000)
            {
                return BadRequest("Plata radnika nije ispravna!");
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var radnik = Context.Radnici.Where(p => p.Nadimak == nadimak).FirstOrDefault();

                var gazdinstvo = await Context.Gazdinstva.Where(p => p.RegistracioniBroj == regBrojGazdinstva).FirstOrDefaultAsync();

                if(radnik != null && radnik.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva)
                {
                    return BadRequest($"Radnik sa nadimkom: {nadimak}, vec postoji u gazdinstvu sa registracionim brojem: {regBrojGazdinstva}!");
                }

                var noviRadnik = new Radnik
                {
                    Ime = ime,
                    Prezime = prezime,
                    Nadimak = nadimak,
                    Plata = plata,
                    Gazdinstvo = gazdinstvo
                };
                Context.Radnici.Add(noviRadnik);
                await Context.SaveChangesAsync();
                return Ok($"Radnik sa nadimkom: {nadimak}, je uspesno zaposljen u gazdinstvu sa registracionim brojem: {regBrojGazdinstva}!");

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
                var radnici = Context.Radnici
                        .Include(p => p.Gazdinstvo)
                        .Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva);
                
                if(radnici.FirstOrDefault() == null)
                {
                    return BadRequest($"Gazdinstvo sa registracionim brojem: {regBrojGazdinstva}, ne poseduje radnike!");
                }

                var radnik = await radnici.ToListAsync();

                return Ok
                (
                    radnik.Select(p =>
                    new
                    {
                        ID = p.ID,
                        Ime = p.Ime,
                        Prezime = p.Prezime,
                        Nadimak = p.Nadimak,
                        Plata = p.Plata
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiRadnika/{nadimak}/{regBrojGazdinstva}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiRadnika(string nadimak, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(nadimak) || nadimak.Length > 20)
            {
                return BadRequest("Nadimak radnika nije ispravan!");
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }

            try
            {
                var radnik = await Context.Radnici
                        .Include(p =>  p.Gazdinstvo)
                        .Where(p => p.Nadimak == nadimak && p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).FirstOrDefaultAsync();
                if(radnik == null)
                {
                    return BadRequest("Radnik za otpustanje nije pronadjen!");
                }
                var upravlja = await Context.Upravljanje.Where(p => p.Radnik.Nadimak == nadimak).FirstOrDefaultAsync();
                if(upravlja != null)
                {
                    return BadRequest($"Ne mozete obrisati radnika koji upravlja vozilom/mehanizacijom!");
                }
                Context.Radnici.Remove(radnik);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno otpusten radnik sa nadimkom: {nadimak}, iz gazdinstva sa registracionim brojem: {regBrojGazdinstva}!");
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
                var radnici = await Context.Radnici.Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).ToListAsync();
                if(radnici.FirstOrDefault() == null)
                {
                    return BadRequest("Radnici je prazno!");
                }
                Context.Radnici.RemoveRange(radnici);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisani radnici!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}