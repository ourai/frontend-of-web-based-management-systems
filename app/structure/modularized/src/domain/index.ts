import { registerModules } from '@/utils/module';

import session from './session';
import animation from './animation';
import comic from './comic';
import game from './game';
import novel from './novel';

registerModules([session, animation, comic, game, novel]);
