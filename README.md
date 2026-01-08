# The Fourth Candle

An Advent prayer initiative by Jesus Youth Calicut Intercession Ministry. This web app allows users to offer Hail Mary prayers, set goals, and see community progress.

## Description

"The Fourth Candle" is a simple web app built with Firebase for tracking Hail Mary prayers during Advent. Users sign in with Google, choose a patron saint, set a prayer goal, and add prayers daily. The app shows personal progress, community leaderboard (newest active first), and global prayer count.

## Features

- Google Sign-In with optional 2FA
- Onboarding: Choose saint name, set goal, add intentions
- Personal dashboard with progress bar and daily additions (max 5000 at a time)
- Community list with newest active users first
- Global prayer counter with animation
- Bible verse of the day from Firestore
- About/Contact section with social links
- Responsive design for all devices
- Secure Firebase rules

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **Fonts**: Cinzel Decorative, Cinzel, Lato
- **Colors**: Deep blues (#000814, #001D3D, #003566) and golds (#FFC300, #FFD60A)

## Setup

1. Clone the repo:
   ```
   git clone https://github.com/yourusername/voyage.git
   cd voyage
   ```

2. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   firebase login
   ```

3. Configure Firebase:
   - Create a Firebase project in the console.
   - Add Web app to get `firebaseConfig` → paste in `js/firebase-config.js`.
   - Enable Google Sign-In in Authentication.
   - Create Firestore database (production mode).
   - Update Security Rules as in the code.
   - Add Bible verses to `bible-verse` collection.

4. Deploy:
   ```
   firebase deploy
   ```

## Usage

- Sign in with Google.
- Complete onboarding.
- Add prayers daily.
- See your progress and community.
