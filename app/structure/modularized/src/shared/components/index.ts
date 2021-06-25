import { registerComponent } from '../utils/component';

import Button from './button';

[{ name: 'OlButton', ctor: Button }].forEach(({ name, ctor }) => registerComponent(name, ctor));
