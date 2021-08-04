import SchedulingInterface from "./Scheduling.vue"

export default {
    id: "datetime-scheduling",
    name: "Agendamento",
    description: "Interface para agendar um horário em com determinado médico",
    icon: "box",
    component: SchedulingInterface,
    types: ["dateTime", "timestamp"],
}
