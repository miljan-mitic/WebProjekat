using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Upravlja
    {
        [Key]
        public int ID { get; set; }

        public VoziloMehanizacija VoziloMehanizacija { get; set; }

        public Radnik Radnik { get; set; }
    }
}