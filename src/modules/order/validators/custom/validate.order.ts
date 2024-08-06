import { PrismaService } from '../../../../prisma.service';
import { OrderDto } from '../../dtos/order.dto';
import * as moment from 'moment-timezone';

export const isAvailableOrderNow = async (
  prisma: PrismaService,
  dto: OrderDto,
) => {
  try {
    // Устанавливаем португальский часовой пояс
    const portugalTimezone = 'Europe/Lisbon';

    const dayName = dto.details.preorder
      ? moment(dto.details.preorderTime).tz(portugalTimezone).format('dddd')
      : moment().tz(portugalTimezone).format('dddd');
    const orderTime = dto.details.preorder
      ? moment(dto.details.preorderTime).tz(portugalTimezone)
      : moment().tz(portugalTimezone);

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
      const deliveryEndTime = moment(workingHours.deliveryEnd, 'HH:mm').tz(
        portugalTimezone,
      );
      const lastAvailableTime = deliveryEndTime.subtract(30, 'minutes');

      isAvailable = orderTime.isBefore(lastAvailableTime);
    } else if (dto.details.deliveryMethod === 'takeAway') {
      const takeawayEndTime = moment(workingHours.takeawayEnd, 'HH:mm').tz(
        portugalTimezone,
      );
      const lastAvailableTime = takeawayEndTime.subtract(30, 'minutes');

      isAvailable = orderTime.isBefore(lastAvailableTime); // Изменено на isBefore
    }

    return isAvailable;
  } catch (error) {
    console.error('Error checking order availability:', error);
    throw error;
  }
};
