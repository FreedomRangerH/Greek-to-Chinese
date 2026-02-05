<template>
  <n-input v-model:value="search" placeholder="查找" size="large" clearable />

  <n-virtual-list
    style="height: 640px; margin-top: 16px"
    :items="pairs"
    :item-size="64"
    :key="pairs.length"
  >
    <template #default="{ item }">
      <SyllableItem :pair="item" style="height: 64px" />
    </template>
  </n-virtual-list>
</template>

<script setup>
import { computed, ref } from "vue";
import { useDataStore } from "../data";
import SyllableItem from "./SyllableItem.vue";

const data = useDataStore();

const pairs = computed(() => {
  return data.getAllSyllables.filter((pair) => {
    const syllable = pair[0];
    if (!search.value) return true;
    return syllable.includes(search.value);
  });
});
const search = ref("");
</script>
