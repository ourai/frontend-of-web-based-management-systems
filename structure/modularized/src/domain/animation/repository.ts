import { ResponseResult } from '@/types';
import httpClient from '@/utils/http';

import { AnimationEntity } from './typing';

class AnimationRepository {
  public async getAllAnimationList(): Promise<ResponseResult<AnimationEntity[]>> {
    return httpClient.get('/api/animations');
  }
}

const repo = new AnimationRepository();

export { AnimationRepository, repo as default };
