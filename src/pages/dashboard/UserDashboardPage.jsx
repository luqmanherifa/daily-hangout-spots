import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import {
  submitSpot,
  fetchUserSubmissions,
  deleteSubmission,
} from "../../services/submissionService";

const FORM_CONFIG = [
  {
    key: "kebutuhan",
    label: "Kebutuhan",
    question: "Tempat ini biasanya digunakan untuk apa?",
    type: "multi",
    options: [
      "Ngopi cepat",
      "Makan ringan",
      "Makan utama",
      "Bekerja sebentar",
      "Nongkrong santai",
      "Menunggu",
      "Istirahat singkat",
    ],
  },
  {
    key: "waktu",
    label: "Waktu",
    question: "Waktu yang paling sesuai untuk tempat ini?",
    type: "multi",
    options: ["Pagi", "Siang", "Sore", "Malam", "Larut malam"],
  },
  {
    key: "suasana",
    label: "Suasana",
    question: "Bagaimana suasana tempat ini secara umum?",
    type: "single",
    options: ["Sepi", "Sedang", "Ramai"],
  },
  {
    key: "durasi",
    label: "Durasi",
    question: "Berapa lama biasanya orang berada di tempat ini?",
    type: "single",
    options: ["Singkat", "Sedang", "Lama"],
  },
  {
    key: "biaya",
    label: "Biaya",
    question: "Bagaimana perkiraan biaya di tempat ini?",
    type: "single",
    options: ["Murah", "Sedang", "Tinggi"],
  },
  {
    key: "aktivitas",
    label: "Aktivitas",
    question: "Aktivitas apa yang paling sesuai di tempat ini?",
    type: "multi",
    options: ["Fokus", "Mengobrol", "Santai", "Menunggu", "Transit"],
  },
  {
    key: "kepadatan",
    label: "Kepadatan",
    question: "Seberapa padat tempat ini biasanya?",
    type: "single",
    options: ["Longgar", "Normal", "Padat"],
  },
  {
    key: "fleksibilitas",
    label: "Fleksibilitas",
    question: "Seberapa praktis tempat ini untuk datang dan pergi?",
    type: "single",
    options: ["Praktis", "Standar", "Formal"],
  },
  {
    key: "polaKunjungan",
    label: "Pola Kunjungan",
    question: "Bagaimana pola kunjungan yang umum di tempat ini?",
    type: "single",
    options: ["Datang–pergi", "Duduk singkat", "Duduk lama"],
  },
  {
    key: "kenyamanan",
    label: "Kenyamanan",
    question: "Bagaimana tingkat kenyamanan untuk duduk dan beraktivitas?",
    type: "single",
    options: ["Dasar", "Cukup", "Nyaman"],
  },
  {
    key: "tipeKunjungan",
    label: "Tipe Kunjungan",
    question: "Tempat ini masuk akal untuk berapa orang?",
    type: "multi",
    options: ["Sendiri", "Berdua", "Kelompok kecil", "Kelompok besar"],
  },
];

