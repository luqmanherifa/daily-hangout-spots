import { useState } from "react";
import { auth } from "../../lib/firebase";
import { submitSpot } from "../../services/submissionService";

export default function UserDashboardPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [wifi, setWifi] = useState(false);
  const [loading, setLoading] = useState(false);

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
          tags: [],
          topMenus: [],
          busyTimes: [],
          adminNote: "",
        },
        auth.currentUser.uid,
      );

      alert("Spot submitted for review");
      setName("");
      setDescription("");
      setLocation("");
      setWifi(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Submit New Spot</h1>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input
          className="w-full border p-2"
          placeholder="Spot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wifi}
            onChange={(e) => setWifi(e.target.checked)}
          />
          WiFi Available
        </label>

        <button disabled={loading} className="bg-black text-white px-4 py-2">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
