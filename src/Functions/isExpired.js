import dayjs from 'dayjs';

export default function isExpired(subject, expiration) {
    return dayjs(subject).isBefore(expiration);
}