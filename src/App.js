import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import AddSchedule from './AddSchedule';
import ListMentor from './ListMentor';
import Protected from './Protected';
import MentorDetail from './MentorDetail';
import Dashboard from './Dashboard';
import Profile from './Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <h1>Mentoring Platform</h1> */}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/add' element={<AddSchedule />} />
          <Route path='/mentor' element={<ListMentor />} />
          <Route path='/mentor/:uid' element={<MentorDetail />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />

          {/* <Route path='/profile' element={<Protected  Cmp={Profile} />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
