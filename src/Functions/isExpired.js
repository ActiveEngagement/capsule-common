import moment from 'moment-timezone';

export default function isExpired(subject, expiration, timezone = 'America/New_York') {
    return moment(subject).isBefore(moment.tz(expiration, timezone));
}