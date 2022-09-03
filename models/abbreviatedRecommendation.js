export class AbbreviatedRecommendation {
    constructor(
        groupRecID,
        recType,
        endorsements,
        createdAt,
        recID_id,
        recDesc,
        recRating,
        recUsername,
        recFullName,
        title,
        description,
        imageURL,
        externalURL,
        recCreatorID,
        mediaID,
        parentPodID
    ) {
        this.groupRecID = groupRecID,
        this.recType = recType,
        this.endorsements = endorsements,
        this.createdAt = createdAt,
        this.recID_id = recID_id,
        this.recDesc = recDesc,
        this.recRating = recRating,
        this.recUsername = recUsername,
        this.recFullName = recFullName,
        this.title = title,
        this.description = description,
        this.imageURL = imageURL,
        this.externalURL = externalURL,
        this.recCreatorId = recCreatorID,
        this.mediaID = mediaID,
        this.parentPodID = parentPodID
    }
}