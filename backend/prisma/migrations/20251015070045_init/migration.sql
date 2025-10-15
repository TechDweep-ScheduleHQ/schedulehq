-- CreateTable
CREATE TABLE "public"."Client" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "meetingDuration" TEXT NOT NULL DEFAULT '15 min',
    "meetingType" TEXT NOT NULL DEFAULT 'zoom',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/kolkata',
    "meetingDate" TIMESTAMP(3) NOT NULL,
    "hourDuration" TEXT NOT NULL,
    "meetingTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
