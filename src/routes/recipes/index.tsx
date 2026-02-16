import { createFileRoute } from '@tanstack/react-router'
import { RecipeList } from '@/features/recipes/components/RecipeList'
import { z } from 'zod'
import { FaUtensils } from 'react-icons/fa'

const recipeSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute('/recipes/')({
  // URLのバリデーション設定
  validateSearch: (search) => recipeSearchSchema.parse(search),
  component: RecipesPageIndex,
})

function RecipesPageIndex() {
  const search = Route.useSearch()
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
          <FaUtensils className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レシピ一覧</h1>
          <p className="text-sm text-gray-500">
            これまでにAIが解析した美味しいレシピのコレクションです。
          </p>
        </div>
      </div>

      <RecipeList page={search.page} />
    </div>
  )
}