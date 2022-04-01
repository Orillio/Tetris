using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;
using Tetris.Models.Contexts;

namespace Tetris.Models
{
    public static class DbMigrate
    {
        public static void EnsureCreated(IApplicationBuilder app)
        {
            var context = app.ApplicationServices
                .CreateScope().ServiceProvider
                .GetRequiredService<IdentityContext>();
            if(context.Database.GetPendingMigrations().Any())
            {
                context.Database.Migrate();
            }

        }
    }
}