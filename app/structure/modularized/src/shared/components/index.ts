import { registerComponent } from '../utils/component';

import Button from './button';
import DataTable from './data-table';

[
  { name: 'OlButton', ctor: Button },
  { name: 'DataTable', ctor: DataTable },
].forEach(({ name, ctor }) => registerComponent(name, ctor));
