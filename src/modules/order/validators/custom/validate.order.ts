import { PrismaService } from '../../../../prisma.service';
import { OrderDto } from '../../dtos/order.dto';
import * as moment from 'moment-timezone';

export const isAvailableOrderNow = async (
  prisma: PrismaService,
  dto: OrderDto,
) => {
  try {
    const portugalTimezone = 'Europe/Lisbon';
    const preorder = dto.details.preorder;

    // Определение времени заказа
    const orderTime = preorder
      ? moment(dto.details.preorderTime).tz(portugalTimezone)
      : moment().tz(portugalTimezone);

    const dayName = preorder
      ? orderTime.format('dddd')
      : moment().tz(portugalTimezone).format('dddd');

    const orderTimeOnly = orderTime.clone().set({
      year: 1970,
      month: 0,
      date: 1,
    });

    const workingHours = await prisma.workingHours.findUnique({
      where: {
        day: dayName,
      },
    });

    if (!workingHours) {
      return false;
    }

    let isAvailable = false;

    // Проверка доступности для доставки
    if (dto.details.deliveryMethod === 'taxiDelivery') {
      const deliveryStartTime = moment
        .tz(workingHours.deliveryStart, 'HH:mm', portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const deliveryEndTime = moment
        .tz(workingHours.deliveryEnd, 'HH:mm', portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const lastAvailableTime = deliveryEndTime.clone().subtract(30, 'minutes');

      isAvailable = orderTimeOnly.isBetween(
        deliveryStartTime,
        preorder ? deliveryEndTime : lastAvailableTime,
        undefined,
        '[]',
      );
    }
    // Проверка доступности для самовывоза
    else if (dto.details.deliveryMethod === 'takeAway') {
      const takeawayStartTime = moment
        .tz(workingHours.takeawayStart, 'HH:mm', portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const takeawayEndTime = moment
        .tz(workingHours.takeawayEnd, 'HH:mm', portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const lastAvailableTime = takeawayEndTime.clone().subtract(30, 'minutes');

      isAvailable = orderTimeOnly.isBetween(
        takeawayStartTime,
        preorder ? takeawayEndTime : lastAvailableTime,
        undefined,
        '[]',
      );
    }

    return isAvailable;
  } catch (error) {
    console.error('Error checking order availability:', error);
    throw error;
  }
};
