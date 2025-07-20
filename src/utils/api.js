import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = 'AIzaSyBddKgavS8qhcSx5Gi10Uf6m50M0v2rEm0'; // Using the original working API key

// Default options for search requests
const getDefaultOptions = () => ({
  params: {
    key: API_KEY,
    type: 'video',
    maxResults: '30',
    part: 'snippet',
  }
});

// Special options for video details (no type parameter needed)
const getVideoOptions = () => ({
  params: {
    key: API_KEY,
    part: 'snippet,contentDetails,statistics',
  }
});

export const fetchDatafromApi = async (url) => {
  try {
    // Determine which options to use based on the URL
    let options;
    if (url.includes('videos?id=')) {
      // For video details, don't include type parameter
      options = getVideoOptions();
    } else {
      // For search requests, use default options
      options = getDefaultOptions();
    }

    console.log('Fetching:', `${BASE_URL}/${url}`);
    console.log('Options:', options);

    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    
    console.log('API Response:', data);
    return data;
    
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      
      if (error.response.status === 403) {
        console.error('API Key quota exceeded or invalid, using mock data');
        return getMockData(url);
      } else if (error.response.status === 400) {
        console.error('Bad request, check URL format');
        return getMockData(url);
      }
    } else if (error.request) {
      // The request was made but no response was received (network error)
      console.error('Network error, no response received');
      return getMockData(url);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      return getMockData(url);
    }
    
    return null;
  }
};

// Mock data for development when API fails
const getMockData = (url) => {
  console.log('Using mock data for:', url);
  
  if (url.includes('search')) {
    return {
      items: [
        {
          id: { videoId: 'mock-video-1' },
          snippet: {
            title: 'Sample Video 1',
            description: 'This is a sample video description',
            thumbnails: {
              medium: { url: 'https://picsum.photos/320/180?random=1' }
            },
            channelTitle: 'Sample Channel',
            publishTime: new Date().toISOString()
          }
        },
        {
          id: { videoId: 'mock-video-2' },
          snippet: {
            title: 'Sample Video 2',
            description: 'Another sample video description',
            thumbnails: {
              medium: { url: 'https://picsum.photos/320/180?random=2' }
            },
            channelTitle: 'Another Channel',
            publishTime: new Date().toISOString()
          }
        },
        {
          id: { videoId: 'mock-video-3' },
          snippet: {
            title: 'Sample Video 3',
            description: 'Third sample video description',
            thumbnails: {
              medium: { url: 'https://picsum.photos/320/180?random=3' }
            },
            channelTitle: 'Third Channel',
            publishTime: new Date().toISOString()
          }
        },
        {
          id: { videoId: 'mock-video-4' },
          snippet: {
            title: 'Sample Video 4',
            description: 'Fourth sample video description',
            thumbnails: {
              medium: { url: 'https://picsum.photos/320/180?random=4' }
            },
            channelTitle: 'Fourth Channel',
            publishTime: new Date().toISOString()
          }
        }
      ]
    };
  }
  
  if (url.includes('videos?id=')) {
    return {
      items: [
        {
          id: 'mock-video-1',
          snippet: {
            title: 'Sample Video Title',
            description: 'This is a detailed video description',
            channelTitle: 'Sample Channel',
            publishedAt: new Date().toISOString()
          },
          statistics: {
            viewCount: '1000',
            likeCount: '100'
          }
        }
      ]
    };
  }
  
  return { items: [] };
};

