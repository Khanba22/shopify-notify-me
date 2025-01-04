import { PrismaClient } from "@prisma/client";

let prisma;

// Check if we are running in a development environment
if (process.env.NODE_ENV === "development") {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
} else {
  prisma = new PrismaClient();
}

console.log("Prisma client connected");

export default prisma;
