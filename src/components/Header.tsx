import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FaSignOutAlt, 
  FaUtensils, 
  FaHistory, 
  FaCog,
  FaClock
} from 'react-icons/fa';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  // ユーザーのイニシャルを取得（表示用）
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左側: ロゴとナビゲーション */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-extrabold text-slate-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="bg-orange-500 text-white p-1.5 rounded-lg">
              <FaUtensils className="text-sm" />
            </span>
            TubeChef
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-orange-600 [&.active]:text-orange-600 [&.active]:font-bold transition-colors"
            >
              トップ
            </Link>
            <Link 
              to="/recipes" 
              search={{ page: 1 }}
              className="text-gray-600 hover:text-orange-600 [&.active]:text-orange-600 [&.active]:font-bold transition-colors"
            >
              レシピ一覧
            </Link>
            <Link 
              to="/history" 
              className="text-gray-600 hover:text-orange-600 [&.active]:text-orange-600 [&.active]:font-bold transition-colors"
            >
              最近見たレシピ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            // ログイン時: ユーザーメニュー
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/recipes" search={{ page: 1 }} className="cursor-pointer flex items-center">
                    <FaUtensils className="mr-2 h-4 w-4 text-orange-500" />
                    レシピ一覧
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/library" className="cursor-pointer flex items-center">
                    <FaHistory className="mr-2 h-4 w-4 text-orange-500" />
                    生成したレシピ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/history" className="cursor-pointer flex items-center">
                    <FaClock className="mr-2 h-4 w-4 text-orange-500" />
                    最近見たレシピ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center">
                    <FaCog className="mr-2 h-4 w-4 text-orange-500" />
                    設定
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                >
                  <FaSignOutAlt className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // 未ログイン時: ログイン/登録ボタン
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="font-bold text-gray-600">
                <Link to="/login">ログイン</Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md">
                <Link to="/register">新規登録</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}