import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "../trpc";

type subject = {
    name: string,
    totalTime: number,
    timeObjetive: number,
    subjectId: string
}


export const ruterAsignaturas = createTRPCRouter({


    createAsignatura2: publicProcedure
      .input(z.object({ name: z.string().nullish()}).nullish())
      .mutation(({ ctx, input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: ctx?.session?.user.id
                },
                data: {
                    subjects: {
                        create: {
                            name: input?.name ?? "",
                        }
                    }
                }
            });
        }

      ),

    getAsignaturas2: publicProcedure
      .query(async ({ ctx }) => {
            const prisma = new PrismaClient();
            return prisma.subjects.findMany({
                where: {
                    ownerId: ctx?.session?.user.id
                },
                select:{
                    name: true,
                    totalTime: true,
                    timeObjetive:true,
                    subjectId: true
                }

            })
        }
      ),

    getAsignatura: publicProcedure
      .input(z.object({ subjectId: z.string()}).nullish())
      .query(async ({ ctx, input }) => {
            const prisma = new PrismaClient();
            return prisma.user.findUnique({
                where: {
                    id: ctx?.session?.user.id
                },
                select:{
                    subjects: {
                        where: {
                            subjectId: input?.subjectId ?? ""
                        },
                        select: {
                            name: true,
                            totalTime: true,
                            timeObjetive:true,
                            restTime: true,
                            workingTime: true
                        }

                    }
                }

            })
        }
      ),

    modificarAsignatura: publicProcedure
      .input(z.object({ subjectId: z.string(), name: z.string().nullish(), tiempoTrabajo: z.number(), tiempoDescanso: z.number(), timeObjective: z.number(), videoUrl: z.string().nullish()}).nullish())
      .mutation(({ ctx, input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: ctx?.session?.user.id
                },
                data: {
                    subjects: {
                        update: {
                            where: {
                                subjectId: input?.subjectId ?? ""
                            },
                            data: {
                                name: input?.name ?? "",
                                workingTime: input?.tiempoTrabajo ?? 0,
                                restTime: input?.tiempoDescanso ?? 0,
                                timeObjetive: input?.timeObjective ?? 0,
                                song: input?.videoUrl ?? ""
                            }
                        }
                    }
                }
            });
        }

      ),

    eliminarAsignatura: publicProcedure
      .input(z.object({ subjectId: z.string()}).nullish())
      .mutation(({ ctx, input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: ctx?.session?.user.id
                },
                data: {
                    subjects: {
                        delete: {
                            subjectId: input?.subjectId ?? ""
                        }
                    }
                }
            });
        }

      ),

    añadirTiempo: publicProcedure
      .input(z.object({ subjectId: z.string(), tiempo: z.number(), totalTime: z.number()}).nullish())
      .mutation(({ ctx, input }) => {
            const prisma = new PrismaClient();
            const tiempoAñadido = prisma.user.update({
                where: {
                    id: ctx?.session?.user.id
                },
                data: {
                    subjects: {
                        update: {
                            where: {
                                subjectId: input?.subjectId ?? ""
                            },
                            data: {
                                individualtimes: {
                                    create: {
                                        workedTime: input?.tiempo ?? 0,
                                        totalTime: input?.totalTime ?? 0
                                    }
                                }
                            }
                        }
                    }
                }
            });
            return tiempoAñadido
        }

      ),

    getTiempos: publicProcedure
      .input(z.object({ subjectId: z.string()}).nullish())
      .query(async ({ input }) => {
            const prisma = new PrismaClient();
            const suma =  prisma.individualTimes.findMany({
                where: {
                    subjectId: input?.subjectId ?? ""

                },
                select: {
                    workedTime: true
                }
            })
            return suma
        }
      ),

    actualizarTiempoTotal: publicProcedure
      .input(z.object({ subjectId: z.string(), totalTime: z.number()}).nullish())
      .mutation(({ ctx, input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: ctx?.session?.user.id
                },
                data: {
                    subjects: {
                        update: {
                            where: {
                                subjectId: input?.subjectId ?? ""
                            },
                            data: {
                                totalTime: input?.totalTime ?? 0
                            }
                        }
                    }
                }
            });
        }

      ),

    checkIfSubjectExists: publicProcedure
      .input(z.object({ id: z.string().nullish(), subjectId: z.string()}).nullish())
      .query(async ({ input }) => {
        const prisma = new PrismaClient();
        const subject = await prisma.user.findUnique({
          where: {
            id: input?.id ?? ""
          },
          select:{
            subjects: {
              where: {
                subjectId: input?.subjectId ?? ""

              }
            }
          }
        })

        if (subject?.subjects[0] === undefined) {
          return false
        } else {
          return true
        }
      }
    ),

  getSubjectSong: publicProcedure
    .input(z.object({ subjectId: z.string()}).nullish())
    .query(async ({ input }) => {
      const prisma = new PrismaClient();
      const song = await  prisma.subjects.findUnique({
        where: {
          subjectId: input?.subjectId ?? ""
        },
        select: {
          song: true
        }
      })

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        song: song?.song ?? "",
      }




    }
  ),


})
