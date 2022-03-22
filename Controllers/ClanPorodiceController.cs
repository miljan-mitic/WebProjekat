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
    public class ClanPorodiceController : ControllerBase
    {
        public GazdinstvoContext Context { get; set; }
        public ClanPorodiceController(GazdinstvoContext context)
        {
            Context = context;
        }

        [Route("Dodaj/{ime}/{srednjeSlovo}/{prezime}/{JMBG}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string ime, string srednjeSlovo, string prezime, string JMBG)
        {
            if(string.IsNullOrWhiteSpace(ime) || ime.Length > 30)
            {
                return BadRequest("Ime clana porodice nije ispravno!");
            }
            if(string.IsNullOrWhiteSpace(srednjeSlovo) || srednjeSlovo.Length > 1)
            {
                return BadRequest("Sredje slovo clana porodice nije ispravno!");
            }
            if(string.IsNullOrWhiteSpace(prezime) || prezime.Length > 30)
            {
                return BadRequest("Prezime clana porodice nije ispravno!");
            }
            if(string.IsNullOrWhiteSpace(JMBG) || JMBG.Length != 13)
            {
                return BadRequest("JMBG clana porodice mora sadrzati tacno 13 cifara!");
            }
            try
            {
                var clanPorodice = Context.ClanoviPorodice.Where(p => p.JMBG == JMBG).FirstOrDefault();
                if(clanPorodice != null)
                {
                    return StatusCode(302, $"Clan porodice sa navedenim JMBG-om: {clanPorodice.JMBG}, vec postoji!");
                }
                var noviClanPorodice = new ClanPorodice
                {
                    Ime = ime,
                    SrednjeSlovo = srednjeSlovo,
                    Prezime = prezime,
                    JMBG = JMBG
                };
                Context.ClanoviPorodice.Add(noviClanPorodice);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno dodat novi clan porodice sa navedenim JMBG-om: {JMBG}!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Preuzmi")]
        [HttpGet]
        public async Task<ActionResult> Preuzmi()
        {
            try
            {
                return Ok(await Context.ClanoviPorodice.Select(p =>
                new
                {
                    p.Ime,
                    p.SrednjeSlovo,
                    p.Prezime,
                    p.JMBG
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiClanaPorodice/{jmbg}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiClanaPorodice(string jmbg)
        {
            if(string.IsNullOrWhiteSpace(jmbg) || jmbg.Length != 13)
            {
                return BadRequest("JMBG clana porodice mora sadrzati tacno 13 cifara!");
            }
            try
            {
                var clanPorodice = await Context.ClanoviPorodice.Where(p => p.JMBG == jmbg).FirstOrDefaultAsync();
                if(clanPorodice == null)
                {
                    return BadRequest($"Ne postoji clan porodice sa zadatim JMBG-om: {jmbg}");
                }
                var vlasnik = await Context.Vlasnici.Where(p => p.ClanPorodice.JMBG == jmbg).FirstOrDefaultAsync();
                if(vlasnik != null)
                {
                    return BadRequest($"Ne mozete obrisati clana porodice koji je vlasnik gazdinstva!");
                }
                Context.ClanoviPorodice.Remove(clanPorodice);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisan clan porodice sa JMBG-om: {jmbg}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}