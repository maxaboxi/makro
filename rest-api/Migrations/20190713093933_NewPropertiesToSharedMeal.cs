using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Makro.Migrations
{
    public partial class NewPropertiesToSharedMeal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>("Shared", "SharedMeals", nullable: false, defaultValue: true);
            migrationBuilder.AddColumn<int>("PortionSize", "SharedMeals", nullable: false, defaultValue: 0);
            migrationBuilder.AddColumn<int>("Portions", "SharedMeals", nullable: false, defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("Shared", "SharedMeals");
            migrationBuilder.DropColumn("PortionSize", "SharedMeals");
            migrationBuilder.DropColumn("Portions", "SharedMeals");
        }
    }
}
