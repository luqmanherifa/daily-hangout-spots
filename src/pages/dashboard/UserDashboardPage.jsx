import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import {
  submitSpot,
  fetchUserSubmissions,
  deleteSubmission,
} from "../../services/submissionService";
import { uploadImage, getThumbnailUrl } from "../../services/cloudinaryService";

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

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const totalSteps = 3 + FORM_CONFIG.length;

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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

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
    if (currentStep === 2) {
      return true;
    }
    const fieldIndex = currentStep - 3;
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
    setSelectedImage(null);
    setImagePreview(null);
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
      let imageUrl = "";
      let imagePublicId = "";

      if (selectedImage) {
        setUploadingImage(true);
        const result = await uploadImage(selectedImage);
        imageUrl = result.url;
        imagePublicId = result.publicId;
        setUploadingImage(false);
      }

      await submitSpot(
        {
          name,
          description,
          location,
          wifi,
          stopkontak,
          imageUrl,
          imagePublicId,
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
      setUploadingImage(false);
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
        <div className="space-y-4">
          <div>
            <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
              Nama Spot
            </label>
            <input
              className="w-full border border-slate-300 px-4 py-2.5 rounded-lg font-body text-sm focus:outline-none focus:border-softolive transition-colors bg-white tracking-wide placeholder:text-slate-400"
              placeholder="Nama tempat..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
              Deskripsi
            </label>
            <textarea
              className="w-full border border-slate-300 px-4 py-2.5 rounded-lg font-body text-sm focus:outline-none focus:border-softolive resize-none transition-colors bg-white tracking-wide placeholder:text-slate-400"
              placeholder="Ceritakan tentang spot ini..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
              Lokasi
            </label>
            <input
              className="w-full border border-slate-300 px-4 py-2.5 rounded-lg font-body text-sm focus:outline-none focus:border-softolive transition-colors bg-white tracking-wide placeholder:text-slate-400"
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
            <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
              WiFi
            </label>
            <p className="font-body text-xs text-slate-600 mb-3 tracking-wide">
              Apakah ada WiFi di tempat ini?
            </p>
            <div className="space-y-2">
              {["Ada", "Tidak ada", "Tidak tahu"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 font-body cursor-pointer p-3 rounded-lg border transition-colors ${
                    wifi === option
                      ? "border-softolive bg-softolive/10"
                      : "border-slate-300 bg-white hover:border-softolive/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="wifi"
                    checked={wifi === option}
                    onChange={() => setWifi(option)}
                    className="w-4 h-4 cursor-pointer accent-softolive"
                  />
                  <span className="text-sm font-medium tracking-wide text-slate-700">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
              Stopkontak
            </label>
            <p className="font-body text-xs text-slate-600 mb-3 tracking-wide">
              Apakah ada stopkontak di tempat ini?
            </p>
            <div className="space-y-2">
              {["Ada", "Tidak ada", "Tidak tahu"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 font-body cursor-pointer p-3 rounded-lg border transition-colors ${
                    stopkontak === option
                      ? "border-softolive bg-softolive/10"
                      : "border-slate-300 bg-white hover:border-softolive/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="stopkontak"
                    checked={stopkontak === option}
                    onChange={() => setStopkontak(option)}
                    className="w-4 h-4 cursor-pointer accent-softolive"
                  />
                  <span className="text-sm font-medium tracking-wide text-slate-700">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <div>
            <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
              Foto Spot
            </label>
            <p className="font-body text-xs text-slate-600 mb-3 tracking-wide">
              Upload foto tempat ini (opsional, maks 5MB)
            </p>

            {!imagePreview ? (
              <label className="block w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-softolive transition-colors bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="text-4xl mb-2">📷</div>
                <p className="font-body text-sm text-slate-600 tracking-wide">
                  Klik untuk pilih foto
                </p>
                <p className="font-body text-xs text-slate-500 tracking-wide mt-1">
                  JPG, PNG, atau GIF (maks 5MB)
                </p>
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-slate-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
                <p className="font-body text-xs text-slate-600 tracking-wide mt-2">
                  {selectedImage?.name}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    const fieldIndex = currentStep - 3;
    const field = FORM_CONFIG[fieldIndex];

    if (field.type === "multi") {
      return (
        <div className="space-y-4">
          <div>
            <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
              {field.label}
            </label>
            <p className="font-body text-xs text-slate-600 mb-3 tracking-wide">
              {field.question}
            </p>
            <div className="space-y-2">
              {field.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 font-body cursor-pointer p-3 rounded-lg border transition-colors ${
                    formData[field.key]?.includes(option)
                      ? "border-softolive bg-softolive/10"
                      : "border-slate-300 bg-white hover:border-softolive/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData[field.key]?.includes(option)}
                    onChange={() => handleMultiSelect(field.key, option)}
                    className="w-4 h-4 cursor-pointer accent-softolive"
                  />
                  <span className="text-sm font-medium tracking-wide text-slate-700">
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
      <div className="space-y-4">
        <div>
          <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
            {field.label}
          </label>
          <p className="font-body text-xs text-slate-600 mb-3 tracking-wide">
            {field.question}
          </p>
          <div className="space-y-2">
            {field.options.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 font-body cursor-pointer p-3 rounded-lg border transition-colors ${
                  formData[field.key] === option
                    ? "border-softolive bg-softolive/10"
                    : "border-slate-300 bg-white hover:border-softolive/50"
                }`}
              >
                <input
                  type="radio"
                  name={field.key}
                  checked={formData[field.key] === option}
                  onChange={() => handleSingleSelect(field.key, option)}
                  className="w-4 h-4 cursor-pointer accent-softolive"
                />
                <span className="text-sm font-medium tracking-wide text-slate-700">
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 max-sm:px-4 max-sm:py-6">
        <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:items-start max-sm:gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-deepolive mb-1 tracking-tight max-sm:text-2xl">
              Submission Saya
            </h1>
            <p className="font-body text-sm text-slate-600 tracking-wide">
              Kelola semua spot yang kamu submit
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-softolive text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide max-sm:w-full"
          >
            + Tambah Spot
          </button>
        </div>

        {pageLoading ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
            <div className="inline-block w-10 h-10 border-3 border-softolive border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="font-body text-sm text-slate-600 tracking-wide">
              Memuat data...
            </p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-5xl mb-3">📍</div>
            <p className="font-heading font-bold text-xl text-deepolive mb-2 tracking-tight">
              Belum ada submission
            </p>
            <p className="font-body text-sm text-slate-600 mb-5 tracking-wide">
              Bagikan spot favorit ke komunitas
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-softolive text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide inline-block"
            >
              Tambah Spot Pertama
            </button>
          </div>
        ) : (
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
                              onClick={() => setDetailModal(s)}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-md hover:border-softolive hover:text-softolive transition-colors tracking-wide"
                            >
                              Detail
                            </button>
                            {canDelete(s) && (
                              <button
                                onClick={() => handleDelete(s.id)}
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
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 max-sm:p-5 max-h-[90vh] overflow-y-auto">
            <div className="mb-5">
              <h2 className="font-heading font-bold text-2xl text-deepolive mb-1 tracking-tight max-sm:text-xl">
                Tambah Spot Baru
              </h2>
              <p className="font-body text-sm text-slate-600 mb-4 tracking-wide">
                Bagikan tempat hangout favoritmu
              </p>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-softolive h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / totalSteps) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-body text-xs text-slate-600 tracking-wide min-w-[50px] text-right">
                  {currentStep + 1} / {totalSteps}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              <div className="flex gap-2 pt-5 max-sm:flex-col">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 border border-slate-300 text-slate-700 font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors tracking-wide"
                    disabled={loading}
                  >
                    Sebelumnya
                  </button>
                )}

                {currentStep === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-slate-300 text-slate-700 font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors tracking-wide"
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
                    className="flex-1 bg-softolive text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-deepolive transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed tracking-wide"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !canProceedCurrentStep()}
                    className="flex-1 bg-softolive text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-deepolive transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed tracking-wide"
                  >
                    {loading
                      ? uploadingImage
                        ? "Mengupload foto..."
                        : "Mengirim..."
                      : "Submit"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {detailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 border border-slate-200 max-sm:p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="font-heading font-bold text-2xl text-deepolive mb-2 tracking-tight max-sm:text-xl">
                  Detail Spot
                </h2>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide inline-block ${
                    detailModal.status === "approved"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : detailModal.status === "rejected"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {detailModal.status === "approved"
                    ? "Disetujui"
                    : detailModal.status === "rejected"
                      ? "Ditolak"
                      : "Pending"}
                </span>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {detailModal.imageUrl && (
                <div className="border-b border-slate-200 pb-4">
                  <img
                    src={detailModal.imageUrl}
                    alt={detailModal.name}
                    className="w-full h-64 object-cover rounded-lg border border-slate-300"
                  />
                </div>
              )}

              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-body font-semibold text-sm text-slate-700 mb-3 tracking-wide">
                  Informasi Dasar
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-0.5">
                      Nama Spot
                    </p>
                    <p className="font-body text-sm text-deepolive tracking-wide">
                      {detailModal.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-0.5">
                      Deskripsi
                    </p>
                    <p className="font-body text-sm text-slate-600 tracking-wide leading-relaxed">
                      {detailModal.description}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-0.5">
                      Lokasi
                    </p>
                    <p className="font-body text-sm text-slate-600 tracking-wide">
                      📍 {detailModal.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-body font-semibold text-sm text-slate-700 mb-3 tracking-wide">
                  Fasilitas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-0.5">
                      WiFi
                    </p>
                    <p className="font-body text-sm text-slate-600 tracking-wide">
                      {detailModal.wifi || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-0.5">
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
                    className="border-b border-slate-200 pb-4 last:border-b-0"
                  >
                    <h3 className="font-body font-semibold text-sm text-slate-700 mb-1 tracking-wide">
                      {field.label}
                    </h3>
                    <p className="font-body text-xs text-slate-500 tracking-wide mb-2">
                      {field.question}
                    </p>
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-1.5">
                        {value.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md tracking-wide border border-slate-200"
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

            <div className="flex gap-2 pt-5 max-sm:flex-col">
              <button
                onClick={() => setDetailModal(null)}
                className="flex-1 bg-softolive text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-deepolive transition-colors tracking-wide"
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
