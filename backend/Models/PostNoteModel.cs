using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManager.Models
{
    public class PostNoteModel
    {
        public string Description { get; set; }
        public int CategoryID { get; set; }
        public DateTime IntentedDate { get; set; }
    }
}
