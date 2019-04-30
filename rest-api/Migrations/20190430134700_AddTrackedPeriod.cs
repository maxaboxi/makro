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
            migrationBuilder.AddColumn<int>("TrackedPeriodId", "Days", "int", false, null, false, null, true);

            migrationBuilder.CreateIndex(
             name: "IX_Days_TrackedPeriodId",
             table: "Days",
             column: "TrackedPeriodId");

            migrationBuilder.CreateTable(
                name: "TrackedPeriods",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    UUID = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: true),
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
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Days_UUID",
                table: "Days",
                column: "UUID",
                unique: true);
                     
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
