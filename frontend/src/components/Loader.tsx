export default function Loader({ message = 'Loading collection...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[300px]">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-stone-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-stone-900 border-t-transparent animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-xs tracking-widest uppercase font-medium text-stone-500">
          {message}
        </p>
      )}
    </div>
  );
}


