import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { fetchDatafromApi } from "../utils/api";
import { Context } from "../context/Context";
import SuggestionVideo from "./SuggestionVideo";
import { FiEye } from "react-icons/fi";

const VideoDetail = () => {
  // https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&relatedToVideoId=${videoId}&maxResults=10
  // https://www.googleapis.com/youtube/v3/videos?id=uaGldshAvjk&key=AIzaSyA4HwEIVjctW9CLp5AbljOBofgUkkWdlhE&part=snippet,contentDetails,statistics
  const [video, setVideo] = useState();
  const [relatedVideo, setRelatedVideo] = useState();
  const { setLoading } = useContext(Context);
  const { id } = useParams();
  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
    fetchVideoDetails();
    fetchRelatedVideos();
  }, [id]);

  const fetchVideoDetails = () => {
    setLoading(true);
    fetchDatafromApi(`videos?id=${id}&part=contentDetails,statistics`).then(
      (res) => {
        // console.log("video res", res);
        setVideo(res);

        setLoading(false);
      }
    );
  };
  console.log(video?.items[0]?.snippet?.title);

  const fetchRelatedVideos = () => {
    setLoading(true);
    // i did not get related video parameter so i am calling all video
    fetchDatafromApi(`search?`).then((res) => {
      setRelatedVideo(res);
      // console.log("Related videos", res);
      setLoading(false);
    });
  };
  {
    /* <ReactPlayer url={ `https://www.youtube.com/watch?v=${id}`} /> */
  }
  return (
    <div className="  h-[calc(100%-56px)]  bg-black flex justify-center  flex-row"  >
         
         <div className="flex flex-col lg:flex-row  w-full max-w-[1280px]   " >
            <div className=" flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3  lg:py-3 overflow-y-auto  "  >
                <div className="h-[200px] md:[400px] lg:h-[400px] xl:[550]  ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0 overflow-hidden " >
                <ReactPlayer 
                url={ `https://www.youtube.com/watch?v=${id}`}  
                  controls
                  width="100%"
                  height="100%"
                  style={{backgroundColor:'#000000 ',overflow:'hidden' }}
                />
                </div>

                <div className="text-white mt-3 line-clamp-2 font-bold text-sm md:text-xl  " > {video?.items[0]?.snippet?.title} </div>

                <div  className=" justify-between flex flex-col md:flex-row mt-4 " >  
                    <div className="flex" >
                       <div className=" flex items-start" > 
                          <div className="flex h-11 w-11  rounded-full overflow-hidden  bg-red-700 " >
                            <img  
                              className="h-full w-full object-cover "
                            // src={video?.items[0]?.snippet?.thumbnails?.high?.url} alt="" 
                            src="https://xsgames.co/randomusers/assets/avatars/female/11.jpg"
                            />
                          </div>

                       </div>
                       <div className="flex flex-col ml-3 " >
                            <div className=" text-white text-md font-semibold flex items-center " > {video?.items[0]?.snippet?.channelTitle} </div>
                           <div className="text-white/[0.7] text-sm " > 568 subscribers </div>
                       </div>

                    </div>

                    <div className="flex text-white mt-4 md:mt-0 " >
                       <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15] "  >  <AiOutlineLike className="text-xl text-white mr-2" /> {video?.items[0].statistics?.likeCount} likes  </div>
                       <div  className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15] ml-4 " >  < FiEye className="text-xl text-white mr-2" /> {video?.items[0].statistics?.viewCount} views</div>
                    </div>

                </div>

            </div>
            
            {/* related items */}
             <div className="flex flex-col py-6 px-4  overflow-y-auto lg:w-[350px] xl:w-[400px] text-white " > 
              {
                 relatedVideo?.items?.map((item,index)=>{
                     return(
                      <SuggestionVideo 
                         item={index}
                         video={item?.id}
                         snippet={item?.snippet}
                      />
                     )
                 })
              }
            </div>

         </div>
          
    </div>

  );
};

export default VideoDetail;
