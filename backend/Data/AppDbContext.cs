using Microsoft.EntityFrameworkCore;
using TaskManager.Models;

namespace TaskManager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Note> Notes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .Property(prop => prop.Description)
                .HasMaxLength(80);

            modelBuilder.Entity<Category>()
                .HasData(
                    new Category { CategoryID = 1, Description = "English", CreationDate = new System.DateTime() },
                    new Category { CategoryID = 2, Description = "Programming", CreationDate = new System.DateTime() },
                    new Category { CategoryID = 3, Description = "Music", CreationDate = new System.DateTime() }
                );

            modelBuilder.Entity<Note>()
                .Property(prop => prop.Description)
                .HasMaxLength(80);

            modelBuilder.Entity<Note>()
                .HasData(
                    new Note { NoteID = 1, Description = "SubV Chords", CategoryID = 3, CreationDate = new System.DateTime(), IntentedDate = new System.DateTime(), Done = false },
                    new Note { NoteID = 2, Description = "Web Sockets", CategoryID = 2, CreationDate = new System.DateTime(), IntentedDate = new System.DateTime(), Done = false },
                    new Note { NoteID = 3, Description = "Modal Verbs", CategoryID = 1, CreationDate = new System.DateTime(), IntentedDate = new System.DateTime(), Done = false }
                );
        }

        public DbSet<TaskManager.Models.Note> Note { get; set; }
    }
}
