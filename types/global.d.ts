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

interface MovieDataSingle {
    adult: boolean;
    backdrop_path : string;
    belongs_to_collection : string | null;
    budget : number;
    genres : Array<{ id : number, name : string}>;
    homepage : string;
    id : number;
    imdb_id : string;
    origin_country : Array<string>;
    original_language : string;
    original_title : string;
    overview : string;
    popularity : number;
    poster_path : string;
    production_companies : Array<{ id : number; logo_path : string, name : string, origin_country : string}>;
    production_countries : Array<{ iso_3166_1 : string, name : string}>;
    release_date : string;
    revenue : number;
    runtime : number;
    spoken_languages : Array<{ english_name : string, iso_639_1 : string, name : string }>;
    status : string;
    tagline : string;
    title : string;
    video : boolean;
    vote_average : number;
    vote_count : number;
}

interface Cast {
    adult : boolean;
    gender : number;
    id : number;
    known_for_department : string;
    name : string;
    original_name : string;
    popularity : number;
    profile_path : string;
    cast_id : number;
    character : string;
    credit_id : string;
    order : number;
}

interface Crew {
    adult : boolean;
    gender : number;
    id : number;
    known_for_department : string;
    name : string;
    original_name : string;
    popularity : number;
    profile_path : string;
    credit_id : string;
    department : string;
    job : string;
}

interface MovieCredits {
    id : number;
    cast : Array<Cast>;
    crew : Array<Crew>;
}

