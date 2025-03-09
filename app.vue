<template>

  <div>
    <NuxtLayout />
  </div>

</template>

<script setup>
import { computed, onMounted, ref, provide, inject } from "vue";

import ImageElement from "~/components/ImageElement.vue";

const globalCreationState = reactive({
  creationStep: null,
  companyName: null,
  logoBuilder: false,
});


// Access the injected GSAP animations initializer
const { $initAnimations } = useNuxtApp();

onMounted(() => {
  $initAnimations();
});


</script>
