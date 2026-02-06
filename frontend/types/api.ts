// API response and error envelope types

// Generic success response wrapper
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

// Error response from API
export type ApiError = {
  error: string;
  details?: string;
  status?: number;
};

// Pagination metadata (if your API supports it)
export type PaginationMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

// Paginated response
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
