using Microsoft.AspNetCore.Mvc;

namespace PaintByNumbersProject.Controllers
{
    public class PaintController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
