<template>

  <div>
    <NuxtLayout />
  </div>


</template>

<script setup>
import { onMounted } from "vue";

// Access the injected GSAP animations initializer
const { $initAnimations } = useNuxtApp();

onMounted(() => {
  $initAnimations();
});


</script>

<style lang="scss">
/* Base toast container */
.Vue-Toastification__toast--success {
  background-color: #0F172A;
  color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 1rem;
}

/* Error variant */
.Toastify__toast--error {
  border-left: 4px solid #f56565; /* red accent */
}

/* Progress bar */
.Toastify__progress-bar {
  background: #edf2f7;  /* pale bar */
}

/* Close button (if enabled) */
.Toastify__close-button {
  color: #a0aec0;
  opacity: 0.8;
}
.Toastify__close-button:hover {
  opacity: 1;
}

</style>