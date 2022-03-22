using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class ClanPorodice
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        [RegularExpression(@"\w+")]
        public string Ime { get; set; }

        [Required]
        [MaxLength(1)]
        [RegularExpression(@"\w+")]
        public string SrednjeSlovo { get; set; }

        [Required]
        [MaxLength(30)]
        [RegularExpression(@"\w+")]
        public string Prezime { get; set; }

        [Required]
        [MinLength(13)]
        [MaxLength(13)]
        [RegularExpression("^[0-9]*$")]
        public string JMBG { get; set; }

        public List<Vlasnik> Poseduje { get; set; }

    }
}