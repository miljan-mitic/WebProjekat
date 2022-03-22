using Microsoft.EntityFrameworkCore.Migrations;

namespace Projekat.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Gazdinstva",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegistracioniBroj = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BrojVlasnika = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gazdinstva", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Parcele",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegistracioniBroj = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Povrsina = table.Column<double>(type: "float", nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    GazdinstvoID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parcele", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Parcele_Gazdinstva_GazdinstvoID",
                        column: x => x.GazdinstvoID,
                        principalTable: "Gazdinstva",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateTable(
                name: "VozilaMehanizacije",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tip = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Marka = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Registracija = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    GazdinstvoID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VozilaMehanizacije", x => x.ID);
                    table.ForeignKey(
                        name: "FK_VozilaMehanizacije_Gazdinstva_GazdinstvoID",
                        column: x => x.GazdinstvoID,
                        principalTable: "Gazdinstva",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClanoviPorodice",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    SrednjeSlovo = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    JMBG = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    RadnaSnagaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClanoviPorodice", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ClanoviPorodice_RadneSnage_RadnaSnagaID",
                        column: x => x.RadnaSnagaID,
                        principalTable: "RadneSnage",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Radnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Nadimak = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Plata = table.Column<int>(type: "int", nullable: false),
                    RadnaSnagaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Radnici", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Radnici_RadneSnage_RadnaSnagaID",
                        column: x => x.RadnaSnagaID,
                        principalTable: "RadneSnage",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vlasnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GazdinstvoID = table.Column<int>(type: "int", nullable: true),
                    ClanPorodiceID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vlasnici", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Vlasnici_ClanoviPorodice_ClanPorodiceID",
                        column: x => x.ClanPorodiceID,
                        principalTable: "ClanoviPorodice",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Vlasnici_Gazdinstva_GazdinstvoID",
                        column: x => x.GazdinstvoID,
                        principalTable: "Gazdinstva",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Upravljanje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VoziloMehanizacijaID = table.Column<int>(type: "int", nullable: true),
                    RadnikID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Upravljanje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Upravljanje_Radnici_RadnikID",
                        column: x => x.RadnikID,
                        principalTable: "Radnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Upravljanje_VozilaMehanizacije_VoziloMehanizacijaID",
                        column: x => x.VoziloMehanizacijaID,
                        principalTable: "VozilaMehanizacije",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClanoviPorodice_RadnaSnagaID",
                table: "ClanoviPorodice",
                column: "RadnaSnagaID");

            migrationBuilder.CreateIndex(
                name: "IX_Parcele_GazdinstvoID",
                table: "Parcele",
                column: "GazdinstvoID");

            migrationBuilder.CreateIndex(
                name: "IX_RadneSnage_GazdinstvoID",
                table: "RadneSnage",
                column: "GazdinstvoID");

            migrationBuilder.CreateIndex(
                name: "IX_Radnici_RadnaSnagaID",
                table: "Radnici",
                column: "RadnaSnagaID");

            migrationBuilder.CreateIndex(
                name: "IX_Upravljanje_RadnikID",
                table: "Upravljanje",
                column: "RadnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Upravljanje_VoziloMehanizacijaID",
                table: "Upravljanje",
                column: "VoziloMehanizacijaID");

            migrationBuilder.CreateIndex(
                name: "IX_Vlasnici_ClanPorodiceID",
                table: "Vlasnici",
                column: "ClanPorodiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Vlasnici_GazdinstvoID",
                table: "Vlasnici",
                column: "GazdinstvoID");

            migrationBuilder.CreateIndex(
                name: "IX_VozilaMehanizacije_GazdinstvoID",
                table: "VozilaMehanizacije",
                column: "GazdinstvoID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Parcele");

            migrationBuilder.DropTable(
                name: "Upravljanje");

            migrationBuilder.DropTable(
                name: "Vlasnici");

            migrationBuilder.DropTable(
                name: "Radnici");

            migrationBuilder.DropTable(
                name: "VozilaMehanizacije");

            migrationBuilder.DropTable(
                name: "ClanoviPorodice");

            migrationBuilder.DropTable(
                name: "RadneSnage");

            migrationBuilder.DropTable(
                name: "Gazdinstva");
        }
    }
}
