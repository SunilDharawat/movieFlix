import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import '../MovieDetails.css';
import {API_BASE_URL, API_OPTIONS} from "../services/api.js";
import {ChevronsLeft} from "lucide-react";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [showHearts, setShowHearts] = useState(false);

    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                // Get basic movie details
                const movieResponse = await fetch(
                    `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos`,
                    API_OPTIONS
                );

                if (!movieResponse.ok) {
                    throw new Error('Failed to fetch movie details');
                }

                const movieData = await movieResponse.json();
                setMovie(movieData);
            } catch (err) {
                console.error(err);
                setError('Failed to load movie details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, API_BASE_URL, API_OPTIONS]);

    // Load liked status from localStorage
    useEffect(() => {
        const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || {};
        setLiked(likedMovies[id] || false);
    }, [id]);

    // Toggle like/unlike
    const handleLikeToggle = () => {
        const newLikedStatus = !liked;
        setLiked(newLikedStatus);

        // Store in localStorage
        const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || {};
        likedMovies[movie.id] = newLikedStatus;
        localStorage.setItem("likedMovies", JSON.stringify(likedMovies));

        // Trigger heart effect
        if (!liked) {
            setShowHearts(true);
            setTimeout(() => setShowHearts(false), 1000); // Remove hearts after animation
        }
    };
    const goBack = () => {
        navigate('/');
    };

    if (loading) return <div className="movie-details-container"><Spinner /></div>;
    if (error) return <div className="movie-details-container error">{error}</div>;
    if (!movie) return <div className="movie-details-container not-found">Movie not found</div>;

    // Extract the YouTube trailer if available
    const trailer = movie.videos?.results?.find(
        video => video.type === "Trailer" && video.site === "YouTube"
    );

    // Get director and top cast
    const director = movie.credits?.crew?.find(person => person.job === "Director");
    const topCast = movie.credits?.cast?.slice(0, 6) || [];


    return (
        <div className="movie-details-container">
            {/* Backdrop Image */}
            {movie.backdrop_path && (
                <div className="backdrop" style={{
                    backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`
                }} />
            )}

            <div className="movie-details-content">
                <button className="back-button" onClick={goBack}>
                    <span><ChevronsLeft/> Back to Movies</span>
                </button>

                <div className="movie-details-main">
                    {/* Movie Poster */}
                    <div className="movie-poster">
                        <img
                            src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : './placeholder.png'}
                            alt={`${movie.title} poster`}
                        />
                    </div>

                    {/* Movie Info */}
                    <div className="movie-info-details">
                        <h1>{movie.title}</h1>
                        {movie.tagline && <p className="tagline">{movie.tagline}</p>}

                        <div className="movie-meta-details">
                            {movie.release_date && (
                                <span className="meta-item">
                  <span className="meta-label">Release Date:</span>
                                    {new Date(movie.release_date).toLocaleDateString()}
                </span>
                            )}

                            {movie.runtime > 0 && (
                                <span className="meta-item">
                  <span className="meta-label">Runtime:</span>
                                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
                            )}

                            {movie.vote_average > 0 && (
                                <span className="meta-item">
                  <span className="meta-label">Rating:</span>
                                    {movie.vote_average.toFixed(1)}/10
                </span>
                            )}
                        </div>

                        {movie.genres && movie.genres.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                {/* Genres */}
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres.map((genre) => (
                                        <span key={genre.id} className="genre-tag">{genre.name}</span>
                                    ))}
                                </div>

                                {/* Like Button (Relative for Heart Effect) */}
                                <div className="relative">
                                    <button
                                        onClick={handleLikeToggle}
                                        className={`p-2 rounded-md cursor-pointer text-2xl relative z-10 ${
                                            liked ? "text-red-500" : "text-gray-400"
                                        } transition-all`}
                                    >
                                        {liked ? "❤️" : "🤍"}
                                    </button>

                                    {/* Floating Hearts Effect (Positioned Above the Like Button) */}
                                    {showHearts && (
                                        <div className="hearts-container">
                                            {[...Array(8)].map((_, i) => (
                                                <span key={i} className="heart-effect">❤️</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        {movie.overview && (
                            <div className="overview">
                                <h3>Overview</h3>
                                <p>{movie.overview}</p>
                            </div>
                        )}

                        {/* Director */}
                        {director && (
                            <div className="director">
                                <h3>Director</h3>
                                <p>{director.name}</p>
                            </div>
                        )}

                        {/* Cast */}
                        {topCast.length > 0 && (
                            <div className="cast">
                                <h3>Cast</h3>
                                <div className="cast-list">
                                    {topCast.map(person => (
                                        <div key={person.id} className="cast-member">
                                            {person.profile_path ? (
                                                <img
                                                    src={`${IMAGE_BASE_URL}${person.profile_path}`}
                                                    alt={person.name}
                                                />
                                            ) : (
                                                <div className="cast-placeholder"></div>
                                            )}
                                            <p>{person.name}</p>
                                            <p className="character">{person.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trailer */}
                {trailer && (
                    <div className="trailer-section">
                        <h3>Trailer</h3>
                        <div className="trailer-container">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title="Movie Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;