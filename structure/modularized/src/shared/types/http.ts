type RequestParams = any;

type Pagination = {
  pageNum: number;
  pageSize: number;
};

type ResponseExtra = Pagination & {
  total: number;
  [key: string]: any;
};

type ResponseResult<DataType = any> = {
  success: boolean;
  message: string;
  code: string;
  data: DataType;
  extra: ResponseExtra;
};

type ResponseSuccess<T = any> = (data: T, extra: ResponseExtra, result: ResponseResult<T>) => any;
type ResponseFail<T = any> = (message: string, result: ResponseResult<T>) => any;

export { RequestParams, ResponseExtra, ResponseResult, ResponseSuccess, ResponseFail };
