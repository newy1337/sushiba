import { PrismaService } from '../../../../prisma.service';
import { OrderDto } from '../../dtos/order.dto';
import * as moment from 'moment';

export const isAvailableOrderNow = async (
  prisma: PrismaService,
  dto: OrderDto,
) => {
  try {
    const dayName = dto.details.preorder
      ? moment(dto.details.preorderTime).format('dddd')
      : moment().format('dddd');
    const currentTime = dto.details.preorder
      ? moment(dto.details.preorderTime)
      : moment();

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
      const deliveryEndTime = moment(workingHours.deliveryEnd, 'HH:mm');
      const lastAvailableTime = deliveryEndTime.subtract(30, 'minutes');

      isAvailable = currentTime.isBefore(lastAvailableTime);
    } else if (dto.details.deliveryMethod === 'takeAway') {
      const takeawayEndTime = moment(workingHours.takeawayEnd, 'HH:mm');
      const lastAvailableTime = takeawayEndTime.subtract(30, 'minutes');

      isAvailable = currentTime.isBefore(lastAvailableTime);
    }

    return isAvailable;
  } catch (error) {
    console.error('Error checking order availability:', error);
    throw error;
  }
};
