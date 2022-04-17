using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaintByNumbersProject.Migrations
{
    public partial class AddColumn_PaintImageName_ImageModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaintImageName",
                table: "Images",
                type: "nvarchar(100)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaintImageName",
                table: "Images");
        }
    }
}