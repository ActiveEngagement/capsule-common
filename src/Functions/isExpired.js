import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
// dayjs.extend(timezone);

export default function isExpired(cachedAt, updatedAt) {
    return dayjs(updatedAt).local().isAfter(dayjs(cachedAt).local());
}