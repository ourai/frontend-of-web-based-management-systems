<template>
  <div class="AnimationList">
    <ul>
      <li class="AnimationItem" :key="anime.id" v-for="anime in dataSource">
        <h3>
          <a :href="`https://otaku.ourai.ws/animations/${anime.id}/`" target="_blank">{{
            anime.title
          }}</a>
        </h3>
        <p v-if="anime.description">{{ anime.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { AnimationEntity } from '../../typing';
import { createListViewContext } from '../../context';

@Component
export default class AnimationList extends Vue {
  private readonly context = createListViewContext({}, this);

  private dataSource: AnimationEntity[] = [];

  private created(): void {
    this.context.execute('getAllAnimationList').then(res => {
      if (res.success) {
        this.dataSource = res.data;
      }
    });
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
