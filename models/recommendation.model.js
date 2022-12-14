export class Recommendation {

    constructor(
    groupRecID,
    recType,
    endorsements,
    numEndorsements,
    createdAt,
    updatedAt,
    creatorUserID,
    recID_id,
    recommenderDescription,
    recommenderRating,
    recommenderUsername,
    recommenderFirstName,
    recommenderLastName,
    movieInfo,
    podcastInfo,
    episodeInfo,
    bookInfo,
    tvInfo,
    comments,
    groupsRecommendedTo,
    episodeID,
    endorsedByCurrentUser,
    title,
    imageURL
    ) {
        this.groupRecID = groupRecID,
        this.recType = recType,
        this.endorsements = endorsements,
        this.numEndorsements = numEndorsements,
        this.createdAt = createdAt,
        this.updatedAt = updatedAt,
        this.creatorUserID = creatorUserID,
        this.recID_id = recID_id,
        this.recommenderDescription = recommenderDescription,
        this.recommenderRating = recommenderRating,
        this.recommenderUsername = recommenderUsername,
        this.recommenderFirstName = recommenderFirstName,
        this.recommenderLastName = recommenderLastName,
        this.movieInfo = movieInfo,
        this.podcastInfo = podcastInfo,
        this.episodeInfo = episodeInfo,
        this.bookInfo = bookInfo,
        this.tvInfo = tvInfo,
        this.comments = comments,
        this.groupsRecommendedTo = groupsRecommendedTo,
        this.episodeID = episodeID,
        this.endorsedByCurrentUser = endorsedByCurrentUser,
        this.title = title,
        this.imageURL = imageURL
    }

}