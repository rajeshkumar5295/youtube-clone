import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike, AiOutlineDislike, AiOutlineShareAlt } from "react-icons/ai";
import { fetchDatafromApi } from "../utils/api";
import { Context } from "../context/Context";
import SuggestionVideo from "./SuggestionVideo";
import { FiEye, FiMessageCircle, FiSend, FiPlay } from "react-icons/fi";
import { collection, doc, getDoc, getDocs, query, limit, orderBy, addDoc, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase/config";

const VideoDetail = () => {
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [loading, setLoading] = useState(true);
  const [relatedVideosLoading, setRelatedVideosLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isDarkMode } = useContext(Context);
  const { id } = useParams();

  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
    fetchVideoDetails();
    fetchComments();
  }, [id]);

  const fetchVideoDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // First, try to fetch from Firestore (uploaded videos)
      try {
        const videoDoc = await getDoc(doc(db, 'videos', id));
        if (videoDoc.exists()) {
          setVideo({
            type: 'uploaded',
            data: { id: videoDoc.id, ...videoDoc.data() }
          });
          setLoading(false);
          return;
        }
      } catch (firestoreError) {
        console.log('Not a Firestore video, trying YouTube API');
      }

      // If not found in Firestore, try YouTube API
      try {
        const res = await fetchDatafromApi(`videos?id=${id}&part=snippet,contentDetails,statistics`);
        if (res?.items?.length > 0) {
          setVideo({
            type: 'youtube',
            data: res.items[0]
          });
        } else {
          setError('Video not found');
        }
      } catch (youtubeError) {
        console.error('YouTube API error:', youtubeError);
        setError('Failed to load video');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    console.log('Fetching related videos for video type:', video?.type);
    setRelatedVideosLoading(true);
    try {
      if (video?.type === 'youtube') {
        // Fetch YouTube related videos
        console.log('Fetching YouTube related videos for ID:', id);
        const res = await fetchDatafromApi(`search?relatedToVideoId=${id}&type=video&part=snippet&maxResults=15`);
        console.log('YouTube related videos result:', res);
        setRelatedVideos(res?.items || []);
      } else if (video?.type === 'uploaded') {
        // Fetch uploaded videos from Firestore
        console.log('Fetching uploaded videos from Firestore');
        try {
          const q = query(collection(db, 'videos'), orderBy('uploadDate', 'desc'), limit(10));
          const querySnapshot = await getDocs(q);
          const videos = querySnapshot.docs.map(doc => ({
            id: { videoId: doc.id },
            snippet: {
              title: doc.data().title,
              description: doc.data().description,
              thumbnails: {
                medium: { url: doc.data().thumbnailURL || 'https://via.placeholder.com/320x180?text=Video' }
              },
              channelTitle: doc.data().userName,
              publishTime: doc.data().uploadDate
            }
          }));
          console.log('Firestore related videos:', videos);
          setRelatedVideos(videos);
        } catch (firestoreError) {
          console.error('Error fetching related videos from Firestore:', firestoreError);
          setRelatedVideos([]);
        }
      }
    } catch (error) {
      console.error('Error fetching related videos:', error);
      setRelatedVideos([]);
    } finally {
      setRelatedVideosLoading(false);
    }
  };

  // Update related videos when video type changes
  useEffect(() => {
    if (video) {
      fetchRelatedVideos();
    }
  }, [video]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      // Try to fetch comments from Firestore
      try {
        const q = query(
          collection(db, 'comments'),
          where('videoId', '==', id),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const commentsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsList);
      } catch (firestoreError) {
        console.log('Firestore not available for comments, using mock data');
        // Fallback to mock comments
        const mockComments = [
          {
            id: 1,
            author: "John Doe",
            avatar: "https://picsum.photos/40/40?random=1",
            text: "Great video! Really helpful content.",
            timestamp: "2 hours ago",
            likes: 15
          },
          {
            id: 2,
            author: "Jane Smith",
            avatar: "https://picsum.photos/40/40?random=2",
            text: "Thanks for sharing this information. Very informative!",
            timestamp: "5 hours ago",
            likes: 8
          },
          {
            id: 3,
            author: "Mike Johnson",
            avatar: "https://picsum.photos/40/40?random=3",
            text: "I've been looking for this for a while. Perfect timing!",
            timestamp: "1 day ago",
            likes: 23
          }
        ];
        setComments(mockComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    console.log('handleAddComment called, user:', user);
    
    if (!user) {
      alert("Please sign in to comment");
      return;
    }
    
    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const commentData = {
        videoId: id,
        author: user.displayName || user.email?.split('@')[0] || 'Anonymous',
                 avatar: user.photoURL || `https://picsum.photos/40/40?random=${user.uid || 'user'}`,
        text: newComment.trim(),
        timestamp: serverTimestamp(),
        likes: 0,
        userId: user.uid
      };

      console.log('Comment data:', commentData);

      // Try to save to Firestore
      try {
        await addDoc(collection(db, 'comments'), commentData);
        console.log('Comment saved to Firestore');
      } catch (firestoreError) {
        console.warn('Firestore not available, saving to local storage:', firestoreError);
        // Fallback to local storage
        const localComments = JSON.parse(localStorage.getItem(`comments_${id}`) || '[]');
        const newCommentLocal = {
          ...commentData,
          id: Date.now(),
          timestamp: new Date().toISOString()
        };
        localComments.unshift(newCommentLocal);
        localStorage.setItem(`comments_${id}`, JSON.stringify(localComments));
        console.log('Comment saved to local storage');
      }

      // Add to local state
      const newCommentObj = {
        id: Date.now(),
        author: commentData.author,
        avatar: commentData.avatar,
        text: commentData.text,
        timestamp: "Just now",
        likes: 0
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      console.log('Comment added to local state');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = serverTimestamp.toDate ? serverTimestamp.toDate() : new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  const getVideoUrl = () => {
    if (video?.type === 'youtube') {
      return `https://www.youtube.com/watch?v=${id}`;
    } else if (video?.type === 'uploaded') {
      return video.data.videoURL;
    }
    return null;
  };

  const getVideoTitle = () => {
    if (video?.type === 'youtube') {
      return video.data.snippet?.title;
    } else if (video?.type === 'uploaded') {
      return video.data.title;
    }
    return 'Video Title';
  };

  const getVideoDescription = () => {
    if (video?.type === 'youtube') {
      return video.data.snippet?.description;
    } else if (video?.type === 'uploaded') {
      return video.data.description;
    }
    return '';
  };

  const getChannelInfo = () => {
    if (video?.type === 'youtube') {
      return {
        name: video.data.snippet?.channelTitle,
                 avatar: "https://picsum.photos/44/44?random=channel"
      };
    } else if (video?.type === 'uploaded') {
      return {
        name: video.data.userName,
                 avatar: video.data.userPhotoURL || `https://picsum.photos/44/44?random=${video.data.userName}`
      };
    }
         return { name: 'Unknown Channel', avatar: "https://picsum.photos/44/44?random=unknown" };
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📹</div>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Video Not Found</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error || "The video you're looking for doesn't exist or has been removed."}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const channelInfo = getChannelInfo();

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Main Video Section */}
          <div className="flex-1 lg:mr-6">
            <div className={`px-4 py-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
              {/* Video Player */}
              <div className="w-full max-w-3xl mx-auto h-[200px] sm:h-[320px] md:h-[360px] lg:h-[420px] xl:h-[480px] 2xl:h-[540px] rounded-lg bg-black overflow-hidden shadow-lg">
                {getVideoUrl() ? (
                  <ReactPlayer 
                    url={getVideoUrl()}
                    controls
                    width="100%"
                    height="100%"
                    style={{backgroundColor:'#000000'}}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload'
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPlay className="text-6xl text-white opacity-50" />
                  </div>
                )}
              </div>

              {/* Video Title */}
              <div className={`mt-4 font-bold text-lg md:text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                {getVideoTitle()}
              </div>

              {/* Video Stats and Channel Info */}
              <div className={`justify-between flex flex-col md:flex-row mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
                <div className="flex">
                  <div className="flex items-start">
                    <div className="flex h-12 w-12 rounded-full overflow-hidden bg-red-700 shadow-lg">
                      <img  
                        className="h-full w-full object-cover"
                        src={channelInfo.avatar}
                        alt="Channel"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col ml-3">
                    <div className={`text-lg font-semibold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {channelInfo.name}
                      <BsFillCheckCircleFill className="text-blue-500 ml-1" />
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {video?.type === 'uploaded' ? 'Uploaded by user' : 'YouTube Channel'}
                    </div>
                  </div>
                </div>

                <div className="flex mt-4 md:mt-0 space-x-2">
                  <div className={`flex items-center justify-center h-11 px-6 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors cursor-pointer`}>
                    <AiOutlineLike className={`text-xl mr-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{formatNumber(video?.data?.likes || 0)} likes</span>
                  </div>
                  <div className={`flex items-center justify-center h-11 px-6 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors cursor-pointer`}>
                    <AiOutlineDislike className={`text-xl mr-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Dislike</span>
                  </div>
                  <div className={`flex items-center justify-center h-11 px-6 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors cursor-pointer`}>
                    <AiOutlineShareAlt className={`text-xl mr-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Share</span>
                  </div>
                </div>
              </div>

              {/* Video Description */}
              <div className={`mt-6 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formatNumber(video?.data?.views || 0)} views • {formatDate(video?.data?.uploadDate || video?.data?.snippet?.publishedAt)}</div>
                <div className={`mt-3 text-sm leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getVideoDescription()}</div>
              </div>

              {/* Comments Section */}
              <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
                {/* Debug Info - Remove in production */}
                <div className={`mb-4 p-3 text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200'} rounded-lg`}>
                  <p>User Status: {user ? `Logged in as ${user.displayName || user.email}` : 'Not logged in'}</p>
                  <p>Comments Count: {comments.length}</p>
                  <p>Show Comments: {showComments ? 'Yes' : 'No'}</p>
                  <p>New Comment: "{newComment}"</p>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FiMessageCircle className="text-xl" />
                    <span className="font-semibold text-lg">{comments.length} Comments</span>
                  </div>
                  <button 
                    onClick={() => setShowComments(!showComments)}
                    className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {showComments ? 'Hide' : 'Show'} Comments
                  </button>
                </div>

                {showComments && (
                  <>
                    {/* Add Comment */}
                    <div className="flex space-x-4 mb-8">
                      <img 
                        src={user?.photoURL || `https://picsum.photos/40/40?random=${user?.uid || 'user'}`}
                        alt="User"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={user ? "Add a comment..." : "Sign in to comment"}
                          value={newComment}
                          onChange={(e) => {
                            console.log('Comment input changed:', e.target.value);
                            setNewComment(e.target.value);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && user && newComment.trim()) {
                              console.log('Enter pressed, calling handleAddComment');
                              handleAddComment();
                            }
                          }}
                          className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                          disabled={!user}
                        />
                      </div>
                      <button
                        onClick={handleAddComment}
                        disabled={!user || !newComment.trim()}
                        className={`p-4 rounded-xl transition-all ${user && newComment.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'} text-gray-600 cursor-not-allowed`}`}
                      >
                        <FiSend className="text-lg" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                      {commentsLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading comments...</p>
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-4">
                            <img 
                              src={comment.avatar}
                              alt={comment.author}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {comment.author}
                                </span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {comment.timestamp}
                                </span>
                              </div>
                              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {comment.text}
                              </p>
                              <div className="flex items-center space-x-4 mt-3">
                                <button className={`flex items-center space-x-1 text-xs ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
                                  <AiOutlineLike className="text-sm" />
                                  <span>{comment.likes}</span>
                                </button>
                                <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      {comments.length === 0 && !commentsLoading && (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className={`w-full lg:w-80 xl:w-96 px-4 py-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-lg sticky top-4`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Related Videos ({relatedVideos.length})
              </h3>
              
              {/* Debug Info - Remove this in production */}
              <div className={`mb-4 p-3 text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200'} rounded-lg`}>
                <p>Video Type: {video?.type || 'none'}</p>
                <p>Related Videos Count: {relatedVideos.length}</p>
                <p>Loading: {relatedVideosLoading ? 'Yes' : 'No'}</p>
                <p>Video ID: {id}</p>
                <button 
                  onClick={fetchRelatedVideos}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                >
                  Refresh Related Videos
                </button>
              </div>
              
              <div className="space-y-3">
                {relatedVideosLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading related videos...</p>
                  </div>
                ) : (
                  relatedVideos.map((video, index) => (
                    <SuggestionVideo 
                      key={video.id?.videoId || index}
                      video={video.id}
                      snippet={video.snippet}
                    />
                  ))
                )}
                {relatedVideos.length === 0 && !relatedVideosLoading && (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>No related videos found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
