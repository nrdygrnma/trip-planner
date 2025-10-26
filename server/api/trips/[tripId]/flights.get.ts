import { prisma } from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  return prisma.flight.findMany();
});
