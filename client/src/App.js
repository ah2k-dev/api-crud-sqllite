import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.js";
import Home from "./pages/Home.js";
import DatabaseInfo from "./pages/DatabaseInfo.js";
import InnerLayout from "./components/InnerLayout";
import TableData from "./pages/TableData.js";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/database" element={<InnerLayout />}>
              <Route path="/database/:database" element={<DatabaseInfo />} />
              <Route path="/database/:database/:table" element={<TableData />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
