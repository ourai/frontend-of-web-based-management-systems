<template>
  <a :href="`https://otaku.ourai.ws/animations/${row.id}/`" target="_blank">{{ value }}</a>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';

import TableField from '@/widgets/TableField';

import { AnimationEntity } from '../../typing';

@Component
export default class AnimationListTitleField extends TableField<AnimationEntity> {
  @Prop({ type: String, default: '' })
  private readonly value!: string;
}
</script>
