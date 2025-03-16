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
