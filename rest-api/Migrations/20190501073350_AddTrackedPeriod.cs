using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Makro.Migrations
{
    public partial class AddTrackedPeriod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TrackedPeriods",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    UUID = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    TotalCalories = table.Column<decimal>(nullable: false),
                    AverageCaloriesPerDay = table.Column<decimal>(nullable: false),
                    SmallestCalorieCount = table.Column<decimal>(nullable: false),
                    BiggestCalorieCount = table.Column<decimal>(nullable: false),
                    TotalProtein = table.Column<decimal>(nullable: false),
                    TotalCarbs = table.Column<decimal>(nullable: false),
                    TotalFat = table.Column<decimal>(nullable: false),
                    TotalFiber = table.Column<decimal>(nullable: false),
                    TotalSugar = table.Column<decimal>(nullable: false),
                    TotalFoodWeight = table.Column<decimal>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedPeriods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackedPeriods_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrackedPeriodDays",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    TrackedPeriodId = table.Column<int>(nullable: false),
                    DayId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedPeriodDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackedPeriodDays_Days_DayId",
                        column: x => x.DayId,
                        principalTable: "Days",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackedPeriodDays_TrackedPeriods_TrackedPeriodId",
                        column: x => x.TrackedPeriodId,
                        principalTable: "TrackedPeriods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Days_UUID",
                table: "Days",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrackedPeriodDays_DayId",
                table: "TrackedPeriodDays",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedPeriodDays_TrackedPeriodId",
                table: "TrackedPeriodDays",
                column: "TrackedPeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedPeriods_UUID",
                table: "TrackedPeriods",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrackedPeriods_UserId",
                table: "TrackedPeriods",
                column: "UserId");
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
                name: "TrackedPeriodDays");

            migrationBuilder.DropTable(
                name: "Meals");

            migrationBuilder.DropTable(
                name: "Foods");

            migrationBuilder.DropTable(
                name: "SharedMeals");

            migrationBuilder.DropTable(
                name: "TrackedPeriods");

            migrationBuilder.DropTable(
                name: "Days");

            migrationBuilder.DropTable(
                name: "SharedDays");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
