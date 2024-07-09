import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const workingHoursData = [
  {
    day: 'Monday',
    deliveryStart: '09:00',
    deliveryEnd: '17:00',
    takeawayStart: '09:00',
    takeawayEnd: '17:00',
  },
  {
    day: 'Tuesday',
    deliveryStart: '09:00',
    deliveryEnd: '17:00',
    takeawayStart: '09:00',
    takeawayEnd: '17:00',
  },
  {
    day: 'Wednesday',
    deliveryStart: '09:00',
    deliveryEnd: '17:00',
    takeawayStart: '09:00',
    takeawayEnd: '17:00',
  },
  {
    day: 'Thursday',
    deliveryStart: '09:00',
    deliveryEnd: '17:00',
    takeawayStart: '09:00',
    takeawayEnd: '17:00',
  },
  {
    day: 'Friday',
    deliveryStart: '09:00',
    deliveryEnd: '17:00',
    takeawayStart: '09:00',
    takeawayEnd: '17:00',
  },
  {
    day: 'Saturday',
    deliveryStart: '10:00',
    deliveryEnd: '16:00',
    takeawayStart: '10:00',
    takeawayEnd: '16:00',
  },
  {
    day: 'Sunday',
    deliveryStart: '10:00',
    deliveryEnd: '16:00',
    takeawayStart: '10:00',
    takeawayEnd: '16:00',
  },
];

const OrderStatuses = [
  {
    id: 1,
    name: 'Created',
    desc: 'Created',
  },
  {
    id: 2,
    name: 'Wait confirm',
    desc: 'wait confirm',
  },
  {
    id: 3,
    name: 'Cooking',
    desc: 'cooking',
  },
  {
    id: 4,
    name: 'Done',
    desc: 'Done',
  },
];

const Category = [
  {
    id: 'clyelszag0000nzscx2tga0p3',
    name: 'Maki',
    slug: 'maki',
  },
  {
    id: 'clyelszag0300nzscx2tga0pu',
    name: 'Soups',
    slug: 'soups',
  },
  {
    id: 'clyelsza3430400nzscx2tga0pu',
    name: 'Rolls',
    slug: 'rolls',
  },
  {
    id: 'clyelsza3430400nzscdsds2tga0pu',
    name: 'Extras',
    slug: 'extras',
  },
];

const Products = [
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Roll 1',
    name: 'Roll 1',
    slug: 'roll_1',
    active: true,
    price: 15,
    servingSize: 8,
    weight: 150,
    discount: 0,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelsza3430400nzscx2tga0pu',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Roll 2',
    name: 'Roll 2',
    slug: 'roll_2',
    active: true,
    price: 15,
    servingSize: 8,
    weight: 150,
    discount: 0,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelsza3430400nzscx2tga0pu',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Roll 3',
    name: 'Roll 3',
    slug: 'roll_3',
    active: true,
    price: 10,
    servingSize: 8,
    weight: 150,
    discount: 0,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelsza3430400nzscx2tga0pu',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Roll 4',
    name: 'Roll 4',
    slug: 'roll_4',
    active: true,
    price: 12,
    servingSize: 8,
    weight: 150,
    discount: 0,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelsza3430400nzscx2tga0pu',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Roll 5',
    name: 'Roll 5',
    slug: 'roll_5',
    active: true,
    price: 20,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelsza3430400nzscx2tga0pu',
  },

  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Maki 1',
    name: 'Maki 1',
    slug: 'maki_1',
    active: true,
    price: 20,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelszag0000nzscx2tga0p3',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Maki 2',
    name: 'Maki 2',
    slug: 'maki_2',
    active: true,
    price: 20,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelszag0000nzscx2tga0p3',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Maki 3',
    name: 'Maki 3',
    slug: 'maki_3',
    active: true,
    price: 20,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelszag0000nzscx2tga0p3',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Maki 4',
    name: 'Maki 4',
    slug: 'maki_4',
    active: true,
    price: 20,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelszag0000nzscx2tga0p3',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Soup 1',
    name: 'Soup 1',
    slug: 'soup_1',
    active: true,
    price: 20,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelszag0000nzscx2tga0p3',
  },
  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Soup 2',
    name: 'Soup 2',
    slug: 'soup_2',
    active: true,
    price: 25,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelszag0000nzscx2tga0p3',
  },

  {
    image: 'https://i.imgur.com/gnEGDFn.png',
    description: 'Soup 3',
    name: 'Soup 3',
    active: true,
    slug: 'soup_3',
    price: 25,
    servingSize: 8,
    weight: 150,
    discount: 5,
    filling: ['riba', 'mech'],
    allergens: ['svas', 'xujas'],
    categoryId: 'clyelszag0000nzscx2tga0p3',
  },
];

async function main() {
  console.log('Seeding...');

  console.log('Seeding... working hours');
  for (const hours of workingHoursData) {
    await prisma.workingHours.upsert({
      where: { day: hours.day },
      update: {},
      create: hours,
    });
  }

  console.log('Seeding... order status');
  for (const status of OrderStatuses) {
    await prisma.orderStatuses.upsert({
      where: { id: status.id },
      update: {},
      create: status,
    });
  }

  console.log('Seeding... categories');

  for (const category of Category) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  console.log('Seeding... products');

  for (const product of Products) {
    await prisma.category.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
