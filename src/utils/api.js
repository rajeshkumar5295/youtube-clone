import axios from "axios";

// const BASE_URL='https://youtube138.p.rapidapi.com'
const BASE_URL="https://www.googleapis.com/youtube/v3"

// const options = {
//   params: {
    
//     hl: 'en',
//     gl: 'US'
//   },
//   headers: {
//     'X-RapidAPI-Key': process.env.REACT_APP_YOUTUBE_API_KEY,
    
//     'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
    
//   }
// };

const options={
    params:{
        key:'AIzaSyDA7kqMQPzcG7dhTqyoOImrncmh4I_5TVY',
       
        type:'video',
        maxResults:'30',
        part:'snippet',
        // The maximum value for maxResults is 50.
    }
}


export  const fetchDatafromApi=async(url)=>{

     try {  
           const {data}=await axios.get(`${BASE_URL}/${url}`,options);
          // https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&q=${SEARCH_QUERY}
            
            // const {data} =axios.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyBddKgavS8qhcSx5Gi10Uf6m50M0v2rEm0&part=snippet&type=video&q=New')
            // const {data}=axios.get('https://www.googleapis.com/youtube/v3/search?q=Music&key=AIzaSyBddKgavS8qhcSx5Gi10Uf6m50M0v2rEm0&part=snippet&type=video')

           console.log(data)

           return data;
        
    } catch (error) { 
        console.log(error)
        
    }
}
fetchDatafromApi();

