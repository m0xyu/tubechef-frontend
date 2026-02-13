import { Link } from '@tanstack/react-router';
import type { RecipeListItem } from '@/types/api';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaClock, FaYoutube, FaUtensils } from 'react-icons/fa';

interface RecipeCardProps {
  recipe: RecipeListItem;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link 
      to="/recipes/$recipeId" 
      params={{ recipeId: recipe.slug }}
      className="group block h-full"
    >
      <Card className="pt-0 pb-3 h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group-hover:-translate-y-1 bg-white">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {recipe.thumbnail_url ? (
            <img 
              src={recipe.thumbnail_url} 
              alt={recipe.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-xs">No Image</span>
            </div>
          )}
          
          {recipe.dish && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-orange-600 hover:bg-white backdrop-blur-sm shadow-sm">
                <FaUtensils className="mr-1 text-[10px]" />
                {recipe.dish.name}
              </Badge>
            </div>
          )}
        </div>

        <CardHeader>
          <h3 className="font-bold line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
            {recipe.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-col gap-2">
            {recipe.channel_name && (
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FaYoutube className="text-red-500 shrink-0" />
                <span className="truncate">{recipe.channel_name}</span>
              </p>
            )}
          </div>
          {recipe.cooking_time && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <FaClock className="text-orange-400" />
                <span>{recipe.cooking_time}</span>             
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 mt-auto border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
            <span className="text-orange-500 font-bold transform group-hover:translate-x-1.5 duration-300">
             詳細を見る →
           </span>
        </CardFooter>
      </Card>
    </Link>
  );
};