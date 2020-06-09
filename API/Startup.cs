using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // Dependencies injector containers
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddDbContext<StoreContext>(x => x.UseSqlite(
                _config.GetConnectionString("DefaultConnection")
            ));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Where we add middleware
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                // Sends a developer friendly development page
                app.UseDeveloperExceptionPage();
            }

            // Redirects http calls to https endpoint
            app.UseHttpsRedirection();

            // Gets the control we are hitting
            app.UseRouting();

            // Dosen't do anything for now
            app.UseAuthorization();

            // Maps all our endpoints to our controllers so our api server knows where to send the request on to
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
