import React from "react";
import Link from "./Link";

class List extends React.Component {
  render() {
    var content = this.props.bookmarks.map(bookmark => {
      return <Link key={bookmark.id} link={bookmark} />;
    });
    return (
      <div className="list">
        {content}
      </div>
    );
  }
}

export default List;
