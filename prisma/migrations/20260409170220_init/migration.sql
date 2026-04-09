-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('text', 'file');

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextItem" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "TextItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileItem" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "FileItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TextItem_itemId_key" ON "TextItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "FileItem_itemId_key" ON "FileItem"("itemId");

-- AddForeignKey
ALTER TABLE "TextItem" ADD CONSTRAINT "TextItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileItem" ADD CONSTRAINT "FileItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
