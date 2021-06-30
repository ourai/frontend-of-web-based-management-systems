import { Pagination, ResponseResult } from '@/types/http';
import httpClient from '@/utils/http';

import { AnimationEntity } from './typing';

class AnimationRepository {
  public async getAnimationList(condition: Pagination): Promise<ResponseResult<AnimationEntity[]>> {
    return httpClient.get('/api/animations', { params: condition });
  }

  public async getAnimationById(id: string): Promise<ResponseResult<AnimationEntity>> {
    return httpClient.get(`/api/animations/${id}`);
  }
}

const repo = new AnimationRepository();

export { AnimationRepository, repo as default };
