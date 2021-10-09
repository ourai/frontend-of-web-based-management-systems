<template>
  <wait :busy="loading">
    <form-renderer
      :fields="fields"
      :value="value"
      :validation="validation"
      :config="config"
      @change="onFieldValueChange"
    />
    <searchable-tree
      :data-source="treeData"
      :value="checkedNodes"
      :expanded-keys="expandedNodes"
      :selected-keys="selectedNodes"
      :node-field="{ key: 'id', label: 'name', children: 'subList' }"
      :node-renderer="renderTreeNode"
      :filter="filterTreeNode"
      placeholder="请输入关键字"
      empty-text="饿爆了！快喂我"
      checkable
      expanded
      @change="handleTreeChange"
      @select="handleTreeSelect"
      @expand="handleTreeExpand"
    />
    <x-button color="primary" @click.prevent="context.submit()">保存</x-button>
  </wait>
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
  private readonly treeData: any[] = [
    {
      id: 1,
      name: '节点 1',
      subList: [
        { id: 2, name: '节点 1-1' },
        { id: 3, name: '节点 1-2' },
      ],
    },
    {
      id: 4,
      name: '节点 2',
      subList: [
        { id: 5, name: '节点 2-1' },
        { id: 6, name: '节点 2-2' },
      ],
    },
  ];

  private checkedNodes = [3];

  private expandedNodes = [this.treeData[0].id];

  private selectedNodes = [2];

  private get id() {
    return this.$route.params.id || '';
  }

  private filterTreeNode(keyword, data): boolean {
    return data.name.indexOf(keyword) > -1;
  }

  private handleTreeChange(checkedKeys): void {
    console.log('checked keys', checkedKeys);
    this.checkedNodes = checkedKeys;
  }

  private handleTreeSelect(selectedKeys): void {
    console.log('selected keys', selectedKeys);
    this.selectedNodes = selectedKeys;
  }

  private handleTreeExpand(expandedKeys): void {
    console.log('expanded keys', expandedKeys);
    this.expandedNodes = expandedKeys;
  }

  private renderTreeNode(data) {
    return this.$createElement('span', `${data.name} (key-${data.id})`);
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
