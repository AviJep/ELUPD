import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No data available",
  message = "There are no records to display at this time.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-4 max-w-sm text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FileQuestion className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
            {actionLabel && onAction && (
              <Button onClick={onAction}>{actionLabel}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
