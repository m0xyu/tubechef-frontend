import { useState } from 'react';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FaSpinner } from 'react-icons/fa';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
  beforeLoad: ({ context }) => {
      if (context.auth.user) {
        throw redirect({
          to: '/',
        });
      }
    },
});

function RegisterPage() {
  const { register, errors } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      await navigate({ 
        to: '/',
        replace: true // 履歴に残さない
      });
    } catch {
      // エラーハンドリング
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-xl border-orange-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">新規登録</CardTitle>
          <CardDescription className="text-center">
            あなただけのレシピ帳を作りましょう ✨
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">お名前</Label>
              <Input
                id="name"
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors?.name && <p className="text-red-500 text-xs">{errors.name[0]}</p>}
            </div>
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
              {errors?.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-6">
            <Button 
              type="submit" 
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
              アカウントを作成
            </Button>
            <div className="text-center text-sm text-gray-500">
              すでにアカウントをお持ちですか？{' '}
              <Link to="/login" className="text-orange-600 font-bold hover:underline">
                ログイン
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}