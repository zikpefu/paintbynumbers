#nullable disable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaintByNumbersProject.Models;
using PaintByNumbersProject.Data;
using System.Net;
using Microsoft.AspNetCore.Authorization;

namespace PaintByNumbersProject.Controllers
{
    [Authorize]
    public class ImageController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;
        public const string EmptyPaitinImageText = "Empty";
        private string GetCurrentUserID()
        {
            var userName = User.Identity.Name;
            return _context.Users.FirstOrDefault(x => x.Email == userName).Id;
        }

        public ImageController(ApplicationDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            this._hostEnvironment = hostEnvironment;
        }

        // GET: Image
        public async Task<IActionResult> Index()
        {
            return View(await _context.Images.Where(x => x.UserID == GetCurrentUserID()).ToListAsync());
        }

        public IActionResult Create()
        {
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ImageId,Title,ImageFile")] ImageModel imageModel)
        {
            var userID = GetCurrentUserID();
            imageModel.UserID = userID;
            if(_context.Images.Count(x=>x.UserID == userID) > 5)
			{
                throw new ArgumentException("You cant add more than 5 images");
			}
            string wwwRootPath = _hostEnvironment.WebRootPath;
            string fileName = Path.GetFileNameWithoutExtension(imageModel.ImageFile.FileName);
            string extension = Path.GetExtension(imageModel.ImageFile.FileName);
            imageModel.ImageName = fileName = fileName + DateTime.Now.ToString("yymmssfff") + extension;
            imageModel.PaintImageName = EmptyPaitinImageText;
            //Save image to wwwroot/Images
            string path = Path.Combine(wwwRootPath + "/Image/", fileName);
            using (var fileStream = new FileStream(path, FileMode.Create))
            {
                await imageModel.ImageFile.CopyToAsync(fileStream);
            }
            _context.Add(imageModel);
            await _context.SaveChangesAsync();
            return RedirectToAction("Details", new { id = imageModel.ImageId });
        }

        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Images.Any(x => x.ImageId == id && x.UserID != GetCurrentUserID()))
            {
                return NotFound();
            }

            var imageModel = await _context.Images
                .FirstOrDefaultAsync(m => m.ImageId == id);
            if (imageModel == null)
            {
                return NotFound();
            }

            return View(imageModel);
        }
        public async Task<IActionResult> Paint(int? id)
        {
            if (id == null || _context.Images.Any(x => x.ImageId == id && x.UserID != GetCurrentUserID()))
            {
                return NotFound();
            }

            var imageModel = await _context.Images
                .FirstOrDefaultAsync(m => m.ImageId == id);
            if (imageModel == null)
            {
                return NotFound();
            }

            return View(imageModel);
        }
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Images.Any(x => x.ImageId == id && x.UserID != GetCurrentUserID()))
            {
                return NotFound();
            }

            var imageModel = await _context.Images
                .FirstOrDefaultAsync(m => m.ImageId == id);
            if (imageModel == null)
            {
                return NotFound();
            }

            return View(imageModel);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {

            var imageModel = await _context.Images.FindAsync(id);
            string wwwRootPath = _hostEnvironment.WebRootPath;
            //REMOVE FILE
            string filePathImageName = Path.Combine(wwwRootPath + "/Image/", imageModel.ImageName);
            System.IO.File.Delete(filePathImageName);

            //REMOVE PAITING FILE
            if (imageModel.PaintImageName != EmptyPaitinImageText)
            {
                //REMOVE FILE
                string filePathPaintImageName = Path.Combine(wwwRootPath + "/Image/", imageModel.PaintImageName);
                System.IO.File.Delete(filePathPaintImageName);
            }
            _context.Images.Remove(imageModel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePaitingImage(IFormFile file, int? ImageID = null)
        {
            try
            {
                if (!_context.Images.Any(x => x.ImageId == ImageID))
                {
                    throw new ArgumentException("Did not found the image");
                }
                var imageModel = _context.Images.Find(ImageID);
                if (imageModel.PaintImageName != EmptyPaitinImageText)
                {
                    throw new ArgumentException("The paiting image was already created");
                }
                string wwwRootPath = _hostEnvironment.WebRootPath;
                if (file == null || file.Length == 0)
                {
                    throw new ArgumentException("Did not receive any file");
                }
                string filePaintImageName = Path.GetFileNameWithoutExtension(imageModel.ImageName) + "-PaintingImage" + ".svg";
                string filePath = Path.Combine(wwwRootPath + "/Image/", filePaintImageName);
                using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                imageModel.PaintImageName = filePaintImageName;
                await _context.SaveChangesAsync();
                return Json("success");
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(ex.Message.ToString());
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateChangesPaitingImage(IFormFile file, int? ImageID = null)
        {
            try
            {
                if (!_context.Images.Any(x => x.ImageId == ImageID))
                {
                    throw new ArgumentException("Did not found the image");
                }
                var imageModel = _context.Images.Find(ImageID);
                string wwwRootPath = _hostEnvironment.WebRootPath;
                if (imageModel.PaintImageName != EmptyPaitinImageText)
                {
                    //REMOVE FILE
                    string filePathPaintImageName = Path.Combine(wwwRootPath + "/Image/", imageModel.PaintImageName);
                    System.IO.File.Delete(filePathPaintImageName);
                }
                if (file == null || file.Length == 0)
                {
                    throw new ArgumentException("Did not receive any file");
                }
                string filePath = Path.Combine(wwwRootPath + "/Image/", imageModel.PaintImageName);
                using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                await _context.SaveChangesAsync();
                return Json("success");
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(ex.Message.ToString());
            }
        }


        private bool ImageModelExists(int id)
        {
            return _context.Images.Any(e => e.ImageId == id);
        }
    }
}
