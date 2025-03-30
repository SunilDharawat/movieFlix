import { useState, useEffect } from "react";
import { API_BASE_URL, API_OPTIONS } from "../services/api";

export default function TabBar({setMovieList}) {
    const [activeTab, setActiveTab] = useState("All Movies");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const tabs = ["All Movies", "TV Shows", "Trending Movies"];

    // Function to fetch data based on the selected tab
    const fetchData = async (category) => {
        setLoading(true);
        try {
            let endpoint = "";
            if (category === "All Movies") {
                endpoint = "/movie/popular";
            } else if (category === "TV Shows") {
                endpoint = "/tv/popular";
            } else if (category === "Trending Movies") {
                endpoint = "/trending/movie/week";
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, API_OPTIONS);
            const result = await response.json();
            setMovieList(result.results || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the tab changes
    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab]);

    return (
        <div>
            {/* Tab Bar */}
            <div className="flex gap-4 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-md font-medium text-white transition-all ${
                            activeTab === tab
                                ? "bg-gray-800 text-black shadow-md"
                                : "bg-black bg-opacity-60 hover:bg-opacity-80"
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>


        </div>
    );
}
