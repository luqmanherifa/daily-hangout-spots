import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { getThumbnailUrl } from "../../../services/cloudinaryService";
import { ImagePlaceholderIcon } from "../../../components/icons";

export default function UserSubmissionTable({
  submissions,
  onViewDetail,
  onDelete,
  deleteLoading,
  canDelete,
}) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: id }).replace(
      "sekitar ",
      "",
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-rose-50 text-rose-700 border-rose-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
    };

    const labels = {
      approved: "Disetujui",
      rejected: "Ditolak",
      pending: "Menunggu",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}
      >
        {labels[status] || labels.pending}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="w-[8%] text-center px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    No
                  </span>
                </th>
                <th className="w-[10%] text-center px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Foto
                  </span>
                </th>
                <th className="w-[22%] text-left px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Nama Spot
                  </span>
                </th>
                <th className="w-[22%] text-left px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Lokasi
                  </span>
                </th>
                <th className="w-[15%] text-left px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="w-[13%] text-left px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Dikirim
                  </span>
                </th>
                <th className="w-[10%] text-center px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Aksi
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((s, index) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm font-medium text-slate-500">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-center">
                      {s.imageUrl ? (
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-slate-200">
                          <img
                            src={getThumbnailUrl(s.imageUrl)}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <ImagePlaceholderIcon className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-slate-900 truncate block">
                      {s.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate block">
                      {s.location}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">{getStatusBadge(s.status)}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-500">
                      {formatDate(s.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewDetail(s)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                        title="Lihat rincian"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      {canDelete(s) && (
                        <button
                          onClick={() => onDelete(s.id)}
                          disabled={deleteLoading}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Hapus pengajuan"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500">
          Menampilkan{" "}
          <span className="font-semibold text-slate-700">
            {submissions.length}
          </span>{" "}
          pengajuan
        </p>
        <p className="text-xs text-slate-400">
          Klik ikon mata untuk melihat rincian lengkap
        </p>
      </div>
    </div>
  );
}
