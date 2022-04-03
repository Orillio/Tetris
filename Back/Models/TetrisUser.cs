using Microsoft.AspNetCore.Identity;

namespace Tetris.Models
{
    public class TetrisUser : IdentityUser
    {
        public string Settings { get; set; }
    }
}