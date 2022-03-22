using Microsoft.EntityFrameworkCore.Migrations;

namespace Projekat.Migrations
{
    public partial class V2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClanoviPorodice_RadneSnage_RadnaSnagaID",
                table: "ClanoviPorodice");

            migrationBuilder.DropForeignKey(
                name: "FK_Radnici_RadneSnage_RadnaSnagaID",
                table: "Radnici");

            migrationBuilder.DropTable(
                name: "RadneSnage");

            migrationBuilder.DropIndex(
                name: "IX_ClanoviPorodice_RadnaSnagaID",
                table: "ClanoviPorodice");

            migrationBuilder.DropColumn(
                name: "RadnaSnagaID",
                table: "ClanoviPorodice");

            migrationBuilder.RenameColumn(
                name: "RadnaSnagaID",
                table: "Radnici",
                newName: "GazdinstvoID");

            migrationBuilder.RenameIndex(
                name: "IX_Radnici_RadnaSnagaID",
                table: "Radnici",
                newName: "IX_Radnici_GazdinstvoID");

            migrationBuilder.AddForeignKey(
                name: "FK_Radnici_Gazdinstva_GazdinstvoID",
                table: "Radnici",
                column: "GazdinstvoID",
                principalTable: "Gazdinstva",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Radnici_Gazdinstva_GazdinstvoID",
                table: "Radnici");

            migrationBuilder.RenameColumn(
                name: "GazdinstvoID",
                table: "Radnici",
                newName: "RadnaSnagaID");

            migrationBuilder.RenameIndex(
                name: "IX_Radnici_GazdinstvoID",
                table: "Radnici",
                newName: "IX_Radnici_RadnaSnagaID");

            migrationBuilder.AddColumn<int>(
                name: "RadnaSnagaID",
                table: "ClanoviPorodice",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RadneSnage",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojClanovaPorodice = table.Column<int>(type: "int", nullable: false),
                    BrojRadnika = table.Column<int>(type: "int", nullable: false),
                    GazdinstvoID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RadneSnage", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RadneSnage_Gazdinstva_GazdinstvoID",
                        column: x => x.GazdinstvoID,
                        principalTable: "Gazdinstva",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClanoviPorodice_RadnaSnagaID",
                table: "ClanoviPorodice",
                column: "RadnaSnagaID");

            migrationBuilder.CreateIndex(
                name: "IX_RadneSnage_GazdinstvoID",
                table: "RadneSnage",
                column: "GazdinstvoID");

            migrationBuilder.AddForeignKey(
                name: "FK_ClanoviPorodice_RadneSnage_RadnaSnagaID",
                table: "ClanoviPorodice",
                column: "RadnaSnagaID",
                principalTable: "RadneSnage",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Radnici_RadneSnage_RadnaSnagaID",
                table: "Radnici",
                column: "RadnaSnagaID",
                principalTable: "RadneSnage",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
