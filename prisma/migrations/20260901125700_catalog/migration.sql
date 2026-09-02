-- CreateTable
CREATE TABLE "WordItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "category" TEXT NOT NULL DEFAULT 'security'
);

-- CreateTable
CREATE TABLE "DingbatItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "set" TEXT NOT NULL DEFAULT 'harness',
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "content" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "acceptedAnswers" TEXT NOT NULL DEFAULT '[]',
    "hint" TEXT NOT NULL DEFAULT '',
    "display" TEXT NOT NULL DEFAULT 'emoji'
);

-- CreateTable
CREATE TABLE "BotItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "facts" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Perfect10Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "targetSeconds" REAL NOT NULL DEFAULT 10,
    "attempts" INTEGER NOT NULL DEFAULT 3
);

-- CreateIndex
CREATE UNIQUE INDEX "WordItem_word_key" ON "WordItem"("word");
