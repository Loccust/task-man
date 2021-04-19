using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManager.Models
{
    [Table("Categories")]
    public partial class Category
    {
        public Category()
        {
            Notes = new HashSet<Note>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryID { get; set; }
        [Required(ErrorMessage = "The description of the Category is required!", AllowEmptyStrings = false)]
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public virtual ISet<Note> Notes { get; private set; }
    }
}
