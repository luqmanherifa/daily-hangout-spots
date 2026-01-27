import { useEffect, useState } from "react";
import {
  fetchSpotSubmissions,
  approveSpotSubmission,
  rejectSpotSubmission,
} from "../../services/adminSubmissionService";

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    alert("Approved");
    loadSubmissions();
  };

  const handleReject = async (id) => {
    await rejectSpotSubmission(id);
    alert("Rejected");
    loadSubmissions();
  };

  if (loading) {
    return <div className="p-6">Loading submissions...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Review</h1>

      {submissions.length === 0 && (
        <p className="text-sm text-gray-500">No submissions found</p>
      )}

      {submissions.map((s) => (
        <div key={s.id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{s.name}</h2>
          <p className="text-sm">{s.description}</p>
          <p className="text-xs text-gray-600">{s.location}</p>
          <p className="text-xs mt-1">Status: {s.status}</p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleApprove(s)}
              className="bg-green-600 text-white px-3 py-1 text-sm rounded"
              disabled={s.status === "approved"}
            >
              Approve
            </button>

            <button
              onClick={() => handleReject(s.id)}
              className="bg-red-600 text-white px-3 py-1 text-sm rounded"
              disabled={s.status === "rejected"}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
