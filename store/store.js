import { createStore, combineReducers } from 'redux'
import MediaReducer from './reducers/media';
import { applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './auth/authReducer';
import GroupsReducer from './reducers/groups';
import { SearchReducer } from './reducers/search';
import RecReducer from './reducers/recommendation';
import NavigationReducer from './reducers/navigation';
import ListReducer from './reducers/lists';
import PodcastIDReducer from "./reducers/podcastID";
import userReducer from './reducers/user';
import outsideUserReducer from './reducers/outsideUser';
import UserSearchReducer from './reducers/userSearch'
import CommentsReducer from './reducers/comments';
import GroupSettingsReducer from './reducers/groupSettings';
import FeedImagesReducer from './reducers/feedImages';


const rootReducer = combineReducers({
    mediaReducer: MediaReducer,
    authReducer: authReducer,
    groupsReducer: GroupsReducer,
    searchReducer: SearchReducer,
    recReducer: RecReducer,
    navigationReducer: NavigationReducer,
    listReducer: ListReducer,
    podcastIDReducer: PodcastIDReducer,
    userReducer: userReducer,
    outsideUserReducer: outsideUserReducer,
    userSearchReducer: UserSearchReducer,
    commentsReducer: CommentsReducer,
    groupSettingsReducer: GroupSettingsReducer,
    feedImagesReducer: FeedImagesReducer
})

const configureStore = () => createStore(rootReducer, applyMiddleware(ReduxThunk));

export default configureStore();