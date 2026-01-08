// js/onboarding.js
import { auth } from './firebase-config.js';
import { getUserData, saveOnboardingData } from './db.js';

let onboardingData = {
  displayName: '',
  goal: 100,
  intentions: [
    "For जाgo Conference 2025",
    "For Jesus Youth Calicut Zone"
  ]
};

const steps = { 1: document.getElementById('step1'), 2: document.getElementById('step2'), 3: document.getElementById('step3') };
const nameInput = document.getElementById('displayName');
const goalInput = document.getElementById('goal');
const customIntention = document.getElementById('custom-intention');

nameInput.value = "St. ";
nameInput.focus();
nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);

window.nextStep = function(step) {
  if (step === 2) {
    const fullName = nameInput.value.trim();

    if (!/^St\.\s+/i.test(fullName)) {
      alert("Please begin with 'St. ' followed by your favorite Saint or Baptism name.\nExample: St. Francis, St. Maria Goretti");
      nameInput.focus();
      return;
    }

    const saintName = fullName.replace(/^St\.\s+/i, '').trim();
    if (saintName.length < 2) {
      alert("Please enter a valid name after 'St. '\nExample: St. Teresa, St. John Paul");
      nameInput.focus();
      return;
    }

    onboardingData.displayName = "St. " + saintName;
  }

  if (step === 3) {
    const rawGoal = goalInput.value.trim();
    if (!rawGoal || isNaN(rawGoal) || rawGoal === '') {
      alert("Please type your prayer goal (e.g. 5000, 25000, 100000)");
      goalInput.focus();
      return;
    }

    let goal = parseInt(rawGoal);
    if (goal < 1) goal = 1;
    if (goal > 100000) {
      alert("Maximum goal is 1,00,000 Hail Marys — a truly heroic offering!");
      goal = 100000;
    }
    onboardingData.goal = goal;
    goalInput.value = goal;
  }

  Object.values(steps).forEach(s => s.classList.add('hidden'));
  steps[step].classList.remove('hidden');
};

window.completeOnboarding = async function() {
  const allIntentions = [
    "For जाgo Conference 2025",
    "For Jesus Youth Calicut Zone"
  ];

  const custom = document.getElementById('custom-intention').value.trim();
  if (custom) {
    allIntentions.push(custom);
  }

  if (allIntentions.length < 2) {
    alert("Please keep the two main intentions or add your own.");
    return;
  }

  onboardingData.intentions = allIntentions;

  const user = auth.currentUser;
  if (!user) {
    alert("Not logged in");
    return;
  }

  try {
    await saveOnboardingData(user.uid, onboardingData);
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
  } catch (err) {
    console.error("Onboarding failed:", err);
    alert("Something went wrong. Please try again.");
  }
};