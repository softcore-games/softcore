interface LoadingViewProps {
  isError?: boolean;
}

export function LoadingView({ isError }: LoadingViewProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className={`text-xl ${isError ? "text-red-400" : "text-gray-400"}`}>
        {isError ? "Failed to load scene" : "Loading..."}
      </div>
    </div>
  );
}
