export default function LoadingScreen({ progress = 0 }) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="w-64 max-w-[70vw]">
        <div className="h-2 rounded-full bg-neutral-900/80 overflow-hidden shadow-inner">
          <div
            className="h-full bg-white transition-[width] duration-200 ease-out"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <div className="mt-3 text-xs tracking-[0.25em] uppercase text-neutral-400 text-center">
          Loading {Math.round(clampedProgress)}%
        </div>
      </div>
    </div>
  )
}


