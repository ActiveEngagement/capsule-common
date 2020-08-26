import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function isExpired(cachedAt, updatedAt) {
    return dayjs.tz(updatedAt, 'America/New_York').local().isAfter(cachedAt);
}