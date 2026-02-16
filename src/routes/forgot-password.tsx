import { useState } from 'react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

export const Route = createFileRoute('/forgot-password')({
  beforeLoad: ({ context }) => {
        if (context.auth.user) {
          throw redirect({
            to: '/',
          });
        }
      },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatus(null);

    try {
      await apiClient.get('/sanctum/csrf-cookie'); // CSRF保護
      const res = await apiClient.post('/forgot-password', { email });
      setStatus(res.data.message || res.data.status || 'Success');
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 422) {
        setError(e.response.data.errors.email?.[0] || 'メール送信に失敗しました');
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-xl border-orange-100">
        <CardHeader>
          <CardTitle>パスワードの再設定</CardTitle>
          <CardDescription>
            登録したメールアドレスを入力してください。<br />
            再設定用のリンクをお送りします。
          </CardDescription>
        </CardHeader>

        {status ? (
          <CardContent className="text-center py-8">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <p className="text-gray-700 font-bold mb-2">メールを送信しました</p>
            <p className="text-sm text-gray-500 mb-6">
              メール内のリンクをクリックして、<br />新しいパスワードを設定してください。
            </p>
            <Button asChild variant="outline">
              <Link to="/login">ログイン画面に戻る</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-6">
              <Button 
                type="submit" 
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                リセットリンクを送信
              </Button>
              <Link to="/login" className="text-sm text-gray-500 hover:text-orange-600">
                キャンセルして戻る
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}