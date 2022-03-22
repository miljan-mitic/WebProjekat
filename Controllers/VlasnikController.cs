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
    public class VlasnikController : ControllerBase
    {
        public GazdinstvoContext Context { get; set; }
        public VlasnikController(GazdinstvoContext context)
        {
            Context = context;
        }

        [Route("Dodaj/{regBrojGazdinstva}/{JMBGVlasnika}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string regBrojGazdinstva, string JMBGVlasnika)
        {
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length < 10 || regBrojGazdinstva.Length > 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara!");
            }
            if(string.IsNullOrWhiteSpace(JMBGVlasnika) || JMBGVlasnika.Length < 13 || JMBGVlasnika.Length > 13)
            {
                return BadRequest("JMBG vlasnika mora sadrzati tacno 13 cifara!");
            }
            try
            {
                var gazdinstvo = await Context.Gazdinstva.Where(p => p.RegistracioniBroj == regBrojGazdinstva).FirstOrDefaultAsync();
                if(gazdinstvo == null)
                {
                    return BadRequest($"Ne postoji gazdinstvo sa registracionim brojem: {regBrojGazdinstva}!");
                }
                var clanPorodice = await Context.ClanoviPorodice.Where(p => p.JMBG == JMBGVlasnika).FirstOrDefaultAsync();
                if(clanPorodice == null)
                {
                    return BadRequest($"Ne postoji clan porodice sa navedenim JMBG-om: {JMBGVlasnika}!");
                }
                var vlasnik = await Context.Vlasnici.Where(p => p.Gazdinstvo == gazdinstvo && p.ClanPorodice == clanPorodice).FirstOrDefaultAsync();
                if(vlasnik != null)
                {
                    return BadRequest($"Clan porodice sa JMBG-om: {JMBGVlasnika}, je vec vlasnika gazdinstva sa registracionim brojem: {regBrojGazdinstva}!");
                }
                var noviVlasnik = new Vlasnik
                {
                    Gazdinstvo = gazdinstvo,
                    ClanPorodice = clanPorodice
                };
                gazdinstvo.BrojVlasnika++;
                Context.Vlasnici.Add(noviVlasnik);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno dodat vlasnik sa JMBG-om: {noviVlasnik.ClanPorodice.JMBG}, gazdinstvu: {noviVlasnik.Gazdinstvo.RegistracioniBroj}!");
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
                var vlasnici = Context.Vlasnici
                        .Include(p => p.Gazdinstvo)
                        .Include(p => p.ClanPorodice)
                        .Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva);
                
                var vlasnik = await vlasnici.ToListAsync();
                if(vlasnik.FirstOrDefault() == null)
                {
                    return BadRequest("Nisu pronadjeni vlasnici! " + regBrojGazdinstva);
                }
                return Ok
                (
                    vlasnik.Select(p =>
                    new
                    {
                        ID = p.ID,
                        NazivGazdinstva = p.Gazdinstvo.Naziv,
                        Ime = p.ClanPorodice.Ime,
                        SrednjeSlovo = p.ClanPorodice.SrednjeSlovo,
                        Prezime = p.ClanPorodice.Prezime,
                        JMBG = p.ClanPorodice.JMBG
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiVlasnika/{jmbgVlasnika}/{regBrojGazdinstva}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiVlasnika(string jmbgVlasnika, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(jmbgVlasnika) || jmbgVlasnika.Length != 13)
            {
                return BadRequest("JMBG vlasnika mora sadrzati tacno 13 cifara!");
            }
            
            try
            {
                var vlasnik = await Context.Vlasnici
                        .Include(p => p.Gazdinstvo)
                        .Include(p => p.ClanPorodice)
                        .Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva && p.ClanPorodice.JMBG == jmbgVlasnika).FirstOrDefaultAsync();
                
                if(vlasnik == null)
                {
                    return BadRequest("Vlasnik nije pronadjen!");
                }
                vlasnik.Gazdinstvo.BrojVlasnika--;
                Context.Vlasnici.Remove(vlasnik);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno prodat udeo gazdinstva sa registracionim brojem: {regBrojGazdinstva}, od strane vlasnika sa JMBG-om: {jmbgVlasnika}!");
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
                var vlasnici = await Context.Vlasnici.Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).ToListAsync();
                if(vlasnici.FirstOrDefault() == null)
                {
                    return StatusCode(302, "Vlasnici je prazno!");
                }
                Context.Vlasnici.RemoveRange(vlasnici);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisani vlasnici!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
