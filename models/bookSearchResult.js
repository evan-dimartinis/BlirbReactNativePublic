export class BookSearchResult {
    constructor(
        id,
        authors,
        categories,
        description,
        thumbnail,
        infoLink,
        language,
        pageCount,
        title
    ) {
        this.id = id,
        this.authors = authors,
        this.categories = categories,
        this.description = description,
        this.thumbnail = thumbnail,
        this.infoLink = infoLink,
        this.language = language,
        this.pageCount = pageCount,
        this.title = title
    }
}