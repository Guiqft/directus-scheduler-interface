<template>
    <div class="datetime-picker-container">
        <DatePicker
            title-position="left"
            mode="datetime"
            locale="pt-BR"
            :min-date="dateLimits.min"
            :max-date="dateLimits.max"
            :disabled-dates="{ weekdays: disabledDates }"
            :minute-increment="timeStep"
            :model-config="modelConfig"
            :model-value="date"
            @update:model-value="handleDateInput"
            :is-dark="isDark"
            is-expanded
            is24hr
        />
        <p class="note" v-if="timeStep">
            O agendamento tem um período de {{ timeStep }} minutos
        </p>
        <p class="warning" v-if="error">{{ error }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { Calendar, DatePicker } from "v-calendar"
import { addDays, getDay, parseISO, format, formatISO } from "date-fns"
import { IScheduleDay, toISOString } from "./utils"

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
        const isDark = ref(false)

        const date = ref(new Date(props.initialState))
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
                date.value = new Date(value)
                emit("input", toISOString(parsedDate))
            }
        }

        onMounted(() => {
            //checking directus theme
            const sidebarEl = document.getElementsByClassName("sidebar")[0]
            if (sidebarEl) {
                const { backgroundColor } = getComputedStyle(sidebarEl)
                if (backgroundColor === "rgb(46, 60, 67)") {
                    isDark.value = true
                } else if (backgroundColor === "rgb(240, 244, 249)") {
                    isDark.value = false
                }
            }
        })

        return {
            date,
            dateLimits,
            handleDateInput,
            modelConfig,
            error,
            isDark,
        }
    },
})
</script>

<style lang="scss" scoped>
.datetime-picker-container {
    margin: 20px;

    .note {
        margin-left: 10px;
        color: var(--foreground-subdued);
    }

    .warning {
        color: var(--warning);
        margin: 10px 0;
    }
}
</style>
