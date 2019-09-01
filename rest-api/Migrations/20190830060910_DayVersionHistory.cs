using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Makro.Migrations
{
    public partial class DayVersionHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>("IsLatest", "Days", nullable: false, defaultValue: true);
            migrationBuilder.AddColumn<string>("LatestVersionId", "Days", nullable: true, defaultValue: null);
            migrationBuilder.AddColumn<bool>("HasVersions", "Days", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<DateTime>("VersionCreated", "Days", nullable: true, defaultValue: null);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("IsLatest", "Days");
            migrationBuilder.DropColumn("LatestVersionId", "Days");
            migrationBuilder.DropColumn("HasVersions", "Days");
            migrationBuilder.DropColumn("VersionCreated", "Days");
        }
    }
}
