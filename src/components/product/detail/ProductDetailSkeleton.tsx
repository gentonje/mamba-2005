
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const ProductDetailSkeleton = () => {
  return (
    <div className="w-full mx-0 px-0">
      <Card className="w-full overflow-hidden shadow-md border-0 rounded-none">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left column */}
            <div className="md:w-1/2 flex flex-col p-2 md:p-4">
              <Skeleton className="h-6 w-24 mb-4" /> {/* Back button */}
              <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
              <Skeleton className="aspect-square w-full mb-4" />
              <div className="flex gap-2 justify-center">
                <Skeleton className="w-20 h-20" />
                <Skeleton className="w-20 h-20" />
                <Skeleton className="w-20 h-20" />
                <Skeleton className="w-20 h-20" />
              </div>
            </div>

            {/* Right column */}
            <div className="md:w-1/2 p-2 md:p-4 mt-1 md:mt-0 md:pt-10">
              <div className="flex border-b mb-4">
                <Skeleton className="h-10 w-24 mr-4" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center w-full">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-40" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
