using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Notes/List
        [HttpPost("List")]
        public async Task<ActionResult<IEnumerable<NoteModel>>> ListNotes(FilterNotesModel filter)
        {
            var query = (
                from note in _context.Notes
                join category in _context.Categories on note.CategoryID equals category.CategoryID
                select new NoteModel {
                    NoteID = note.NoteID,
                    Description = note.Description,
                    IntentedDate = note.IntentedDate,
                    CategoryID = category.CategoryID,
                    Category = category.Description,
                    Done = note.Done
                }
            );
            if(filter.DateFrom.ToString() != "1/1/0001 12:00:00 AM" && !string.IsNullOrEmpty(filter.DateFrom.ToString()))
                query = query.Where(note => filter.DateFrom >= note.IntentedDate);
             if (filter.DateTo.ToString() != "1/1/0001 12:00:00 AM" && !string.IsNullOrEmpty(filter.DateTo.ToString()))
                query.Where(note => filter.DateTo <= note.IntentedDate);
             if (filter.CategoryID > 0)
                query = query.Where(note => note.CategoryID == filter.CategoryID);
            if (!string.IsNullOrEmpty(filter.Description))
                query = query.Where(note => note.Description.ToUpper().Contains(filter.Description.ToUpper()));
            query = query.Where(note => note.Done == filter.Done);

            var result = await query.ToListAsync();
            return Ok(result);
        }

        // GET: api/Notes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> GetNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }

            return note;
        }

        // PUT: api/Notes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNote(int id, Note note)
        {
            if (id != note.NoteID)
            {
                return BadRequest();
            }

            _context.Entry(note).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Notes/Create
        [HttpPost("Create")]
        public async Task<ActionResult<Note>> PostNote(Note note)
        {
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNote", new { id = note.NoteID }, note);
        }

        // DELETE: api/Notes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NoteExists(int id)
        {
            return _context.Notes.Any(e => e.NoteID == id);
        }
    }
}
