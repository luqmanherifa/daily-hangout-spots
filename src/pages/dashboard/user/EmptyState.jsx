export default function EmptyState({ onAddSpot, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
        <div className="inline-block w-10 h-10 border-3 border-softolive border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-body text-sm text-slate-600 tracking-wide">
          Memuat data...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
      <div className="text-5xl mb-3">📍</div>
      <p className="font-heading font-bold text-xl text-deepolive mb-2 tracking-tight">
        Belum ada submission
      </p>
      <p className="font-body text-sm text-slate-600 mb-5 tracking-wide">
        Bagikan spot favorit ke komunitas
      </p>
      <button
        onClick={onAddSpot}
        className="bg-softolive text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide inline-block"
      >
        Tambah Spot Pertama
      </button>
    </div>
  );
}
