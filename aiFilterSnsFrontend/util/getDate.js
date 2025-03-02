export default function getDate(DT) {
    const dateTime = DT.split("T");
    const date = dateTime[0];
    const times = dateTime[1].split(".");
    const time = times[0];
    return [date, time];
}