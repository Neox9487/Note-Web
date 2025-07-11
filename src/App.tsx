import { BrowserRouter, Routes, Route } from "react-router-dom";


import Layout from "./widgets/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
