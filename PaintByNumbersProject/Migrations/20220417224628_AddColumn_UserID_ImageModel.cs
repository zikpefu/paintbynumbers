using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaintByNumbersProject.Migrations
{
    public partial class AddColumn_UserID_ImageModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserID",
                table: "Images",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Images");
        }
    }
}
