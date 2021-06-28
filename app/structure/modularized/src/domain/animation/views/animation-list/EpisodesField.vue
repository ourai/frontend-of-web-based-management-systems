<template>
  <span>{{ value.length }}</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AnimationListEpisodesField extends Vue {
  @Prop({ type: Array, default: () => [] })
  private readonly value!: string[];
}
</script>
