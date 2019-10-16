export default function(date) {
    // Copy date so don't affect original
    const d = new Date(+date);

    if(isNaN(d)) {
        return;
    }

    // Move to previous Monday
    d.setDate(d.getDate() - d.getDay() + 1);

    // Week number is ceil date/7
    return {
        month: +d.getMonth()+1,
        week: Math.ceil(d.getDate()/7)
    };
};
