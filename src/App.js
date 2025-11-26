import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/home/home";
import Error from "./components/error/error";
import SharedLayout from "./components/shared/sharedLayout";
import Dokumen from "./components/dokumen/dokumen";
import UserManagement from "./components/userManagement/userManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SharedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dokumen" element={<Dokumen />} />
          <Route path="/userManagement" element={<UserManagement />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;