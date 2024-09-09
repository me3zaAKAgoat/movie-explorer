"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDebounce } from "@/lib/useDebounce";
import {
  useQuery,
} from "@tanstack/react-query";
import React from "react";

const fetchMovies = async (page: number = 1, searchTerm: string = "") => {
  const url = searchTerm
    ? `https://api.themoviedb.org/3/search/movie?language=en-US&query=${searchTerm}&page=${page}&include_adult=false&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    : `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
  const response = await axios.get(url);
  return response.data.results;
};

//state that holds the list of movies
//state updating function that fetches on scroll
//turn this into a server side rendered page at first, then split out the client side rendered part
//add types
//remove NEXT_PUBLIC from client side env vars
export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500) as string;
    // const [movies, setMovies] = useState<any[]>([]);
  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery({
    queryFn: async () => await fetchMovies(page, debouncedSearch),
    queryKey: ["movies", page, debouncedSearch],
	staleTime: 60 * 1000,
  });

  return (
    <main className="h-screen flex flex-col items-center justify-between">
      <div className="flex items-center justify-center gap-4 p-4">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          className="rounded-lg px-2 py-1 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-start justify-center gap-2">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}
        {!isError &&
          !isLoading &&
          movies.map((movie: any) => (
            <MovieCard
              movie={movie}
              key={movie.id}
              setSelectedMovie={setSelectedMovie}
            />
          ))}
      </div>
	  <div className="flex items-center justify-center gap-4 p-4">
		<button className="disabled:opacity-50" disabled={page === 1} 
		onClick={() => setPage((prev) => prev - 1)}>prev</button>
		<button onClick={() => setPage((prev) => prev + 1)}>next</button>
	  </div>
      <Dialog
        open={selectedMovie !== null}
        onOpenChange={() => setSelectedMovie(null)}
      >
        <DialogContent className="max-w-none w-auto p-0 border-none drop-shadow-lg bg-transparent">
          <MovieDetails movie={selectedMovie} />
        </DialogContent>
      </Dialog>
    </main>
  );
}

function MovieCard({
  movie,
  setSelectedMovie,
}: {
  movie: any;
  setSelectedMovie: any;
}) {
  return (
    <div className="w-48">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt="movie.title"
        className="rounded-lg border-2 border-black hover:border-purple-400 transition-all hover:brightness-75 cursor-pointer"
        onClick={() => setSelectedMovie(movie)}
      />
      <h1 className="font-bold text-lg">{movie.original_title}</h1>
      <p className="text-sm">{movie.release_date.split("-")[0]}</p>
    </div>
  );
}

function MovieDetails({ movie }: { movie: any }) {
  if (!movie) return null;
  return (
    <div className="h-[80vh] w-[80vw] flex items-start justify-center gap-4 bg-black/70 p-4 rounded-xl">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt="movie.title"
        className="h-full rounded-lg border-2 border-black"
      />
      <div className="h-full flex flex-col items-start justify-between gap-2">
        <div className="flex flex-col items-start justify-center gap-2">
          <h1 className="font-bold text-2xl">{movie.original_title}</h1>
          <p className="text-sm">{movie.overview}</p>
        </div>
        <div className="w-full flex items-center justify-between gap-2">
          <p className="text-sm font-bold">
            {movie.release_date.split("-")[0]}
          </p>
          <p className="text-sm">{movie.vote_average} / 10</p>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { useDebounce } from "@/lib/useDebounce";

// //state that holds the list of movies
// //state updating function that fetches on scroll
// //turn this into a server side rendered page at first, then split out the client side rendered part
// // add types
// export default function Home() {
//   const [movies, setMovies] = useState<any>([]);
//   const [selectedMovie, setSelectedMovie] = useState<any>(null);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 500);
//   const [searching, setSearching] = useState(false);

//   const fetchMovies = async (clearMovies: boolean = false) => {
//     const url = debouncedSearch
//       ? `https://api.themoviedb.org/3/search/movie?language=en-US&query=${debouncedSearch}&page=${page}&include_adult=false&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
//       : `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

//     try {
//       const response = await axios.get(url);
//       if (clearMovies) {
//         setPage(1);
//       }
//       setMovies((prev: any) =>
//         clearMovies
//           ? response.data.results
//           : [...prev, ...response.data.results]
//       );
//     } catch (error) {
//       console.error("Error fetching movies:", error);
//     }
//   };

//   useEffect(() => {
//     window.onscroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop ===
//         document.documentElement.offsetHeight
//       ) {
//         setPage((prev) => prev + 1);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     fetchMovies(true);
//   }, [debouncedSearch]);

//   useEffect(() => {
//     if (page > 1) fetchMovies();
//   }, [page]);

//   return (
//     <main className="flex flex-col items-center justify-center">
//       <div className="flex items-center justify-center gap-4 p-4">
//         <label htmlFor="search">Search</label>
//         <input
//           type="text"
//           id="search"
//           className="rounded-lg px-2 py-1 text-black"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>
//       <div className="flex flex-wrap items-start justify-center gap-2">
//         {movies.map((movie: any) => (
//           <MovieCard
//             movie={movie}
//             key={movie.id}
//             setSelectedMovie={setSelectedMovie}
//           />
//         ))}
//       </div>
//       <Dialog open={selectedMovie} onOpenChange={setSelectedMovie}>
//         <DialogContent className="max-w-none w-auto p-0 border-none drop-shadow-lg bg-transparent">
//           <MovieDetails movie={selectedMovie} />
//         </DialogContent>
//       </Dialog>
//     </main>
//   );
// }

// function MovieCard({
//   movie,
//   setSelectedMovie,
// }: {
//   movie: any;
//   setSelectedMovie: any;
// }) {
//   return (
//     <div className="w-48">
//       <img
//         src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
//         alt="movie.title"
//         className="rounded-lg border-2 border-black hover:border-purple-400 transition-all hover:brightness-75 cursor-pointer"
//         onClick={() => setSelectedMovie(movie)}
//       />
//       <h1 className="font-bold text-lg">{movie.original_title}</h1>
//       <p className="text-sm">{movie.release_date.split("-")[0]}</p>
//     </div>
//   );
// }

// function MovieDetails({ movie }: { movie: any }) {
//   if (!movie) return null;
//   return (
//     <div className="h-[80vh] w-[80vw] flex items-start justify-center gap-4 bg-black/70 p-4 rounded-xl">
//       <img
//         src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
//         alt="movie.title"
//         className="h-full rounded-lg border-2 border-black"
//       />
//       <div className="h-full flex flex-col items-start justify-between gap-2">
//         <div className="flex flex-col items-start justify-center gap-2">
//           <h1 className="font-bold text-2xl">{movie.original_title}</h1>
//           <p className="text-sm">{movie.overview}</p>
//         </div>
//         <div className="w-full flex items-center justify-between gap-2">
//           <p className="text-sm font-bold">
//             {movie.release_date.split("-")[0]}
//           </p>
//           <p className="text-sm">{movie.vote_average} / 10</p>
//         </div>
//       </div>
//     </div>
//   );
// }
