import mongoose from 'mongoose'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

let instructors = [
  {firstName: 'Cade', lastName: 'Nichols', age : 29, gender: 'Male'},
  {firstName: 'Jesse', lastName: 'Heaslip', age : 29, gender: 'Male'},
  {firstName: 'Nick', lastName: 'James', age : 29, gender: 'Male'},
  {firstName: 'Samer', lastName: 'Buna', age : 35, gender: 'Male'}
]

let courses = [
  {courseName: "CodingHouse", instructor: 1}, 
  {courseName: "Mongo", instructor: 2},
  {courseName: "Angular", instructor: 0},
  {courseName: "React", instructor: 3}
]
let students =[
  {firstName: "ryan", lastName: "myers", age: 24, gender: "male", level: "sophomore"},
  {firstName: "ashley", lastName: "thomppson", age: 25, gender: "female", level: "senior"},
  {firstName: "rich", lastName: "patterson", age: 29, gender: "male", level: "freshman"},
  {firstName: "joanna", lastName: "james", age: 41, gender: "female", level: "junior"}
] 



let courseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    courseName: {type: GraphQLString},
    instructor: {
      type: instructorType,
      resolve: (obj) => {
        console.log(obj)
        return instructors[obj.instructor]
      }
    }
  })
})

let studentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    age : {type: GraphQLInt},
    gender: {type: GraphQLString},
    level: {type: GraphQLString},
		courses: {
      type: new GraphQLList(courseType),
      resolve: (obj) => {
        console.log(obj)
      }
    }
  })
})


let instructorType = new GraphQLObjectType({
  name: "Instructor",
  fields: () => ({
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    age : {type: GraphQLInt},
    gender: {type: GraphQLString}
  })
})

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      test: {
        type: GraphQLInt,
        args : {
          num: {type: GraphQLInt}
        },
        resolve: (_, args) => args.num * args.num
      },
      allInstructors : {
        type: new GraphQLList(instructorType),
        args: {
          filter: {type: GraphQLString}
        },
        resolve: (_, {filter}) =>  {
         return filter ? instructors.filter( instructor => {
          return instructor.firstName === filter || instructor.lastName === filter || instructor.gender === filter
         }) : instructors
        }       
      },
      courses: {
        type: new GraphQLList(courseType),
        resolve: () => courses
      },
      students: {
        type: new GraphQLList(studentType),
        resolve: () => students
      },
      message: {
        type: GraphQLString,
        resolve: () => "Hello GraphQL"
      }
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      incrementCounter: {
        type: GraphQLInt,
        args: {
          delta: {type: GraphQLInt}
        },
        resolve: (_, {delta}) => {
          counter += delta;
          return counter;
        }
      }
      //createLink: {
      //  type: linkType,
      //  args: {
      //    title: {type: GraphQLString},
      //    url: {type: GraphQLString}
      //  },
      //  resolve: (_, {title, url}) => {
      //    let newLink = {title, url, id: Date.now()}
      //    links.push(newLink);
      //    return newLink;
      //  }
      //}

    }) 
  })
});


export default schema;
