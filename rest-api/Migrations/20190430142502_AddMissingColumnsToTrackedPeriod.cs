using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Makro.Migrations
{
    public partial class AddMissingColumnsToTrackedPeriod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>("TotalCalories", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("AverageCaloriesPerDay", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("SmallestCalorieCount", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("BiggestCalorieCount", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("TotalProtein", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("TotalCarbs", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("TotalFat", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("TotalFiber", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("TotalSugar", "TrackedPeriods", "decimal", false, null, false, null, false);
            migrationBuilder.AddColumn<decimal>("TotalFoodWeight", "TrackedPeriods", "decimal", false, null, false, null, false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedbacks");

            migrationBuilder.DropTable(
                name: "Likes");

            migrationBuilder.DropTable(
                name: "MealFoods");

            migrationBuilder.DropTable(
                name: "MealNames");

            migrationBuilder.DropTable(
                name: "SharedMealFoods");

            migrationBuilder.DropTable(
                name: "Meals");

            migrationBuilder.DropTable(
                name: "Foods");

            migrationBuilder.DropTable(
                name: "SharedMeals");

            migrationBuilder.DropTable(
                name: "Days");

            migrationBuilder.DropTable(
                name: "SharedDays");

            migrationBuilder.DropTable(
                name: "TrackedPeriods");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
