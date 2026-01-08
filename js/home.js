// js/home.js
import { auth, db } from './firebase-config.js';
import { getUserData, listenToGlobalTotal, listenToUserData, addHailMarys } from './db.js';
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const homeScreen     = document.getElementById('home');
const userNameEl     = document.getElementById('user-name');
const intentionsList = document.getElementById('my-intentions');
const progressText   = document.getElementById('progress-text');
const progressFill   = document.getElementById('progress-fill');
const globalCounter  = document.querySelector('.global-counter h2');
const customAddInput = document.getElementById('custom-add');

window.addPrayers = async function(amount) {
  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);

  try {
    await addHailMarys(user.uid, amount);
    await updateDoc(userDocRef, {
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to update prayer or lastActive:", error);
    alert("Something went wrong. Please try again.");
  }
};

window.addCustom = async function(){
  const val = parseInt(customAddInput.value);
  if (val > 0) {
    if (val > 5000) {
      alert("You can add up to 5000 Hail Marys at a time.");
      customAddInput.value = 5000;  // Auto-correct to max
      return;
    }
    await addPrayers(val);
    customAddInput.value = '';
  }
};

function formatIndianNumber(num) {
  if (num >= 1_00_00_00_00_000) {                    
    return '10,000+ Crore';
  }
  if (num >= 1_00_00_000) {                    
    const crore = (num / 1_00_00_000).toFixed(2);
    return crore.replace(/\.00$/, '') + ' Crore';
  }
  if (num >= 1_00_000) {                       
    const lakh = (num / 1_00_000).toFixed(2);
    return lakh.replace(/\.00$/, '') + ' Lakh';
  }
  if (num >= 1000) {
    const thousand = (num / 1000).toFixed(1);
    return thousand.replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString('en-IN'); 
}

let currentDisplayed = 0; 

listenToGlobalTotal((latestTotal) => {
  const displayEl = document.getElementById('global-total-text');
  if (!displayEl) return;

  const start = currentDisplayed || 0;
  const end = latestTotal;
  const duration = 1800; 
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeProgress);

    displayEl.textContent = `${formatIndianNumber(current)}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentDisplayed = end;
    }
  }

  requestAnimationFrame(animate);
});

auth.onAuthStateChanged((user) => {
  if (!user) return;

  listenToUserData(user.uid, (data) => {
    if (!data) return;

    document.getElementById('user-name').textContent = data.displayName;

    const intentionsList = document.getElementById('my-intentions');
    intentionsList.innerHTML = '';
    data.intentions.forEach(intention => {
      const li = document.createElement('li');
      li.textContent = intention;
      intentionsList.appendChild(li);
    });

    const progress = data.progress || 0;
    const goal = data.goal || 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    progressText.textContent = `0 / ${formatIndianNumber(goal)}`;

    progressFill.offsetHeight;

    const percentage = Math.min((progress / goal) * 100, 100);
    progressFill.style.transition = 'width 2.2s cubic-bezier(0.4, 0, 0.2, 1)';
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${formatIndianNumber(progress)} / ${formatIndianNumber(goal)} Hail Marys`;
  });
});

let cameFromHome = false;

window.showIntro = function() {
  cameFromHome = !document.getElementById('onboarding').classList.contains('hidden') 
                 || document.getElementById('home').classList.contains('hidden') === false;

  document.getElementById('home')?.classList.add('hidden');
  document.getElementById('onboarding')?.classList.add('hidden');
  document.getElementById('intro-page')?.classList.remove('hidden');
};

window.startJourney = function() {
  document.getElementById('intro-page').classList.add('hidden');

  if (cameFromHome) {
    // Came from Home → go back to Home
    document.getElementById('home').classList.remove('hidden');
  } else {
    // First-time user → go to Onboarding Step 1
    document.getElementById('onboarding').classList.remove('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
  }
};