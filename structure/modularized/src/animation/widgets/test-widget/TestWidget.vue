<template>
  <div class="TestWidget">来自动画模块的部件 <el-button /></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { getComponent } from '@/utils/component';

@Component({
  components: { ElButton: getComponent('OlButton')! },
})
export default class TestWidget extends Vue {}
</script>

<style lang="scss" src="./style.scss" scoped></style>
