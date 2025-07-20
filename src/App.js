
import Feed from './components/Feed';
import Header from './components/Header';
import SearchResult from './components/SearchResult';
import VideoDetail from './components/VideoDetail';
import Profile from './components/Profile';
import { AppContext, Context } from './context/Context'
import { useEffect, useContext } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

import { BrowserRouter,Routes,Route } from 'react-router-dom';

function AppContent() {
  const { isDarkMode } = useContext(Context);

  useEffect(() => {
    document.body.classList.toggle('dark-bg', isDarkMode);
    document.body.classList.toggle('light-bg', !isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="flex flex-col h-full">
      <Header/>
      <Routes>
         <Route path="/"  exact   element={<Feed/>}  />
         <Route path='/searchResult/:searchQuery' element={ <SearchResult/> }  />
         <Route   path='/video/:id'  element={<VideoDetail/>} />
         <Route path='/profile' element={<Profile/>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContext>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppContext>
    </ErrorBoundary>
  );
}

export default App;
