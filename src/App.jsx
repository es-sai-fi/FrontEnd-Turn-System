import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Puestos from './pages/Puestos';
import WelcomePage from './pages/WelcomePage';
import Register from './pages/Register';
import Turno from './pages/Turno';
import Crear from './pages/Crear';
import PlaceStats from './pages/PlaceStats';
import Trabajador from './pages/Trabajador'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/puestos" element={<Puestos />}/>
        <Route path="/registro" element={<Register />}/>
        <Route path="/turno" element={<Turno />}/>
        <Route path="/crear" element={<Crear />}/>
        <Route path="/trabajador" element={<Trabajador />}/>
        <Route path="/placeStats" element={<PlaceStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
