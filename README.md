# Explanation

> [!IMPORTANT]
> The easiest way to check for whether caching works is to:
>
> 1.  Perform a movie query.
> 2.  Remove the text to return to the popular movies page.
> 3.  Repeat the same query again, all while monitoring the Network Requests tab in DevTools.

Implementing the infinite scroll fetching combined with react query was honestly a challenge, until I figured out how to use the `useInfiniteQuery` hook correctly, I went in a back and forth between dropping and keeping infinite scrolling in favor of normal pagniation but I got it done correctly at the end.

I also tried to make everything SSR but it was a bit too complicated, so I moved the API calls to a nextJS API route to avoid exposing the API key to the frontend.

Things implemented:

- Infinite scroll
- Debounce search
- Caching of all queries
- Use of SHADCN modal
- Use of Next.js, React 18, Axios, and TypeScript
