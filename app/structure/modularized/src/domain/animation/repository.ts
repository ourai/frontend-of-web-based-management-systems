import { ResponseResult } from '@/types';
import httpClient from '@/utils/http';

import { AnimationEntity } from './typing';

class AnimationRepository {
  public async getAllAnimationList(): Promise<ResponseResult<AnimationEntity[]>> {
    return httpClient.get('/api/animations');
  }

  public async getAnimationById(id: string): Promise<ResponseResult<AnimationEntity>> {
    return httpClient.get(`/api/animations/${id}`);
  }
}

const repo = new AnimationRepository();

export { AnimationRepository, repo as default };
