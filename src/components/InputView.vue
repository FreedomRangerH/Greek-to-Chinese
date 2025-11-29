<template>
  <n-flex :wrap="false">
    <n-input
      v-model:value="greek"
      placeholder="希腊文"
      size="large"
      clearable
    />

    <n-input
      v-model:value="chinese"
      placeholder="中文"
      size="large"
      clearable
    />

    <n-button type="primary" size="large" @click="add">
      <n-icon><Add /></n-icon>
    </n-button>
  </n-flex>

  <n-alert
  v-if="alertText"
    :type="alertType"
    style="margin-top: 16px"
    :title="alertText"
  />
</template>

<script setup>
import { onUnmounted } from "vue";
import { ref } from "vue";
import { Add } from "@vicons/ionicons5";

import { syllabify } from "../utils/syllabify";
import { useDataStore } from "../data";
const data = useDataStore();

const greek = ref("");
const chinese = ref("");
const alertText = ref("");
const alertType = ref("info");

let alertTimer = null;

const showAlert = (message, type) => {
  alertText.value = message;
  alertType.value = type;
  if (alertTimer) {
    clearTimeout(alertTimer);
  }
  alertTimer = setTimeout(() => {
    alertText.value = "";
  }, 5000);
};

const emit = defineEmits(["input"]);

const add = () => {
  const greekWord = greek.value.trim().toLowerCase();
  const chineseWord = chinese.value.trim();

  if (!greekWord) {
    showAlert("请输入希腊文", "warning");
    return;
  }

  if (!/^[\u0370-\u03FF\u1F00-\u1FFF]+$/i.test(greekWord)) {
    showAlert("希腊文只包含希腊字母", "error");
    return;
  }

  if (data.getSyllables(greekWord)) {
    showAlert("该希腊文已存在", "warning");
    return;
  }

  if (chineseWord && !/^[\u4e00-\u9fa5]+$/i.test(chineseWord)) {
    showAlert("中文只包含汉字", "error");
    return;
  }

  const syllableOptions = syllabify(greekWord);
  if (!syllableOptions) {
    showAlert("无法划分音节", "error");
  } else {
    emit("input", {
      greek: greekWord,
      chinese: chineseWord,
      options: syllableOptions,
    });
  }
};

const reset = () => {
  greek.value = "";
  chinese.value = "";
};

defineExpose({
  reset,
});

onUnmounted(() => {
  if (alertTimer) clearTimeout(alertTimer);
});
</script>
