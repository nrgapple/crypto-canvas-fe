import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var prisma: any;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma as any) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
