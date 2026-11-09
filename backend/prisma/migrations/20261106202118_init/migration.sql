-- CreateEnum
CREATE TYPE "CategorieProjet" AS ENUM ('WEB', 'MOBILE', 'DESIGN');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "sousTitre" TEXT NOT NULL,
    "description" TEXT,
    "stack" TEXT[],
    "annee" TEXT NOT NULL,
    "categorie" "CategorieProjet" NOT NULL DEFAULT 'WEB',
    "image" TEXT,
    "lien" TEXT,
    "publie" BOOLEAN NOT NULL DEFAULT true,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "Project_publie_ordre_idx" ON "Project"("publie", "ordre");

-- CreateIndex
CREATE INDEX "Project_categorie_idx" ON "Project"("categorie");
