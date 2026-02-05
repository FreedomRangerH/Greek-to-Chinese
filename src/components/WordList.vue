<template>
  <n-input v-model:value="search" placeholder="查找" size="large" clearable />

  <n-virtual-list
    style="height: 640px; margin-top: 16px"
    :items="pairs"
    :item-size="64"
    :key="pairs.length"
  >
    <template #default="{ item }">
      <WordItem :pair="item" style="height: 64px" />
    </template>
  </n-virtual-list>
</template>

<script setup>
import { computed, ref } from "vue";
import { useDataStore } from "../data";
import WordItem from "./WordItem.vue";

const data = useDataStore();

const pairs = computed(() => {
  return data.getAllWords.filter((pair) => {
    const word = pair[0];
    if (!search.value) return true;
    return word.includes(search.value);
  });
});
const search = ref("");
</script>
