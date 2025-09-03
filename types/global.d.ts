interface MovieData {
    "adult": boolean;
      "backdrop_path": string;
      "genre_ids": Array<number>;
      "id": number;
      "original_language": string;
      "original_title": string;
      "overview": string;
      "popularity": number
      "poster_path": string;
      "release_date": string;
      "title": string;
      "video": boolean;
      "vote_average": number;
      "vote_count": number;
}

interface GlobalMovieArr {
    "page": 1;
    "results": Array<MovieData>;
    "total_pages": number;
    "total_results": number;
}