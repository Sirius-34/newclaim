-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "yearAddedID" TEXT;

-- CreateTable
CREATE TABLE "sprYears" (
    "id" TEXT NOT NULL,
    "npp" SERIAL NOT NULL,
    "cYear" TEXT NOT NULL,
    "cAct" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "sprYears_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sprYears_npp_key" ON "sprYears"("npp");

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_yearAddedID_fkey" FOREIGN KEY ("yearAddedID") REFERENCES "sprYears"("id") ON DELETE SET NULL ON UPDATE CASCADE;
