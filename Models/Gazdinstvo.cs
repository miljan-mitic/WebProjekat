using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Gazdinstvo
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        [RegularExpression("^[0-9]*$")]
        public string RegistracioniBroj { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        [MaxLength(30)]
        public string Naziv { get; set; }

        [Required]
        [MaxLength(50)]
        public string Adresa { get; set; }

        [Required]
        public int BrojVlasnika { get; set; }

        public List<Parcela> Parcele { get; set; }

        public List<VoziloMehanizacija> VozilaMehanizacije { get; set; }

        public List<Radnik> Radnici { get; set; }

        public List<Vlasnik> Vlasnici { get; set; }
    }
}