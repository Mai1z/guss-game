import dayjs from 'dayjs';

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD.MM.YYYY, HH:mm:ss');
}

export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getSecondsUntil(targetDate: string | Date): number {
  const now = dayjs();
  const target = dayjs(targetDate);
  const diff = target.diff(now, 'second');
  return Math.max(0, diff);
}