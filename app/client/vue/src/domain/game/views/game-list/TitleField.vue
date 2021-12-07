<template>
  <a :href="`https://otaku.ourai.ws/games/${row.id}/`" target="_blank">{{ value }}</a>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';

import { StringFieldHeadlessWidget } from '@/components/widget/headless';

@Component
export default class GameListTitleField extends StringFieldHeadlessWidget {
  private get row() {
    return this.$$view.getValue();
  }
}
</script>
