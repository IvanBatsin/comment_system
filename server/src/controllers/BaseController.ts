import { PrismaClient } from "@prisma/client";

export class BaseController {
  public static prismaClient: PrismaClient;

  public static setPrismaClient(prismaClient: PrismaClient): void {
    if (!this.prismaClient) {
      this.prismaClient = prismaClient;
    }
  }
}