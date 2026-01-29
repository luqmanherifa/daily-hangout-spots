import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function fetchApprovedSpots() {
  try {
    const q = query(collection(db, "spots"), where("status", "==", "approved"));
    const snap = await getDocs(q);
    return snap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((spot) => spot.status === "approved")
      .sort((a, b) => {
        const aTime = a.approvedAt?.seconds ?? 0;
        const bTime = b.approvedAt?.seconds ?? 0;
        return bTime - aTime;
      });
  } catch {
    return [];
  }
}

export function filterSpots(spots, { search, wifiOnly }) {
  let result = spots;

  if (wifiOnly) {
    result = result.filter((spot) => spot.wifi === "Ada");
  }

  if (search) {
    const searchTerm = search.toLowerCase().trim();

    result = result.filter((spot) => {
      if (spot.name?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (spot.location?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (spot.description?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (
        spot.kebutuhan?.some((item) => item.toLowerCase().includes(searchTerm))
      ) {
        return true;
      }

      if (
        spot.aktivitas?.some((item) => item.toLowerCase().includes(searchTerm))
      ) {
        return true;
      }

      if (spot.waktu?.some((item) => item.toLowerCase().includes(searchTerm))) {
        return true;
      }

      if (
        spot.tipeKunjungan?.some((item) =>
          item.toLowerCase().includes(searchTerm),
        )
      ) {
        return true;
      }

      if (spot.suasana?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (spot.kenyamanan?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (spot.durasi?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (spot.kepadatan?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (spot.fleksibilitas?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (spot.polaKunjungan?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      const featureKeywords = {
        wifi: ["wifi", "internet", "online", "wi-fi"],
        stopkontak: ["stopkontak", "colokan", "charger", "charging", "listrik"],
        sepi: ["sepi", "tenang", "sunyi", "quiet"],
        ramai: ["ramai", "rame", "crowded", "hidup"],
      };

      if (
        featureKeywords.wifi.some((keyword) => searchTerm.includes(keyword))
      ) {
        if (spot.wifi === "Ada") return true;
      }

      if (
        featureKeywords.stopkontak.some((keyword) =>
          searchTerm.includes(keyword),
        )
      ) {
        if (spot.stopkontak === "Ada") return true;
      }

      if (
        featureKeywords.sepi.some((keyword) => searchTerm.includes(keyword))
      ) {
        if (spot.suasana === "Sepi") return true;
      }

      if (
        featureKeywords.ramai.some((keyword) => searchTerm.includes(keyword))
      ) {
        if (spot.suasana === "Ramai") return true;
      }

      if (spot.biaya?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      return false;
    });
  }

  return result;
}

export function getSearchSuggestions(spots) {
  const suggestions = new Set();

  const commonTerms = [
    "ngopi",
    "kerja",
    "meeting",
    "santai",
    "wifi",
    "stopkontak",
    "sepi",
    "ramai",
    "pagi",
    "siang",
    "malam",
    "sendiri",
    "bareng teman",
    "keluarga",
  ];

  commonTerms.forEach((term) => suggestions.add(term));

  spots.forEach((spot) => {
    if (spot.location) {
      const locationParts = spot.location.split(",");
      locationParts.forEach((part) => {
        const cleaned = part.trim();
        if (cleaned) suggestions.add(cleaned);
      });
    }
  });

  spots.forEach((spot) => {
    spot.kebutuhan?.forEach((item) => suggestions.add(item));
  });

  return Array.from(suggestions).sort();
}

export function advancedFilter(spots, filters) {
  let result = spots;

  if (filters.wifiOnly) {
    result = result.filter((spot) => spot.wifi === "Ada");
  }

  if (filters.stopkontak) {
    result = result.filter((spot) => spot.stopkontak === "Ada");
  }

  if (filters.suasana && filters.suasana.length > 0) {
    result = result.filter((spot) => filters.suasana.includes(spot.suasana));
  }

  if (filters.waktu && filters.waktu.length > 0) {
    result = result.filter((spot) =>
      spot.waktu?.some((w) => filters.waktu.includes(w)),
    );
  }

  if (filters.kebutuhan && filters.kebutuhan.length > 0) {
    result = result.filter((spot) =>
      spot.kebutuhan?.some((k) => filters.kebutuhan.includes(k)),
    );
  }

  if (filters.aktivitas && filters.aktivitas.length > 0) {
    result = result.filter((spot) =>
      spot.aktivitas?.some((a) => filters.aktivitas.includes(a)),
    );
  }

  if (filters.tipeKunjungan && filters.tipeKunjungan.length > 0) {
    result = result.filter((spot) =>
      spot.tipeKunjungan?.some((t) => filters.tipeKunjungan.includes(t)),
    );
  }

  if (filters.durasi && filters.durasi.length > 0) {
    result = result.filter((spot) => filters.durasi.includes(spot.durasi));
  }

  if (filters.biaya && filters.biaya.length > 0) {
    result = result.filter((spot) => filters.biaya.includes(spot.biaya));
  }

  if (filters.kepadatan && filters.kepadatan.length > 0) {
    result = result.filter((spot) =>
      filters.kepadatan.includes(spot.kepadatan),
    );
  }

  if (filters.fleksibilitas && filters.fleksibilitas.length > 0) {
    result = result.filter((spot) =>
      filters.fleksibilitas.includes(spot.fleksibilitas),
    );
  }

  if (filters.polaKunjungan && filters.polaKunjungan.length > 0) {
    result = result.filter((spot) =>
      filters.polaKunjungan.includes(spot.polaKunjungan),
    );
  }

  if (filters.kenyamanan && filters.kenyamanan.length > 0) {
    result = result.filter((spot) =>
      filters.kenyamanan.includes(spot.kenyamanan),
    );
  }

  if (filters.search) {
    result = filterSpots(result, { search: filters.search });
  }

  return result;
}
