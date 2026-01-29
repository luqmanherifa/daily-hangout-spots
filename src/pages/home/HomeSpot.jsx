import { useNavigate } from "react-router-dom";
import { getCardImageUrl } from "../../services/cloudinaryService";
import {
  SearchIcon,
  WifiIcon,
  PlugIcon,
  LocationIcon,
  TargetIcon,
  ClockIcon,
  UserGroupIcon,
  QuietIcon,
  PartyIcon,
  NeutralIcon,
  SpinnerIcon,
  MoneyIcon,
  CouchIcon,
  ImagePlaceholderIcon,
} from "../../components/icons";

export default function HomeSpot({
  filtered,
  loading,
  filters,
  hasActiveFilters,
  clearAllFilters,
}) {
  const navigate = useNavigate();

  const getSpotImage = (spot) => {
    if (spot.imageUrl) {
      return getCardImageUrl(spot.imageUrl);
    }
    return "/tikumsu.png";
  };

  const handleImageError = (e) => {
    e.target.src = "/tikumsu.png";
    e.target.onerror = null;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 max-sm:px-4 max-sm:py-8">
      {loading ? (
        <div className="text-center py-20">
          <SpinnerIcon className="inline-block w-12 h-12 text-softolive animate-spin mb-3" />
          <p className="font-body text-sm text-slate-600 tracking-wide">
            Memuat spot...
          </p>
        </div>
      ) : (
        <>
          {filtered.length > 0 && (
            <div className="mb-8">
              <h2 className="font-heading font-bold text-2xl text-deepolive mb-2 tracking-tight">
                {hasActiveFilters() ? "Hasil Pencarian" : "Semua Spot"}
              </h2>
              <p className="font-body text-sm text-slate-600 tracking-wide">
                {filtered.length} tempat ditemukan
                {filters.search && ` untuk "${filters.search}"`}
                {hasActiveFilters() &&
                  !filters.search &&
                  " dengan filter aktif"}
              </p>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
              <SearchIcon className="w-16 h-16 text-slate-400 mx-auto mb-3" />
              <p className="font-heading font-bold text-xl text-deepolive mb-2 tracking-tight">
                Tidak ada hasil
              </p>
              <p className="font-body text-sm text-slate-600 tracking-wide mb-5">
                Coba kata kunci lain atau hapus filter
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-softolive text-white font-body font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide"
              >
                Reset Pencarian
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {filtered.map((spot) => (
              <div
                key={spot.id}
                onClick={() => navigate(`/spot/${spot.id}`)}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-softolive transition-all cursor-pointer group"
              >
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden border-b border-slate-200">
                  {spot.imageUrl ? (
                    <img
                      src={getSpotImage(spot)}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <ImagePlaceholderIcon className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                  {spot.biaya && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/95 backdrop-blur-sm text-deepolive font-body text-xs font-semibold px-2.5 py-1 rounded-xl border border-slate-200 flex items-center gap-1">
                        <MoneyIcon className="w-3 h-3 text-green-600" />{" "}
                        {spot.biaya}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-heading font-bold text-lg text-deepolive mb-1.5 tracking-tight group-hover:text-softolive transition-colors line-clamp-1">
                    {spot.name}
                  </h3>

                  <div className="mb-3 flex items-start gap-1.5">
                    <LocationIcon className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-slate-600 tracking-wide line-clamp-1">
                      {spot.location}
                    </p>
                  </div>

                  <p className="font-body text-xs text-slate-600 tracking-wide leading-relaxed mb-3 line-clamp-2 min-h-[32px]">
                    {spot.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {spot.wifi === "Ada" && (
                      <span className="font-body text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium tracking-wide border border-blue-200 flex items-center gap-1">
                        <WifiIcon className="w-3 h-3" />
                        WiFi
                      </span>
                    )}
                    {spot.stopkontak === "Ada" && (
                      <span className="font-body text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium tracking-wide border border-amber-200 flex items-center gap-1">
                        <PlugIcon className="w-3 h-3" />
                        Stopkontak
                      </span>
                    )}
                    {spot.suasana && (
                      <span className="font-body text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium tracking-wide border border-purple-200 flex items-center gap-1">
                        {spot.suasana === "Sepi" ? (
                          <QuietIcon className="w-3 h-3" />
                        ) : spot.suasana === "Ramai" ? (
                          <PartyIcon className="w-3 h-3" />
                        ) : (
                          <NeutralIcon className="w-3 h-3" />
                        )}
                        {spot.suasana}
                      </span>
                    )}
                    {spot.kenyamanan && (
                      <span className="font-body text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium tracking-wide border border-green-200 flex gap-1 items-center">
                        <CouchIcon className="w-3 h-3" /> {spot.kenyamanan}
                      </span>
                    )}
                  </div>

                  {spot.kebutuhan && spot.kebutuhan.length > 0 && (
                    <div className="mb-2.5 pb-2.5 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-1 mb-1.5">
                        <TargetIcon className="w-3 h-3 text-softolive" />
                        <span className="font-body text-xs text-slate-500 font-medium">
                          Cocok untuk:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {spot.kebutuhan.slice(0, 2).map((item) => (
                          <span
                            key={item}
                            className="font-body text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded font-medium tracking-wide border border-slate-200"
                          >
                            {item}
                          </span>
                        ))}
                        {spot.kebutuhan.length > 2 && (
                          <span className="font-body text-xs text-slate-500 font-medium">
                            +{spot.kebutuhan.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs">
                    {spot.waktu && spot.waktu.length > 0 && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-500">
                          {spot.waktu.slice(0, 2).join(", ")}
                          {spot.waktu.length > 2 &&
                            ` +${spot.waktu.length - 2}`}
                        </span>
                      </div>
                    )}
                    {spot.tipeKunjungan && spot.tipeKunjungan.length > 0 && (
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-500">
                          {spot.tipeKunjungan.slice(0, 2).join(", ")}
                          {spot.tipeKunjungan.length > 2 &&
                            ` +${spot.tipeKunjungan.length - 2}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
