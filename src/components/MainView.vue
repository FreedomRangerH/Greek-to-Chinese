<template>
  <InputView ref="inputView" @input="input" />

  <SyllableOptionView
    :syllable-options="syllableOptions"
    @select="selectSyllables"
  />

  <ChineseOptionView
    :chinese="chinese"
    v-model:syllables="selectedSyllables"
    v-model:pronunces="selectedChinese"
    @finish="finish"
  />

  <n-grid
    v-if="final"
    :y-gap="16"
    :cols="2"
    style="align-items: center; margin-top: 16px"
  >
    <n-gi :span="2">
      <n-alert :bordered="false" :type="final" :title="alertText">
        {{ selectedSyllables.join(" ") }}
        <n-icon><ArrowForward /></n-icon>
        {{ selectedChinese.join(" ") || "_" }}
      </n-alert>
    </n-gi>

    <n-gi>
      <n-button type="primary" size="large" @click="back">
        <n-icon><ArrowBack /></n-icon>
      </n-button>
    </n-gi>

    <n-gi>
      <n-button
        v-if="final === 'success'"
        :type="final"
        size="large"
        @click="confirm"
      >
        <n-icon><Checkmark /></n-icon>
      </n-button>

      <n-button v-else :type="final" size="large" @click="cancel">
        <n-icon><Close /></n-icon>
      </n-button>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { ref } from "vue";
import { ArrowBack, ArrowForward, Checkmark, Close } from "@vicons/ionicons5";

import InputView from "./InputView.vue";
import SyllableOptionView from "./SyllableOptionView.vue";
import ChineseOptionView from "./ChineseOptionView.vue";

import { auto } from "../utils/auto.js";
import { useDataStore } from "../data";
const data = useDataStore();

const inputView = ref(null);

const greek = ref("");
const chinese = ref("");
const syllableOptions = ref([]);
const selectedSyllables = ref([]);
const selectedChinese = ref([]);
const final = ref("");
const alertText = ref("");

function input(payload) {
  greek.value = payload.greek;
  chinese.value = payload.chinese;
  syllableOptions.value = payload.options;
  selectedSyllables.value = [];
  selectedChinese.value = [];
  final.value = "";
  alertText.value = "";
  if (syllableOptions.value.length === 1) {
    selectSyllables(syllableOptions.value[0]);
  }
}

function selectSyllables(option) {
  selectedSyllables.value = option;
  syllableOptions.value = [];

  auto(chinese.value, selectedSyllables.value, selectedChinese.value);
  finish();
}

function finish() {
  if (
    chinese.value ||
    selectedChinese.value.length === selectedSyllables.value.length
  ) {
    let c = chinese.value.length;
    selectedChinese.value?.forEach((pronunce) => {
      c -= pronunce.length;
    });
    if (c < selectedSyllables.value.length - selectedChinese.value.length) {
      final.value = "error";
      alertText.value = "中文过短";
    }
  } else {
    final.value = "error";
    alertText.value = "无法自动映射，请输入中文";
  }
  if (selectedChinese.value.length === selectedSyllables.value.length) {
    final.value = "success";
    alertText.value = "请确认";
  }
}

function back() {
  final.value = "";
  alertText.value = "";
  selectedChinese.value = [];
}

function confirm() {
  if (!!chinese.value) {
    for (let i = 0; i < selectedSyllables.value.length; i++) {
      const syllable = selectedSyllables.value[i];
      const newPronunce = selectedChinese.value[i];
      const oldPronunce = data.getPronunce(syllable);
      if (!oldPronunce || oldPronunce !== newPronunce) {
        data.addSyllable(syllable, newPronunce);
      }
    }
  }
  data.addWord(greek.value, selectedSyllables.value);
  inputView.value.reset();
  cancel();
}

function cancel() {
  greek.value = "";
  chinese.value = "";
  syllableOptions.value = [];
  selectedSyllables.value = [];
  selectedChinese.value = [];
  final.value = "";
  alertText.value = "";
}
</script>
