
import Feed from './components/Feed';
import Header from './components/Header';
import SearchResult from './components/SearchResult';
import VideoDetail from './components/VideoDetail';
import { AppContext } from './context/Context'

import { BrowserRouter,Routes,Route } from 'react-router-dom';


function App() { 
    
  // fetchDatafromApi("search");

  return (
    <AppContext>
      <BrowserRouter> 
          <div className='flex flex-col h-full  dark'   >
            <Header/>
            <Routes>
               <Route path="/"  exact   element={<Feed/>}  />
               <Route path='/searchResult/:searchQuery' element={ <SearchResult/> }  />
               <Route   path='/video/:id'  element={<VideoDetail/>} />
            </Routes>


          </div>

     
      </BrowserRouter>

  </AppContext>
   
  );
}

export default App;
