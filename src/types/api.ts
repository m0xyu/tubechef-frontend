// ==========================================
// Enums & Constants
// ==========================================

/**
 * レシピ生成ステータス
 * Backend: App\Enums\RecipeGenerationStatus
 */
export type RecipeGenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export const RECIPE_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

/**
 * ビデオのUI切り替え用
 */
export type VideoActionType = 'view_recipe' | 'generate' | 'limit_exceeded';

export const VIDEO_ACTION_TYPE = {
  VIEW_RECIPE: 'view_recipe',
  GENERATE: 'generate',
  LIMIT_EXCEEDED: 'limit_exceeded',
} as const;


// ==========================================
// Shared Components
// ==========================================

/**
 * チャンネル情報
 * Backend: ChannelResource
 */
export interface Channel {
  id: string;          // YouTube Channel ID (e.g., UC...)
  title: string;       // チャンネル名
  custom_url?: string; // @handle
  thumbnail_url?: string;
}

/**
 * 料理カテゴリ
 * Backend: DishResource
 */
export interface Dish {
  id: number;
  name: string;
  slug: string;
}

// ==========================================
// Video Types (Preview & Stored)
// ==========================================

/**
 * 動画の基本情報（共通部分）
 */
interface VideoBase {
  video_id: string;    // YouTube Video ID (e.g., dQw4w9WgXcQ)
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: number | null; // 秒数
  published_at: string;    // ISO8601 Date String
  recipe_slug: string|null;
  recipe_generation_status: RecipeGenerationStatus;
  recipe_generation_status_message: string|null;
}

/**
 * プレビュー用動画データ（保存前）
 * Backend: VideoPreviewResource
 */
export interface VideoPreview extends VideoBase {
  channel: {
    id: string;
    name: string;
  };
  action_type: VideoActionType;
}

/**
 * 保存済み動画データ（保存後・詳細）
 * Backend: VideoResource
 */
export interface VideoDetail extends VideoBase {
  id: number;
  is_saved: true;
  status: RecipeGenerationStatus;
  channel: Channel; 
  view_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  topic_categories: Array<string> | null
}

/**
 * ポーリング用ステータスレスポンス
 * GET /api/videos/{id}/status
 */
export interface VideoStatusResponse {
  status: RecipeGenerationStatus;
  error_message: string | null;
}

// ==========================================
// Recipe Types
// ==========================================

/**
 * レシピ一覧アイテム
 * Backend: RecipeListResource
 */
export interface RecipeListItem {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  channel_name: string | null;
  cooking_time: string | null;
  dish: Dish;
}

/**
 * 材料
 */
export interface Ingredient {
  name: string;
  quantity: string | null;
  group: string | null; // 'A', 'トッピング' etc.
  order: number;
}

/**
 * 調理手順
 */
export interface Step {
  step_number: number;
  description: string;
  start_time_in_seconds: number | null; // YouTube再生位置用
  end_time_in_seconds: number | null;
}

/**
 * コツ・ポイント
 */
export interface Tip {
  description: string;
  related_step_number: number | null;
  start_time_in_seconds: number | null;
}

/**
 * レシピ詳細（完全版）
 * Backend: RecipeResource
 */
export interface RecipeDetail extends RecipeListItem {
  summary: string | null;
  serving_size: string | null; // '2人前'
  
  video: VideoDetail;
  ingredients: Ingredient[];
  steps: Step[];
  tips: Tip[];
}

export interface ApiMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

// ==========================================
// API Response Wrappers
// ==========================================

/**
 * Laravel API Resource Wrapper
 * dataプロパティでラップされる形式に対応
 */
export interface ApiResponse<T> {
  data: T;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: ApiMeta;
}