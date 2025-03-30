import React from 'react'

const MovieCard = ({movie:{title,id, vote_average, poster_path, release_date, original_language}, onClick}) => {
    const votePercentage = Math.round(vote_average * 10);

    // Dynamic stroke color based on rating
    const getStrokeColor = (percentage) => {
        if (percentage >= 70) return "text-green-500 stroke-green-500"; // High
        if (percentage >= 50) return "text-yellow-500 stroke-yellow-500"; // Medium
        return "text-red-500 stroke-red-500"; // Low
    };
    return (
        <div className="movie-card cursor-pointer" onClick={() => onClick(id)}>
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "no-image.png"} alt={title} />
            <div className="mt-4">
                <h3>{title}</h3>

                <div className="flex justify-between">
                    <div className="content">
                        <div className="rating">
                            <img src="star.svg" alt="star" />
                            <p>{vote_average? vote_average.toFixed(1) : "N/A"}</p>
                        </div>
                        <span>•</span>
                        <p className="lang">{original_language}</p>
                        <span>•</span>
                        <p className="year">{release_date ? release_date.split('-')[0] : "N/A" }</p>

                    </div>
                    {/* Circular Rating */}
                    <div className="relative w-10 h-10 mt-2">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            {/* Background Circle */}
                            <circle
                                className="stroke-gray-700"
                                strokeWidth="3"
                                fill="transparent"
                                r="16"
                                cx="18"
                                cy="18"
                            />
                            {/* Progress Circle */}
                            <circle
                                className={`transition-all duration-500 ${getStrokeColor(votePercentage)}`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="transparent"
                                r="16"
                                cx="18"
                                cy="18"
                                strokeDasharray="100"
                                strokeDashoffset={100 - votePercentage} // Controls the progress
                            />
                        </svg>
                        {/* Vote Percentage Text */}
                        <div className="absolute text-white inset-0 flex items-center justify-center text-xs font-bold">
                            {votePercentage}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MovieCard
