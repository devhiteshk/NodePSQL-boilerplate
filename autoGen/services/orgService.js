import prisma from '../db/prisma.js';

export const createOrg = async (data) => {
  // add validation/business logic here
  return prisma.org.create({ data });
};

export const getOrgById = async (id) => prisma.org.findUnique({ where: { id: id } });
export const listOrgs = async (where) => prisma.org.findMany({ where });
export const getOrgByOrgName = async (val) => prisma.org.findUnique({ where: { OrgName: val } });

export const updateOrg = async (id, data) => prisma.org.update({ where: { id: id }, data });
export const deleteOrg = async (id) => prisma.org.delete({ where: { id: id } });
