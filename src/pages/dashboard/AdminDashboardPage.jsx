import { useEffect, useState } from "react";
import {
  fetchSpotSubmissions,
  approveSpotSubmission,
  rejectSpotSubmission,
} from "../../services/adminSubmissionService";

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadSubmissions = async () => {
    setLoading(true);
    const data = await fetchSpotSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (submission) => {
    await approveSpotSubmission(submission);
    alert("Spot telah disetujui! ✓");
    loadSubmissions();
  };

  const handleReject = async (id) => {
    await rejectSpotSubmission(id);
    alert("Spot telah ditolak");
    loadSubmissions();
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmcream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-deepolive border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-heading text-xl text-deepolive tracking-tight">
            Memuat submissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmcream">
      <div className="max-w-7xl mx-auto px-8 py-12 max-sm:px-5 max-sm:py-8">
        <div className="mb-10">
          <h1 className="font-heading font-black text-4xl text-deepolive mb-2 tracking-tight max-sm:text-3xl">
            Review Spot
          </h1>
          <p className="font-body text-sm text-slate-600 tracking-wide">
            Kelola dan review semua submission dari komunitas
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8 max-sm:grid-cols-2 max-sm:gap-3">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
            <p className="font-body text-xs text-slate-600 mb-1 tracking-wide">
              Total
            </p>
            <p className="font-heading font-bold text-3xl text-deepolive tracking-tight">
              {stats.total}
            </p>
          </div>
          <div className="bg-white border-2 border-carameltan/30 rounded-xl p-5">
            <p className="font-body text-xs text-slate-600 mb-1 tracking-wide">
              Pending
            </p>
            <p className="font-heading font-bold text-3xl text-carameltan tracking-tight">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white border-2 border-softolive/30 rounded-xl p-5">
            <p className="font-body text-xs text-slate-600 mb-1 tracking-wide">
              Disetujui
            </p>
            <p className="font-heading font-bold text-3xl text-softolive tracking-tight">
              {stats.approved}
            </p>
          </div>
          <div className="bg-white border-2 border-rusticbrown/30 rounded-xl p-5">
            <p className="font-body text-xs text-slate-600 mb-1 tracking-wide">
              Ditolak
            </p>
            <p className="font-heading font-bold text-3xl text-rusticbrown tracking-tight">
              {stats.rejected}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto max-sm:gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors tracking-wide whitespace-nowrap ${
              filter === "all"
                ? "bg-deepolive text-warmcream"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-deepolive"
            }`}
          >
            Semua ({stats.total})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors tracking-wide whitespace-nowrap ${
              filter === "pending"
                ? "bg-carameltan text-deepolive"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-carameltan"
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors tracking-wide whitespace-nowrap ${
              filter === "approved"
                ? "bg-softolive text-warmcream"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-softolive"
            }`}
          >
            Disetujui ({stats.approved})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors tracking-wide whitespace-nowrap ${
              filter === "rejected"
                ? "bg-rusticbrown text-warmcream"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-rusticbrown"
            }`}
          >
            Ditolak ({stats.rejected})
          </button>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-slate-200">
            <div className="text-6xl mb-5">📋</div>
            <p className="font-heading font-bold text-2xl text-deepolive mb-2 tracking-tight">
              Tidak ada submission
            </p>
            <p className="font-body text-sm text-slate-600 tracking-wide">
              {filter === "all"
                ? "Belum ada submission masuk"
                : `Tidak ada submission dengan status ${
                    filter === "pending"
                      ? "pending"
                      : filter === "approved"
                        ? "disetujui"
                        : "ditolak"
                  }`}
            </p>
          </div>
        )}

        {filteredSubmissions.length > 0 && (
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
                      Oleh
                    </th>
                    <th className="font-heading font-bold text-sm text-left px-6 py-4 tracking-tight">
                      Status
                    </th>
                    <th className="font-heading font-bold text-sm text-left px-6 py-4 tracking-tight">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((s, index) => (
                    <tr
                      key={s.id}
                      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                        index === filteredSubmissions.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >
                      <td className="font-body px-6 py-5">
                        <div className="font-semibold text-deepolive text-base tracking-wide">
                          {s.name}
                        </div>
                        {s.wifi && (
                          <span className="inline-block mt-1.5 text-xs bg-softolive/20 text-softolive px-2 py-1 rounded font-medium">
                            WiFi
                          </span>
                        )}
                      </td>
                      <td className="font-body px-6 py-5 text-slate-600 text-sm tracking-wide max-w-xs">
                        {s.description}
                      </td>
                      <td className="font-body px-6 py-5 text-slate-600 text-sm tracking-wide">
                        📍 {s.location}
                      </td>
                      <td className="font-body px-6 py-5 text-slate-600 text-sm tracking-wide">
                        {s.createdByEmail ?? "-"}
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
                      <td className="font-body px-6 py-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(s)}
                            disabled={s.status === "approved"}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors tracking-wide ${
                              s.status === "approved"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                                : "bg-softolive text-warmcream hover:bg-deepolive"
                            }`}
                          >
                            ✓ Setuju
                          </button>

                          <button
                            onClick={() => handleReject(s.id)}
                            disabled={s.status === "rejected"}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors tracking-wide ${
                              s.status === "rejected"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                                : "bg-rusticbrown text-warmcream hover:bg-rusticbrown/80"
                            }`}
                          >
                            ✕ Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredSubmissions.length > 0 && (
          <div className="sm:hidden space-y-4">
            {filteredSubmissions.map((s) => (
              <div
                key={s.id}
                className="bg-white border-2 border-slate-200 rounded-2xl p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-deepolive tracking-tight mb-1">
                      {s.name}
                    </h3>
                    {s.wifi && (
                      <span className="inline-block text-xs bg-softolive/20 text-softolive px-2 py-1 rounded font-medium">
                        WiFi
                      </span>
                    )}
                  </div>
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

                <p className="font-body text-xs text-slate-500 mb-2 tracking-wide">
                  📍 {s.location}
                </p>

                <p className="font-body text-xs text-slate-500 mb-4 tracking-wide">
                  Oleh: {s.createdByEmail ?? "-"}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(s)}
                    disabled={s.status === "approved"}
                    className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors tracking-wide ${
                      s.status === "approved"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                        : "bg-softolive text-warmcream"
                    }`}
                  >
                    ✓ Setuju
                  </button>

                  <button
                    onClick={() => handleReject(s.id)}
                    disabled={s.status === "rejected"}
                    className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors tracking-wide ${
                      s.status === "rejected"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                        : "bg-rusticbrown text-warmcream"
                    }`}
                  >
                    ✕ Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSubmissions.length > 0 && (
          <div className="text-center pt-6">
            <p className="font-body text-xs text-slate-500 tracking-wide">
              Menampilkan {filteredSubmissions.length} dari {stats.total}{" "}
              submission
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
