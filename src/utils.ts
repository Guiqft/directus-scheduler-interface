export interface IDoctorDataRaw {
    id: number | string
    nome_do_medico: string
    tempo: number
    domingo: "sim" | "nao"
    domingo_inicio?: string
    domingo_fim?: string
    segunda: "sim" | "nao"
    segunda_inicio?: string
    segunda_fim?: string
    terca: "sim" | "nao"
    terca_inicio?: "08:00:31"
    terca_fim?: "12:00:36"
    quarta: "sim" | "nao"
    quarta_inicio?: string
    quarta_fim?: string
    quinta: "sim" | "nao"
    quinta_inicio?: string
    quinta_fim?: string
    sexta: "sim" | "nao"
    sexta_inicio?: string
    sexta_fim?: string
    sabado: "sim" | "nao"
    sabado_inicio?: string
    sabado_fim?: string
}

interface IScheduleDay {
    day: number
    start_time: string
    end_time: string
}

export interface IDoctorData {
    name: string
    consultTime: number
    avaiableDays: IScheduleDay[]
    disabledDays: number[]
}

const parseDoctorInfos = (data: IDoctorDataRaw): IDoctorData => {
    const days = [
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado",
    ]
    const daysMap = {
        domingo: 0,
        segunda: 1,
        terca: 2,
        quarta: 3,
        quinta: 4,
        sexta: 5,
        sabado: 6,
    } as Record<string, number>

    let avaiableDays: IScheduleDay[] = []
    let disabledDays: number[] = []
    days.map((day) => {
        if ((data as Record<string, any>)[day] === "sim") {
            const start_time = (data as Record<string, any>)[
                `${day}_inicio`
            ] as string
            const end_time = (data as Record<string, any>)[
                `${day}_fim`
            ] as string

            avaiableDays.push({
                day: daysMap[day],
                start_time: start_time.substring(0, start_time.length - 3),
                end_time: end_time.substring(0, end_time.length - 3),
            })
        } else {
            disabledDays.push(daysMap[day])
        }
    })
    return {
        name: data.nome_do_medico,
        consultTime: data.tempo,
        avaiableDays,
        disabledDays,
    }
}

export { parseDoctorInfos }
