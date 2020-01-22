using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Makro.DB;
using Microsoft.EntityFrameworkCore;
using Makro.Services;
using AutoMapper;
using Makro.Helpers;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace Makro
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddEntityFrameworkNpgsql()
                .AddDbContext<MakroContext>(opt => opt.UseNpgsql(Configuration.GetConnectionString("MakroDB")));
            services.AddScoped<UserService>();
            services.AddScoped<MealService>();
            services.AddScoped<AdminService>();
            services.AddScoped<FoodService>();
            services.AddScoped<DayService>();
            services.AddScoped<FeedbackService>();
            services.AddScoped<LikeService>();
            services.AddScoped<TrackedPeriodService>();
            services.AddScoped<StatisticsService>();
            services.AddControllers();
            services.AddAutoMapper();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsDevelopment",
                    builder => builder
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins("http://localhost:4200"));
                options.AddPolicy("CorsProduction",
                    builder => builder
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins("https://makro.diet"));
            });
            services.AddSwaggerGen(g => g.SwaggerDoc("v2", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Makro", Version = "v2" }));

            // configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var userService = context.HttpContext.RequestServices.GetRequiredService<UserService>();
                        var userId = context.Principal.Identity.Name;
                        var user = userService.GetUser(userId);
                        if (user == null)
                        {
                            // return unauthorized if user no longer exists
                            context.Fail("Unauthorized");
                        }
                        return Task.CompletedTask;
                    }
                };
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.EnvironmentName == "Development")
            {
                app.UseDeveloperExceptionPage();
                app.UseCors("CorsDevelopment");
                app.UseSwagger();
                app.UseSwaggerUI(u => {
                    u.SwaggerEndpoint("/swagger/v2/swagger.json", "Makro API V2");
                    u.RoutePrefix = string.Empty;
                });
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
                app.UseCors("CorsProduction");
            }

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(e => e.MapControllers());
            UpdateDatabase(app);
        }

        private static void UpdateDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<MakroContext>())
                {
                    context.Database.Migrate();
                }
            }
        }
    }
}
