<template>
  <ellipsis>{{ value }}</ellipsis>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';

import { TextFieldHeadlessWidget } from '@/components/widget/headless';
import { getComponents } from '../../helper';

@Component({
  components: getComponents(),
})
export default class AnimationDetailDescriptionField extends TextFieldHeadlessWidget {}
</script>
