import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Error from "./components/error/error";
function App() {
  return (
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
