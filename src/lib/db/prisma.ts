// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prismaBase = globalForPrisma.prisma || new PrismaClient();

// Create extended client with automatic updatedAt updates
export const prisma = prismaBase.$extends({
  name: 'updatePlaylistTimestamp',
  query: {
    playlistVideo: {
      async create({ args, query }) {
        const result = await query(args);

        // Update parent playlist's updatedAt
        if (result.playlistId) {
          await prismaBase.playlist
            .update({
              where: { id: result.playlistId },
              data: { updatedAt: new Date() }
            })
            .catch(() => {});
        }

        return result;
      },
      async update({ args, query }) {
        const result = await query(args);

        // Update parent playlist's updatedAt
        if (result.playlistId) {
          await prismaBase.playlist
            .update({
              where: { id: result.playlistId },
              data: { updatedAt: new Date() }
            })
            .catch(() => {});
        }

        return result;
      },
      async delete({ args, query }) {
        // Fetch the record before deletion to get playlistId
        const record = await prismaBase.playlistVideo.findUnique({
          where: args.where,
          select: { playlistId: true }
        });

        const result = await query(args);

        // Update parent playlist's updatedAt
        if (record?.playlistId) {
          await prismaBase.playlist
            .update({
              where: { id: record.playlistId },
              data: { updatedAt: new Date() }
            })
            .catch(() => {});
        }

        return result;
      }
    },
    subcategory: {
      async create({ args, query }) {
        const result = await query(args);

        // Update parent playlist's updatedAt
        if (result.playlistId) {
          await prismaBase.playlist
            .update({
              where: { id: result.playlistId },
              data: { updatedAt: new Date() }
            })
            .catch(() => {});
        }

        return result;
      },
      async update({ args, query }) {
        const result = await query(args);

        // Update parent playlist's updatedAt
        if (result.playlistId) {
          await prismaBase.playlist
            .update({
              where: { id: result.playlistId },
              data: { updatedAt: new Date() }
            })
            .catch(() => {});
        }

        return result;
      },
      async delete({ args, query }) {
        // Fetch the record before deletion to get playlistId
        const record = await prismaBase.subcategory.findUnique({
          where: args.where,
          select: { playlistId: true }
        });

        const result = await query(args);

        // Update parent playlist's updatedAt
        if (record?.playlistId) {
          await prismaBase.playlist
            .update({
              where: { id: record.playlistId },
              data: { updatedAt: new Date() }
            })
            .catch(() => {});
        }

        return result;
      }
    }
  }
}) as unknown as PrismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
