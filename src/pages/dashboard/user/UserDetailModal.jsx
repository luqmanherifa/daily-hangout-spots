import { getThumbnailUrl } from "../../../services/cloudinaryService";

export default function UserDetailModal({ submission, onClose, formConfig }) {
  if (!submission) return null;

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

  const InfoRow = ({ label, value, fullWidth = false }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <div className={fullWidth ? "col-span-2" : ""}>
        <dt className="text-xs font-medium text-slate-500 mb-1">{label}</dt>
        {Array.isArray(value) ? (
          <dd className="flex flex-wrap gap-1.5">
            {value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200"
              >
                {item}
              </span>
            ))}
          </dd>
        ) : (
          <dd className="text-sm text-slate-900">{value}</dd>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Detail Submission
            </h2>
            {getStatusBadge(submission.status)}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {submission.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <img
                src={submission.imageUrl}
                alt={submission.name}
                className="w-full h-72 object-cover"
              />
            </div>
          )}

          <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Informasi Dasar
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <InfoRow label="Nama Spot" value={submission.name} fullWidth />
              <InfoRow
                label="Deskripsi"
                value={submission.description}
                fullWidth
              />
              <InfoRow label="Lokasi" value={submission.location} fullWidth />
              <InfoRow label="WiFi" value={submission.wifi} />
              <InfoRow label="Stopkontak" value={submission.stopkontak} />
            </dl>
          </div>

          {formConfig.map((field) => {
            const value = submission[field.key];
            if (!value || (Array.isArray(value) && value.length === 0))
              return null;

            return (
              <div
                key={field.key}
                className="bg-slate-50/50 rounded-lg border border-slate-200 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  {field.label}
                </h3>
                <p className="text-xs text-slate-500 mb-3">{field.question}</p>
                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-1.5">
                    {value.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-md border border-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-900">{value}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
