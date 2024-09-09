# Explanation

> [!IMPORTANT]
> Easiest way to check for caching is to:
>
> 1.  do a movie query
> 2.  remove the text to go back to popular page
> 3.  and redo the same query once again
>     all monitoring the network requests tab in dev tools

I honestly struggled a lot with the infinite scrolling fetching combined with react query, until I figured out how to use the useInfiniteQuery hook correctly, I went in a back and forth between dropping and keeping infinite scrolling in favor of normal pagniation but I got it done correctly at the end.

I also tried to make everything SSR but it was a bit too complicated, so I moved the api calls to an nextJS API route to avoid exposing the API key to the frontend
