import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
