import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const ruterAsignaturas = createTRPCRouter({
    getAsignaturas: publicProcedure
    .input(z.object({ id: z.string().nullish()}).nullish())
    .query(async ({ input }) => {
      const prisma = new PrismaClient();
      const asignaturas = prisma.asignaturas.findMany({
        where: {
            propietarioId: input?.id ?? ""
        },
        select:{
            nombre: true,
            tiempoTotal: true,
            timepoObjetivo:true,
            asignaturaId: true
        }
      })
      return {
        asignaturas: (await asignaturas).map((asignatura: any) => {
            return {
                
                nombre: asignatura.nombre,
                tiempoTotal: asignatura.tiempoTotal,
                tiempoObjetivo: asignatura.tiempoObjetivo,
                asignaturaId: asignatura.asignaturaId
            }
        })
        };
    }
  ),

    createAsignatura: publicProcedure
    .input(z.object({ id: z.string().nullish(), nombre: z.string().nullish()}).nullish())
    .mutation(({ input, ctx }) => {
        const prisma = new PrismaClient();
        return prisma.asignaturas.create({
            data: {
                propietarioId: input?.id ?? "",
                nombre: input?.nombre ?? "",
            }
        });
        }

    ),

    createAsignatura2: publicProcedure
    .input(z.object({ id: z.string().nullish(), nombre: z.string().nullish()}).nullish())
    .mutation(({ input, ctx }) => {
        const prisma = new PrismaClient();
        return prisma.user.update({
            where: {
                id: input?.id ?? "",
            },
            data: {
                asignaturas: {
                    create: {
                        nombre: input?.nombre ?? "",
                    }
                }
            }
        });
        }      

    ),

    getAsignaturas2: publicProcedure
    .input(z.object({ id: z.string().nullish()}).nullish())
    .query(async ({ input }) => {
        const prisma = new PrismaClient();
        return prisma.asignaturas.findMany({
            where: {
                propietarioId: input?.id ?? ""
            },
            select:{
                nombre: true,
                tiempoTotal: true,
                timepoObjetivo:true,
                asignaturaId: true
            }

        })
    }
    ),

    getAsignatura: publicProcedure
    .input(z.object({ id: z.string().nullish(), asignaturaId: z.string()}).nullish())
    .query(async ({ input }) => {
        const prisma = new PrismaClient();
        return prisma.user.findUnique({
            where: {
                id: input?.id ?? ""
            },
            select:{
                asignaturas: {
                    where: {
                        asignaturaId: input?.asignaturaId ?? ""
                    },
                    select: {
                        nombre: true,
                        tiempoTotal: true,
                        timepoObjetivo:true,
                        tiempoDescanso: true,
                        tiempoTrabajo: true
                    }

                }
            }

        })
    }
    ),

    modificarAsignatura: publicProcedure
    .input(z.object({ id: z.string().nullish(), asignaturaId: z.string(), nombre: z.string().nullish(), tiempoTrabajo: z.number(), tiempoDescanso: z.number(), tiempoObjetivo: z.number()}).nullish())
    .mutation(({ input, ctx }) => {
        const prisma = new PrismaClient();
        return prisma.user.update({
            where: {
                id: input?.id ?? "",
            },
            data: {
                asignaturas: {
                    update: {
                        where: {
                            asignaturaId: input?.asignaturaId ?? ""
                        },
                        data: {
                            nombre: input?.nombre ?? "",
                            tiempoTrabajo: input?.tiempoTrabajo ?? 0,
                            tiempoDescanso: input?.tiempoDescanso ?? 0,
                            timepoObjetivo: input?.tiempoObjetivo ?? 0
                        }
                    }
                }
            }
        });
        }

    ),

    eliminarAsignatura: publicProcedure
    .input(z.object({ id: z.string().nullish(), asignaturaId: z.string()}).nullish())
    .mutation(({ input, ctx }) => {
        const prisma = new PrismaClient();
        return prisma.user.update({
            where: {
                id: input?.id ?? "",
            },
            data: {
                asignaturas: {
                    delete: {
                        asignaturaId: input?.asignaturaId ?? ""
                    }
                }
            }
        });
        }

    ),

        
    
        
    
})
