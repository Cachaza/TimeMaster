import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

type subject = {
  name: string;
  totalTime: number;
  timeObjetive: number;
  subjectId: string;
};

export const ruterAsignaturas = createTRPCRouter({
  createAsignatura2: publicProcedure
    .input(z.object({ name: z.string().nullish() }).nullish())
    .mutation(({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          subjects: {
            create: {
              name: input?.name ?? "",
            },
          },
        },
      });
    }),

  getAsignaturas2: publicProcedure.query(async ({ ctx }) => {
    if (!ctx?.session?.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }
    return ctx.prisma.subjects.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        name: true,
        totalTime: true,
        timeObjetive: true,
        subjectId: true,
      },
    });
  }),

  getAsignatura: publicProcedure
    .input(z.object({ subjectId: z.string() }).nullish())
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      return ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          subjects: {
            where: {
              subjectId: input?.subjectId ?? "",
            },
            select: {
              name: true,
              totalTime: true,
              timeObjetive: true,
              restTime: true,
              workingTime: true,
            },
          },
        },
      });
    }),

  modificarAsignatura: publicProcedure
    .input(
      z
        .object({
          subjectId: z.string(),
          name: z.string().nullish(),
          tiempoTrabajo: z.number(),
          tiempoDescanso: z.number(),
          timeObjective: z.number(),
          videoUrl: z.string().nullish(),
        })
        .nullish()
    )
    .mutation(({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          subjects: {
            update: {
              where: {
                subjectId: input?.subjectId ?? "",
              },
              data: {
                name: input?.name ?? "",
                workingTime: input?.tiempoTrabajo ?? 0,
                restTime: input?.tiempoDescanso ?? 0,
                timeObjetive: input?.timeObjective ?? 0,
                song: input?.videoUrl ?? "",
              },
            },
          },
        },
      });
    }),

  eliminarAsignatura: publicProcedure
    .input(z.object({ subjectId: z.string() }).nullish())
    .mutation(({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          subjects: {
            delete: {
              subjectId: input?.subjectId ?? "",
            },
          },
        },
      });
    }),

  añadirTiempo: publicProcedure
    .input(
      z
        .object({
          subjectId: z.string(),
          tiempo: z.number(),
          totalTime: z.number(),
        })
        .nullish()
    )
    .mutation(({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      const tiempoAñadido = ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          subjects: {
            update: {
              where: {
                subjectId: input?.subjectId ?? "",
              },
              data: {
                individualtimes: {
                  create: {
                    workedTime: input?.tiempo ?? 0,
                    totalTime: input?.totalTime ?? 0,
                  },
                },
              },
            },
          },
        },
      });
      return tiempoAñadido;
    }),

  getTiempos: publicProcedure
    .input(z.object({ subjectId: z.string() }).nullish())
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      const suma = ctx.prisma.individualTimes.findMany({
        where: {
          subjectId: input?.subjectId ?? "",
        },
        select: {
          workedTime: true,
        },
      });
      return suma;
    }),

  actualizarTiempoTotal: publicProcedure
    .input(z.object({ subjectId: z.string(), totalTime: z.number() }).nullish())
    .mutation(({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          subjects: {
            update: {
              where: {
                subjectId: input?.subjectId ?? "",
              },
              data: {
                totalTime: input?.totalTime ?? 0,
              },
            },
          },
        },
      });
    }),

  checkIfSubjectExists: publicProcedure
    .input(
      z.object({ id: z.string().nullish(), subjectId: z.string() }).nullish()
    )
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      const subject = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id ?? "",
        },
        select: {
          subjects: {
            where: {
              subjectId: input?.subjectId ?? "",
            },
          },
        },
      });

      if (subject?.subjects[0] === undefined) {
        return false;
      } else {
        return true;
      }
    }),

  getSubjectSong: publicProcedure
    .input(z.object({ subjectId: z.string() }).nullish())
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      const song = await ctx.prisma.subjects.findUnique({
        where: {
          subjectId: input?.subjectId ?? "",
        },
        select: {
          song: true,
        },
      });

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        song: song?.song ?? "",
      };
    }),

  getUserTimes: publicProcedure.query(async ({ ctx }) => {
    if (ctx === undefined) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }
    if (!ctx.session || !ctx.session.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }
    const times = await ctx.prisma.user.findMany({
      where: {
        id: ctx.session.user.id ?? "",
      },
      select: {
        subjects: {
          select: {
            name: true,
            individualtimes: {
              select: {
                id: true,
                subjectId: true,
                workedTime: true,
                date: true,
              },
            },
          },
        },
      },
    });
    return {
      map: times.map((time) => {
        return {
          Subjects: time.subjects.map((subject) => {
            return {
              name: subject.name,
              Times: subject.individualtimes.map((individualtime) => {
                return {
                  id: individualtime.id,
                  subjectId: individualtime.subjectId,
                  workedTime: individualtime.workedTime,
                  date: new Date(individualtime.date)
                    .toISOString()
                    .substring(0, 10),
                };
              }),
            };
          }),
        };
      }),
    };
  }),

  getUserSubjetTimes: publicProcedure
    .input(
      z
        .object({
          subjectId: z.string(),
          startDate: z.date(),
          endDate: z.date(),
        })
        .nullish()
    )
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      if (input === null || input === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need to provide a subjectId",
        });
      }

      const start = new Date(input.startDate);
      const end = new Date(input.endDate);
      const times = await ctx.prisma.user.findMany({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          subjects: {
            select: {
              individualtimes: {
                select: {
                  workedTime: true,
                  date: true,
                },
                where: {
                  date: {
                    gte: start,
                    lte: end,
                  },
                },
              },
            },
            where: {
              subjectId: input.subjectId,
            },
          },
        },
      });

      if (times[0]?.subjects[0] === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need to provide a valid subjectId",
        });
      }

      return {
        map: times.map((time) => {
          return {
            Subjects: time.subjects.map((subject) => {
              return {
                Times: subject.individualtimes.map((individualtime) => {
                  return {
                    workedTime: individualtime.workedTime,
                    date: new Date(individualtime.date)
                      .toISOString()
                      .substring(0, 10),
                    time: individualtime.date.getTime(),
                  };
                }),
              };
            }),
          };
        }),
      };
    }),
});
