# YouTube Clone

A modern YouTube clone built with React, Firebase, and Tailwind CSS.

## Features

### 🎥 Video Upload
- **Secure Authentication**: Google Sign-in required for video uploads
- **File Validation**: Supports MP4, AVI, MOV files up to 100MB
- **Progress Tracking**: Real-time upload progress with visual feedback
- **Firebase Storage**: Videos stored securely in Firebase Storage
- **Metadata Storage**: Video information stored in Firestore database

### 🎬 Video Features
- **YouTube API Integration**: Browse and watch videos from YouTube
- **Search Functionality**: Search for videos with instant results
- **Video Player**: Embedded YouTube video player
- **Comments System**: Add and view comments on videos
- **Related Videos**: Discover related content

### 👤 User Profile
- **Personal Dashboard**: View profile information and activity
- **Upload Management**: See all your uploaded videos
- **Settings**: Manage account preferences
- **Activity Tracking**: Monitor video watching and upload history

### 🎨 UI/UX
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, YouTube-inspired design
- **Loading States**: Smooth loading animations and skeletons
- **Infinite Scroll**: Load more videos as you scroll

### 🔧 Technical Features
- **React 18**: Latest React features and hooks
- **Firebase Integration**: Authentication, Storage, and Firestore
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Context API**: Global state management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtubeclone
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication (Google provider)
   - Enable Storage
   - Enable Firestore
   - Update `src/firebase/config.js` with your Firebase config

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Uploading Videos
1. Sign in with your Google account
2. Click the video upload icon in the header
3. Fill in video title and description
4. Select a video file (MP4, AVI, MOV up to 100MB)
5. Click "Upload Video" and wait for completion

### Browsing Videos
1. Use the left navigation to browse categories
2. Search for specific videos using the search bar
3. Click on any video to watch it
4. Add comments and interact with content

### Profile Management
1. Click your profile picture to access your profile
2. View your uploaded videos
3. Manage account settings
4. Track your activity

## Project Structure

```
src/
├── components/          # React components
│   ├── Feed.jsx        # Main video feed
│   ├── Header.jsx      # Navigation header
│   ├── Profile.jsx     # User profile page
│   ├── UserVideos.jsx  # User's uploaded videos
│   └── ...
├── context/            # React context
│   └── Context.js      # Global state management
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
├── utils/              # Utility functions
│   ├── api.js          # YouTube API integration
│   └── constant.js     # App constants
└── shared/             # Shared components
    ├── Loader.jsx      # Loading component
    └── Skeleton.jsx    # Skeleton loading
```

## Technologies Used

- **Frontend**: React 18, React Router, React Icons
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Storage, Firestore)
- **API**: YouTube Data API v3
- **Video Player**: React Player
- **State Management**: React Context API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- YouTube for the API
- Firebase for backend services
- React and Tailwind CSS communities
