import { PrismaClient } from "@prisma/client";
import { BaseController } from "../controllers/BaseController";

export const initializePrismaClient = (prismaClient: PrismaClient, controllersArray: typeof BaseController[]): void => {
  if (controllersArray.length) {
    controllersArray.forEach(Controller => Controller.setPrismaClient(prismaClient));
  }
}