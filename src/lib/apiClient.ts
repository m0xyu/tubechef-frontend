import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },

  // Laravel Sanctumの認証クッキー(Session/XSRF)を自動送受信する設定
  withCredentials: true,
});


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 419: CSRFトークン切れ (ページを再読み込みするか、トークン再取得が必要)
      // 401: 未認証 (ログイン期限切れ)
      if (status === 419 || status === 401) {
        console.warn('セッションが無効です。再ログインが必要です。');
        // window.location.href = '/login'; 
      }
      
      // 500: サーバーエラー
      if (status >= 500) {
        console.error('サーバーエラーが発生しました。');
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };