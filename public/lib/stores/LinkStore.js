import {EventEmitter} from 'events';
import AppDispatcher from "../AppDispatcher";
import {ActionTypes} from "../Constants";

let _links = [];

class LinkStore extends EventEmitter {
  //Register with the Dispatcher
  constructor(props){
    super(props);

    AppDispatcher.register(action => {
      switch (action.actionType){
          case ActionTypes.RECEIVE_LINKS:
          console.log('4. We Received news about the new data', action)
          console.log(action.links)
          _links= action.links
          this.emit("CHANGE")

          break;
      case ActionTypes.RECEIVE_ONE_LINK:
          console.log('Were recieving a link')
          console.log(_links)
          _links.push(action.link)
          this.emit("CHANGE")
          break;
        default:
            //do Nothing

      }
    })
  }


  //Exposes some data
  getAll() {
    if (!_links){
      console.log(_links)
      return _links = [];
    }
    _links =  _links.map(link => {
      link.url = link.url.startsWith("http") ? link.url : 
        'http://${link.url}'
        return link
    });
    return _links.map(link => {
      link.isSafe = link.url.startsWith("https") ? true : false
        return link
    })
  }

  startListening(callback){
    this.on("CHANGE", callback);
  }
  stopListening(callback){
    this.removeListener("CHANGE", callback);
  }
}

export default new LinkStore();
