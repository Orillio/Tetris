using Microsoft.AspNetCore.Mvc;

namespace Tetris.Components
{
    public class FieldViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}