import { createFileRoute } from '@tanstack/react-router'
import { UrlInputForm } from '../features/video/components/UrlInputForm'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          TubeChef
        </h1>
        <p className="text-gray-600 mb-10">
          YouTube動画から、AIが自動でレシピと材料を書き起こします。
        </p>
        
        <UrlInputForm />
      </div>
    </div>
  )
}