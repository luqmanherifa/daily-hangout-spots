import { getThumbnailUrl } from "../../../services/cloudinaryService";

export default function SubmissionTable({
  submissions,
  onViewDetail,
  onDelete,
  deleteLoading,
  canDelete,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="font-body font-semibold text-xs text-left px-4 py-3 tracking-wide text-slate-700">
                  Nama Spot
                </th>
                <th className="font-body font-semibold text-xs text-left px-4 py-3 tracking-wide text-slate-700">
                  Lokasi
                </th>
                <th className="font-body font-semibold text-xs text-left px-4 py-3 tracking-wide text-slate-700">
                  Status
                </th>
                <th className="font-body font-semibold text-xs text-center px-4 py-3 tracking-wide text-slate-700">
                  Aksi
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
                  <td className="font-body px-4 py-3 text-deepolive text-sm tracking-wide">
                    <div className="flex items-center gap-2">
                      {s.imageUrl && (
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={getThumbnailUrl(s.imageUrl)}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td className="font-body px-4 py-3 text-slate-600 text-sm tracking-wide">
                    {s.location}
                  </td>
                  <td className="font-body px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide inline-block ${
                        s.status === "approved"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : s.status === "rejected"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {s.status === "approved"
                        ? "Disetujui"
                        : s.status === "rejected"
                          ? "Ditolak"
                          : "Pending"}
                    </span>
                  </td>
                  <td className="font-body px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onViewDetail(s)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-md hover:border-softolive hover:text-softolive transition-colors tracking-wide"
                      >
                        Detail
                      </button>
                      {canDelete(s) && (
                        <button
                          onClick={() => onDelete(s.id)}
                          disabled={deleteLoading}
                          className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-slate-300 rounded-md hover:border-red-500 hover:bg-red-50 transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Hapus
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

      <div className="text-center pt-2">
        <p className="font-body text-xs text-slate-500 tracking-wide">
          Total {submissions.length} submission
        </p>
      </div>
    </div>
  );
}
