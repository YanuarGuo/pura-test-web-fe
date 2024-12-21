<template>
    <div class="mb-3">
      <input
        type="text"
        :id="inputId"
        class="form-control"
        v-model="internalValue"
        @input="filterInput"
        :placeholder="placeholder"
        required
      />
      <div v-if="!isValid" class="invalid-feedback">
        Please enter only numbers (0-9).
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from "vue";
  
  export default {
    name: "NumericInput",
    props: {
      modelValue: {
        type: String,
        default: "",
      },
      inputId: {
        type: String,
        default: "numericInput",
      },
      placeholder: {
        type: String,
        default: "Enter numbers only",
      },
    },
    setup(props, { emit }) {
      const internalValue = ref(props.modelValue);
      const isValid = ref(true);
  
      const filterInput = (event) => {
        const newValue = event.target.value.replace(/[^0-9]/g, "");
        internalValue.value = newValue;
        isValid.value = /^[0-9]*$/.test(newValue);
        emit("update:modelValue", newValue); // Emit the updated value
      };
  
      watch(() => props.modelValue, (newValue) => {
        internalValue.value = newValue;
      });
  
      return {
        internalValue,
        isValid,
        filterInput,
      };
    },
  };
  </script>
  