export default function DashboardHeader({ onAddSpot }) {
  return (
    <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:items-start max-sm:gap-4">
      <div>
        <h1 className="font-heading font-bold text-3xl text-deepolive mb-1 tracking-tight max-sm:text-2xl">
          Submission Saya
        </h1>
        <p className="font-body text-sm text-slate-600 tracking-wide">
          Kelola semua spot yang kamu submit
        </p>
      </div>
      <button
        onClick={onAddSpot}
        className="bg-softolive text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide max-sm:w-full"
      >
        + Tambah Spot
      </button>
    </div>
  );
}
