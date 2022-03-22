using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace Projekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GazdinstvoController : ControllerBase
    {
        public GazdinstvoContext Context { get; set; }
        public GazdinstvoController(GazdinstvoContext context)
        {
            Context = context;
        }

        [Route("Dodaj/{regBroj}/{status}/{naziv}/{adresa}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string regBroj, string status, string naziv, string adresa)
        {
            if(string.IsNullOrWhiteSpace(regBroj) || regBroj.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBroj.Length);
            }
            if(string.IsNullOrWhiteSpace(status))
            {
                return BadRequest("Status gazdinstva nije ispravan!");
            }
            if(string.IsNullOrEmpty(naziv) || naziv.Length > 30)
            {
                return BadRequest("Naziv gazdinstva nije ispravan!");
            }
            if(string.IsNullOrEmpty(adresa) || adresa.Length > 50)
            {
                return BadRequest("Adresa gazdinstva nije ispravna!");
            }
            try
            {
                var gazdinstvo = Context.Gazdinstva.Where(p => p.RegistracioniBroj == regBroj).FirstOrDefault();
                if(gazdinstvo != null)
                {
                    return BadRequest("Gazdinstvo sa zadatim registracionim brojem vec postoji!");
                }
                gazdinstvo = Context.Gazdinstva.Where(p => p.Naziv == naziv).FirstOrDefault();
                if(gazdinstvo != null)
                {
                    return BadRequest("Gazdinstvo sa zadatim nazivom vec postoji!");
                }
                gazdinstvo = Context.Gazdinstva.Where(p => p.Adresa == adresa).FirstOrDefault();
                if(gazdinstvo != null)
                {
                    return BadRequest("Na zadatoj adresi je vec registrovano jedno gazdinstvo!");
                }
                var novoGazdinstvo = new Gazdinstvo
                {
                    RegistracioniBroj = regBroj,
                    Status = status,
                    Naziv = naziv,
                    Adresa = adresa,
                    BrojVlasnika = 0
                };
                Context.Gazdinstva.Add(novoGazdinstvo);
                await Context.SaveChangesAsync();
                return Ok($"Gazdinstvo je uspesno dodato sa registracionim brojem: {novoGazdinstvo.RegistracioniBroj}");
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
                return Ok(await Context.Gazdinstva.Select(p =>
                new
                {
                    p.RegistracioniBroj,
                    p.Status,
                    p.Naziv,
                    p.Adresa,
                    p.BrojVlasnika
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PromeniStatus/{regBroj}")]
        [HttpPut]
        public async Task<ActionResult> PromeniStatus(string regBroj)
        {
            if(string.IsNullOrWhiteSpace(regBroj) || regBroj.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBroj.Length);
            }
            try
            {
                var gazdinstvo = await Context.Gazdinstva.Where(p => p.RegistracioniBroj == regBroj).FirstOrDefaultAsync();
                if(gazdinstvo == null)
                {
                    return BadRequest($"Ne postoji gazdinstvo sa registracionim brojem: {regBroj}!");
                }
                if(gazdinstvo.Status == "Aktivno")
                {
                    gazdinstvo.Status = "Stecaj";
                }
                else
                {
                    gazdinstvo.Status = "Aktivno";
                }
                await Context.SaveChangesAsync();
                return Ok($"Uspesno izmenjen status gazdinstva sa registracionim brojem: {regBroj}!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Izbrisi/{regBrojGazdinstva}")]
        [HttpDelete]
        public async Task<ActionResult> Izbrisi(string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var gazdinstvo = await Context.Gazdinstva.Where(p => p.RegistracioniBroj == regBrojGazdinstva).FirstOrDefaultAsync();
                if(gazdinstvo == null)
                {
                    return BadRequest("Gazdinstvo ne postoji!");
                }
                Context.Gazdinstva.RemoveRange(gazdinstvo);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisano gazdinstvo!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
