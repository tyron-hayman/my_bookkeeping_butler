import { NextRequest } from 'next/server';


export async function GET(req: NextRequest) {
    const movie_id = req.nextUrl.searchParams.get('movieid');
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/credits`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_KEY as string}`
        }
    };
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
  
      if (!response) {
        return new Response(JSON.stringify(data), { status: response  });
      }
  
      // Success case
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (_error) {
      return new Response(JSON.stringify({ error: 'Failed to add contact' }), { status: 500 });
    }
  }