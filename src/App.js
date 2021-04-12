import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import AuthProvider from './contexts/auth';

import Moment from 'react-moment';
import 'moment-timezone';

import { ToastContainer } from 'react-toastify';




function App() {
  return (
    <AuthProvider>
      <ToastContainer autoClose={3000}/>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
