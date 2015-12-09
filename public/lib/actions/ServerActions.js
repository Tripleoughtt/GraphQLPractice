import AppDispatcher from '../AppDispatcher';
import {ActionTypes} from '../Constants';

let ServerActions = {
  receiveLinks(links) {
    console.log('3. in ServerActions.receiveLinks()', links)
    AppDispatcher.dispatch({
      actionType: ActionTypes.RECEIVE_LINKS,
      links
    });
},
  receiveOneLink(link) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.RECEIVE_ONE_LINK,
      link
    })
  }

}

export default ServerActions