export default function UserDashboardPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [wifi, setWifi] = useState("");
  const [stopkontak, setStopkontak] = useState("");

  const [formData, setFormData] = useState(() => {
    const initialData = {};
    FORM_CONFIG.forEach((field) => {
      initialData[field.key] = field.type === "multi" ? [] : "";
    });
    return initialData;
  });

  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [detailModal, setDetailModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const totalSteps = 2 + FORM_CONFIG.length;

  const loadSubmissions = async () => {
    if (!auth.currentUser) {
      setPageLoading(false);
      return;
    }
    try {
      const data = await fetchUserSubmissions(auth.currentUser.uid);
      setSubmissions(data);
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSubmissions();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMultiSelect = (fieldKey, option) => {
    setFormData((prev) => {
      const currentValues = prev[fieldKey] || [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter((v) => v !== option)
        : [...currentValues, option];
      return { ...prev, [fieldKey]: newValues };
    });
  };

  const handleSingleSelect = (fieldKey, option) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: option }));
  };

  const canProceedCurrentStep = () => {
    if (currentStep === 0) {
      return name.trim() && description.trim() && location.trim();
    }
    if (currentStep === 1) {
      return wifi && stopkontak;
    }
    const fieldIndex = currentStep - 2;
    const field = FORM_CONFIG[fieldIndex];
    if (field.type === "multi") {
      return formData[field.key] && formData[field.key].length > 0;
    }
    return formData[field.key] !== "";
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLocation("");
    setWifi("");
    setStopkontak("");
    const resetData = {};
    FORM_CONFIG.forEach((field) => {
      resetData[field.key] = field.type === "multi" ? [] : "";
    });
    setFormData(resetData);
    setCurrentStep(0);
  };

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
          stopkontak,
          ...formData,
          adminNote: "",
        },
        auth.currentUser,
      );

      await loadSubmissions();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus submission ini?")) return;

    setDeleteLoading(true);
    try {
      await deleteSubmission(id);
      await loadSubmissions();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const canDelete = (submission) => {
    return submission.createdBy === auth.currentUser?.uid;
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-5">
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
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-5">
          <div>
            <label className="font-body text-sm font-medium text-deepolive mb-3 block tracking-wide">
              WiFi
            </label>
            <p className="font-body text-sm text-slate-600 mb-3 tracking-wide">
              Apakah ada WiFi di tempat ini?
            </p>
            <div className="space-y-2">
              {["Ada", "Tidak ada", "Tidak tahu"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 font-body cursor-pointer p-4 rounded-xl border-2 transition-colors ${
                    wifi === option
                      ? "border-softolive bg-softolive/10"
                      : "border-slate-200 bg-slate-50 hover:border-softolive/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="wifi"
                    checked={wifi === option}
                    onChange={() => setWifi(option)}
                    className="w-5 h-5 cursor-pointer accent-softolive"
                  />
                  <span className="text-sm font-medium tracking-wide text-deepolive">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-body text-sm font-medium text-deepolive mb-3 block tracking-wide">
              Stopkontak
            </label>
            <p className="font-body text-sm text-slate-600 mb-3 tracking-wide">
              Apakah ada stopkontak di tempat ini?
            </p>
            <div className="space-y-2">
              {["Ada", "Tidak ada", "Tidak tahu"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 font-body cursor-pointer p-4 rounded-xl border-2 transition-colors ${
                    stopkontak === option
                      ? "border-softolive bg-softolive/10"
                      : "border-slate-200 bg-slate-50 hover:border-softolive/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="stopkontak"
                    checked={stopkontak === option}
                    onChange={() => setStopkontak(option)}
                    className="w-5 h-5 cursor-pointer accent-softolive"
                  />
                  <span className="text-sm font-medium tracking-wide text-deepolive">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const fieldIndex = currentStep - 2;
    const field = FORM_CONFIG[fieldIndex];

    if (field.type === "multi") {
      return (
        <div className="space-y-5">
          <div>
            <label className="font-body text-sm font-medium text-deepolive mb-2 block tracking-wide">
              {field.label}
            </label>
            <p className="font-body text-sm text-slate-600 mb-4 tracking-wide">
              {field.question}
            </p>
            <div className="space-y-2">
              {field.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 font-body cursor-pointer p-4 rounded-xl border-2 transition-colors ${
                    formData[field.key]?.includes(option)
                      ? "border-softolive bg-softolive/10"
                      : "border-slate-200 bg-slate-50 hover:border-softolive/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData[field.key]?.includes(option)}
                    onChange={() => handleMultiSelect(field.key, option)}
                    className="w-5 h-5 cursor-pointer accent-softolive"
                  />
                  <span className="text-sm font-medium tracking-wide text-deepolive">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div>
          <label className="font-body text-sm font-medium text-deepolive mb-2 block tracking-wide">
            {field.label}
          </label>
          <p className="font-body text-sm text-slate-600 mb-4 tracking-wide">
            {field.question}
          </p>
          <div className="space-y-2">
            {field.options.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 font-body cursor-pointer p-4 rounded-xl border-2 transition-colors ${
                  formData[field.key] === option
                    ? "border-softolive bg-softolive/10"
                    : "border-slate-200 bg-slate-50 hover:border-softolive/50"
                }`}
              >
                <input
                  type="radio"
                  name={field.key}
                  checked={formData[field.key] === option}
                  onChange={() => handleSingleSelect(field.key, option)}
                  className="w-5 h-5 cursor-pointer accent-softolive"
                />
                <span className="text-sm font-medium tracking-wide text-deepolive">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
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

        {pageLoading ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-slate-200">
            <div className="text-4xl mb-4">⏳</div>
            <p className="font-body text-sm text-slate-500 tracking-wide">
              Memuat data...
            </p>
          </div>
        ) : submissions.length === 0 ? (
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
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-deepolive text-warmcream">
                    <th className="font-body font-semibold text-sm text-left px-6 py-4 tracking-wide">
                      Nama Spot
                    </th>
                    <th className="font-body font-semibold text-sm text-left px-6 py-4 tracking-wide">
                      Lokasi
                    </th>
                    <th className="font-body font-semibold text-sm text-left px-6 py-4 tracking-wide">
                      Status
                    </th>
                    <th className="font-body font-semibold text-sm text-center px-6 py-4 tracking-wide">
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
                      <td className="font-body px-6 py-4 text-deepolive text-sm tracking-wide">
                        {s.name}
                      </td>
                      <td className="font-body px-6 py-4 text-slate-600 text-sm tracking-wide">
                        {s.location}
                      </td>
                      <td className="font-body px-6 py-4">
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
                      <td className="font-body px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setDetailModal(s)}
                            className="px-3 py-1.5 text-xs font-semibold text-deepolive border-2 border-slate-200 rounded-lg hover:border-softolive hover:bg-softolive/10 transition-colors tracking-wide"
                          >
                            Detail
                          </button>
                          {canDelete(s) && (
                            <button
                              onClick={() => handleDelete(s.id)}
                              disabled={deleteLoading}
                              className="px-3 py-1.5 text-xs font-semibold text-rusticbrown border-2 border-slate-200 rounded-lg hover:border-rusticbrown hover:bg-rusticbrown/10 transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 border-2 border-slate-200 max-sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="font-heading font-bold text-3xl text-deepolive mb-2 tracking-tight max-sm:text-2xl">
                Tambah Spot Baru
              </h2>
              <p className="font-body text-sm text-slate-600 mb-4 tracking-wide">
                Share tempat hangout favorit kamu!
              </p>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-softolive h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / totalSteps) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-body text-xs text-slate-600 tracking-wide min-w-[60px] text-right">
                  {currentStep + 1} / {totalSteps}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              <div className="flex gap-3 pt-6 max-sm:flex-col">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 border-2 border-slate-200 text-slate-700 font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-colors tracking-wide"
                    disabled={loading}
                  >
                    Sebelumnya
                  </button>
                )}

                {currentStep === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-2 border-slate-200 text-slate-700 font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-colors tracking-wide"
                    disabled={loading}
                  >
                    Batal
                  </button>
                )}

                {currentStep < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceedCurrentStep()}
                    className="flex-1 bg-deepolive text-warmcream font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-softolive transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed tracking-wide"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !canProceedCurrentStep()}
                    className="flex-1 bg-deepolive text-warmcream font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-softolive transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed tracking-wide"
                  >
                    {loading ? "Mengirim..." : "Submit Spot"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {detailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border-2 border-slate-200 max-sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-heading font-bold text-3xl text-deepolive mb-2 tracking-tight max-sm:text-2xl">
                  Detail Spot
                </h2>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide inline-block ${
                    detailModal.status === "approved"
                      ? "bg-softolive/20 text-softolive border border-softolive/30"
                      : detailModal.status === "rejected"
                        ? "bg-rusticbrown/20 text-rusticbrown border border-rusticbrown/30"
                        : "bg-carameltan/20 text-carameltan border border-carameltan/30"
                  }`}
                >
                  {detailModal.status === "approved"
                    ? "✓ Disetujui"
                    : detailModal.status === "rejected"
                      ? "✕ Ditolak"
                      : "⏱ Pending"}
                </span>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-5">
                <h3 className="font-body font-semibold text-sm text-deepolive mb-3 tracking-wide">
                  Informasi Dasar
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-1">
                      Nama Spot
                    </p>
                    <p className="font-body text-sm text-deepolive tracking-wide">
                      {detailModal.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-1">
                      Deskripsi
                    </p>
                    <p className="font-body text-sm text-slate-600 tracking-wide leading-relaxed">
                      {detailModal.description}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-1">
                      Lokasi
                    </p>
                    <p className="font-body text-sm text-slate-600 tracking-wide">
                      📍 {detailModal.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 pb-5">
                <h3 className="font-body font-semibold text-sm text-deepolive mb-3 tracking-wide">
                  Fasilitas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-1">
                      WiFi
                    </p>
                    <p className="font-body text-sm text-slate-600 tracking-wide">
                      {detailModal.wifi || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-1">
                      Stopkontak
                    </p>
                    <p className="font-body text-sm text-slate-600 tracking-wide">
                      {detailModal.stopkontak || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {FORM_CONFIG.map((field) => {
                const value = detailModal[field.key];
                if (!value || (Array.isArray(value) && value.length === 0))
                  return null;

                return (
                  <div
                    key={field.key}
                    className="border-b border-slate-200 pb-5 last:border-b-0"
                  >
                    <h3 className="font-body font-semibold text-sm text-deepolive mb-2 tracking-wide">
                      {field.label}
                    </h3>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-2">
                      {field.question}
                    </p>
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-2">
                        {value.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg tracking-wide"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body text-sm text-slate-600 tracking-wide">
                        {value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-6 max-sm:flex-col">
              <button
                onClick={() => setDetailModal(null)}
                className="flex-1 bg-deepolive text-warmcream font-body font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-softolive transition-colors tracking-wide"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
