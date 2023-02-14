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
    getAsignaturas: publicProcedure
      .input(z.object({ id: z.string().nullish()}).nullish())
      .query(async ({ input }) => {
            const prisma = new PrismaClient();
            const subjects = prisma.subjects.findMany({
                where: {
                    ownerId: input?.id ?? ""
                },
                select:{
                    name: true,
                    totalTime: true,
                    timeObjetive:true,
                    subjectId: true
                }
            })
            return {
                asignaturas: (await subjects).map((subject: subject) => {
                    return {
                        name: subject.name,
                        totalTime: subject.totalTime,
                        timeObjective: subject.timeObjetive,
                        id: subject.subjectId

                    }
                })
            };
        }
      ),

    createAsignatura: publicProcedure
      .input(z.object({ id: z.string().nullish(), name: z.string().nullish()}).nullish())
      .mutation(({ input }) => {
            const prisma = new PrismaClient();
            return prisma.subjects.create({
                data: {
                    ownerId: input?.id ?? "",
                    name: input?.name ?? "",
                }
            });
        }

      ),

    createAsignatura2: publicProcedure
      .input(z.object({ id: z.string().nullish(), name: z.string().nullish()}).nullish())
      .mutation(({ input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: input?.id ?? "",
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
      .input(z.object({ id: z.string().nullish()}).nullish())
      .query(async ({ input }) => {
            const prisma = new PrismaClient();
            return prisma.subjects.findMany({
                where: {
                    ownerId: input?.id ?? ""
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
      .input(z.object({ id: z.string().nullish(), subjectId: z.string()}).nullish())
      .query(async ({ input }) => {
            const prisma = new PrismaClient();
            return prisma.user.findUnique({
                where: {
                    id: input?.id ?? ""
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
      .input(z.object({ id: z.string().nullish(), subjectId: z.string(), name: z.string().nullish(), tiempoTrabajo: z.number(), tiempoDescanso: z.number(), timeObjective: z.number()}).nullish())
      .mutation(({ input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: input?.id ?? "",
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
                                timeObjetive: input?.timeObjective ?? 0
                            }
                        }
                    }
                }
            });
        }

      ),

    eliminarAsignatura: publicProcedure
      .input(z.object({ id: z.string().nullish(), subjectId: z.string()}).nullish())
      .mutation(({ input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: input?.id ?? "",
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
      .input(z.object({ id: z.string().nullish(), subjectId: z.string(), tiempo: z.number(), totalTime: z.number()}).nullish())
      .mutation(({ input }) => {
            const prisma = new PrismaClient();
            const tiempoAñadido = prisma.user.update({
                where: {
                    id: input?.id ?? "",
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
        }

      ),

    getTiempos: publicProcedure
      .input(z.object({ id: z.string().nullish(), subjectId: z.string()}).nullish())
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
      .input(z.object({ id: z.string().nullish(), subjectId: z.string(), totalTime: z.number()}).nullish())
      .mutation(({ input }) => {
            const prisma = new PrismaClient();
            return prisma.user.update({
                where: {
                    id: input?.id ?? "",
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

})
