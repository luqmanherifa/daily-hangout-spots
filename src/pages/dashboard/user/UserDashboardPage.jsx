import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase.js";
import {
  submitSpot,
  fetchUserSubmissions,
  deleteSubmission,
} from "../../../services/submissionService.js";
import { uploadImage } from "../../../services/cloudinaryService.js";
import UserHeader from "./UserHeader.jsx";
import UserEmptyState from "./UserEmptyState.jsx";
import UserSubmissionTable from "./UserSubmissionTable.jsx";
import AddSpotModal from "./AddSpotModal.jsx";
import UserDetailModal from "./UserDetailModal.jsx";

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
  const [authReady, setAuthReady] = useState(false);

  const loadSubmissions = async (userId) => {
    if (!userId) {
      setPageLoading(false);
      return;
    }

    setPageLoading(true);

    try {
      const data = await fetchUserSubmissions(userId);
      setSubmissions(data);
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthReady(true);
      if (user) {
        loadSubmissions(user.uid);
      } else {
        setPageLoading(false);
      }
    });

    return () => unsubscribe();
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

      await loadSubmissions(auth.currentUser.uid);
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
    if (!confirm("Yakin ingin menghapus pengajuan ini?")) return;

    setDeleteLoading(true);
    try {
      await deleteSubmission(id);
      if (auth.currentUser) {
        await loadSubmissions(auth.currentUser.uid);
      }
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-10 pb-16 max-sm:px-4 max-sm:py-6">
          <UserHeader onAddSpot={() => setIsModalOpen(true)} />

          {pageLoading ? (
            <UserEmptyState isLoading={true} />
          ) : submissions.length === 0 ? (
            <UserEmptyState onAddSpot={() => setIsModalOpen(true)} />
          ) : (
            <UserSubmissionTable
              submissions={submissions}
              onViewDetail={setDetailModal}
              onDelete={handleDelete}
              deleteLoading={deleteLoading}
              canDelete={canDelete}
            />
          )}
        </div>
      </div>

      <div className="bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-6 max-sm:px-4 max-sm:py-4">
          <div className="text-center font-body text-xs text-slate-600 tracking-wide">
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

      <AddSpotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formConfig={FORM_CONFIG}
        onSubmit={handleSubmit}
        loading={loading}
        uploadingImage={uploadingImage}
      />

      <UserDetailModal
        submission={detailModal}
        onClose={() => setDetailModal(null)}
        formConfig={FORM_CONFIG}
      />
    </div>
  );
}
