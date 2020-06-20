using API.Extensions;
using API.Helpers;
using API.Middleware;
using AutoMapper;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddControllers();
            services.AddDbContext<StoreContext>(x => x.UseSqlite(
                _config.GetConnectionString("DefaultConnection")
            ));

            services.AddApplicationServices();
            services.AddSwaggerDocumentation();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Where we add middleware
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Our exception middleware
            app.UseMiddleware<ExceptionMiddleware>();

            //if (env.IsDevelopment())
            //{
            //    // Sends a developer friendly development page
            //    app.UseDeveloperExceptionPage();
            //}

            // Adds a middleware for error handling
            app.UseStatusCodePagesWithRedirects("/errors/{0}");

            // Redirects http calls to https endpoint
            app.UseHttpsRedirection();

            // Gets the control we are hitting
            app.UseRouting();

            // Necessary to use static images
            app.UseStaticFiles();

            // Dosen't do anything for now
            app.UseAuthorization();

            app.UseSwaggerDocumentation();

            // Maps all our endpoints to our controllers so our api server knows where to send the request on to
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
