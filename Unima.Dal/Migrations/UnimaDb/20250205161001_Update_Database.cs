using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unima.Dal.Migrations.UnimaDb
{
    /// <inheritdoc />
    public partial class Update_Database : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationUserFood");

            migrationBuilder.CreateTable(
                name: "UserFoods",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FoodId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFoods", x => new { x.UserId, x.FoodId });
                    table.ForeignKey(
                        name: "FK_UserFoods_ApplicationUser_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicationUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFoods_Foods_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Foods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserFoods_FoodId",
                table: "UserFoods",
                column: "FoodId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserFoods");

            migrationBuilder.CreateTable(
                name: "ApplicationUserFood",
                columns: table => new
                {
                    FoodsId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserFood", x => new { x.FoodsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserFood_ApplicationUser_UsersId",
                        column: x => x.UsersId,
                        principalTable: "ApplicationUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserFood_Foods_FoodsId",
                        column: x => x.FoodsId,
                        principalTable: "Foods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserFood_UsersId",
                table: "ApplicationUserFood",
                column: "UsersId");
        }
    }
}
