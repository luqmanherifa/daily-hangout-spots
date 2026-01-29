import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getDetailImageUrl } from "../../services/cloudinaryService";
import {
  SpinnerIcon,
  SearchIcon,
  ArrowLeftIcon,
  MoneyIcon,
  LocationIcon,
  WifiIcon,
  PlugIcon,
  QuietIcon,
  PartyIcon,
  NeutralIcon,
  TimerIcon,
  CouchIcon,
  TargetIcon,
  ClockIcon,
  SparklesIcon,
  UserGroupIcon,
  PeopleGroupIcon,
  DoorOpenIcon,
  RepeatIcon,
  ImagePlaceholderIcon,
} from "../../components/icons.jsx";

export default function SpotDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const getSpotImage = (spot) => {
    if (spot?.imageUrl) {
      return getDetailImageUrl(spot.imageUrl);
    }
    return "/tikumsu.png";
  };

  const handleImageError = (e) => {
    e.target.src = "/tikumsu.png";
    e.target.onerror = null;
  };

  useEffect(() => {
    const loadSpot = async () => {
      setLoading(true);
      try {
        const spotDoc = await getDoc(doc(db, "spots", id));

        if (spotDoc.exists() && spotDoc.data().status === "approved") {
          setSpot({ id: spotDoc.id, ...spotDoc.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error loading spot:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadSpot();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <SpinnerIcon className="inline-block w-10 h-10 text-softolive animate-spin mb-3" />
          <p className="font-body text-sm text-slate-600 tracking-wide">
            Memuat spot...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !spot) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <SearchIcon className="w-20 h-20 text-slate-400 mx-auto mb-4" />
          <h1 className="font-heading font-bold text-2xl text-deepolive mb-2 tracking-tight">
            Spot tidak ditemukan
          </h1>
          <p className="font-body text-sm text-slate-600 tracking-wide mb-6">
            Spot yang kamu cari tidak ada atau belum disetujui
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-softolive text-white font-body font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-6 max-sm:px-4 max-sm:py-5">
          <button
            onClick={() => navigate("/")}
            className="text-slate-700 font-body font-medium text-sm hover:text-softolive transition-colors tracking-wide flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kembali ke Home
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-8 max-sm:px-4 max-sm:pb-6">
        <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden mb-6 max-sm:h-48 border-b border-slate-200">
          {spot.imageUrl ? (
            <img
              src={getSpotImage(spot)}
              alt={spot.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <ImagePlaceholderIcon className="w-16 h-16 text-slate-400" />
            </div>
          )}

          {spot.biaya && (
            <div className="absolute top-4 right-4">
              <span className="bg-white/95 backdrop-blur-sm text-deepolive font-body text-xs font-bold px-4 py-2 rounded-full border border-slate-200 flex items-center gap-1.5">
                <MoneyIcon className="w-3.5 h-3.5 text-green-600" />
                {spot.biaya}
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h1 className="font-heading font-bold text-3xl text-deepolive mb-2 tracking-tight max-sm:text-2xl">
            {spot.name}
          </h1>
          <p className="font-body text-base text-slate-600 tracking-wide flex items-center gap-2 mb-3">
            <LocationIcon className="w-4 h-4 text-red-500" />
            {spot.location}
          </p>
          <p className="font-body text-base text-slate-700 tracking-wide leading-relaxed">
            {spot.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {spot.wifi === "Ada" && (
            <span className="font-body text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-semibold tracking-wide border border-blue-200 flex items-center gap-1.5">
              <WifiIcon className="w-4 h-4" />
              WiFi
            </span>
          )}
          {spot.stopkontak === "Ada" && (
            <span className="font-body text-sm bg-amber-50 text-amber-700 px-3 py-2 rounded-lg font-semibold tracking-wide border border-amber-200 flex items-center gap-1.5">
              <PlugIcon className="w-4 h-4" />
              Stopkontak
            </span>
          )}
          {spot.suasana && (
            <span className="font-body text-sm bg-purple-50 text-purple-700 px-3 py-2 rounded-lg font-semibold tracking-wide border border-purple-200 flex items-center gap-1.5">
              {spot.suasana === "Sepi" ? (
                <QuietIcon className="w-4 h-4" />
              ) : spot.suasana === "Ramai" ? (
                <PartyIcon className="w-4 h-4" />
              ) : (
                <NeutralIcon className="w-4 h-4" />
              )}
              {spot.suasana}
            </span>
          )}
          {spot.durasi && (
            <span className="font-body text-sm bg-slate-100 text-slate-700 px-3 py-2 rounded-lg font-semibold tracking-wide border border-slate-200 flex items-center gap-1.5">
              <TimerIcon className="w-4 h-4 text-slate-600" />
              {spot.durasi}
            </span>
          )}
          {spot.kenyamanan && (
            <span className="font-body text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg font-semibold tracking-wide border border-green-200 flex items-center gap-1.5">
              <CouchIcon className="w-4 h-4" />
              {spot.kenyamanan}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 max-sm:grid-cols-1">
          {spot.kebutuhan && spot.kebutuhan.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-body text-sm font-semibold text-slate-700 tracking-wide mb-3 flex items-center gap-2">
                <TargetIcon className="w-4 h-4 text-softolive" />
                Cocok untuk
              </p>
              <div className="flex flex-wrap gap-1.5">
                {spot.kebutuhan.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-md tracking-wide border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {spot.waktu && spot.waktu.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-body text-sm font-semibold text-slate-700 tracking-wide mb-3 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                Waktu terbaik
              </p>
              <div className="flex flex-wrap gap-1.5">
                {spot.waktu.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-md tracking-wide border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {spot.aktivitas && spot.aktivitas.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-body text-sm font-semibold text-slate-700 tracking-wide mb-3 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-yellow-500" />
                Aktivitas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {spot.aktivitas.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-md tracking-wide border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {spot.tipeKunjungan && spot.tipeKunjungan.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="font-body text-sm font-semibold text-slate-700 tracking-wide mb-3 flex items-center gap-2">
                <UserGroupIcon className="w-4 h-4 text-purple-600" />
                Untuk siapa
              </p>
              <div className="flex flex-wrap gap-1.5">
                {spot.tipeKunjungan.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-md tracking-wide border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {(spot.kepadatan || spot.fleksibilitas || spot.polaKunjungan) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1 max-sm:gap-4">
              {spot.kepadatan && (
                <div>
                  <p className="font-body text-xs font-semibold text-slate-500 tracking-wide mb-2 flex items-center gap-1.5">
                    <PeopleGroupIcon className="w-3.5 h-3.5 text-slate-600" />
                    Kepadatan
                  </p>
                  <p className="font-body text-base text-slate-700 tracking-wide font-medium">
                    {spot.kepadatan}
                  </p>
                </div>
              )}
              {spot.fleksibilitas && (
                <div>
                  <p className="font-body text-xs font-semibold text-slate-500 tracking-wide mb-2 flex items-center gap-1.5">
                    <DoorOpenIcon className="w-3.5 h-3.5 text-slate-600" />
                    Fleksibilitas
                  </p>
                  <p className="font-body text-base text-slate-700 tracking-wide font-medium">
                    {spot.fleksibilitas}
                  </p>
                </div>
              )}
              {spot.polaKunjungan && (
                <div>
                  <p className="font-body text-xs font-semibold text-slate-500 tracking-wide mb-2 flex items-center gap-1.5">
                    <RepeatIcon className="w-3.5 h-3.5 text-slate-600" />
                    Pola Kunjungan
                  </p>
                  <p className="font-body text-base text-slate-700 tracking-wide font-medium">
                    {spot.polaKunjungan}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-softolive to-deepolive text-white rounded-xl p-6 border border-softolive max-sm:p-5">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-heading font-bold text-xl mb-2 tracking-tight max-sm:text-lg">
              Punya rekomendasi spot lain?
            </h3>
            <p className="font-body text-sm text-white/90 tracking-wide mb-5 leading-relaxed max-sm:text-sm">
              Bagikan tempat nongkrong favoritmu dan bantu komunitas menemukan
              spot yang pas
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-deepolive font-body font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors tracking-wide"
            >
              Tambah Spot Baru
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-6 max-sm:px-4 max-sm:py-5">
          <div className="text-center font-body text-sm text-slate-600 tracking-wide">
            © 2026{" "}
            <a
              href="https://github.com/Spesialis-Ngopi-Dadakan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-softolive hover:underline transition-colors"
            >
              Spesialis Ngopi Dadakan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
