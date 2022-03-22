using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class VoziloMehanizacija
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        [RegularExpression(@"\w+")]
        public string Tip { get; set; }

        [Required]
        [MaxLength(30)]
        [RegularExpression(@"\w+")]
        public string Marka { get; set; }

        [Required]
        [MaxLength(10)]
        [MinLength(9)]
        public string Registracija { get; set; }

        public Gazdinstvo Gazdinstvo { get; set; }

        public List<Upravlja> Radnici { get; set; }
    }
}