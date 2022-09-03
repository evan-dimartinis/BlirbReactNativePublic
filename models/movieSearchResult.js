export class MovieSearchResult {
    constructor(
        adult,
        backdrop_path,
        genre_ids,
        id,
        media_type,
        original_language,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        title,
        video,
        vote_average,
        vote_count
    ) {
        this.adult = adult,
        this.backdrop_path = backdrop_path,
        this.genre_ids = genre_ids,
        this.id = id,
        this.media_type = media_type,
        this.original_language = original_language,
        this.original_title = original_title,
        this.overview = overview,
        this.popularity = popularity,
        this.poster_path = poster_path,
        this.release_date = release_date,
        this.title = title,
        this.video = video,
        this.vote_average = vote_average,
        this.vote_count = vote_count
    }
}