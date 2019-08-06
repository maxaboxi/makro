using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Makro.Migrations
{
    public partial class AddIndexForMeal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>("Index", "Meals", nullable: false, defaultValue: 99);
            migrationBuilder.AddColumn<int>("Index", "MealNames", nullable: false, defaultValue: 99);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("Index", "Meals");
            migrationBuilder.DropColumn("Index", "MealNames");
        }
    }
}
