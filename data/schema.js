/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

var store = { dummy: 42 };

store.links = [
  {_id: 1, title: "Google", url: "https://google.com"},
  {_id: 2, title: "Yahoo", url: "yahoo.com"},
  {_id: 3, title: "HP", url: "https://hp.com"},
  {_id: 4, title: "Dell", url: "https://dell.com"},
  {_id: 5, title: "GraphQL", url: "http://graphql.org"},
  {_id: 6, title: "React", url: "http://facebook.github.io/react"},
  {_id: 7, title: "Relay", url: "http://facebook.github.io/relay"}
];

store.instructors =[
  {firstName: "joe", lastName: "sanders", age: 24, gender: "male"},
  {firstName: "sue", lastName: "thomas", age: 25, gender: "female"},
  {firstName: "cade", lastName: "nichols", age: 29, gender: "male"},
  {firstName: "bob", lastName: "sturick", age: 41, gender: "male"},
]

store.courses = [
  {courseName: 'react', instructor: 0},
  {courseName: 'angular', instructor: 1},
  {courseName: 'mongo', instructor: 2},
  {courseName: 'graphql', instructor: 3},
]

store.students =[
  {firstName: "ryan", lastName: "myers", age: 24, gender: "male", level: "sophomore"},
  {firstName: "ashley", lastName: "thomppson", age: 25, gender: "female", level: "senior"},
  {firstName: "rich", lastName: "patterson", age: 29, gender: "male", level: "freshman"},
  {firstName: "joanna", lastName: "james", age: 41, gender: "female", level: "junior"},
]


store.grades = [
  {student: "myers", course: "react", grade: 'A'},
  {student: "myers", course: "angular", grade: 'C'},
  {student: "myers", course: "mongo", grade: 'B'},
  {student: "myers", course: "graphql", grade: 'D'},
  {student: "thomppson", course: "react", grade: 'C'},
  {student: "thomppson", course: "angular", grade: 'F'},
  {student: "thomppson", course: "mongo", grade: 'D'},
  {student: "thomppson", course: "graphql", grade: 'B'},
  {student: "patterson", course: "react", grade: 'A'},
  {student: "patterson", course: "angular", grade: 'C'},
  {student: "patterson", course: "mongo", grade: 'A'},
  {student: "patterson", course: "graphql", grade: 'C'},
  {student: "james", course: "mongo", grade: 'D'},
  {student: "james", course: "angular", grade: 'D'},
  {student: "james", course: "react", grade: 'A'},
  {student: "james", course: "graphql", grade: 'A'}
] 



// import { } from './database';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    // if (type === 'Game') {
    //   return getGame(id);
    // } else if (type === 'HidingSpot') {
    //   return getHidingSpot(id);
    // } else {
    //   return null;
    // }
  },
  (obj) => {
    // if (obj instanceof Game) {
    //   return gameType;
    // } else if (obj instanceof HidingSpot)  {
    //   return hidingSpotType;
    // } else {
    //   return null;
    // }
  }
);


let instructorType = new GraphQLObjectType({
  name: 'instructor',
  fields: ()=>({
    age: {type: GraphQLInt},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    gender: {type: GraphQLString},
  })
})


let linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => obj._id
    },
    title: {
      type: GraphQLString,
      args: {
        upcase: { type: GraphQLBoolean }
      },
      resolve: (obj, {upcase}) => upcase ? obj.title.toUpperCase() : obj.title
    },
    url: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.url.startsWith("http") ? obj.url : `http://${obj.url}`
      }
    },
    safe: {
      type: GraphQLBoolean,
      resolve: obj => obj.url.startsWith("https")
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: instructorConnection} =
  connectionDefinitions({name: 'instructor', nodeType: instructorType});

var {connectionType: linkConnection} =
  connectionDefinitions({name: 'Link', nodeType: linkType})


  var storeType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
      id: globalIdField('Store'),
      dummy: {
        type: GraphQLInt
      },
      links: {
        type: linkConnection,
        args: {
          ...connectionArgs,
          filter: {type: GraphQLString}
        },
        resolve: (obj, args) => {
          console.log(args.filter)
          console.log(obj.links)
          let newLinks = obj.links.filter(link => {
            return link.title.match(args.filter)
          })
          return connectionFromArray(newLinks || obj.links, args)
        }
      },
      instructors: {
        type: instructorConnection,
        args: {
          ...connectionArgs,
          filter: {type: GraphQLString}
        },
        resolve: (obj, args) => {
          console.log(obj.instructors)
          return connectionFromArray(obj.instructors, args)
        }
      },
      total: {
        type: GraphQLInt,
        resolve: (obj) => obj.links.length
      }
    }),
    interfaces: [nodeInterface]
  });

  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeField,
      store: {
        type: storeType,
        resolve: () => store
      }
    }),
  });

  export var Schema = new GraphQLSchema({
    query: queryType,
    // Uncomment the following after adding some mutation fields:
    // mutation: mutationType
  });
