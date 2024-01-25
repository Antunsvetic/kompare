import Home from './pages/Home';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import { UserProvider } from './context/user';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Container>
            <div className='app-container'>
              <NavBar />
              <Routes>
                <Route path='/' element={<Home />} />
              </Routes>
            </div>
          </Container>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
