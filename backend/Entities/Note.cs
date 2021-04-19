using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Models
{
    [Table("Notes")]
    public partial class Note
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NoteID { get; set; }
        [Required(ErrorMessage = "The description of the Task is required!", AllowEmptyStrings = false)]
        public string Description { get; set; }
        [ForeignKey("CategoryID")]
        public int CategoryID { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime IntentedDate { get; set; }
        public bool Done { get; set; }
    }
}
