// src/routes/__root.tsx
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { type AuthContextType } from '@/context/AuthContext'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 antialiased">
        {/* ヘッダー */}
        <Header />
        
        {/* メインコンテンツ */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>

        {/* フッター */}
        <Footer />

        {/* 開発ツール & 通知 */}
        <TanStackRouterDevtools position="bottom-right" />
        <Toaster /> 
      </div>
  ),
})