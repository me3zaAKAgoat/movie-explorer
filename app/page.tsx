"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDebounce } from "@/lib/useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

type Movie = {
  id: number;
  poster_path: string;
  original_title: string;
  release_date: string;
  overview: string;
  vote_average: number;
};

const fetchMovies = async (page: number = 1, searchTerm: string = "") => {
  const url = `/api/movies?page=${page}&searchTerm=${searchTerm}`;
  const response = await axios.get(url);
  return {
    page: page,
    results: response.data.results,
    total_pages: response.data.total_pages,
  };
};

const useFetchMovies = (searchTerm = "") => {
  return useInfiniteQuery({
    queryKey: ["movies", searchTerm],
    queryFn: async ({ pageParam = 1 }) =>
      await fetchMovies(pageParam, searchTerm),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500) as string;
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useFetchMovies(debouncedSearch);
  const movieListElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = !Math.floor(
        Math.abs(
          movieListElementRef.current?.getBoundingClientRect().bottom! -
            document.documentElement.clientHeight
        )
      );
      if (isBottom) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage]);

  return (
    <main className="h-screen flex flex-col items-center justify-start">
      <div className="flex items-center justify-center gap-4 p-4">
        <input
          type="text"
          id="search"
          className="rounded px-2 py-1 text-white bg-stone-800 border-none focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Search for a movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div
        ref={movieListElementRef}
        className="flex flex-wrap items-start justify-center gap-2"
      >
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}
        {!isError &&
          !isLoading &&
          data?.pages.map((page: any) =>
            page.results.map((movie: Movie) => (
              <MovieCard
                movie={movie}
                key={movie.id}
                setSelectedMovie={setSelectedMovie}
              />
            ))
          )}
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
  movie: Movie;
  setSelectedMovie: any;
}) {
  return (
    <div className="w-28 sm:w-48">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={movie.original_title}
        className="rounded-lg border-2 border-black hover:border-purple-400 transition-all hover:brightness-75 cursor-pointer"
        onClick={() => setSelectedMovie(movie)}
      />
      <h1 className="font-bold text-lg">{movie.original_title}</h1>
      <p className="text-sm">{movie.release_date.split("-")[0]}</p>
    </div>
  );
}

function MovieDetails({ movie }: { movie: Movie | null }) {
  if (!movie) return null;
  return (
    <div className="sm:h-[80vh] w-[80vw] flex items-start justify-center gap-4 bg-black/80 p-4 rounded-xl">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={movie.original_title}
        className="sm:h-full h-48 rounded-lg border-2 border-black"
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
