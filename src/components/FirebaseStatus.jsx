import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../context/Context';
import { db } from '../firebase/config';
import { collection, getDocs, limit } from 'firebase/firestore';
import { FiWifi, FiWifiOff, FiDatabase, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const FirebaseStatus = () => {
  const { isDarkMode } = useContext(Context);
  const [firestoreStatus, setFirestoreStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const checkFirebaseStatus = async () => {
    setFirestoreStatus('checking');
    try {
      // Try to read from Firestore
      const querySnapshot = await getDocs(collection(db, 'videos'), limit(1));
      setFirestoreStatus('connected');
      setLastChecked(new Date());
    } catch (error) {
      console.error('Firebase connection error:', error);
      setFirestoreStatus('disconnected');
      setLastChecked(new Date());
    }
  };

  const getStatusIcon = () => {
    switch (firestoreStatus) {
      case 'connected':
        return <FiCheckCircle className="text-green-500 text-xl" />;
      case 'disconnected':
        return <FiAlertCircle className="text-red-500 text-xl" />;
      case 'checking':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>;
      default:
        return <FiWifiOff className="text-gray-500 text-xl" />;
    }
  };

  const getStatusText = () => {
    switch (firestoreStatus) {
      case 'connected':
        return 'Firebase Connected';
      case 'disconnected':
        return 'Firebase Disconnected';
      case 'checking':
        return 'Checking Connection...';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (firestoreStatus) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      case 'checking':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Firebase Status
        </h3>
        <button
          onClick={checkFirebaseStatus}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title="Refresh status"
        >
          <FiDatabase className="text-lg" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            {lastChecked && (
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        
        {firestoreStatus === 'disconnected' && (
          <div className={`text-xs p-3 rounded-lg ${
            isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
          }`}>
            <p className="font-medium mb-1">Firebase is not available</p>
            <p>Your videos will be saved locally instead.</p>
          </div>
        )}
        
        {firestoreStatus === 'connected' && (
          <div className={`text-xs p-3 rounded-lg ${
            isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            <p className="font-medium mb-1">Firebase is working properly</p>
            <p>Your videos will be saved to the cloud.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseStatus; 