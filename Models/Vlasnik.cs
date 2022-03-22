using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Vlasnik
    {
        [Key]
        public int ID { get; set; }

        public Gazdinstvo Gazdinstvo { get; set; }

        public ClanPorodice ClanPorodice { get; set; }
    }
}