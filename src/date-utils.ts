import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  format,
  setDay,
  startOfWeek,
} from 'date-fns';

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

export const getDayNames = () => {
  const firstDayOfWeek = startOfWeek(currentDate());
  return Array.from({length: 7}).map((_, i) =>
    format(addDays(firstDayOfWeek, i), 'EEEE')
  );
};

export const getNextWeekday = (date: Date, dayOfWeek: number) => {
  let result = setDay(date, dayOfWeek);
  if (result < date) {
    result = addWeeks(result, 1);
  }
  return result;
};

export const getUpcomingDates = ({
  dayOfWeek,
  count,
}: {
  dayOfWeek: number;
  count: number;
}) => {
  const startDate = getNextWeekday(currentDate(), dayOfWeek);
  return Array.from({length: count}).map((_, i) => addWeeks(startDate, i));
};
