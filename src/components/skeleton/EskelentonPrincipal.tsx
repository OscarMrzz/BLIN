import {
  Card,
  CardHeader,
  CardFooter,
  CardAction,
} from "@/components/misUI/card";
import { Skeleton } from "@/components/misUI/skeleton";

export default function SkeletonPrincipal() {
  // Show 3 cards on mobile, 7 on desktop
  const skeletonCount = 7;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Card key={index} className="relative mx-auto w-full max-w-sm pt-0">
          {/* Image skeleton with overlay */}
          <div className="absolute inset-0 z-30 aspect-video bg-black/35 h-48 w-full" />
        
            <Skeleton className="relative z-20 w-full h-48 p-4 overflow-hidden" />
        

          {/* Card header skeleton */}
          <CardHeader>
            <CardAction>
              <Skeleton className="h-6 w-20" />
            </CardAction>
            <Skeleton className="h-6 w-3/4 mt-2" />
            <div className="flex flex-col space-y-2 mt-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardHeader>

          {/* Card footer skeleton */}
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
