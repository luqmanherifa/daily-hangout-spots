import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApprovedSpots, filterSpots } from "../../services/spotService";
import { useAuthUser } from "../../lib/useAuthUser";
import {
  MapIcon,
  CoffeeIcon,
  BowlFoodIcon,
  LaptopIcon,
  MusicIcon,
  SearchIcon,
  WifiIcon,
  PlugIcon,
  UserGroupIcon,
  ClockIcon,
  LocationIcon,
  LightbulbIcon,
  StarIcon,
  QuietIcon,
  PartyIcon,
  NeutralIcon,
  SpinnerIcon,
  TargetIcon,
  CouchIcon,
  MoneyIcon,
} from "../../components/icons";

const SPOT_IMAGES = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=300&fit=crop",
];

const getRandomImage = () => {
  return SPOT_IMAGES[Math.floor(Math.random() * SPOT_IMAGES.length)];
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [spots, setSpots] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [wifiOnly, setWifiOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    const loadSpots = async () => {
      setLoading(true);
      const data = await fetchApprovedSpots();
      setSpots(data);
      setFiltered(data);

      const images = {};
      data.forEach((spot) => {
        images[spot.id] = getRandomImage();
      });
      setImageMap(images);

      setLoading(false);
    };

    loadSpots();
  }, []);

  useEffect(() => {
    setFiltered(filterSpots(spots, { search, wifiOnly }));
  }, [search, wifiOnly, spots]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b-4 border-softolive">
        <div className="max-w-7xl mx-auto px-6 py-20 max-sm:px-4 max-sm:py-12">
          <div className="grid grid-cols-12 gap-8 items-center max-lg:grid-cols-1 max-lg:gap-6">
            <div className="col-span-7 max-lg:col-span-1">
              <div className="inline-block bg-softolive/10 border border-softolive/30 px-4 py-2 rounded-full mb-5">
                <p className="font-body text-sm font-semibold text-softolive tracking-wide flex items-center gap-2">
                  <MapIcon className="w-4 h-4" />
                  Direktori Spot Lokal
                </p>
              </div>

              <h1 className="font-heading font-extrabold text-5xl text-deepolive mb-5 leading-tight tracking-tight max-sm:text-3xl">
                Cari spot nongkrong?
                <br />
                <span className="text-softolive">Ada semua di sini</span>
              </h1>

              <p className="font-body text-lg text-slate-600 mb-8 tracking-wide leading-relaxed max-w-xl max-sm:text-base">
                Cari tempat ngopi, makan siang, atau kerja remote? Temukan
                rekomendasi spot berdasarkan kebutuhan praktis kamu.
              </p>

              <div className="flex gap-6 mb-8 max-sm:gap-4">
                <div className="text-center">
                  <div className="font-heading font-bold text-3xl text-deepolive tracking-tight max-sm:text-2xl">
                    {loading ? "..." : spots.length}
                  </div>
                  <div className="font-body text-xs text-slate-600 tracking-wide mt-1">
                    Spot tersedia
                  </div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-center">
                  <div className="font-heading font-bold text-3xl text-softolive tracking-tight max-sm:text-2xl">
                    {loading
                      ? "..."
                      : spots.filter((s) => s.wifi === "Ada").length}
                  </div>
                  <div className="font-body text-xs text-slate-600 tracking-wide mt-1">
                    Ada WiFi
                  </div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-center">
                  <div className="font-heading font-bold text-2xl text-deepolive tracking-tight max-sm:text-xl">
                    Free
                  </div>
                  <div className="font-body text-xs text-slate-600 tracking-wide mt-2">
                    Tanpa biaya
                  </div>
                </div>
              </div>

              <div className="flex gap-3 max-sm:flex-col">
                <a
                  href="#spots"
                  className="inline-block bg-softolive text-white font-body font-semibold text-base px-8 py-3.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide text-center"
                >
                  Lihat Semua Spot
                </a>
                {user ? (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-block border-2 border-slate-300 text-slate-700 font-body font-semibold text-base px-8 py-3.5 rounded-lg hover:border-softolive hover:text-softolive transition-colors tracking-wide text-center"
                  >
                    Tambah Spot Baru
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="inline-block border-2 border-slate-300 text-slate-700 font-body font-semibold text-base px-8 py-3.5 rounded-lg hover:border-softolive hover:text-softolive transition-colors tracking-wide text-center"
                  >
                    Masuk untuk Kontribusi
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-5 max-lg:col-span-1 max-lg:hidden">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 aspect-square flex flex-col justify-center items-center">
                    <CoffeeIcon className="w-12 h-12 text-amber-700 mb-2" />
                    <p className="font-body text-sm font-semibold text-amber-900 tracking-wide text-center">
                      Ngopi Cepat
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 aspect-square flex flex-col justify-center items-center">
                    <BowlFoodIcon className="w-12 h-12 text-orange-700 mb-2" />
                    <p className="font-body text-sm font-semibold text-orange-900 tracking-wide text-center">
                      Makan Siang
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mt-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 aspect-square flex flex-col justify-center items-center">
                    <LaptopIcon className="w-12 h-12 text-blue-700 mb-2" />
                    <p className="font-body text-sm font-semibold text-blue-900 tracking-wide text-center">
                      Kerja Remote
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 aspect-square flex flex-col justify-center items-center">
                    <MusicIcon className="w-12 h-12 text-purple-700 mb-2" />
                    <p className="font-body text-sm font-semibold text-purple-900 tracking-wide text-center">
                      Santai Sore
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-b border-slate-200" id="spots">
        <div className="max-w-7xl mx-auto px-6 py-6 max-sm:px-4 max-sm:py-5">
          <div className="flex gap-3 items-center max-sm:flex-col max-sm:items-stretch">
            <div className="flex-1 relative">
              <input
                className="w-full bg-white border border-slate-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-softolive rounded-lg tracking-wide transition-colors placeholder:text-slate-400"
                placeholder="Cari nama spot atau lokasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </span>
            </div>

            <label className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-3 cursor-pointer rounded-lg hover:border-softolive transition-colors max-sm:justify-center">
              <input
                type="checkbox"
                checked={wifiOnly}
                onChange={(e) => setWifiOnly(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-softolive"
              />
              <span className="font-body text-sm font-medium tracking-wide text-slate-700">
                Ada WiFi
              </span>
            </label>
          </div>
        </div>
      </div>

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
                  {search || wifiOnly ? "Hasil Pencarian" : "Semua Spot"}
                </h2>
                <p className="font-body text-sm text-slate-600 tracking-wide">
                  {filtered.length} tempat ditemukan
                  {wifiOnly && " dengan WiFi"}
                  {search && ` untuk "${search}"`}
                </p>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                <SearchIcon className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                <p className="font-heading font-bold text-xl text-deepolive mb-2 tracking-tight">
                  Tidak ada hasil
                </p>
                <p className="font-body text-sm text-slate-600 tracking-wide mb-5">
                  Coba kata kunci lain atau hapus filter
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setWifiOnly(false);
                  }}
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
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={imageMap[spot.id] || SPOT_IMAGES[0]}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {spot.biaya && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/95 backdrop-blur-sm text-deepolive font-body text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
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

      <div className="bg-gradient-to-br from-softolive to-deepolive border-t-4 border-softolive">
        <div className="max-w-7xl mx-auto px-6 py-20 max-sm:px-4 max-sm:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-5">
              <p className="font-body text-sm font-semibold text-white tracking-wide flex items-center gap-2 justify-center">
                <LightbulbIcon className="w-4 h-4" />
                Bantu Komunitas
              </p>
            </div>

            <h2 className="font-heading font-semibold text-4xl text-white mb-4 tracking-tight max-sm:text-2xl">
              Punya rekomendasi spot favorit?
            </h2>

            <p className="font-body text-lg text-white/90 mb-8 tracking-wide leading-relaxed max-sm:text-base">
              Bagikan spot nongkrong yang sering kamu kunjungi. Bantu orang lain
              menemukan tempat yang pas untuk kebutuhan mereka.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-white text-deepolive font-body font-bold text-base px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors tracking-wide w-full sm:w-auto"
                  >
                    Tambah Spot Sekarang
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-white text-deepolive font-body font-bold text-base px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors tracking-wide w-full sm:w-auto"
                  >
                    Masuk untuk Kontribusi
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="border-2 border-white text-white font-body font-bold text-base px-8 py-4 rounded-lg hover:bg-white/10 transition-colors tracking-wide w-full sm:w-auto"
                  >
                    Daftar Gratis
                  </button>
                </>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="grid grid-cols-3 gap-6 max-sm:gap-4">
                <div className="text-center">
                  <div className="font-heading font-bold text-2xl text-white tracking-tight">
                    {loading ? "..." : `${spots.length}+`}
                  </div>
                  <div className="font-body text-xs text-white/80 tracking-wide mt-1">
                    Spot Tersedia
                  </div>
                </div>
                <div className="text-center border-l border-r border-white/20">
                  <div className="font-heading font-bold text-2xl text-white tracking-tight">
                    100%
                  </div>
                  <div className="font-body text-xs text-white/80 tracking-wide mt-1">
                    Gratis
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-bold text-2xl text-white tracking-tight flex items-center justify-center gap-0.5">
                    <StarIcon className="w-6 h-6" />
                    <StarIcon className="w-6 h-6" />
                    <StarIcon className="w-6 h-6" />
                    <StarIcon className="w-6 h-6" />
                    <StarIcon className="w-6 h-6" />
                  </div>
                  <div className="font-body text-xs text-white/80 tracking-wide mt-3">
                    Komunitas Lokal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
