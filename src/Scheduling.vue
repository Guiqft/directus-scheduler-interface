<template>
    <div class="scheduling-container">
        <p v-if="error" class="error">{{ error }}</p>
        <date-time-picker
            v-if="doctorSchedule"
            :dayTimes="doctorSchedule.avaiableDays"
            :disabledDates="doctorSchedule.disabledDays"
            :timeStep="doctorConsultTime"
            @input="emitSchedule"
            :initialState="value"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from "vue"
import { IDoctorSchedule, parseDoctorSchedule } from "./utils"
import DateTimePicker from "./DateTimePicker.vue"

export default defineComponent({
    emits: ["input"],
    components: { DateTimePicker },
    props: {
        value: {
            type: Date,
            required: true,
            default: null,
        },
    },
    setup(props, { emit }) {
        const api = inject("api") as Record<string, any>
        const values = inject("values") as Record<string, any>

        const error = ref(null)

        const doctorSchedule = ref({} as IDoctorSchedule)
        const doctorConsultTime = ref(null as number)

        watch(
            values,
            async () => {
                try {
                    // getting doctor schedule data raw
                    const doctorId = values.value.medico
                    if (doctorId) {
                        const response = (
                            await api.get(
                                `items/cronograma/?filter={ "medico": { "_eq": "${doctorId}" }}`
                            )
                        ).data.data[0]

                        // getting doctor consult time
                        doctorConsultTime.value = response.tempo_atendimento
                        if (!doctorConsultTime) {
                            error.value =
                                "É necessário configurar o cronograma do médico selecionado"
                        } else {
                            // getting days relations ids
                            const doctorScheduleRelations =
                                response.dias_de_atendimento as number[]

                            // getting ids from doctor relation
                            const doctorScheduleDaysIds = (
                                await api.get(
                                    `items/cronograma_dias_atendimento/?filter={ "id": { "_in": [${doctorScheduleRelations.toString()}] }}`
                                )
                            ).data.data.map(
                                ({
                                    dias_atendimento_id,
                                }: {
                                    dias_atendimento_id: number
                                }) => dias_atendimento_id
                            )

                            // getting days schedule
                            doctorSchedule.value = parseDoctorSchedule(
                                (
                                    await api.get(
                                        `items/dias_atendimento/?filter={ "id": { "_in": [${doctorScheduleDaysIds.toString()}] }}`
                                    )
                                ).data.data
                            )

                            error.value = null
                        }
                    } else {
                        error.value = "Por favor, selecione um médico."
                        doctorSchedule.value = null
                    }
                } catch (e) {
                    console.error(e)
                    error.value =
                        "Não foi possível obter os dados do médico. Contate o suporte."
                }
            },
            { immediate: true }
        )

        const emitSchedule = (selectedDate: Date) => {
            emit("input", selectedDate)
        }

        return { error, doctorSchedule, doctorConsultTime, emitSchedule }
    },
})
</script>

<style lang="scss" scoped>
.error {
    color: var(--warning);
}
</style>
