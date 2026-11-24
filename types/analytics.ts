
import type {
  AnalyticsResponse,
  ApiResponse,
  PaginatedResponse,
  Sentiment,
} from "./api-response";

export interface HealthData {
  status: string;
  database_connected: boolean;
  missing_tables: string[];
}

export interface TableInfo {
  table_name: string;
  n_rows: number;
}

export type HealthResponse = ApiResponse<HealthData>;
export type TablesResponse = AnalyticsResponse<TableInfo>;

// ==========================================
// SENTIMENT
// ==========================================

export interface SentimentDistribution {
  sentiment: Sentiment;
  n_comments: number;
  percentage: number;
}

export interface SentimentSummary {
  total_comments: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  positive_to_negative_ratio: number;
}

export interface DailySentiment {
  comment_date: string;
  n_total: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
  n_total_ma7: number | null;
}

export interface MonthlySentiment {
  month_start: string;
  n_total: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
  d_pct_positive_pp: number | null;
  d_pct_negative_pp: number | null;
  d_pct_neutral_pp: number | null;
}

export interface SentimentTopMeta {
  total: number;
  metric: string;
  min_comments: number;
}

export type SentimentOverallResponse =
  AnalyticsResponse<SentimentDistribution>;

export type SentimentSummaryResponse =
  ApiResponse<SentimentSummary>;

export type DailySentimentResponse =
  PaginatedResponse<DailySentiment>;

export type MonthlySentimentResponse =
  AnalyticsResponse<MonthlySentiment>;

export type DailySentimentTopResponse =
  ApiResponse<DailySentiment[], SentimentTopMeta>;

export type MonthlySentimentTopResponse =
  ApiResponse<MonthlySentiment[], SentimentTopMeta>;

// ==========================================
// SUBREDDITS
// ==========================================

export interface SubredditAnalytics {
  subreddit: string;
  n_total: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
  avg_score: number;
  n_posts: number;
}

export interface SubredditTopMeta {
  total: number;
  metric: string;
  min_comments: number;
}

export type SubredditsResponse =
  PaginatedResponse<SubredditAnalytics>;

export type SubredditsTopResponse =
  ApiResponse<SubredditAnalytics[], SubredditTopMeta>;

// ==========================================
// USERS - KARMA
// ==========================================

export interface KarmaSentiment {
  karma_category: string;
  category_order: number;
  n_total: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
  avg_score: number;
  n_accounts: number;
}

export interface KarmaWeightedComparison {
  karma_category: string;
  category_order: number;
  cw_pct_positive: number;
  aw_pct_positive: number;
  cw_pct_negative: number;
  aw_pct_negative: number;
  cw_pct_neutral: number;
  aw_pct_neutral: number;
  n_accounts_aw: number;
}

// ==========================================
// USERS - ACCOUNT AGE
// ==========================================

export interface AccountAgeSentiment {
  age_category: string;
  category_order: number;
  n_total: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
  n_accounts: number;
}

// ==========================================
// USERS - VERIFICATION
// ==========================================

export type VerificationStatus = "TRUE" | "FALSE" | "NULL";

export interface VerificationSentiment {
  verified_status: VerificationStatus;
  n_total: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
  n_accounts: number;
}

export type KarmaSentimentResponse =
  AnalyticsResponse<KarmaSentiment>;

export type KarmaWeightedComparisonResponse =
  AnalyticsResponse<KarmaWeightedComparison>;

export type AccountAgeResponse =
  AnalyticsResponse<AccountAgeSentiment>;

export type VerificationResponse =
  AnalyticsResponse<VerificationSentiment>;

export interface ScoreDistribution {
  score_category: string;
  category_order: number;
  n_comments: number;
  percentage: number;
}

export interface EngagementBySentiment {
  sentiment: Sentiment;
  n_comments: number;
  avg_score: number;
  avg_ups: number;
  avg_downs: number;
}

export interface ScoreCategorySentiment {
  score_category: string;
  category_order: number;
  n_comments: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
}

export interface ControversialitySentiment {
  controversiality: number;
  n_comments: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
}

export interface ControversialityBySentiment {
  sentiment: Sentiment;
  pct_controversial: number;
}

export type ScoreDistributionResponse =
  AnalyticsResponse<ScoreDistribution>;

export type EngagementBySentimentResponse =
  AnalyticsResponse<EngagementBySentiment>;

export type ScoreCategorySentimentResponse =
  AnalyticsResponse<ScoreCategorySentiment>;

export type ControversialityResponse =
  AnalyticsResponse<ControversialitySentiment>;

export type ControversialityBySentimentResponse =
  AnalyticsResponse<ControversialityBySentiment>;

// ==========================================
// POSTS
// ==========================================

export interface PostAnalytics {
  post_id: string;
  subreddit: string;
  post_title: string;
  post_score: number;
  post_upvote_ratio: number;
  post_created_time: string;
  n_total: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
  balance_index: number;
}

export type PostRankingMetric =
  | "volume"
  | "pct_negative"
  | "pct_positive"
  | "balance";

export interface PostTopMeta {
  total: number;
  metric: PostRankingMetric;
  min_comments: number;
}

