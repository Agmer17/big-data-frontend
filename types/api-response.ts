
export interface ApiResponse<T, M = Record<string, unknown>> {
  data: T;
  meta: M;
}

// akjsndikajsbdkb
export interface ApiErrorResponse { 
  error: {
    code: string;
    message: string;
    details: ApiErrorDetail[];
  };
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TotalMeta {
  total: number;
}

export type Sentiment = "positive" | "negative" | "neutral";

export type SortOrder = "asc" | "desc";

export type AnalyticsResponse<T> = ApiResponse<T[], TotalMeta>;

export type PaginatedResponse<T> = ApiResponse<T[], PaginationMeta>;
