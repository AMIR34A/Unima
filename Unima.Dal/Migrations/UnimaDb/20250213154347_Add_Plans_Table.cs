using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unima.Dal.Migrations.UnimaDb
{
    /// <inheritdoc />
    public partial class Add_Plans_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LastUpgradeLevel",
                table: "ApplicationUser",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "ReferredByUsername",
                table: "ApplicationUser",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Plans",
                columns: table => new
                {
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Period = table.Column<byte>(type: "tinyint", nullable: false),
                    CountOfMeal = table.Column<byte>(type: "tinyint", nullable: false),
                    HasTelegramBot = table.Column<bool>(type: "bit", nullable: true),
                    HasSMSNotification = table.Column<bool>(type: "bit", nullable: true),
                    HasEmailNotification = table.Column<bool>(type: "bit", nullable: true),
                    CountOfSMS = table.Column<bool>(type: "bit", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Plans");

            migrationBuilder.DropColumn(
                name: "ReferredByUsername",
                table: "ApplicationUser");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastUpgradeLevel",
                table: "ApplicationUser",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
