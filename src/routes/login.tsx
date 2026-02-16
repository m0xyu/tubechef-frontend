import { useEffect, useRef, useState } from 'react';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { toast } from 'sonner';

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { login, errors } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const search = Route.useSearch();
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });

      await navigate({ 
        to: search.redirect || '/',
        replace: true // 履歴に残さない
      });
    } catch {
      toast.error("ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (search.error === 'unauthorized' && !toastShownRef.current) {
      toast.error("ログインが必要です", {
        description: "このページにアクセスするにはログインしてください。",
        duration: 4000,
      });
      toastShownRef.current = true;

      navigate({
        from: Route.fullPath,
        search: (prev) => ({ ...prev, error: undefined }),
        replace: true,
      });
    }
  }, [search.error, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-xl border-orange-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">ログイン</CardTitle>
          <CardDescription className="text-center">
            TubeChefに戻りましょう 🍳
          </CardDescription>
        </CardHeader>
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
              {errors?.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">パスワード</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors?.password && <p className="text-red-500 text-xs">{errors.password[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-6">
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
              ログインする
            </Button>
            <div className="text-center text-sm text-gray-500">
              アカウントをお持ちでないですか？{' '}
              <Link to="/register" className="text-orange-600 font-bold hover:underline">
                新規登録
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              <Link to="/forgot-password" className="text-orange-600 font-bold hover:underline">
                パスワードを忘れた方はこちら
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}