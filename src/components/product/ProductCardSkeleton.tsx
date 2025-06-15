
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export const ProductCardSkeleton = () => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <AspectRatio ratio={1 / 1} className="bg-transparent">
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <CardContent className="p-2 sm:p-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-2 sm:p-3 pt-0">
        <Skeleton className="h-6 w-1/3" />
      </CardFooter>
    </Card>
  )
}
