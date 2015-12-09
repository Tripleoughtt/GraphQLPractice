import API from '../API';

let LinkActions = {
  saveBookmark(newBookmark){
    API.saveBookmark(newBookmark);
  },
  getAllBookmarks() {
    console.log('1. In LinkActions.getAllBookmarks()');
    API.fetchAllBookmarks();
  },
  removeBookmark(link) {
    console.log('1. In LinkActions.removeBookmark', link)
    API.deleteBookmark(link)
  },
  likeLink(link){
    console.log('1. in LinkActions.likeLink', link)
    API.likeBookmark(link)
  }


};

export default LinkActions;
