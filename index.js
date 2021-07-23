import { defineComponent, inject, ref, onMounted, resolveComponent, openBlock, createBlock, Fragment, createVNode } from 'vue';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var parseDoctorInfos = function (data) {
    var days = [
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado",
    ];
    var daysMap = {
        domingo: 0,
        segunda: 1,
        terca: 2,
        quarta: 3,
        quinta: 4,
        sexta: 5,
        sabado: 6,
    };
    var avaiableDays = [];
    var disabledDays = [];
    days.map(function (day) {
        if (data[day] === "sim") {
            var start_time = data[day + "_inicio"];
            var end_time = data[day + "_fim"];
            avaiableDays.push({
                day: daysMap[day],
                start_time: start_time.substring(0, start_time.length - 3),
                end_time: end_time.substring(0, end_time.length - 3),
            });
        }
        else {
            disabledDays.push(daysMap[day]);
        }
    });
    return {
        name: data.nome_do_medico,
        consultTime: data.tempo,
        avaiableDays: avaiableDays,
        disabledDays: disabledDays,
    };
};

var script = defineComponent({
    emits: ["input"],
    props: {
        value: { type: String, required: true, default: null },
    },
    setup: function (props, _a) {
        var _this = this;
        _a.emit;
        var system = inject("system");
        var selectedDoctor = ref({});
        var doctorList = ref([]);
        onMounted(function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, system.api.get("items/medico")];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200) {
                            doctorList.value = response.data.data.map(function (doctor) { return ({
                                text: doctor.nome_do_medico,
                                value: doctor,
                            }); });
                        }
                        return [2];
                }
            });
        }); });
        var handleInput = function (value) {
            selectedDoctor.value = parseDoctorInfos(value);
        };
        return { handleInput: handleInput, selectedDoctor: selectedDoctor, doctorList: doctorList };
    },
});

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_input = resolveComponent("v-input");
  const _component_v_select = resolveComponent("v-select");

  return (openBlock(), createBlock(Fragment, null, [
    createVNode(_component_v_input, {
      "model-value": _ctx.value,
      "onUpdate:modelValue": _ctx.handleInput
    }, null, 8 /* PROPS */, ["model-value", "onUpdate:modelValue"]),
    createVNode(_component_v_select, {
      placeholder: "Selecione um médico para agendamento",
      "model-value": _ctx.selectedDoctor.name,
      "onUpdate:modelValue": _ctx.handleInput,
      items: _ctx.doctorList
    }, null, 8 /* PROPS */, ["model-value", "onUpdate:modelValue", "items"])
  ], 64 /* STABLE_FRAGMENT */))
}

script.render = render;
script.__file = "src/Scheduling.vue";

var index = {
    id: "datetime-scheduling",
    name: "Agendamento",
    description: "Interface para agendar um horário em com determinado médico",
    icon: "box",
    component: script,
    types: ["json"],
};

export default index;
