import prisma from '../db/prisma.js';

export const createUser = async (data) => {
  // add validation/business logic here
  return prisma.user.create({ data });
};

export const getUserById = async (id) => prisma.user.findUnique({ where: { id: id } });
export const listUsers = async (where) => prisma.user.findMany({ where });
export const getUserByEmail = async (val) => prisma.user.findUnique({ where: { email: val } });

export const updateUser = async (id, data) => prisma.user.update({ where: { id: id }, data });
export const deleteUser = async (id) => prisma.user.delete({ where: { id: id } });
