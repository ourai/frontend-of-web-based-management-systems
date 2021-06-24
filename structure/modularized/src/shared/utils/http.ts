import axios, { AxiosResponse } from 'axios';

import { ResponseExtra, ResponseResult } from '../types';

function normalizeResponse<DataType = any>(res: AxiosResponse): ResponseResult<DataType> {
  return {
    success: res.status === 200,
    message: '',
    code: '',
    data: res.data as DataType,
    extra: {} as ResponseExtra,
  };
}

export { normalizeResponse, axios as default };
