export default function getLocalDate(time) {
    let date = new Date(parseInt(time)).toLocaleString().split(' ')[0].split('/')
    let year = date[0]
    let month = date[1] * 1 > 9 ? date[1] * 1 : 0 + date[1]
    let day = date[2] * 1 > 9 ? date[2] * 1 : 0 + date[2]

    let localDate = year.toString() + month.toString() + day.toString()
    return localDate
}