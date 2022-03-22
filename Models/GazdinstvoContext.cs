using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class GazdinstvoContext : DbContext
    {
        public DbSet<Gazdinstvo> Gazdinstva { get; set; }
        public DbSet<Parcela> Parcele { get; set; }
        public DbSet<VoziloMehanizacija> VozilaMehanizacije { get; set; }
        public DbSet<ClanPorodice> ClanoviPorodice { get; set; }
        public DbSet<Radnik> Radnici { get; set; }
        public DbSet<Vlasnik> Vlasnici { get; set; }
        public DbSet<Upravlja> Upravljanje { get; set; }

        public GazdinstvoContext(DbContextOptions options) : base(options)
        {

        }
    }
}