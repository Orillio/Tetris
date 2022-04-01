using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Tetris.Models;

namespace Tetris
{
    public class Startup
    {
        IConfiguration Configuration { get; set; }
        public Startup(IConfiguration conf)
        {
            Configuration = conf;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddMvc(services => services.EnableEndpointRouting = false)
                .AddSessionStateTempDataProvider()
                .AddSessionStateTempDataProvider();

            services.AddDbContext<IdentityContext>(options => 
            {
                options.UseSqlServer(Configuration["ConnectionStrings:Identity"]);
            });
            services.AddIdentity<IdentityUser, IdentityRole>(options => {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
            })
            .AddDefaultTokenProviders()
            .AddEntityFrameworkStores<IdentityContext>();

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromDays(1);
            });
            services.AddMemoryCache();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseStaticFiles();
            app.UseSession();
            app.UseAuthorization();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(null,
                    template: "",
                    defaults: new { controller = "Home", action = "Index" }
                );
            });

            DbMigrate.EnsureCreated(app);
        }
    }
}
