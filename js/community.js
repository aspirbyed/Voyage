// js/community.js
import { listenToLeaderboard } from './db.js';
import { auth } from './firebase-config.js';

const leaderboardEl = document.getElementById('leaderboard');

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(target).classList.remove('hidden');
  });
});

function formatShortIndian(num) {
  if (num >= 1_00_00_000) {
    const cr = (num / 1_00_00_000).toFixed(2).replace(/\.00$/, '');
    return cr.replace(/\.0$/, '') + 'Cr';
  }
  if (num >= 1_00_000) {
    const lakh = (num / 1_00_000).toFixed(2).replace(/\.00$/, '');
    return lakh.replace(/\.0$/, '') + 'L';
  }
  return num.toLocaleString('en-IN');
}

listenToLeaderboard((leaders) => {
  const listEl = document.getElementById('community-list');
  const totalEl = document.getElementById('total-pilgrims');
  const currentUserUid = auth.currentUser?.uid;

  listEl.innerHTML = '';

  const medal = '✨';

  if (leaders.length === 0) {
    listEl.innerHTML = '<li style="padding:12px; opacity:0.7;">No pilgrims yet. Be the first!</li>';
    totalEl.textContent = '';
    return;
  }

  totalEl.textContent = `${leaders.length} pilgrim${leaders.length > 1 ? 's' : ''} praying together`;

  leaders.forEach(pilgrim => {
    const isYou = pilgrim.uid === currentUserUid;
    const li = document.createElement('li');
    li.style.padding = '12px 0';
    li.style.borderBottom = '1px solid rgba(255,215,0,0.1)';
    li.style.fontSize = '1.05rem';

    li.innerHTML = `
      ${medal}
      <strong style="color:#ffd700;">${pilgrim.name}</strong>
      ${isYou ? '<span style="color:#ffd700; font-weight:normal;"> (You)</span>' : ''}
      — ${formatShortIndian(pilgrim.progress)} Hail Marys
    `;
    listEl.appendChild(li);
  });

  /*
  // Placeholder
  const placeholderSaints = [
    { name: "St. Maria Goretti", progress: 98500 },
    { name: "St. Kuriakose Elias", progress: 87600 },
    { name: "St. Teresa of Calcutta", progress: 74300 },
    { name: "St. Alphonsa", progress: 68900 },
    { name: "St. John Paul II", progress: 57200 },
    { name: "St. Francis Xavier", progress: 45100 },
    { name: "St. Dominic Savio", progress: 38900 },
    { name: "St. Clare of Assisi", progress: 31200 },
    { name: "St. Maria Goretti", progress: 98500 },
    { name: "St. Kuriakose Elias", progress: 87600 },
    { name: "St. Teresa of Calcutta", progress: 74300 },
    { name: "St. Alphonsa", progress: 68900 },
    { name: "St. John Paul II", progress: 57200 },
    { name: "St. Francis Xavier", progress: 45100 },
    { name: "St. Dominic Savio", progress: 38900 },
    { name: "St. Clare of Assisi", progress: 31200 },
    { name: "St. Maria Goretti", progress: 98500 },
    { name: "St. Kuriakose Elias", progress: 87600 },
    { name: "St. Teresa of Calcutta", progress: 74300 },
    { name: "St. Alphonsa", progress: 68900 },
    { name: "St. John Paul II", progress: 57200 },
    { name: "St. Francis Xavier", progress: 45100 },
    { name: "St. Dominic Savio", progress: 38900 },
    { name: "St. Clare of Assisi", progress: 31200 },
    { name: "St. Maria Goretti", progress: 98500 },
    { name: "St. Kuriakose Elias", progress: 87600 },
    { name: "St. Teresa of Calcutta", progress: 74300 },
    { name: "St. Alphonsa", progress: 68900 },
    { name: "St. John Paul II", progress: 57200 },
    { name: "St. Francis Xavier", progress: 45100 },
    { name: "St. Dominic Savio", progress: 38900 },
    { name: "St. Clare of Assisi", progress: 31200 },
    { name: "St. Maria Goretti", progress: 98500 },
    { name: "St. Kuriakose Elias", progress: 87600 },
    { name: "St. Teresa of Calcutta", progress: 74300 },
    { name: "St. Alphonsa", progress: 68900 },
    { name: "St. John Paul II", progress: 57200 },
    { name: "St. Francis Xavier", progress: 45100 },
    { name: "St. Dominic Savio", progress: 38900 },
    { name: "St. Clare of Assisi", progress: 31200 },
    { name: "St. Maria Goretti", progress: 98500 },
    { name: "St. Kuriakose Elias", progress: 87600 },
    { name: "St. Teresa of Calcutta", progress: 74300 },
    { name: "St. Alphonsa", progress: 68900 },
    { name: "St. John Paul II", progress: 57200 },
    { name: "St. Francis Xavier", progress: 45100 },
    { name: "St. Dominic Savio", progress: 38900 },
    { name: "St. Clare of Assisi", progress: 31200 }
  ];

  placeholderSaints.forEach(p => {
    const li = document.createElement('li');
    li.style.padding = '12px 0';
    li.style.borderBottom = '1px solid rgba(255,215,0,0.08)';
    li.style.fontSize = '1.05rem';
    li.style.opacity = '0.7';
    li.style.fontStyle = 'italic';

    li.innerHTML = `
			  ${medal}
        <strong style="color:#ffd700;">${p.name}</strong>
        — ${formatShortIndian(p.progress)} Hail Marys
    `;
    listEl.appendChild(li);
  });
  */
});