export interface PostCommentDistribution {
  bin_index: number;
  log10_start: number;
  log10_end: number;
  comments_start: number;
  comments_end: number;
  n_posts: number;
}

export interface PostCommentDistributionMeta {
  total: number;
  n_posts: number;
}

export type PostsResponse =
  PaginatedResponse<PostAnalytics>;

export type PostsTopResponse =
  ApiResponse<PostAnalytics[], PostTopMeta>;

export type PostCommentDistributionResponse =
  ApiResponse<
    PostCommentDistribution[],
    PostCommentDistributionMeta
  >;

// ==========================================
// KEYWORDS
// ==========================================

export type KeywordSourceField =
  | "comment"
  | "post_title"
  | "post_body";

export interface TopKeyword {
  keyword: string;
  n_occurrences: number;
}

export interface DistinctiveKeyword {
  keyword: string;
  n_occurrences: number;
  per_10k_tokens: number;
  log2_ratio: number;
}

export interface NegativeVsPositiveKeyword {
  keyword: string;
  n_positive: number;
  n_negative: number;
  neg_vs_pos_log2_ratio: number;
}

export interface KeywordTheme {
  theme: string;
  sentiment: Sentiment;
  n_occurrences: number;
  per_10k_tokens: number;
}

export interface KeywordThemeDefinition {
  theme: string;
  keywords: string[];
}

export interface KeywordTopMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DistinctiveKeywordMeta {
  total: number;
  sentiment: Sentiment;
  min_occurrences: number;
}

export interface NegativeVsPositiveMeta {
  total: number;
  direction: "negative" | "positive";
  min_occurrences: number;
}

export type TopKeywordsResponse =
  PaginatedResponse<TopKeyword>;

export type DistinctiveKeywordsResponse =
  ApiResponse<DistinctiveKeyword[], DistinctiveKeywordMeta>;

export type NegativeVsPositiveResponse =
  ApiResponse<NegativeVsPositiveKeyword[], NegativeVsPositiveMeta>;

export type KeywordThemesResponse =
  AnalyticsResponse<KeywordTheme>;

export type KeywordThemeDefinitionsResponse =
  AnalyticsResponse<KeywordThemeDefinition>;

// ==========================================
// STATISTICS
// ==========================================

export type EffectSize =
  | "negligible"
  | "lemah"
  | "sedang"
  | "kuat";

export interface AssociationStatistic {
  analysis: string;
  n_rows_compared: number;
  n_comments: number;
  chi2: number;
  dof: number;
  p_value: number;
  cramers_v: number | null;
  effect_size: EffectSize | null;
}

export type ContingencyVariable =
  | "karma"
  | "comment_score"
  | "account_age";

export interface ContingencyRow {
  category: string;
  category_order: number;
  n_positive: number;
  n_negative: number;
  n_neutral: number;
  n_total: number;
  pct_positive: number;
  pct_negative: number;
  pct_neutral: number;
}

export interface ContingencyMeta {
  total: number;
  variable: ContingencyVariable;
}

export type AssociationsResponse =
  AnalyticsResponse<AssociationStatistic>;

export type ContingencyResponse =
  ApiResponse<ContingencyRow[], ContingencyMeta>;

export interface DominantSentiment {
  sentiment: Sentiment;
  n_comments: number;
  percentage: number;
  positive_to_negative_ratio: number;
}

export interface PeakActivity {
  busiest_day: {
    comment_date: string;
    n_total: number;
  };
  busiest_month: {
    month_start: string;
    n_total: number;
  };
  most_negative_month: {
    month_start: string;
    pct_negative: number;
  };
  most_positive_month: {
    month_start: string;
    pct_positive: number;
  };
}

export interface LargestSubreddit {
  subreddit: string;
  n_total: number;
  pct_of_all_comments: number;
}

export interface SubredditSummary {
  largest: LargestSubreddit[];
  highest_pct_negative: {
    subreddit: string;
    pct_negative: number;
  };
  lowest_pct_negative: {
    subreddit: string;
    pct_negative: number;
  };
}

export interface KarmaNegativeSummary {
  karma_category: string;
  n_total: number;
  comment_weighted_pct_negative: number;
  account_weighted_pct_negative: number;
}

export interface EngagementSummary {
  sentiment: Sentiment;
  avg_score: number;
  avg_ups: number;
  avg_downs: number;
}

export interface LargestDiscussionPost {
  post_id: string;
  subreddit: string;
  post_title: string;
  n_total: number;
  pct_negative: number;
}

export interface AssociationStrength {
  analysis: string;
  cramers_v: number | null;
}

export interface DashboardSummary {
  dominant_sentiment: DominantSentiment;
  peak_activity: PeakActivity;
  subreddits: SubredditSummary;
  karma_negative_by_category: KarmaNegativeSummary[];
  engagement_by_sentiment: EngagementSummary[];
  largest_discussion_post: LargestDiscussionPost;
  top_comment_keywords: string[];
  association_strength: AssociationStrength[];
}

export type DashboardSummaryResponse =
  ApiResponse<DashboardSummary>;
