import { useState } from "react";

export default function UserProfile() {
    const [isOpen, setIsOpen] = useState(false);

    const user = {
        name: "Sunny Dharawat",
        profilePic: "./man.png",
        bio: "Movie enthusiast, loves action & sci-fi films.",
        favoriteGenres: ["Action", "Sci-Fi", "Drama"]
    };

    return (
        <div className=" relative z-50">
            {/* Profile Icon Button (Click to Toggle) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 cursor-pointer right-4 w-12 h-12 rounded-full border-2 border-gray-500 overflow-hidden"
            >
                <img src={user.profilePic} alt="Profile" className="w-full h-full" />
            </button>

            {/* Profile Dropdown */}
            {isOpen && (
                <div className="mt-1 absolute top-16 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64">
                    {/* Profile Picture */}
                    <img
                        src={user.profilePic}
                        alt="User Avatar"
                        className="w-20 h-20 rounded-full mx-auto mb-2 border-4 border-gray-600"
                    />

                    {/* Name */}
                    <h2 className="text-lg font-bold text-center">{user.name}</h2>

                    {/* Bio */}
                    <p className="text-gray-400 text-center text-sm">{user.bio}</p>

                    {/* Favorite Genres */}
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {user.favoriteGenres.map((genre, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-xs">
                {genre}
              </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
