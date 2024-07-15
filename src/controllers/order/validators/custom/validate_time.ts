import { PrismaService } from '../../../../prisma.service';
import { OrderDto } from '../../dtos/order.dto';
import moment from 'moment';

export const isAvailableOrderNow = async (
  prisma: PrismaService,
  dto: OrderDto,
) => {
  try {
    const dayName = dto.details.preorderTime
      ? moment(dto.details.preorderTime).format('dddd')
      : moment().format('dddd');
    const currentTime = moment();

    const workingHours = await prisma.workingHours.findUnique({
      where: {
        day: dayName,
      },
    });

    if (!workingHours) {
      return false;
    }

    let isAvailable = false;
    if (dto.details.deliveryMethod === 'delivery') {
      const deliveryEndTime = moment(workingHours.deliveryEnd, 'HH:mm');
      const lastAvailableTime = deliveryEndTime.subtract(30, 'minutes');

      isAvailable = currentTime.isBefore(lastAvailableTime);
    } else if (dto.details.deliveryMethod === 'takeaway') {
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
