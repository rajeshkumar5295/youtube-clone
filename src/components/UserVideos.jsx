import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../context/Context';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiPlay, FiEye, FiClock } from 'react-icons/fi';

const UserVideos = () => {
  const { user, isDarkMode } = useContext(Context);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  const fetchUserVideos = async () => {
    setLoading(true);
    try {
      // Try to fetch from Firestore first
      try {
        const q = query(
          collection(db, 'videos'),
          where('userId', '==', user.uid),
          orderBy('uploadDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const videos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserVideos(videos);
      } catch (firestoreError) {
        console.log('Firestore not available, checking local storage');
        // Fallback to local storage
        const existingVideos = localStorage.getItem(`userVideos_${user.uid}`);
        if (existingVideos) {
          setUserVideos(JSON.parse(existingVideos));
        } else {
          setUserVideos([]);
        }
      }
    } catch (error) {
      console.error('Error fetching user videos:', error);
      setUserVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
        <h2 className="text-2xl font-bold mb-6">Your Videos</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
      <h2 className="text-2xl font-bold mb-6">Your Videos ({userVideos.length})</h2>
      
      {userVideos.length === 0 ? (
        <div className="text-center py-8">
          <FiPlay className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You haven't uploaded any videos yet
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Start sharing your content with the world!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userVideos.map((video) => (
            <div 
              key={video.id} 
              className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} rounded-lg overflow-hidden shadow-lg transition-colors cursor-pointer`}
              onClick={() => window.open(`/video/${video.id}`, '_blank')}
            >
                             {/* Video Thumbnail */}
               <div className="relative h-48 bg-gray-800">
                 {video.thumbnailURL ? (
                   <img 
                     src={video.thumbnailURL} 
                     alt={video.title}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                     <FiPlay className="text-4xl text-gray-400" />
                   </div>
                 )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration || '0:00'}
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-4">
                <h3 className={`font-semibold text-sm mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {video.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <FiEye className="text-sm" />
                    <span>{video.views || 0} views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-sm" />
                    <span>{formatDate(video.uploadDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserVideos; 