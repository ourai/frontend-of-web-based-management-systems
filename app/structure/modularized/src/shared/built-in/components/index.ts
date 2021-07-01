import { registerComponent } from 'handie-vue';

import Button from './button';
import DataTable from './data-table';

const components = [
  { name: 'OlButton', ctor: Button },
  { name: 'DataTable', ctor: DataTable },
];

function registerComponents(): void {
  components.forEach(({ name, ctor }) => registerComponent(name, ctor));
}

export { registerComponents };
