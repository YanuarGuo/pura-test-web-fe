<template>
  <div class="money-icon">
    <slot>🪙</slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MoneyIcon',
  setup() { }
});
</script>

<style scoped>
.money-icon {
  display: inline-block;
  animation: wave 2s infinite;
  font-size: 2rem;
  /* Adjust the size as needed */
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }

  10% {
    transform: rotate(14deg);
  }

  20% {
    transform: rotate(-8deg);
  }

  30% {
    transform: rotate(14deg);
  }

  40% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(10deg);
  }

  60% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>