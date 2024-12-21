<template>
  <input ref="inputRef" type="text" class="form-control m-1" :readonly="readonly_value" />
</template>

<script>
import { useCurrencyInput } from "vue-currency-input";
import { watchDebounced } from "@vueuse/core";
import { watch, ref, onMounted } from "vue";

export default {
  name: "DebouncedCurrencyInput",
  props: {
    modelValue: Number,
    options: Object,
    readonly_value: Boolean,
  },
  emits: ["value-updated", "value-inputed"],
  setup(props, { emit }) {

    // Create a copy of the options object
    const options = { ...props.options };

    // Check if props.options.max is not null and set max value
    if (props.options.max !== null && props.options.max !== undefined) {
      options.max = props.options.max;
    }

    const { inputRef, numberValue, setValue } = useCurrencyInput(options, false);

    const enforcePrefix = () => {
      const currentValue = inputRef.value.value; // Capture current input value
      if (currentValue) {
        let formattedValue = currentValue.replace(/[^0-9]/g, "");
        if (formattedValue.length > 0) {
          formattedValue =
            "Rp. 0" + parseInt(formattedValue, 10).toLocaleString();
        }
        inputRef.value.value = formattedValue;
      }
    };

    const updateNumberValue = (value) => {
      const numericValue = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;

      // Enforce max value if defined
      if (options.max !== undefined && numericValue > options.max) {
        setValue(options.max);
        emit("value-updated", options.max);
        emit("value-inputed", options.max);
      } else {
        setValue(numericValue);
        emit("value-updated", numericValue);
        emit("value-inputed", numericValue);
      }
    };

    watch(
      () => numberValue.value,
      (value) => {
        if (value < 0) {
          setValue(0);
          value = 0;
        }
      },
      { immediate: true }
    );

    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue < 0) {
          newValue = 0;
        }
        if (newValue !== numberValue.value) {
          setValue(newValue);
        }
      }
    );

    watchDebounced(
      numberValue,
      (value) => {
        if (value < 0) {
          setValue(0);
          value = 0;
        }
      },
      {
        debounce: 1000,
      }
    );

    onMounted(() => {
      if (inputRef.value) {
        inputRef.value.addEventListener("input", enforcePrefix);
        inputRef.value.addEventListener("input", (event) => {
          const inputValue = event.target.value;
          updateNumberValue(inputValue); // Update the numeric value directly from input
        });
        enforcePrefix();
      }
    });

    return { inputRef };
  },
};
</script>
