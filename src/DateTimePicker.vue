<template>
    <div class="datetime-picker-container">
        <DatePicker
            v-model="teste"
            mode="dateTime"
            title-position="left"
            :min-date="dateLimits.min"
            :max-date="dateLimits.max"
            :minute-increment="15"
            :disabled-dates="{ weekdays: disabledDates }"
            is24hr
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { Calendar, DatePicker } from "v-calendar"
import { addDays } from "date-fns"

export default defineComponent({
    components: { Calendar, DatePicker },
    props: {
        disabledDates: { type: (): number[] => [], default: [] },
    },
    mounted() {
        console.log(this.disabledDates)
    },
    setup() {
        const teste = ref(null)
        const dateLimits = ref({
            min: new Date(),
            max: addDays(new Date(), 30),
        })

        return { teste, dateLimits }
    },
})
</script>

<style lang="scss" scoped>
.datetime-picker-container {
}
</style>
