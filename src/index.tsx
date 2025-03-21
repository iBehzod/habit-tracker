import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from './store/authSlice';

// Bootstrap component to handle auth state
const AuthStateHandler: React.FC<{children: React.ReactNode}> = ({ children }) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      store.dispatch(setUser(user));
    });
    
    return () => unsubscribe();
  }, []);
  
  return <>{children}</>;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthStateHandler>
          <App />
        </AuthStateHandler>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);