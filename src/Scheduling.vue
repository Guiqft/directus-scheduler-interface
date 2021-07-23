<template>
    <v-input :model-value="value" @update:model-value="handleInput" />
    <v-select
        placeholder="Selecione um médico para agendamento"
        :model-value="selectedDoctor.name"
        @update:model-value="handleInput"
        :items="doctorList"
    />
</template>

<script lang="ts">
import { defineComponent, onMounted, inject, ref } from "vue"
import { IDoctorData, IDoctorDataRaw, parseDoctorInfos } from "./utils"

interface ISelectItem {
    text: string
    value: any
}

export default defineComponent({
    emits: ["input"],
    props: {
        value: { type: String, required: true, default: null },
    },
    setup(props, { emit }) {
        const system = inject("system") as Record<string, any>

        const selectedDoctor = ref({} as IDoctorData)
        const doctorList = ref([] as ISelectItem[])
        onMounted(async () => {
            const response = await system.api.get("items/medico")
            if (response.status === 200) {
                doctorList.value = response.data.data.map(
                    (doctor: IDoctorDataRaw) => ({
                        text: doctor.nome_do_medico,
                        value: doctor,
                    })
                )
            }
        })

        const handleInput = (value: IDoctorDataRaw) => {
            selectedDoctor.value = parseDoctorInfos(value)
        }

        return { handleInput, selectedDoctor, doctorList }
    },
})
</script>

<style lang="scss" scoped></style>
