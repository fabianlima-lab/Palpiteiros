-- AlterTable
ALTER TABLE "Rumor" ADD COLUMN "lastScraped" DATETIME;
ALTER TABLE "Rumor" ADD COLUMN "signalScore" REAL DEFAULT 0;

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "authorName" TEXT,
    "authorHandle" TEXT,
    "authorAvatar" TEXT,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "imageUrl" TEXT,
    "publishedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "players" TEXT,
    "teams" TEXT,
    "likes" INTEGER,
    "retweets" INTEGER,
    "views" INTEGER
);

-- CreateTable
CREATE TABLE "RumorNewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rumorId" TEXT NOT NULL,
    "newsItemId" TEXT NOT NULL,
    "relevance" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RumorNewsItem_rumorId_fkey" FOREIGN KEY ("rumorId") REFERENCES "Rumor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RumorNewsItem_newsItemId_fkey" FOREIGN KEY ("newsItemId") REFERENCES "NewsItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RumorSignal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rumorId" TEXT NOT NULL,
    "period" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    "mentions" INTEGER NOT NULL,
    "velocity" REAL NOT NULL,
    CONSTRAINT "RumorSignal_rumorId_fkey" FOREIGN KEY ("rumorId") REFERENCES "Rumor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "NewsItem_publishedAt_idx" ON "NewsItem"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsItem_source_idx" ON "NewsItem"("source");

-- CreateIndex
CREATE UNIQUE INDEX "NewsItem_source_sourceId_key" ON "NewsItem"("source", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "RumorNewsItem_rumorId_newsItemId_key" ON "RumorNewsItem"("rumorId", "newsItemId");

-- CreateIndex
CREATE INDEX "RumorSignal_rumorId_period_idx" ON "RumorSignal"("rumorId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "RumorSignal_rumorId_period_source_key" ON "RumorSignal"("rumorId", "period", "source");
