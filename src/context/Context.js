import { createContext,useState,useEffect } from "react";
import { fetchDatafromApi } from "../utils/api";
import { auth, googleProvider, storage, db } from "../firebase/config";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

 export const Context=createContext();

 export const AppContext=(props)=>{ 
           const[loading,setLoading]=useState(false)
           const[searchResults,setSearchResults]=useState([]);
           const[selectCategories,setSelectCategories]=useState("New");
           const[mobileMenue,setMobileMenue]=useState(false);
           const[user,setUser]=useState(null);
           const[authLoading,setAuthLoading]=useState(true);
           const[isDarkMode,setIsDarkMode]=useState(true);
           const[uploadProgress,setUploadProgress]=useState(0);
           const[isUploading,setIsUploading]=useState(false);


             useEffect(()=>{
              fetchSelectedCategoryData(selectCategories)
             },[selectCategories])    

             // Auth state listener
             useEffect(() => {
               const unsubscribe = onAuthStateChanged(auth, (user) => {
                 setUser(user);
                 setAuthLoading(false);
               });
               return () => unsubscribe();
             }, []);

           const fetchSelectedCategoryData=(query)=>{
                    if (!query || query.trim() === '') {
                        console.log('Empty query, skipping API call');
                        setSearchResults([]);
                        setLoading(false);
                        return;
                    }
                    
                    console.log('Fetching data for category:', query);
                    setLoading(true);
                    
                    // Use proper search endpoint
                    const searchUrl = `search?q=${encodeURIComponent(query)}`;
                    console.log('Search URL:', searchUrl);
                    
                    fetchDatafromApi(searchUrl).then(
                        (res)=>{
                            console.log('API response:', res);
                            if (res && res.items) {
                                setSearchResults(res.items);
                            } else {
                                console.log('No items in response, setting empty array');
                                setSearchResults([]);
                            }
                            setLoading(false);
                        }
                    ).catch((error) => {
                        console.error('Error fetching category data:', error);
                        setSearchResults([]);
                        setLoading(false);
                    });
              }

              const signInWithGoogle = async () => {
                try {
                  const result = await signInWithPopup(auth, googleProvider);
                  return result.user;
                } catch (error) {
                  console.error('Error signing in with Google:', error);
                  throw error;
                }
              };

              const signOut = async () => {
                try {
                  await firebaseSignOut(auth);
                } catch (error) {
                  console.error('Error signing out:', error);
                  throw error;
                }
              };

              const toggleTheme = () => {
                setIsDarkMode(!isDarkMode);
              };

              const uploadVideo = async (file, title, description) => {
                if (!user) {
                  throw new Error('User must be logged in to upload videos');
                }

                if (!file) {
                  throw new Error('Please select a video file');
                }

                if (!title.trim()) {
                  throw new Error('Please enter a video title');
                }

                setIsUploading(true);
                setUploadProgress(0);

                try {
                  // Create a unique filename
                  const timestamp = Date.now();
                  const fileName = `${user.uid}_${timestamp}_${file.name}`;
                  const storageRef = ref(storage, `videos/${fileName}`);

                  // Upload the file
                  const uploadTask = uploadBytesResumable(storageRef, file);

                  // Monitor upload progress
                  uploadTask.on('state_changed', 
                    (snapshot) => {
                      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      setUploadProgress(progress);
                    },
                    (error) => {
                      console.error('Upload error:', error);
                      setIsUploading(false);
                      setUploadProgress(0);
                      throw error;
                    },
                    async () => {
                      try {
                        // Upload completed successfully
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        
                        // Prepare video data
                        const videoData = {
                          id: `local_${timestamp}`,
                          title: title.trim(),
                          description: description.trim(),
                          videoURL: downloadURL,
                          thumbnailURL: '', // You can add thumbnail generation later
                          userId: user.uid,
                          userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
                          userPhotoURL: user.photoURL,
                          uploadDate: new Date().toISOString(),
                          views: 0,
                          likes: 0,
                          duration: '0:00', // You can add video duration detection later
                          fileName: fileName
                        };

                        // Try to save to Firestore first
                        try {
                          await addDoc(collection(db, 'videos'), videoData);
                          console.log('Video saved to Firestore successfully');
                        } catch (firestoreError) {
                          console.warn('Firestore not available, saving to local storage:', firestoreError);
                          
                          // Fallback to local storage
                          const existingVideos = localStorage.getItem(`userVideos_${user.uid}`);
                          const videos = existingVideos ? JSON.parse(existingVideos) : [];
                          videos.unshift(videoData);
                          localStorage.setItem(`userVideos_${user.uid}`, JSON.stringify(videos));
                        }
                        
                        setUploadProgress(100);
                        setIsUploading(false);
                        
                        return downloadURL;
                      } catch (error) {
                        console.error('Error saving video data:', error);
                        setIsUploading(false);
                        setUploadProgress(0);
                        throw new Error('Video uploaded but failed to save metadata. Please try again.');
                      }
                    }
                  );
                } catch (error) {
                  console.error('Error uploading video:', error);
                  setIsUploading(false);
                  setUploadProgress(0);
                  throw error;
                }
              };

              // console.log(searchResults)
              

  return(
           <Context.Provider  value={{
            loading, setLoading,
              searchResults,setSearchResults,
              selectCategories,setSelectCategories,
              mobileMenue,setMobileMenue,
              user, setUser,
              authLoading,
              signInWithGoogle,
              signOut,
              isDarkMode,
              toggleTheme,
              uploadVideo,
              uploadProgress,
              isUploading
           }}    >
            {props.children}
        </Context.Provider>
    );


 }