// Reusable loading and error state components
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Simple loading spinner
export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  );
}

// Full page loading state
export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}

// Error state with retry button
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Une erreur est survenue", onRetry }: ErrorStateProps) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 text-destructive mb-4">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{message}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Empty state
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

// Skeleton loaders for specific components
export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export function ConversationCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

export function ContactRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8" />
    </div>
  );
}

export function InboxCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-8" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-8 w-full mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-8 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
