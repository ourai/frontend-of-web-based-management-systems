<template>
  <a :href="`https://otaku.ourai.ws/animations/${row.id}/`" target="_blank">{{ value }}</a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { AnimationEntity } from '../../typing';

@Component
export default class AnimationListTitleField extends Vue {
  @Prop({ type: String, default: '' })
  private readonly value!: string;

  @Prop({ type: Object, default: () => ({}) })
  private readonly row!: AnimationEntity;
}
</script>
