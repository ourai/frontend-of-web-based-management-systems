<template>
  <div class="FormView">
    <el-form>
      <el-form-item :label="f.label" :key="f.name" v-for="f in fields">{{
        dataSource[f.name]
      }}</el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { Form as ElForm, FormItem as ElFormItem } from 'element-ui';

import { ObjectViewContext } from '@/types/context';

import { getComponents } from '../../context';

const components = getComponents();

components.ElForm = ElForm;
components.ElFormItem = ElFormItem;

@Component({ components })
export default class FormView extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ObjectViewContext;

  private dataSource: any = {};

  private get id() {
    return this.$route.params.id || '';
  }

  private get fields() {
    return this.context.getFields();
  }

  private created(): void {
    const ctx = this.context;

    if (this.id && ctx.getOne) {
      ctx.getOne(this.id, data => (this.dataSource = data));
    }
  }
}
</script>
