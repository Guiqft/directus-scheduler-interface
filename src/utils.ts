export interface IScheduleDay {
    day: number
    start_time: string
    end_time: string
}

export interface IDoctorSchedule {
    avaiableDays: IScheduleDay[]
    disabledDays: number[]
}

interface IDoctorScheduleRaw {
    dia_da_semana: string
    inicio: string
    fim: string
}

const parseDoctorSchedule = (data: IDoctorScheduleRaw[]): IDoctorSchedule => {
    const daysMap = {
        Domingo: 1,
        "Segunda-feira": 2,
        "Terça-feira": 3,
        "Quarta-feira": 4,
        "Quinta-feira": 5,
        "Sexta-feira": 6,
        Sábado: 7,
    } as Record<string, number>

    const avaiableDays: IScheduleDay[] = data.map((el) => ({
        day: daysMap[el.dia_da_semana],
        start_time: el.inicio.substring(0, el.inicio.length - 3) + ":00",
        end_time: el.fim.substring(0, el.fim.length - 3) + ":00",
    }))

    const disabledDays: number[] = Object.keys(daysMap)
        .map((day) => {
            if (!data.find(({ dia_da_semana }) => dia_da_semana === day)) {
                return daysMap[day]
            }
        })
        .filter((el) => el !== undefined)

    return {
        avaiableDays,
        disabledDays,
    }
}

const toISOString = (date: Date): string => {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? "+" : "-",
        pad = function (num: number) {
            var norm = Math.floor(Math.abs(num))
            return (norm < 10 ? "0" : "") + norm
        }
    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds()) +
        dif +
        pad(tzo / 60) +
        ":" +
        pad(tzo % 60)
    )
}

export { parseDoctorSchedule, toISOString }
