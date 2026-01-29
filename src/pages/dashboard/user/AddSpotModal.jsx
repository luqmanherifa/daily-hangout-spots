import { useState } from "react";

export default function AddSpotModal({
  isOpen,
  onClose,
  formConfig,
  onSubmit,
  loading,
  uploadingImage,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [wifi, setWifi] = useState("");
  const [stopkontak, setStopkontak] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    formConfig.forEach((field) => {
      initialData[field.key] = field.type === "multi" ? [] : "";
    });
    return initialData;
  });

  const totalSteps = 3 + formConfig.length;

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
    const field = formConfig[fieldIndex];
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
    formConfig.forEach((field) => {
      resetData[field.key] = field.type === "multi" ? [] : "";
    });
    setFormData(resetData);
    setCurrentStep(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit({
      name,
      description,
      location,
      wifi,
      stopkontak,
      selectedImage,
      ...formData,
    });
    if (success) {
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
              Unggah foto spot ini (opsional, maks 5MB)
            </p>

            {!imagePreview ? (
              <label className="block w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-softolive transition-colors bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
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
    const field = formConfig[fieldIndex];

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

  if (!isOpen) return null;

  return (
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
                onClick={handleClose}
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
                  : "Ajukan"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
