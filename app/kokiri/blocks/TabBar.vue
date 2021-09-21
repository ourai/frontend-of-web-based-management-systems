<template>
  <demo-container title="标签栏 TabBar">
    <demo-section title="演示">
      <demo-block title="基础用法">
        <tab-bar
          class="TabBarDemo-bar"
          prev-button-icon="el:arrow-left"
          next-button-icon="el:arrow-right"
          content-class-name="TabBarDemo-content"
          nav-class-name="TabBarDemo-nav"
          :navs="navs"
          ><icon refs="javascript"
        /></tab-bar>
      </demo-block>
      <demo-block title="平铺">
        <tab-bar
          class="TabBarDemo-bar"
          prev-button-icon="el:arrow-left"
          next-button-icon="el:arrow-right"
          content-class-name="TabBarDemo-content"
          nav-class-name="TabBarDemo-nav"
          :navs="navs"
          stretch
        />
      </demo-block>
      <demo-block title="滑动">
        <tab-bar
          class="TabBarDemo-bar"
          prev-button-icon="el:arrow-left"
          next-button-icon="el:arrow-right"
          content-class-name="TabBarDemo-content"
          nav-class-name="TabBarDemo-nav"
          :navs="manyNavs"
          ><icon refs="javascript"
        /></tab-bar>
      </demo-block>
      <demo-block title="使用子组件">
        <tab-bar
          prev-button-icon="el:arrow-left"
          next-button-icon="el:arrow-right"
          content-class-name="TabBarDemo-content"
        >
          <tab-nav
            class="TabBarDemo-nav"
            :flag="idx"
            :disabled="nav.disabled"
            :key="nav.label"
            v-for="(nav, idx) in manyNavs"
            >{{ nav.label }}</tab-nav
          >
          <icon refs="javascript" />
        </tab-bar>
      </demo-block>
    </demo-section>
  </demo-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { TabBar, TabNav, Icon } from 'kokiri';
import { DemoContainer, DemoSection, DemoBlock } from '../containers';

@Component({
  components: {
    DemoContainer,
    DemoSection,
    DemoBlock,
    TabBar,
    TabNav,
    Icon,
  },
})
export default class TabBarDemo extends Vue {
  private readonly navs: any[] = [
    { label: '用户管理' },
    { label: '配置管理' },
    { label: '角色管理' },
    { label: '定时任务补偿' },
  ];

  private manyNavs: any[] = [];

  private created(): void {
    [1, 2, 3, 4, 5].forEach(num =>
      [
        { label: '用户管理' },
        { label: '配置管理' },
        { label: '角色管理' },
        { label: '定时任务补偿' },
      ].forEach(nav => this.manyNavs.push({ ...nav, label: `${nav.label}${num}` })),
    );
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
