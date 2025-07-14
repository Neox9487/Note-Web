import { BrowserRouter, Routes, Route } from "react-router-dom";


import Layout from "./layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Notes from "./pages/Notes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/note" element={<Notes/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
