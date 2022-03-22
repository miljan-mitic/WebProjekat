using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Parcela
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        [RegularExpression("^[0-9]*$")]
        public string RegistracioniBroj { get; set; }

        [Required]
        [Range(1,1000000)]
        public double Povrsina { get; set; }

        [Required]
        public string Tip { get; set; }

        [Required]
        [MaxLength(30)]
        public string Naziv { get; set; }

        public Gazdinstvo Gazdinstvo { get; set; }
    }
}