import { PrismaService } from '../../../../prisma.service';
import { OrderDto } from '../../dtos/order.dto';
import * as moment from 'moment-timezone';

export const isAvailableOrderNow = async (
  prisma: PrismaService,
  dto: OrderDto,
) => {
  try {
    const portugalTimezone = 'Europe/Lisbon';

    const dayName = dto.details.preorder
      ? moment(dto.details.preorderTime).tz(portugalTimezone).format('dddd')
      : moment().tz(portugalTimezone).format('dddd');
    const orderTime = dto.details.preorder
      ? moment(dto.details.preorderTime).tz(portugalTimezone)
      : moment().tz(portugalTimezone);

    console.log(orderTime);

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
      const deliveryStartTime = moment(workingHours.deliveryStart, 'HH:mm').tz(
        portugalTimezone,
      );
      const deliveryEndTime = moment(workingHours.deliveryEnd, 'HH:mm').tz(
        portugalTimezone,
      );
      const lastAvailableTime = deliveryEndTime.subtract(30, 'minutes');

      console.log(deliveryStartTime, deliveryEndTime);
      isAvailable = orderTime.isBetween(deliveryStartTime, lastAvailableTime);
    } else if (dto.details.deliveryMethod === 'takeAway') {
      const takeawayStartTime = moment(workingHours.takeawayStart, 'HH:mm').tz(
        portugalTimezone,
      );
      const takeawayEndTime = moment(workingHours.takeawayEnd, 'HH:mm').tz(
        portugalTimezone,
      );
      const lastAvailableTime = takeawayEndTime.subtract(30, 'minutes');

      console.log(takeawayStartTime, takeawayEndTime);
      isAvailable = orderTime.isBetween(takeawayStartTime, lastAvailableTime);
    }

    return isAvailable;
  } catch (error) {
    console.error('Error checking order availability:', error);
    throw error;
  }
};
