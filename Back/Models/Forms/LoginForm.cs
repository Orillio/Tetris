using System.ComponentModel.DataAnnotations;

namespace Tetris.Models.Forms
{
    public class LoginForm
    {
        [Required(ErrorMessage = "Не указано имя"), MinLength(5, ErrorMessage = "Имя минимум 5 символов")]
        public string Username { get; set; }
        
        [Required(ErrorMessage = "Не указан пароль"), MinLength(5, ErrorMessage = "Пароль минимум 5 символов")]
        public string Password { get; set; }
    }
}