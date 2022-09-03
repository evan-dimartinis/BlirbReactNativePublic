export class TVSearchResult {
    constructor(
        backdrop_path,
        first_air_date,
        genre_ids,
        id,
        media_type,
        name,
        origin_country,
        original_language,
        original_name,
        overview,
        popularity,
        poster_path,
        vote_average,
        vote_count
    ) {
        this.backdrop_path = backdrop_path,
        this.first_air_date = first_air_date,
        this.genre_ids = genre_ids,
        this.id = id,
        this.media_type = media_type,
        this.name = name,
        this.origin_country = origin_country,
        this.original_language = original_language,
        this.original_name = original_name,
        this.overview = overview,
        this.popularity = popularity,
        this.poster_path = poster_path,
        this.vote_average = vote_average,
        this.vote_count = vote_count
    }
}