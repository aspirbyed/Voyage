// js/db.js
import { db } from './firebase-config.js';
import {
  doc, setDoc, getDoc, updateDoc, onSnapshot, collection,
  query, orderBy, limit, increment, serverTimestamp, runTransaction
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const usersRef = collection(db, "users");
const counterRef = doc(db, "counters", "totalHailMarys");

export async function ensureGlobalCounter() {
  try {
    const snap = await getDoc(counterRef);
    if (!snap.exists()) {
      await setDoc(counterRef, { count: 0, lastUpdated: serverTimestamp() });
    }
  } catch (e) {
    console.error("Failed to init counter:", e);
  }
}

export async function saveOnboardingData(userId, data) {
  const userDoc = doc(usersRef, userId);
  await setDoc(userDoc, {
    displayName: data.displayName.trim(),
    goal: data.goal,
    progress: 0,
    intentions: data.intentions,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp()
  });
}

export async function getUserData(userId) {
  const userDoc = doc(usersRef, userId);
  const snap = await getDoc(userDoc);
  return snap.exists() ? snap.data() : null;
}

export function listenToGlobalTotal(callback) {
  return onSnapshot(counterRef, (doc) => {
    const data = doc.data();
    const total = data?.count || 0;
    callback(total);
  }, (err) => console.error("Global counter error:", err));
}

export function listenToUserData(userId, callback) {
  const userDoc = doc(usersRef, userId);
  return onSnapshot(userDoc, (doc) => {
    callback(doc.exists() ? doc.data() : null);
  });
}

export async function addHailMarys(userId, amount) {
  if (!amount || amount <= 0) return;

  const userDoc = doc(usersRef, userId);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userDoc);
    if (!userSnap.exists()) throw "User not found";

    const newProgress = (userSnap.data().progress || 0) + amount;

    transaction.update(userDoc, {
      progress: newProgress,
      lastActive: serverTimestamp()
    });

    transaction.update(counterRef, {
      count: increment(amount),
      lastUpdated: serverTimestamp()
    });
  });
}

export function listenToLeaderboard(callback) {
  const q = query(
    collection(db, "users"),
    orderBy("lastActive", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const leaders = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      leaders.push({
        name: data.displayName || "St. Anonymous",
        progress: data.progress || 0,
        uid: doc.id
      });
    });
    callback(leaders);
  });
}