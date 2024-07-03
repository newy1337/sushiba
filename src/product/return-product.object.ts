import { Prisma } from '@prisma/client';

export const returnProductObject: Prisma.ProductSelect = {
  id: true,
  name: true,
  slug: true,
};
