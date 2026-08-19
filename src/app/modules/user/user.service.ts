import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import config from '../../../config';
import { ApiError } from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import { pick } from '../../../utils/pick';
import { userFilterableFields, userSearchableFields } from './user.constant';
import type { IUpdateUserPayload, IUserFilters } from './user.interface';

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<IGenericResponse<unknown>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => {
        if (key === 'isActive') {
          return { isActive: value === 'true' };
        }
        return { [key]: value };
      }),
    });
  }

  const whereConditions: Prisma.UserWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { loans: true, transactions: true } },
    },
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getUserById = async (id: string): Promise<unknown> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { loans: true, transactions: true } },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateUser = async (id: string, payload: IUpdateUserPayload): Promise<unknown> => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const data: Prisma.UserUpdateInput = {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.role !== undefined && { role: payload.role }),
    ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    ...(payload.password !== undefined && {
      password: await bcrypt.hash(payload.password, config.salt_rounds),
    }),
  };

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: string): Promise<void> => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }
  await prisma.user.delete({ where: { id } });
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
