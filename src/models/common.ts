export type Response<T> = {
  data: ReadonlyArray<T>;
  page: number;
  pageSize: number;
  totalElements: number;
};

export type FilterRequestParams = {
  page?: number;
  pageSize?: number;
  filter?: string | number | Date;
};

export type Repository<T> = {
  create: (entity: T) => Promise<T>;
  update: (entity: T) => Promise<T>;
  read: (id: string) => Promise<T>;
  readAll: (filter?: FilterRequestParams) => Promise<Response<T>>;
  remove: (id: string) => Promise<void>;
};

export type Service<TRequest, TResponse> = {
  create: (dto: TRequest) => Promise<TResponse>;
  update: (id: string, dto: TRequest) => Promise<TResponse>;
  read: (id: string) => Promise<TResponse>;
  readAll: (filter?: FilterRequestParams) => Promise<Response<TResponse>>;
  remove: (id: string) => Promise<void>;
};
