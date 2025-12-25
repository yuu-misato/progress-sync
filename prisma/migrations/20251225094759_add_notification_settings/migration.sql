-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lineUserId" TEXT,
    "notificationEmail" TEXT,
    "notifyViaLine" BOOLEAN NOT NULL DEFAULT false,
    "notifyViaEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyViaSlack" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Project" ("clientName", "createdAt", "id", "lineUserId", "name", "status", "updatedAt") SELECT "clientName", "createdAt", "id", "lineUserId", "name", "status", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
