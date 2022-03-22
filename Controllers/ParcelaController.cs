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
    public class ParcelaController : ControllerBase
    {
        public GazdinstvoContext Context { get; set; }
        public ParcelaController(GazdinstvoContext context)
        {
            Context = context;
        }

        [Route("Dodaj/{registracioniBroj}/{povrsina}/{tip}/{naziv}/{regBrojGazdinstva}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string registracioniBroj, double povrsina, string tip, string naziv, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(registracioniBroj) || registracioniBroj.Length != 10)
            {
                return BadRequest("Registracioni broj parcele mora sadrzati tacno 10 cifara! " + registracioniBroj.Length);
            }
            if(povrsina < 1 || povrsina > 1000000)
            {
                return BadRequest("Povrsina parcele je u rangu od 1 do 1000000!");
            }
            if(string.IsNullOrWhiteSpace(tip))
            {
                return BadRequest("Tip parcele nije ispravan!");
            }
            if(string.IsNullOrEmpty(naziv) || naziv.Length > 30)
            {
                return BadRequest("Naziv parcele nije ispravan!");
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }

            try
            {
                var parcela = Context.Parcele.Where(p => p.RegistracioniBroj == registracioniBroj).FirstOrDefault();
                if(parcela != null)
                {
                    return BadRequest("Parcela sa zadatim registracionim broj vec postoji!");
                }
                
                parcela = Context.Parcele
                        .Include(p => p.Gazdinstvo)
                        .Where(p => p.Naziv == naziv && p.Gazdinstvo.RegistracioniBroj == registracioniBroj).FirstOrDefault();
                if(parcela != null)
                {
                    return BadRequest($"Gazdinstvo sa registracionim brojem: {regBrojGazdinstva}, vec poseduje parcelu sa navedenim nazivom: {naziv}!");
                }

                var gazdinstvo = await Context.Gazdinstva.Where(p => p.RegistracioniBroj == regBrojGazdinstva).FirstOrDefaultAsync();
                var novaParcela = new Parcela
                {
                    RegistracioniBroj = registracioniBroj,
                    Povrsina = povrsina,
                    Tip = tip,
                    Naziv = naziv,
                    Gazdinstvo = gazdinstvo
                };
                Context.Parcele.Add(novaParcela);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno dodata nova parcela sa registracionim brojem: {registracioniBroj}, nazivom: {naziv}, u gazdinstvo sa registracionim brojem: {gazdinstvo.RegistracioniBroj}, nazivom: {gazdinstvo.Naziv}!");
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
                var parcele = Context.Parcele
                        .Include(p => p.Gazdinstvo)
                        .Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva);

                if(parcele.FirstOrDefault() == null)
                {
                    return BadRequest($"Gazdinstvo sa registracionim brojem: {regBrojGazdinstva}, ne poseduje parcele!");
                }
                var parcela = await parcele.ToListAsync();

                return Ok
                (
                    parcela.Select(p =>
                    new
                    {
                        ID = p.ID,
                        RegistracioniBroj = p.RegistracioniBroj,
                        Povrsina = p.Povrsina,
                        Tip = p.Tip,
                        Naziv = p.Naziv
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiParcelu/{registracioniBroj}/{regBrojGazdinstva}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiParcelu(string registracioniBroj, string regBrojGazdinstva)
        {
            if(string.IsNullOrWhiteSpace(registracioniBroj) || registracioniBroj.Length != 10)
            {
                return BadRequest("Registracioni broj parcele mora sadrzati tacno 10 cifara! " + registracioniBroj.Length);
            }
            if(string.IsNullOrWhiteSpace(regBrojGazdinstva) || regBrojGazdinstva.Length != 10)
            {
                return BadRequest("Registracioni broj gazdinstva mora sadrzati tacno 10 cifara! " + regBrojGazdinstva.Length);
            }
            try
            {
                var parcela = await Context.Parcele
                        .Include(p => p.Gazdinstvo)
                        .Where(p => p.RegistracioniBroj == registracioniBroj && p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva)
                        .FirstOrDefaultAsync();
                if(parcela == null)
                {
                    return BadRequest("Parcela za prodaju nije pronadjena!");
                }
                Context.Parcele.Remove(parcela);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno prodata parcela sa registracionim brojem: {registracioniBroj}, gazdinstva sa registracionim brojem: {regBrojGazdinstva}!");
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
                var parcele = await Context.Parcele.Where(p => p.Gazdinstvo.RegistracioniBroj == regBrojGazdinstva).ToListAsync();
                if(parcele.FirstOrDefault() == null)
                {
                    return BadRequest("Parcele je prazno!");
                }
                Context.Parcele.RemoveRange(parcele);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisane parcele!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}