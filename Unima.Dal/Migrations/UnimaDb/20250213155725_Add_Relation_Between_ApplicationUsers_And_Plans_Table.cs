using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unima.Dal.Migrations.UnimaDb
{
    /// <inheritdoc />
    public partial class Add_Relation_Between_ApplicationUsers_And_Plans_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Plans",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "PlanId",
                table: "ApplicationUser",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Plans",
                table: "Plans",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUser_PlanId",
                table: "ApplicationUser",
                column: "PlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUser_Plans_PlanId",
                table: "ApplicationUser",
                column: "PlanId",
                principalTable: "Plans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUser_Plans_PlanId",
                table: "ApplicationUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Plans",
                table: "Plans");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationUser_PlanId",
                table: "ApplicationUser");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "PlanId",
                table: "ApplicationUser");
        }
    }
}
