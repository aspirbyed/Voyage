// js/auth.js
import { auth } from './firebase-config.js';
import { ensureGlobalCounter } from './db.js';
import { getUserData } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    try {
      await ensureGlobalCounter();
    } catch (e) {
      console.warn("Counter init failed (might already exist)", e);
    }

    const userData = await getUserData(user.uid);

    const loading = document.getElementById('loading');
    const onboarding = document.getElementById('onboarding');
    const home = document.getElementById('home');

    if (loading) loading.classList.add('hidden');

    if (!userData) {
      document.getElementById('intro-page').classList.remove('hidden');
    } else {
      document.getElementById('home').classList.remove('hidden');
    }

    document.getElementById('initial-loading').remove();  
  });

  document.getElementById('logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => window.location.href = 'login.html');
  });
});