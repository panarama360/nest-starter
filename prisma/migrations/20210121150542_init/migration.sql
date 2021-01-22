-- CreateTable
CREATE TABLE "User" (
"id" SERIAL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "roleName" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL,
    "permisions" JSONB NOT NULL,

    PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("roleName")REFERENCES "Role"("name") ON DELETE CASCADE ON UPDATE CASCADE;
