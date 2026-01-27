import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import {
  submitSpot,
  fetchUserSubmissions,
} from "../../services/submissionService";

export default function UserDashboardPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [wifi, setWifi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSubmissions = async () => {
    if (!auth.currentUser) return;
    const data = await fetchUserSubmissions(auth.currentUser.uid);
    setSubmissions(data);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitSpot(
        {
          name,
          description,
          location,
          wifi,
          tags: [],
          topMenus: [],
          busyTimes: [],
          adminNote: "",
        },
        auth.currentUser,
      );

      await loadSubmissions();

      setName("");
      setDescription("");
      setLocation("");
      setWifi(false);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmcream">
      <div className="max-w-7xl mx-auto px-8 py-12 max-sm:px-5 max-sm:py-8">
        <div className="flex justify-between items-center mb-10 max-sm:flex-col max-sm:items-start max-sm:gap-5">
          <div>
            <h1 className="font-heading font-black text-4xl text-deepolive mb-2 tracking-tight max-sm:text-3xl">
              Spot Saya
            </h1>
            <p className="font-body text-sm text-slate-600 tracking-wide">
              Kelola semua submission spot yang kamu kirim
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-deepolive text-warmcream font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-softolive transition-colors tracking-wide max-sm:w-full"
          >
            + Tambah Spot
          </button>
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-slate-200">
            <div className="text-6xl mb-5">📍</div>
            <p className="font-heading font-bold text-2xl text-deepolive mb-2 tracking-tight">
              Belum ada submission
            </p>
            <p className="font-body text-sm text-slate-600 mb-6 tracking-wide">
              Yuk share spot favorit kamu ke komunitas!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-deepolive text-warmcream font-body font-semibold text-sm px-6 py-3 rounded-xl hover:bg-softolive transition-colors tracking-wide inline-block"
            >
              Tambah Spot Pertama
            </button>
          </div>
        )}

        {submissions.length > 0 && (
          <div className="space-y-4">
            <div className="hidden sm:block bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-deepolive text-warmcream">
                      <th className="font-heading font-bold text-sm text-left px-6 py-4 tracking-tight">
                        Nama Spot
                      </th>
                      <th className="font-heading font-bold text-sm text-left px-6 py-4 tracking-tight">
                        Deskripsi
                      </th>
                      <th className="font-heading font-bold text-sm text-left px-6 py-4 tracking-tight">
                        Lokasi
                      </th>
                      <th className="font-heading font-bold text-sm text-left px-6 py-4 tracking-tight">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s, index) => (
                      <tr
                        key={s.id}
                        className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                          index === submissions.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="font-body px-6 py-5">
                          <div className="font-semibold text-deepolive text-base tracking-wide">
                            {s.name}
                          </div>
                        </td>
                        <td className="font-body px-6 py-5 text-slate-600 text-sm tracking-wide">
                          {s.description}
                        </td>
                        <td className="font-body px-6 py-5 text-slate-600 text-sm tracking-wide">
                          📍 {s.location}
                        </td>
                        <td className="font-body px-6 py-5">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide inline-block ${
                              s.status === "approved"
                                ? "bg-softolive/20 text-softolive border border-softolive/30"
                                : s.status === "rejected"
                                  ? "bg-rusticbrown/20 text-rusticbrown border border-rusticbrown/30"
                                  : "bg-carameltan/20 text-carameltan border border-carameltan/30"
                            }`}
                          >
                            {s.status === "approved"
                              ? "✓ Disetujui"
                              : s.status === "rejected"
                                ? "✕ Ditolak"
                                : "⏱ Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sm:hidden space-y-4">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border-2 border-slate-200 rounded-2xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading font-bold text-lg text-deepolive tracking-tight flex-1">
                      {s.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide ml-3 ${
                        s.status === "approved"
                          ? "bg-softolive/20 text-softolive border border-softolive/30"
                          : s.status === "rejected"
                            ? "bg-rusticbrown/20 text-rusticbrown border border-rusticbrown/30"
                            : "bg-carameltan/20 text-carameltan border border-carameltan/30"
                      }`}
                    >
                      {s.status === "approved"
                        ? "✓ Disetujui"
                        : s.status === "rejected"
                          ? "✕ Ditolak"
                          : "⏱ Pending"}
                    </span>
                  </div>
                  <p className="font-body text-sm text-slate-600 mb-3 tracking-wide leading-relaxed">
                    {s.description}
                  </p>
                  <p className="font-body text-xs text-slate-500 tracking-wide">
                    📍 {s.location}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <p className="font-body text-xs text-slate-500 tracking-wide">
                Total {submissions.length} submission
              </p>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 border-2 border-slate-200 max-sm:p-6">
            <h2 className="font-heading font-bold text-3xl text-deepolive mb-2 tracking-tight max-sm:text-2xl">
              Tambah Spot Baru
            </h2>
            <p className="font-body text-sm text-slate-600 mb-6 tracking-wide">
              Share tempat hangout favorit kamu!
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-sm font-medium text-deepolive mb-2 block tracking-wide">
                  Nama Spot
                </label>
                <input
                  className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl font-body text-base focus:outline-none focus:border-softolive transition-colors bg-slate-50 focus:bg-white tracking-wide"
                  placeholder="Nama tempat..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-deepolive mb-2 block tracking-wide">
                  Deskripsi
                </label>
                <textarea
                  className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl font-body text-base focus:outline-none focus:border-softolive resize-none transition-colors bg-slate-50 focus:bg-white tracking-wide"
                  placeholder="Ceritain tentang spot ini..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-deepolive mb-2 block tracking-wide">
                  Lokasi
                </label>
                <input
                  className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl font-body text-base focus:outline-none focus:border-softolive transition-colors bg-slate-50 focus:bg-white tracking-wide"
                  placeholder="Alamat lengkap..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <label className="flex items-center gap-3 font-body text-deepolive cursor-pointer p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-softolive transition-colors">
                <input
                  type="checkbox"
                  checked={wifi}
                  onChange={(e) => setWifi(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-softolive"
                />
                <span className="text-sm font-medium tracking-wide">
                  Ada WiFi di tempat ini
                </span>
              </label>

              <div className="flex gap-3 pt-2 max-sm:flex-col">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-2 border-slate-200 text-slate-700 font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-colors tracking-wide"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-deepolive text-warmcream font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-softolive transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed tracking-wide"
                >
                  {loading ? "Mengirim..." : "Submit Spot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
