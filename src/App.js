import "./App.css";
import Login from "./Components/Login";
import AdminPanel from "./Components/AdminPanel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="body">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path='/admin' element={<AdminPanel/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
