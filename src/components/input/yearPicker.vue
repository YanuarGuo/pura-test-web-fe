<template>
  <div>
    <DatePicker v-model="year" type="year" format="YYYY" valueType="format" :input-attr="{ class: 'form-control' }"
      @change="onYearChange" />
  </div>
</template>

<script>
import "vue-datepicker-next/index.css";
import DatePicker from "vue-datepicker-next";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomDatePicker",
  components: {
    DatePicker,
  },
  data() {
    return {
      year: "",
      yearRange: "",
    };
  },
  methods: {
    onYearChange(selectedYear) {
      const startYear = parseInt(selectedYear, 10);
      const endYear = startYear + 1;
      this.yearRange = `${startYear}/${endYear}`;
      this.$emit("year-range-change", this.yearRange);
    },
  },
});
</script>

<style scoped>
/* Additional styling if needed */
</style>
