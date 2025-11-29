<template>
  <n-alert
    v-if="props.syllableOptions.length > 1"
    :bordered="false"
    type="info"
    title="请选择音节划分"
    style="margin-top: 16px"
  />

  <n-flex v-if="props.syllableOptions.length > 1" style="margin-top: 16px">
    <n-button
      v-for="(option, index) in props.syllableOptions"
      :key="index"
      size="large"
      type="primary"
      @click="selectSyllables(option)"
    >
      {{ option.join(" ") }}
    </n-button>
  </n-flex>
</template>

<script setup>
const props = defineProps(["syllableOptions"]);
const emit = defineEmits(["select"]);
const selectSyllables = (option) => {
  emit("select", option);
};
</script>
