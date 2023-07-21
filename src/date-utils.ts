import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  format,
  parse,
  set,
  setDay,
  startOfDay,
  startOfWeek,
} from 'date-fns';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

// for mocking
export const currentDate = (): Date => new Date();

export const formatDay = (date: Date): string => {
  let dateFormat = 'EEEE MMMM do';
  const dayDifference = differenceInCalendarDays(date, currentDate());
  if (dayDifference === 0) {
    dateFormat = `'Today,' EEEE 'the' do`;
  } else if (dayDifference < 7) {
    dateFormat = `'This' EEEE 'the' do`;
  } else if (dayDifference < 14) {
    dateFormat = `'Next' EEEE 'the' do`;
  }
  return format(date, dateFormat);
};

export const parseTime = (date: Date, time: string): Date => {
  return parse(time, 'HH:mm:ss', date);
};

export const formatTime = (date: Date): string => {
  return format(date, 'ha');
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
  weekOffset = 0,
  count,
}: {
  dayOfWeek: number;
  weekOffset?: number;
  count: number;
}) => {
  const startDate = getNextWeekday(currentDate(), dayOfWeek);
  return Array.from({length: count}).map((_, i) =>
    startOfDay(addWeeks(startDate, i + weekOffset))
  );
};

export const timeOfDayToHourRange = (
  timeOfDay: TimeOfDay
): [number, number] => {
  switch (timeOfDay) {
    case 'morning':
      return [8, 12];
    case 'afternoon':
      return [12, 17];
    case 'evening':
      return [17, 21];
    default:
      throw new Error(`Invalid time of day: ${timeOfDay}`);
  }
};

export const hourOfToday = (hour: number): Date => {
  const date = currentDate();
  return set(date, {
    hours: Math.max(0, Math.min(23, hour)),
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
};
