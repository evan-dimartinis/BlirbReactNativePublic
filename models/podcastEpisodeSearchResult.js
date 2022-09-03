export class PodcastEpisodeSearchResult {
    constructor(
        audio_preview_url,
        description,
        duration_ms,
        explicit,
        spotify_url, //external_urls.spotify
        id,
        image, //images[0].url
        is_externally_hosted,
        is_playable,
        language,
        name,
        release_date,
        type
    ) {
        this.audio_preview_url = audio_preview_url,
        this.description = description,
        this.duration_ms = duration_ms,
        this.explicit = explicit,
        this.spotify_url = spotify_url,
        this.id = id,
        this.image = image,
        this.is_externally_hosted = is_externally_hosted,
        this.is_playable = is_playable,
        this.language = language,
        this.name = name,
        this.release_date = release_date,
        this.type = type
    }
}