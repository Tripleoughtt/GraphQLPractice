import {get, post} from "jquery";

let API = {
	saveBookmark(newBookmark) {
    console.log(`this is ${newBookmark.title}`)
		return post("/graphql", {
      query: `
      mutation {
      createLink(title: "${newBookmark.title}", url: "${newBookmark.url}"){
      title
      url
      id
      }
      }
      `
    });
	},
	getAllBookmarks() {
		return post("/graphql",{
			query: `
			{
				allLinks {
					title,
					id,
					url
				}
			}`
		});
	}
};

export default API;
