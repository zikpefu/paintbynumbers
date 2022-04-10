using Microsoft.EntityFrameworkCore;

namespace PaintByNumbersProject.Models
{
    public class ImageDbContext:DbContext
    {
        public ImageDbContext(DbContextOptions<ImageDbContext> options):base(options)
        {

        }

        public DbSet<ImageModel> Images { get; set; }
    }
}
