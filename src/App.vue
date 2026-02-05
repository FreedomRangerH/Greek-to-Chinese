<template>
  <n-config-provider :theme="darkTheme">
    <n-tabs size="large" default-value="main" pane-style="width: 800px;">
      <n-tab-pane display-directive="show:lazy" name="main">
        <template #tab>
          <n-icon>
            <Add />
          </n-icon>
        </template>
        <MainView />
      </n-tab-pane>

      <n-tab-pane display-directive="show:lazy" name="syllables">
        <template #tab>
          <n-icon>
            <Information />
          </n-icon>
        </template>
        <SyllableList />
      </n-tab-pane>

      <n-tab-pane display-directive="show:lazy" name="words">
        <template #tab>
          <n-icon>
            <Text />
          </n-icon>
        </template>
        <WordList />
      </n-tab-pane>

      <n-tab-pane display-directive="show:lazy" name="about">
        <template #tab>
          <n-icon>
            <EllipsisHorizontal />
          </n-icon>
        </template>
        <AboutView />
      </n-tab-pane>
    </n-tabs>
  </n-config-provider>
</template>

<script setup>
import { onMounted } from "vue";
import { darkTheme } from "naive-ui";
import { useDataStore } from "./data";
import { Add, EllipsisHorizontal, Information, Text } from "@vicons/ionicons5";
import MainView from "./components/MainView.vue";
import SyllableList from "./components/SyllableList.vue";
import WordList from "./components/WordList.vue";
import AboutView from "./components/AboutView.vue";

const data = useDataStore();
onMounted(() => {
  data.loadAll();
});
</script>
