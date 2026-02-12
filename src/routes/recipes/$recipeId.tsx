import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/$recipeId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipes/$recipeId"!</div>
}
