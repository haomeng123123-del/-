export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageParams {
  pageNo: number;
  pageSize: number;
}

export interface PageResult<T> {
  total: number;
  list: T[];
}
