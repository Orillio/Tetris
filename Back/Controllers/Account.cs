using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Tetris.Models.Forms;

namespace Tetris.Controllers
{
    public class Account : Controller
    {
        UserManager<IdentityUser> manager { get; set; }
        SignInManager<IdentityUser> signIn { get; set; }
        public Account(UserManager<IdentityUser> m,
            SignInManager<IdentityUser> s)
        {
            manager = m;
            signIn = s;
        }

        [HttpGet, AllowAnonymous]
        public IActionResult Create()
        {
            return View(new LoginForm());
        }
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(LoginForm form)
        {
            if(ModelState.IsValid)
            {
                var user = new IdentityUser(form.Username);
                var result = await manager.CreateAsync(user, form.Password);

                if(result.Succeeded)
                {
                    await signIn.PasswordSignInAsync(user, form.Password, false, false);
                    return Redirect("/");
                }
                ModelState?.AddModelError("", "Такой пользователь уже существует");
            }
            return View(form);
        }
        [AllowAnonymous]
        public IActionResult Login()
        {
            return View(new LoginForm());
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginForm form)
        {
            if(!ModelState.IsValid) return View(form);

            var user = await manager.FindByNameAsync(form.Username);

            if(user != null)
            {
                if((await signIn.PasswordSignInAsync(user, form.Password, false, false)).Succeeded)
                {
                    return Redirect("/");
                }
            }
            ModelState?.AddModelError(null, "Введены неправильные имя или пароль");
            return View(form);
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await signIn.SignOutAsync();
            return Redirect("/");
        }
    }
}