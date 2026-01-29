import { useNavigate } from "react-router-dom";
import { LightbulbIcon, StarIcon } from "../../components/icons";

export default function HomeCommunity({ user, spots, loading }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-softolive to-deepolive border-t-4 border-softolive">
      <div className="max-w-7xl mx-auto px-6 py-20 max-sm:px-4 max-sm:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-5">
            <p className="font-body text-sm font-semibold text-white tracking-wide flex items-center gap-2 justify-center">
              <LightbulbIcon className="w-4 h-4" />
              Bagikan Rekomendasimu
            </p>
          </div>

          <h2 className="font-heading font-semibold text-4xl text-white mb-4 tracking-tight max-sm:text-2xl">
            Punya spot favorit yang sering dikunjungi?
          </h2>

          <p className="font-body text-lg text-white/90 mb-8 tracking-wide leading-relaxed max-sm:text-base max-w-xl mx-auto">
            Bagikan ke komunitas dan bantu orang lain menemukan tempat nongkrong
            yang pas untuk kebutuhan mereka.
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
                  Masuk dan Berkontribusi
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="border-2 border-white text-white font-body font-bold text-base px-8 py-4 rounded-lg hover:bg-white/10 transition-colors tracking-wide w-full sm:w-auto"
                >
                  Daftar Sekarang
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
                  Tanpa Biaya
                </div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-2xl text-white tracking-tight flex items-center justify-center gap-0.5">
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

      <div className="border-t border-white/20">
        <div className="max-w-3xl mx-auto px-6 py-6 max-sm:px-4 max-sm:py-5">
          <div className="text-center font-body text-sm text-white/80 tracking-wide">
            © 2026{" "}
            <a
              href="https://github.com/Spesialis-Ngopi-Dadakan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white hover:underline transition-colors"
            >
              Spesialis Ngopi Dadakan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
