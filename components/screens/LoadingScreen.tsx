export default function LoadingScreen() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <span className="loading loading-dots loading-md" />
        <div>Loading...</div>
      </div>
    </div>
  );
}
