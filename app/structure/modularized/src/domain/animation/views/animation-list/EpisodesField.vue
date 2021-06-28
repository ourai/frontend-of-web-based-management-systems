<template>
  <span>{{ value.length }}</span>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';

import TableField from '@/widgets/TableField';

import { AnimationEntity } from '../../typing';

@Component
export default class AnimationListEpisodesField extends TableField<AnimationEntity> {
  @Prop({ type: Array, default: () => [] })
  private readonly value!: string[];
}
</script>
