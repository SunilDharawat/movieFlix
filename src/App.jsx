import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetails/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;