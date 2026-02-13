// src/routes/__root.tsx
import { Header } from '@/components/Header'
import { AuthProvider } from '@/context/AuthContext'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 antialiased">
        {/* ヘッダー */}
        <Header />
        
        {/* メインコンテンツ */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>

        {/* フッター (必要であれば) */}
        <footer className="py-6 text-center text-sm text-gray-400 bg-white border-t mt-auto">
          &copy; {new Date().getFullYear()} TubeChef. All rights reserved.
        </footer>

        {/* 開発ツール & 通知 */}
        <TanStackRouterDevtools position="bottom-right" />
        {/* <Toaster />  */}
      </div>
    </AuthProvider>
  ),
})