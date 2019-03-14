﻿// <auto-generated />
using System;
using System.Collections.Generic;
using Makro.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Makro.Migrations
{
    [DbContext(typeof(MakroContext))]
    partial class MakroContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Makro.Models.Day", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Days");
                });

            modelBuilder.Entity("Makro.Models.Feedback", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Anonymous");

                    b.Property<string>("Answer");

                    b.Property<DateTime>("AnsweredAt");

                    b.Property<int?>("AnsweredById");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("FeedbackBody")
                        .IsRequired();

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("AnsweredById");

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Feedbacks");
                });

            modelBuilder.Entity("Makro.Models.Food", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("Carbs");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("En");

                    b.Property<decimal>("Energy");

                    b.Property<decimal>("Fat");

                    b.Property<decimal>("Fiber");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<decimal>("PackageSize");

                    b.Property<decimal>("Protein");

                    b.Property<decimal>("ServingSize");

                    b.Property<decimal>("Sugar");

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Foods");
                });

            modelBuilder.Entity("Makro.Models.Like", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int?>("SharedMealId");

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UserId");

                    b.Property<int>("Value");

                    b.HasKey("Id");

                    b.HasIndex("SharedMealId");

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("Makro.Models.Meal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int?>("DayId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int?>("SharedDayId");

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int?>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("DayId");

                    b.HasIndex("SharedDayId");

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Meals");
                });

            modelBuilder.Entity("Makro.Models.MealFood", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("FoodAmount");

                    b.Property<int>("FoodId");

                    b.Property<int>("MealId");

                    b.HasKey("Id");

                    b.HasIndex("FoodId");

                    b.HasIndex("MealId");

                    b.ToTable("MealFoods");
                });

            modelBuilder.Entity("Makro.Models.MealName", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("MealNames");
                });

            modelBuilder.Entity("Makro.Models.SharedDay", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("SharedDays");
                });

            modelBuilder.Entity("Makro.Models.SharedMeal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("Info");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Recipe");

                    b.Property<List<string>>("Tags")
                        .IsRequired();

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("SharedMeals");
                });

            modelBuilder.Entity("Makro.Models.SharedMealFood", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("FoodAmount");

                    b.Property<int>("FoodId");

                    b.Property<int>("SharedMealId");

                    b.HasKey("Id");

                    b.HasIndex("FoodId");

                    b.HasIndex("SharedMealId");

                    b.ToTable("SharedMealFoods");
                });

            modelBuilder.Entity("Makro.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("Activity");

                    b.Property<int>("Age");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<decimal>("DailyExpenditure");

                    b.Property<string>("Email");

                    b.Property<decimal>("Height");

                    b.Property<string>("Lang");

                    b.Property<DateTime>("LastLogin");

                    b.Property<string>("Password");

                    b.Property<string>("PasswordResetToken");

                    b.Property<List<string>>("Roles");

                    b.Property<string>("Sex");

                    b.Property<bool>("ShowTargets");

                    b.Property<string>("UUID")
                        .IsRequired();

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<decimal>("UserAddedCarbTarget");

                    b.Property<decimal>("UserAddedExpenditure");

                    b.Property<decimal>("UserAddedFatTarget");

                    b.Property<decimal>("UserAddedProteinTarget");

                    b.Property<string>("Username")
                        .IsRequired();

                    b.Property<decimal>("Weight");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("UUID")
                        .IsUnique();

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Makro.Models.Day", b =>
                {
                    b.HasOne("Makro.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.Feedback", b =>
                {
                    b.HasOne("Makro.Models.User", "AnsweredBy")
                        .WithMany()
                        .HasForeignKey("AnsweredById");

                    b.HasOne("Makro.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.Food", b =>
                {
                    b.HasOne("Makro.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.Like", b =>
                {
                    b.HasOne("Makro.Models.SharedMeal", "SharedMeal")
                        .WithMany()
                        .HasForeignKey("SharedMealId");

                    b.HasOne("Makro.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.Meal", b =>
                {
                    b.HasOne("Makro.Models.Day")
                        .WithMany("Meals")
                        .HasForeignKey("DayId");

                    b.HasOne("Makro.Models.SharedDay")
                        .WithMany("Meals")
                        .HasForeignKey("SharedDayId");

                    b.HasOne("Makro.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("Makro.Models.MealFood", b =>
                {
                    b.HasOne("Makro.Models.Food", "Food")
                        .WithMany("MealFoods")
                        .HasForeignKey("FoodId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Makro.Models.Meal", "Meal")
                        .WithMany("MealFoods")
                        .HasForeignKey("MealId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.MealName", b =>
                {
                    b.HasOne("Makro.Models.User", "User")
                        .WithMany("MealNames")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.SharedDay", b =>
                {
                    b.HasOne("Makro.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.SharedMeal", b =>
                {
                    b.HasOne("Makro.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Makro.Models.SharedMealFood", b =>
                {
                    b.HasOne("Makro.Models.Food", "Food")
                        .WithMany("SharedMealFoods")
                        .HasForeignKey("FoodId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Makro.Models.SharedMeal", "SharedMeal")
                        .WithMany("SharedMealFoods")
                        .HasForeignKey("SharedMealId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
