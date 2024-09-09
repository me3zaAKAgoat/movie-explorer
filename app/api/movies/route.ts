import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const searchTerm = url.searchParams.get("searchTerm") || "";

  const apiUrl = searchTerm
    ? `https://api.themoviedb.org/3/search/movie?language=en-US&query=${searchTerm}&page=${page}&include_adult=false&api_key=${API_KEY}`
    : `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.error();
  }
}
