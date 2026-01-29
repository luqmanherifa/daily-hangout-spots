import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase.js";
import {
  submitSpot,
  fetchUserSubmissions,
  deleteSubmission,
} from "../../../services/submissionService.js";
import { uploadImage } from "../../../services/cloudinaryService.js";
import DashboardHeader from "./DashboardHeader";
import EmptyState from "./EmptyState";
import SubmissionTable from "./SubmissionTable";
import AddSpotModal from "./AddSpotModal.jsx";
import DetailModal from "./DetailModal";

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
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleSubmit = async (formValues) => {
    setLoading(true);

    try {
      let imageUrl = "";
      let imagePublicId = "";

      if (formValues.selectedImage) {
        setUploadingImage(true);
        const result = await uploadImage(formValues.selectedImage);
        imageUrl = result.url;
        imagePublicId = result.publicId;
        setUploadingImage(false);
      }

      const { selectedImage, ...dataToSubmit } = formValues;

      await submitSpot(
        {
          ...dataToSubmit,
          imageUrl,
          imagePublicId,
          adminNote: "",
        },
        auth.currentUser,
      );

      await loadSubmissions();
      setIsModalOpen(false);
      return true;
    } catch (err) {
      alert(err.message);
      setUploadingImage(false);
      return false;
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 max-sm:px-4 max-sm:py-6">
        <DashboardHeader onAddSpot={() => setIsModalOpen(true)} />

        {pageLoading ? (
          <EmptyState isLoading={true} />
        ) : submissions.length === 0 ? (
          <EmptyState onAddSpot={() => setIsModalOpen(true)} />
        ) : (
          <SubmissionTable
            submissions={submissions}
            onViewDetail={setDetailModal}
            onDelete={handleDelete}
            deleteLoading={deleteLoading}
            canDelete={canDelete}
          />
        )}
      </div>

      <AddSpotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formConfig={FORM_CONFIG}
        onSubmit={handleSubmit}
        loading={loading}
        uploadingImage={uploadingImage}
      />

      <DetailModal
        submission={detailModal}
        onClose={() => setDetailModal(null)}
        formConfig={FORM_CONFIG}
      />
    </div>
  );
}
