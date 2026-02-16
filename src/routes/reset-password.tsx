import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { z } from 'zod';
import type { ValidationErrors } from '@/types/api';

// URLクエリパラメータのバリデーション定義
const resetPasswordSearchSchema = z.object({
  token: z.string(),
  email: z.email(),
});

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token, email } = Route.useSearch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    try {
      await apiClient.get('/sanctum/csrf-cookie');
      
      await apiClient.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert('パスワードを再設定しました。新しいパスワードでログインしてください。');
      navigate({ to: '/login' });

    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 422) {
        const responseData = e.response.data as { errors: ValidationErrors };
        setErrors(responseData.errors);
      } else {
        alert('パスワードリセットに失敗しました。リンクの有効期限が切れている可能性があります。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-xl border-orange-100">
        <CardHeader>
          <CardTitle>新しいパスワードの設定</CardTitle>
          <CardDescription>
            新しいパスワードを入力してください。
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {/* メールアドレス（表示のみ・変更不可が一般的） */}
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100 text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">新しいパスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors?.password && <p className="text-red-500 text-xs">{errors.password[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">パスワード（確認）</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>

            {errors?.email && (
               <p className="text-red-500 text-xs bg-red-50 p-2 rounded">
                 {errors.email[0]} (無効なリンクか、メールアドレスが一致しません)
               </p>
            )}
          </CardContent>

          <CardFooter className='mt-6'>
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 font-bold"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
              パスワードを変更する
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}