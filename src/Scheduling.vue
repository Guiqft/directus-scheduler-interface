<template>
    <div class="scheduling-container">
        <v-select
            placeholder="Selecione um médico para agendamento"
            :model-value="selectedDoctor.name"
            @update:model-value="handleDoctorSelection"
            :items="doctorList"
        />
        <date-time-picker
            v-if="selectedDoctor.name"
            :initialState="value?.date"
            :dayTimes="selectedDoctor.avaiableDays"
            :disabledDates="selectedDoctor.disabledDays"
            :timeStep="selectedDoctor.consultTime"
            @input="emitSchedule"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject, ref } from "vue"
import { IDoctorData, IDoctorDataRaw, parseDoctorInfos } from "./utils"
import DateTimePicker from "./DateTimePicker.vue"

interface ISelectItem {
    text: string
    value: any
}

interface IEmitData {
    doctor: string | number
    date: string
}

export default defineComponent({
    emits: ["input"],
    components: { DateTimePicker },
    props: {
        value: {
            type: (): IEmitData => ({} as IEmitData),
            required: true,
            default: null,
        },
    },
    setup(props, { emit }) {
        const system = inject("system") as Record<string, any>
        const selectedDoctor = ref({} as IDoctorData)
        const doctorList = ref([] as ISelectItem[])

        onMounted(async () => {
            // fetching Doctors data
            const response = await system.api.get("items/medico")
            if (response.status === 200) {
                doctorList.value = response.data.data.map(
                    (doctor: IDoctorDataRaw) => ({
                        text: doctor.nome_do_medico,
                        value: doctor,
                    })
                )
            }

            // setting existing schedule value
            if (props.value !== null) {
                const doctorData = doctorList.value.find(
                    ({ value }) => value.id === props.value.doctor
                )

                selectedDoctor.value = parseDoctorInfos(doctorData.value)
            }
        })

        const handleDoctorSelection = (value: IDoctorDataRaw) => {
            selectedDoctor.value = parseDoctorInfos(value)
        }

        const emitSchedule = (date: Date) => {
            if (date) {
                emit("input", {
                    doctor: selectedDoctor.value.id,
                    date: date.toString(),
                })
            } else emit("input", null)
        }

        return {
            handleDoctorSelection,
            selectedDoctor,
            doctorList,
            emitSchedule,
        }
    },
})
</script>

<style lang="scss" scoped></style>
