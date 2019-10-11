import moment from 'moment-timezone';

export default function isExpired(a, b, timezone = 'America/New_York') {
    return moment(a).isBefore(moment.tz(b, timezone));
}