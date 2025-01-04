-- CreateTable
CREATE TABLE "Metadata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "webhookLink" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
