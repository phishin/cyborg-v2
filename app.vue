<template>
  <div class="app-wrapper">
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
.Vue-Toastification__toast--success, .Vue-Toastification__toast.Vue-Toastification__toast--info {
  color: #ffffff;
  background-color: #0F172A;
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
  background: #F3F4F6;  /* pale bar */
}

/* Close button (if enabled) */
.Toastify__close-button {
  color: #00C9B1;
  opacity: 1;
}
.Toastify__close-button:hover {
  opacity: 1;
  color: #D5F7F3;
}


</style>