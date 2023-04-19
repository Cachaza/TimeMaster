import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  nombre: publicProcedure
    .input(
      z
        .object({ id: z.string().nullish(), nombre: z.string().nullish() })
        .nullish()
    )
    .query(async ({ input }) => {
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst({
        where: {
          id: input?.id ?? "",
        },
        select: {
          name: true,
        },
      });
      return {
        name: user?.name,
      };
    }),

  descripcion: publicProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(async ({ input }) => {
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: {
          id: input?.id ?? "",
        },
        select: {
          description: true,
        },
      });

      return {
        descripcion: user?.description ?? "No description",
      };
    }),
});
