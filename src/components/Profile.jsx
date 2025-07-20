import React, { useContext, useState, useEffect, useRef } from 'react';
import { Context } from '../context/Context';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSettings, FiLogOut, FiUser, FiMail, FiCalendar, FiUpload, FiX } from 'react-icons/fi';
import { RiVideoAddFill } from 'react-icons/ri';
import UserVideos from './UserVideos';
import FirebaseStatus from './FirebaseStatus';

  const Profile = () => {
  const { user, signOut, isDarkMode, uploadVideo, uploadProgress, isUploading } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Check if user came from upload button
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('upload') === 'true') {
      setShowUpload(true);
      // Clean up the URL
      navigate('/profile', { replace: true });
    }
  }, [location, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        setUploadError('Please select a valid video file');
        return;
      }
      
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('File size must be less than 100MB');
        return;
      }
      
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !videoTitle.trim()) {
      setUploadError('Please select a file and enter a title');
      return;
    }

    try {
      setUploadError('');
      await uploadVideo(selectedFile, videoTitle, videoDescription);
      
      // Reset form
      setSelectedFile(null);
      setVideoTitle('');
      setVideoDescription('');
      setShowUpload(false);
      
      // Trigger a page refresh to show the new video
      window.location.reload();
      
      alert('Video uploaded successfully!');
    } catch (error) {
      setUploadError(error.message);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Please Login</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>You need to be logged in to view your profile</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header Section */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-100 to-gray-200'} h-64 relative`}>
        <div className={`${isDarkMode ? 'bg-black bg-opacity-30' : 'bg-white bg-opacity-30'} absolute inset-0`}></div>
        <div className="relative z-10 flex items-end h-full p-8">
          <div className="flex items-end space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg">
                             <img 
                 src={user.photoURL || `https://picsum.photos/300/300?random=${user.uid || 'user'}`} 
                 alt="Profile" 
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="mb-4">
              <h1 className="text-4xl font-bold mb-2">{user.displayName || 'User'}</h1>
              <p className="text-xl opacity-90">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FiUser className="mr-3" />
                Profile Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FiMail className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xl`} />
                  <div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Email</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <FiCalendar className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xl`} />
                  <div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Member Since</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <RiVideoAddFill className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xl`} />
                  <div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Account Type</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Google Account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
              <h2 className="text-2xl font-bold mb-6">Your Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Videos Watched</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Playlists Created</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Liked Videos</p>
                </div>
              </div>
            </div>

            {/* User Videos */}
            <UserVideos />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Firebase Status */}
            <FirebaseStatus />
            
            {/* Quick Actions */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6`}>
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                           <div className="space-y-3">
               <button 
                 onClick={() => setShowSettings(true)}
                 className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
               >
                 <FiSettings className="text-xl" />
                 <span>Settings</span>
               </button>
               <button 
                 onClick={() => setShowUpload(true)}
                 className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
               >
                 <RiVideoAddFill className="text-xl" />
                 <span>Upload Video</span>
               </button>
               <button 
                 onClick={handleSignOut}
                 className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors"
               >
                 <FiLogOut className="text-xl" />
                 <span>Sign Out</span>
               </button>
             </div>
            </div>

            {/* Recent Activity */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6`}>
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="text-center py-8">
                <p className="text-gray-400">No recent activity</p>
                <p className="text-sm text-gray-500 mt-2">Start watching videos to see your activity here</p>
              </div>
            </div>
          </div>
                 </div>
       </div>

       {/* Settings Modal */}
       {showSettings && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Settings</h3>
               <button 
                 onClick={() => setShowSettings(false)}
                 className="text-gray-400 hover:text-white"
               >
                 ✕
               </button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-2">Display Name</label>
                 <input 
                   type="text" 
                   defaultValue={user.displayName || ''}
                   className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-2">Email</label>
                 <input 
                   type="email" 
                   defaultValue={user.email || ''}
                   disabled
                   className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-gray-400"
                 />
               </div>
               <div className="flex space-x-3 pt-4">
                 <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                   Save Changes
                 </button>
                 <button 
                   onClick={() => setShowSettings(false)}
                   className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Upload Video Modal */}
       {showUpload && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Upload Video</h3>
               <button 
                 onClick={() => {
                   setShowUpload(false);
                   setSelectedFile(null);
                   setVideoTitle('');
                   setVideoDescription('');
                   setUploadError('');
                 }}
                 className="text-gray-400 hover:text-white"
               >
                 <FiX className="text-xl" />
               </button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-2">Video Title *</label>
                 <input 
                   type="text" 
                   placeholder="Enter video title"
                   value={videoTitle}
                   onChange={(e) => setVideoTitle(e.target.value)}
                   className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Description</label>
                 <textarea 
                   placeholder="Enter video description"
                   rows="3"
                   value={videoDescription}
                   onChange={(e) => setVideoDescription(e.target.value)}
                   className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Video File *</label>
                 <input
                   type="file"
                   ref={fileInputRef}
                   accept="video/*"
                   onChange={handleFileSelect}
                   className="hidden"
                 />
                 <div 
                   onClick={handleDropZoneClick}
                   className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-600 transition-colors cursor-pointer ${
                     selectedFile ? 'border-green-500 bg-green-500/10' : 'border-gray-700'
                   }`}
                 >
                   {selectedFile ? (
                     <div>
                       <FiUpload className="text-4xl text-green-400 mx-auto mb-2" />
                       <p className="text-green-400 font-medium">{selectedFile.name}</p>
                       <p className="text-sm text-gray-500 mt-1">
                         {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                       </p>
                     </div>
                   ) : (
                     <div>
                       <RiVideoAddFill className="text-4xl text-gray-400 mx-auto mb-2" />
                       <p className="text-gray-400">Click to select video file</p>
                       <p className="text-sm text-gray-500 mt-1">MP4, AVI, MOV up to 100MB</p>
                     </div>
                   )}
                 </div>
               </div>

               {/* Upload Progress */}
               {isUploading && (
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                     <span>Uploading...</span>
                     <span>{Math.round(uploadProgress)}%</span>
                   </div>
                   <div className="w-full bg-gray-700 rounded-full h-2">
                     <div 
                       className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                       style={{ width: `${uploadProgress}%` }}
                     ></div>
                   </div>
                 </div>
               )}

               {/* Error Message */}
               {uploadError && (
                 <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
                   {uploadError}
                 </div>
               )}

               <div className="flex space-x-3 pt-4">
                 <button 
                   onClick={handleUpload}
                   disabled={isUploading || !selectedFile || !videoTitle.trim()}
                   className={`flex-1 py-2 rounded-lg transition-colors ${
                     isUploading || !selectedFile || !videoTitle.trim()
                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                       : 'bg-blue-600 hover:bg-blue-700 text-white'
                   }`}
                 >
                   {isUploading ? 'Uploading...' : 'Upload Video'}
                 </button>
                 <button 
                   onClick={() => {
                     setShowUpload(false);
                     setSelectedFile(null);
                     setVideoTitle('');
                     setVideoDescription('');
                     setUploadError('');
                   }}
                   disabled={isUploading}
                   className={`flex-1 py-2 rounded-lg transition-colors ${
                     isUploading
                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                       : 'bg-gray-700 hover:bg-gray-600 text-white'
                   }`}
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default Profile; 