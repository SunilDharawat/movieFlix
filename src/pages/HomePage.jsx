import {useDebounce} from "react-use";
import React, {useEffect, useState} from 'react'
import Search from "../components/Search.jsx"
import Spinner from "../components/Spinner.jsx";
import MovieCard from "../components/MovieCard.jsx";
import {getTrendingMovies, updateSearchTerm} from "../appwrite.js";
import {API_OPTIONS, API_KEY, API_BASE_URL} from "../services/api.js";
import {useNavigate} from "react-router-dom";
import TabBar from "../components/Tab-bar.jsx";
import UserProfile from "./Profile.jsx";


const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [movieList, setMovieList] = useState([])
    const [trendingMovies, setTrendingMovies] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const [debounceSearchTerm, setDebounceSearchTerm] = useState("")

    const navigate = useNavigate();

    useDebounce(()=> setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query='') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endPoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endPoint, API_OPTIONS);
            if(!response.ok) {
                throw new Error("Could not fetch movies");
            }
            const data = await response.json();
            if(data.Response === "False"){
                setErrorMessage(data.error || "Failed to fetch movies");
                setMovieList([]);
                return;
            }

            setMovieList(data.results || [])
            if(query && data.results.length > 0) {
                await updateSearchTerm(query, data.results[0]);
            }
        }catch (error) {
            console.error(`Error fetching movies : ${error}`);
            setErrorMessage("Something went wrong, please try again");
        }finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        }catch (error) {
            console.error(`Error fetching trending movies`);
        }
    }
    useEffect(() => {
        fetchMovies(debounceSearchTerm);
    }, [debounceSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, [])

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <main>
            <div className="pattern" />
            <UserProfile/>
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero" />
                    <h1>Find <span className="text-gradient">Movies</span> You will Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie,index) =>(
                                <li key={index}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title}/>
                                </li>
                            ) )}
                        </ul>
                    </section>
                )
                }
                <section className="all-movies">
                    <TabBar setMovieList={setMovieList} />
                    {isLoading ? (
                        <Spinner/>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map(movie => (
                                <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie.id)} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Homepage
