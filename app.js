// === Configuration Firebase (publique) ===

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDBKVbkk-8AVmpHig0R3J_08zgm6XdCk9Y",
  authDomain: "srac-8370f.firebaseapp.com",
  projectId: "srac-8370f",
  storageBucket: "srac-8370f.firebasestorage.app",
  messagingSenderId: "683295395523",
  appId: "1:683295395523:web:a80698765985d4ba3cdc76",
  measurementId: "G-2PE8WDLNP3"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// === Auth anonyme ===
auth.signInAnonymously()
  .then(() => console.log("Connecté anonymement"))
  .catch(err => console.error(err));

// === Chargement des protégés ===
db.collection("protected").onSnapshot(snapshot => {
  const list = document.getElementById("protectedList");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<h3>${d.name}</h3><p>${d.description}</p>`;
    list.appendChild(el);
  });
});

// === Chargement des actualités ===
db.collection("news").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  const list = document.getElementById("newsList");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<h3>${d.title}</h3><p>${d.content}</p>`;
    list.appendChild(el);
  });
});

// === Chat global ===
const messagesEl = document.getElementById("messages");
const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;
  const user = auth.currentUser;
  await db.collection("globalChat").add({
    uid: user.uid,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  input.value = "";
});

db.collection("globalChat").orderBy("createdAt")
  .limit(100)
  .onSnapshot(snapshot => {
    messagesEl.innerHTML = "";
    snapshot.forEach(doc => {
      const d = doc.data();
      const time = d.createdAt ? d.createdAt.toDate().toLocaleTimeString() : "";
      const el = document.createElement("div");
      el.className = "message";
      el.innerHTML = `<span>[${time}]</span><b>${d.uid}</b>: ${d.text}`;
      messagesEl.appendChild(el);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });

