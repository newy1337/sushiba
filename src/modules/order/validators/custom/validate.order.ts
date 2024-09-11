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
    const dayName = preorder
      ? moment(dto.details.preorderTime).tz(portugalTimezone).format('dddd')
      : moment().tz(portugalTimezone).format('dddd');

    const orderTime = preorder
      ? moment(dto.details.preorderTime).tz(portugalTimezone)
      : moment().tz(portugalTimezone);

    // Получаем только время (обнуляем дату)
    const orderTimeOnly = moment(orderTime).set({
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
    if (dto.details.deliveryMethod === 'taxiDelivery') {
      const deliveryStartTime = moment(workingHours.deliveryStart, 'HH:mm')
        .tz(portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const deliveryEndTime = moment(workingHours.deliveryEnd, 'HH:mm')
        .tz(portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const lastAvailableTime = moment(deliveryEndTime).subtract(30, 'minutes');

      console.log(deliveryStartTime, deliveryEndTime);
      isAvailable = orderTimeOnly.isBetween(
        deliveryStartTime,
        preorder ? deliveryEndTime : lastAvailableTime,
        undefined,
        '[]',
      );
    } else if (dto.details.deliveryMethod === 'takeAway') {
      const takeawayStartTime = moment(workingHours.takeawayStart, 'HH:mm')
        .tz(portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const takeawayEndTime = moment(workingHours.takeawayEnd, 'HH:mm')
        .tz(portugalTimezone)
        .set({ year: 1970, month: 0, date: 1 });
      const lastAvailableTime = moment(takeawayEndTime).subtract(30, 'minutes');

      console.log(takeawayStartTime, orderTimeOnly, takeawayEndTime);
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
