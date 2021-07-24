<template>
    <div class="datetime-picker-container">
        <p>Escolha a data e o horário do agendamento:</p>
        <DatePicker
            title-position="left"
            mode="datetime"
            locale="pt-BR"
            timezone="Brazil/DeNoronha"
            :is24hr="true"
            :min-date="dateLimits.min"
            :max-date="dateLimits.max"
            :disabled-dates="{ weekdays: disabledDates }"
            :minute-increment="timeStep"
            :model-config="modelConfig"
            :model-value="date"
            @update:model-value="handleDateInput"
        />

        <p class="warning" v-if="error">{{ error }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { Calendar, DatePicker } from "v-calendar"
import { addDays, getDay, parseISO, format, formatISO } from "date-fns"
import { IScheduleDay } from "./utils"

export default defineComponent({
    emits: ["input"],
    components: { Calendar, DatePicker },
    props: {
        dayTimes: { type: (): IScheduleDay[] => [], default: [] },
        disabledDates: { type: (): number[] => [], default: [] },
        timeStep: { type: Number, default: 60 },
        initialState: { type: String, default: null },
    },
    setup(props, { emit }) {
        const date = ref(null)
        const dateLimits = ref({
            min: new Date(),
            max: addDays(new Date(), 30),
        })
        const error = ref(null)

        const modelConfig = ref({
            type: "string",
            mask: "iso",
            timeAdjust: "12:00:00",
        })

        onMounted(() => {
            if (props.initialState) {
                const currentDate = new Date(props.initialState)
                date.value = formatISO(currentDate).replace("-03:00", "XXX")
            }
        })

        const handleDateInput = (value: string) => {
            const parsedDate = parseISO(value.substring(0, value.length - 3))
            const selectedTime = format(parsedDate, "HH:mm:00")

            // getting time boundaries for selected day
            const { start_time, end_time } = props.dayTimes.filter((el) => {
                return el.day === getDay(parsedDate) + 1
            })[0]

            // check if time is outside the limits
            if (!(start_time <= selectedTime && selectedTime <= end_time)) {
                error.value = `Por favor, selecione um horário entre ${start_time} e ${end_time}.`
                emit("input", null)
            } else {
                error.value = null
                date.value = value
                emit("input", parsedDate)
            }
        }

        return {
            date,
            dateLimits,
            handleDateInput,
            modelConfig,
            error,
        }
    },
})
</script>

<style lang="scss" scoped>
.datetime-picker-container {
    margin: 20px;

    p {
        margin: 10px 0;
    }
}
</style>
