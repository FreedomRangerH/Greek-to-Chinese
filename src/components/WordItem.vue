<template>
  <n-grid :cols="6" :x-gap="16">
    <n-gi span="2">
      <n-tag :bordered="false" size="large">
        {{ props.pair[0] }}
      </n-tag>
    </n-gi>

    <n-gi span="2">
      <n-tag :bordered="false" size="large">
        {{ chinese.join(" ") }}
      </n-tag>
    </n-gi>

    <n-gi>
      <n-button v-if="!remove" size="large" type="error" @click="remove = true">
        <n-icon><Trash /></n-icon>
      </n-button>

      <n-button
        v-else
        size="large"
        type="error"
        @click="data.removeWord(props.pair[0])"
      >
        <n-icon><Checkmark /></n-icon>
      </n-button>
    </n-gi>

    <n-gi>
      <n-button
        size="large"
        type="primary"
        @click="remove = false"
        :style="{ visibility: remove ? 'visible' : 'hidden' }"
      >
        <n-icon><Close /></n-icon>
      </n-button>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { computed, ref } from "vue";
import { Checkmark, Close, Trash } from "@vicons/ionicons5";
import { useDataStore } from "../data";
const data = useDataStore();

const props = defineProps(["pair"]);

const chinese = computed(() => {
  return props.pair[1].map((syllable) => data.getPronunce(syllable));
});
const remove = ref(false);
</script>
