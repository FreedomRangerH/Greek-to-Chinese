<template>
  <n-grid
    :y-gap="32"
    :cols="4"
    v-if="
      syllables &&
      syllables.length > 0 &&
      chinese &&
      pronunces &&
      pronunces.length < syllables.length &&
      c >= syllables.length - pronunces.length
    "
    style="align-items: center; margin-top: 16px"
  >
    <n-gi :span="4">
      <n-alert :type="type" :title="alertText" />
    </n-gi>

    <n-gi :span="4">
      <n-steps :current="currentIndex + 1">
        <n-step
          v-for="(syllable, index) in syllables"
          :key="index"
          :title="syllable"
          :description="index < pronunces.length ? pronunces[index] : '&nbsp;'"
        />
      </n-steps>
    </n-gi>

    <n-gi :span="2">
      <n-flex justify="center" :wrap="false">
        <n-tag :bordered="false" size="large">
          {{ syllables[currentIndex] }}
        </n-tag>

        <n-tag
          v-model:checked="keep"
          checkable
          size="large"
          :style="{ visibility: oldPronunce ? 'visible' : 'hidden' }"
        >
          <n-icon><ArrowForward /></n-icon>
          {{ oldPronunce }}
        </n-tag>
      </n-flex>
    </n-gi>

    <n-gi>
      <n-tag :bordered="false" size="large">
        {{ newPronunce }}
      </n-tag>
    </n-gi>

    <n-gi>
      <n-slider v-model:value="length" :min="1" :max="maxLength" />
    </n-gi>

    <n-gi :span="2">
      <n-button size="large" @click="back">
        <n-icon><ArrowBack /></n-icon>
      </n-button>
    </n-gi>

    <n-gi :span="2">
      <n-button size="large" :type="type" @click="forward">
        <n-icon><ArrowForward /></n-icon>
      </n-button>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";
import { auto } from "../utils/auto";
import { useDataStore } from "../data";
const data = useDataStore();
const props = defineProps(["chinese", "syllables", "pronunces"]);
const emit = defineEmits(["update:syllables", "update:pronunces", "finish"]);

const c = computed(() => {
  let used = 0;
  props.pronunces?.forEach((pronunce) => {
    used += pronunce.length;
  });
  return props.chinese.length - used;
});

const type = computed(() => {
  if (oldPronunce.value) {
    return "warning";
  } else {
    return "info";
  }
});
const alertText = computed(() => {
  if (oldPronunce.value) {
    return `请保留或替换已有发音`;
  } else {
    return "请映射发音";
  }
});
const currentIndex = computed(() => props.pronunces.length);
const oldPronunce = computed(() => {
  return data.getPronunce(props.syllables[currentIndex.value]);
});
const keep = ref(false);

const newPronunce = computed(() => {
  return props.chinese.substring(
    props.chinese.length - c.value,
    props.chinese.length - c.value + length.value
  );
});
const maxLength = computed(() => {
  return c.value - props.syllables.length + props.pronunces.length + 1;
});
const length = ref(1);
watch(
  [currentIndex, oldPronunce],
  () => {
    if (oldPronunce.value) {
      keep.value = true;
      length.value =
        oldPronunce.value.length > maxLength.value
          ? maxLength.value
          : oldPronunce.value.length;
    } else {
      keep.value = false;
      length.value = 1;
    }
  },
  { immediate: true } // 初始化时立即执行一次
);

function back() {
  if (currentIndex.value === 0) {
    emit("update:syllables", []);
  } else {
    const newPronunces = props.pronunces.slice(0, currentIndex.value - 1);
    emit("update:pronunces", newPronunces);
  }
}

function forward() {
  const newPronunces = [...props.pronunces];
  if (oldPronunce.value && keep.value) {
    newPronunces.push(oldPronunce.value);
  } else {
    newPronunces.push(newPronunce.value);
  }
  auto(props.chinese, props.syllables, newPronunces);
  emit("update:pronunces", newPronunces);
  let used = 0;
  newPronunces?.forEach((pronunce) => {
    used += pronunce.length;
  });
  if (
    props.chinese.length - used <
    props.syllables.length - newPronunces.length
  ) {
    emit("finish");
  }
  if (newPronunces.length === props.syllables.length) {
    emit("finish");
  }
}
</script>
