import { useNavigate } from "react-router-dom";
import {
  MapIcon,
  CoffeeIcon,
  BowlFoodIcon,
  LaptopIcon,
  MusicIcon,
} from "../../components/icons";

export default function HomeHero({ user, spots, loading }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b-4 border-softolive">
      <div className="max-w-7xl mx-auto px-6 py-16 max-sm:px-4 max-sm:py-10">
        <div className="grid grid-cols-12 gap-8 items-center max-lg:grid-cols-1 max-lg:gap-6">
          <div className="col-span-7 max-lg:col-span-1">
            <div className="inline-block bg-softolive/10 border border-softolive/30 px-4 py-2 rounded-full mb-4">
              <p className="font-body text-sm font-semibold text-softolive tracking-wide flex items-center gap-2">
                <MapIcon className="w-4 h-4" />
                Panduan Spot Lokal
              </p>
            </div>

            <h1 className="font-heading font-bold text-5xl text-deepolive mb-4 leading-tight tracking-tight max-sm:text-3xl">
              Nongkrong di mana?
              <br />
              <span className="text-softolive">Temukan di sini</span>
            </h1>

            <p className="font-body text-lg text-slate-600 mb-6 tracking-wide leading-relaxed max-w-lg max-sm:text-base">
              Butuh tempat ngopi, makan siang, atau kerja santai? Temukan spot
              yang pas sesuai kebutuhanmu hari ini.
            </p>

            <div className="flex gap-6 mb-6 max-sm:gap-4">
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
                  Masuk dan Berkontribusi
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
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-4 aspect-square flex flex-col justify-center items-center">
                  <BowlFoodIcon className="w-12 h-12 text-rose-700 mb-2" />
                  <p className="font-body text-sm font-semibold text-rose-900 tracking-wide text-center">
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
  );
}
