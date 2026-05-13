export function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-navy/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin-slow" />
      </div>
    </div>
  );
}
