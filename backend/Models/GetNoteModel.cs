using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManager.Models
{
    public class GetNoteModel
    {
        public int NoteID { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int CategoryID { get; set; }
        public DateTime IntentedDate { get; set; }
        public bool Done { get; set; }
    }
}
