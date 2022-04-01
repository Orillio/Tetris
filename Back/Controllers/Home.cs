
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Tetris.Contollers
{
    public class Home : Controller
    {
        public ViewResult Index()
        {
            return View();
        }
    }
}