<template>
  <n-grid :cols="6" :x-gap="16">
    <n-gi span="2">
      <n-tag :bordered="false" size="large">
        {{ props.pair[0] }}
      </n-tag>
    </n-gi>

    <n-gi span="2">
      <n-input v-model:value="pronunce" size="large" />
    </n-gi>

    <n-gi>
      <n-button
        :disabled="!pronunce"
        size="large"
        type="warning"
        @click="edit"
        :style="{
          visibility: pronunce !== props.pair[1] ? 'visible' : 'hidden',
        }"
      >
        <n-icon><Checkmark /></n-icon>
      </n-button>
    </n-gi>

    <n-gi>
      <n-button
        size="large"
        type="primary"
        @click="reset"
        :style="{
          visibility: pronunce !== props.pair[1] ? 'visible' : 'hidden',
        }"
      >
        <n-icon><Close /></n-icon>
      </n-button>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { ref, watch } from "vue";
import { Checkmark, Close } from "@vicons/ionicons5";
import { useDataStore } from "../data";
const data = useDataStore();

const props = defineProps(["pair"]);

const pronunce = ref(props.pair[1]);

function edit() {
  data.addSyllable(props.pair[0], pronunce.value);
}

function reset() {
  pronunce.value = props.pair[1];
}

watch(() => props.pair[1], (newValue) => {
  pronunce.value = newValue;
});
</script>
