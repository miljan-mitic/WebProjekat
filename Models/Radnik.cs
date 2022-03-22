using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Radnik
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        [RegularExpression(@"\w+")]
        public string Ime { get; set; }

        [Required]
        [MaxLength(30)]
        [RegularExpression(@"\w+")]
        public string Prezime { get; set; }

        [Required]
        [MaxLength(20)]
        [RegularExpression(@"\w+")]
        public string Nadimak { get; set; }

        [Required]
        [Range(35000,1000000)]
        public int Plata { get; set; }

        public Gazdinstvo Gazdinstvo { get; set; }

        public List<Upravlja> VozilaMehanizacije { get; set; }
    }
}