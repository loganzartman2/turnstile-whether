import {differenceInCalendarDays, format} from 'date-fns';

// for mocking
export const currentDate = (): Date => new Date();

export const formatDay = (date: Date): string => {
  let result = format(date, "EEEE 'the' do");
  const dayDifference = differenceInCalendarDays(date, currentDate());
  if (dayDifference === 0) {
    result = `Today, ${result}`;
  } else if (dayDifference < 7) {
    result = `This ${result}`;
  } else if (dayDifference < 14) {
    result = `Next ${result}`;
  }
  return result;
};
