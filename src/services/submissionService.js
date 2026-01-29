import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export async function submitSpot(data, user) {
  return addDoc(collection(db, "spotSubmissions"), {
    ...data,
    imageUrl: data.imageUrl || "",
    imagePublicId: data.imagePublicId || "",
    createdBy: user.uid,
    createdByEmail: user.email ?? null,
    createdAt: serverTimestamp(),
    status: "pending",
  });
}

export async function fetchSubmissions() {
  const snap = await getDocs(collection(db, "spotSubmissions"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchUserSubmissions(userId) {
  const q = query(
    collection(db, "spotSubmissions"),
    where("createdBy", "==", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function approveSubmission(submission) {
  await setDoc(doc(db, "spots", submission.id), {
    ...submission,
    status: "approved",
    approvedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "spotSubmissions", submission.id), {
    status: "approved",
  });
}

export async function rejectSubmission(id) {
  await updateDoc(doc(db, "spotSubmissions", id), {
    status: "rejected",
  });
}

export async function deleteSubmission(id) {
  await deleteDoc(doc(db, "spotSubmissions", id));

  try {
    await deleteDoc(doc(db, "spots", id));
  } catch (err) {
    console.log("No corresponding spot document to delete");
  }
}
