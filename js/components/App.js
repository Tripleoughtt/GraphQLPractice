import React from 'react';
import Relay from 'react-relay';

import Link from "./Link";
import Total from "./Total";

class App extends React.Component {
  setCurrentLimit(e) {
    let newLimit = Number(e.target.value);

    this.props.relay.setVariables({
      linksToFetch: newLimit
    });

  }
  render() {
    return (
      <div>
        <h1>Relay Bookmarks</h1>
        <input type="number" onChange={this.setCurrentLimit.bind(this)} />
        {this.props.store.links.edges.map(item => {
          return <Link key={item.node.id} link={item.node} />
        })}

        <Total total={this.props.store.total} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    linksToFetch: 5
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        dummy,
        links(first: $linksToFetch) {
          edges {
            node {
              id,
              ${Link.getFragment('link')}
            }
          }
        }
        total
      }
    `,
  },
});
