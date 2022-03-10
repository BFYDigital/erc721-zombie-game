import { BrowserRouter as Router } from 'react-router-dom';
import ConnectAccount from './components/ConnectAccount';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  return (
    <Router>
      <ConnectAccount />
    </Router>
  );
}

export default App;
