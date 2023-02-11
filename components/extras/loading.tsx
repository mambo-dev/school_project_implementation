export default function Loading() {
  return (
    <div
      className="animate-spin border-b-2   border-l-2 inline-block w-5 h-5 border rounded-full"
      role="status"
    >
      <span className="hidden">Loading...</span>
    </div>
  );
}
