import {Client, Databases, ID, Query} from "appwrite";

const DATABASE_ID = import.meta.env.VITE_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_PUBLIC_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_PUBLIC_APPWRITE_PROJECT_ID)

const database = new Databases(client)


// store serach terms in db
export  const updateSearchTerm = async (query, movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.equal('searchTerm', query),
        ])
        if(result.documents.length > 0){
            const existingMovie = result.documents[0];

            await  database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            )
        }else {
            await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: query,
                    movie_id: movie.id,
                    title:movie.title,
                    count:1,
                    poster_url:`https://Image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            )
        }
    }catch (error){
        console.error(error);
        throw error;
    }
}

export const getTrendingMovies = async ()=> {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.limit(10),
            Query.orderDesc('count')
        ])
        return result.documents;
    }catch (error){
        console.error(error);
        return undefined;
    }
}
