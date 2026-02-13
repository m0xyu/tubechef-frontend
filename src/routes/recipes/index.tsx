import { createFileRoute } from '@tanstack/react-router'
import { RecipeList } from '@/features/recipes/components/RecipeList'
import { z } from 'zod'

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          レシピ一覧 
        </h1>
        <p className="text-gray-500 mt-2">
          これまでにAIが解析した美味しいレシピのコレクションです。
        </p>
      </div>

      <RecipeList page={search.page} />
    </div>
  )
}