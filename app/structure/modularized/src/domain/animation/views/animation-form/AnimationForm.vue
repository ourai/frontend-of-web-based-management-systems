<template>
  <div>
    <form-renderer
      :fields="fields"
      :value="value"
      :validation="validation"
      :config="config"
      @change="onFieldValueChange"
    />
    <x-button color="primary" @click.prevent="context.submit()">保存</x-button>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';

import { ObjectViewHeadlessWidget } from '@/components/widget/headless';
import { FormRenderer } from '@/components/renderer';

import { getComponents } from '../../context';

@Component({
  components: getComponents({ FormRenderer }),
})
export default class AnimationForm extends ObjectViewHeadlessWidget {
  private get id() {
    return this.$route.params.id || '';
  }

  protected created(): void {
    const ctx = this.context;

    this.on({
      fieldChange: ({ name, value }) => console.log(name, value),
      fieldValidate: ({ name, result }) =>
        console.log(
          `Validation result for field '${name}'`,
          result.success,
          result.message,
          result.type,
        ),
      submit: () => {
        console.log('Form submitted!');
      },
    });

    if (this.id && ctx.getOne) {
      ctx.getOne(this.id, data => {
        this.dataSource = data;
        this.context.setValue(data);
      });
    }

    setTimeout(() => this.context.setFieldValue('ghost', 'You can not see me!'), 3000);
  }
}
</script>
