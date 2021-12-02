<template>
  <span>{{ count }}</span>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';

import { RelationFieldHeadlessWidget } from '@/components/widget/headless';

import { AnimationEntity } from '../../typing';

@Component
export default class AnimationListEpisodesField extends RelationFieldHeadlessWidget<
  AnimationEntity[]
> {
  private get count() {
    return (this.value || []).length;
  }
}
</script>
