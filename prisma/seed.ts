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

async function main() {
  console.log('Seeding...');

  // Seeding WorkingHours
  for (const hours of workingHoursData) {
    await prisma.workingHours.upsert({
      where: { day: hours.day },
      update: {},
      create: {
        day: hours.day,
        deliveryStart: hours.deliveryStart,
        deliveryEnd: hours.deliveryEnd,
        takeawayStart: hours.takeawayStart,
        takeawayEnd: hours.takeawayEnd,
      },
    });
  }

  for (const status of OrderStatuses) {
    await prisma.orderStatuses.upsert({
      where: { id: status.id },
      update: {},
      create: {
        id: status.id,
        name: status.name,
        desc: status.desc,
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
