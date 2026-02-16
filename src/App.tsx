import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { useAuth } from './context/AuthContext'
import { FaSpinner } from 'react-icons/fa'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


function AppInner() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-orange-50/30">
        <FaSpinner className="h-10 w-10 animate-spin text-orange-500" />
        <p className="mt-4 text-sm font-medium text-orange-800/60">
          TubeChefを準備中...
        </p>
      </div>
    );
  }

  // チェックが終わったらルーターを表示。context に auth を渡すのを忘れずに。
  return <RouterProvider router={router} context={{ auth }} />;
}

export default function App() {
  return (
      <AppInner />
  );
}