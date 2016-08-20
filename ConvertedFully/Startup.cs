using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChoreApp;
using ChoreApp.Filters;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;

namespace TestAspNetCore
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<ChoreRepository, ChoreRepository>();
            // Add framework services.
            var mvc = services.AddMvc(opt => {
                opt.Filters.Add(new FakeResponseFilterAttribute());
                opt.Filters.Add(new MakeSlowFilterAttribute());
                opt.Filters.Add(new DataExceptionFilterAttribute());
            });
            mvc.AddJsonOptions(opt => {
                var resolver  = opt.SerializerSettings.ContractResolver;
                if (resolver != null)
                {
                    var res = resolver as DefaultContractResolver;
                    res.NamingStrategy = null;  // <<!-- this removes the camelcasing
                }
            });            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            //KIP - Need the .MapWebApiRoute
            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();
        } 
    }
}
