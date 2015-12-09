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

let instructors =[
  {firstName: "joe", lastName: "sanders", age: 24, gender: "male"},
  {firstName: "sue", lastName: "thomas", age: 25, gender: "female"},
  {firstName: "cade", lastName: "nichols", age: 29, gender: "male"},
  {firstName: "bob", lastName: "sturick", age: 41, gender: "male"},
]

let courses = [
  {courseName: 'react', instructor: 0},
  {courseName: 'angular', instructor: 1},
  {courseName: 'mongo', instructor: 2},
  {courseName: 'graphql', instructor: 3},
]

let students =[
  {firstName: "ryan", lastName: "myers", age: 24, gender: "male", level: "sophomore"},
  {firstName: "ashley", lastName: "thomppson", age: 25, gender: "female", level: "senior"},
  {firstName: "rich", lastName: "patterson", age: 29, gender: "male", level: "freshman"},
  {firstName: "joanna", lastName: "james", age: 41, gender: "female", level: "junior"},
]


let grades = [
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
  // {student: "james", course: "graphql", grade: 'A'}
]


let instructorType = new GraphQLObjectType({
  name: 'instructor',
  fields: ()=>({
      age: {type: GraphQLInt},
      firstName: {type: GraphQLString},
      lastName: {type: GraphQLString},
      gender: {type: GraphQLString},
  })
})

let courseType = new GraphQLObjectType({
  name: 'courses',
  fields: ()=>({
    courseName: {type: GraphQLString},
    instructor: {
      type: instructorType,
      resolve: (obj)=>{

        return instructors[obj.instructor];
      }
    },
    grade: {type: GraphQLString}
  })
})

let studentType = new GraphQLObjectType({
  name: 'student',
  fields: ()=>({
      age: {type: GraphQLInt},
      firstName: {type: GraphQLString},
      lastName: {type: GraphQLString},
      gender: {type: GraphQLString},
      level: {type: GraphQLString},
      courses: {
        type: new GraphQLList(courseType),
        resolve: (obj)=>{
          let classNames = [];
          let gradeList = grades.filter((grade)=>{
            return grade.student === obj.lastName
          })

          gradeList.forEach((grade)=>{
            classNames.push(grade.course)
          })
          let currCourses = courses.filter(course=> classNames.indexOf(course.courseName) > -1)
          return currCourses.map(course=>{
            gradeList.forEach(grade => {
              if(grade.course===course.courseName){
                course.grade = grade.grade
              }
            })
            return course
          })
      }
  }})
})


let linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
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
  })
});


let counter = 0;

let schema = new GraphQLSchema({
  // top level fields
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      counter: {
        type: GraphQLInt,
        resolve: () => counter
      },

      square: {
        type: GraphQLInt,
        args: {
          num: { type: GraphQLInt }
        },
        resolve: (_, {num}) => num * num
      },

      links: {
        type: new GraphQLList(linkType),
        args: {
          first: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: (_, {first}) => links.slice(0, first)
      },
      courses: {
        type: new GraphQLList(courseType),
        resolve: ()=>courses
      },


      students: {
        type: new GraphQLList(studentType),
        resolve: ()=> students
      },
      allInstructors: {
        type: new GraphQLList(instructorType),
        args: {
          filter: {type: GraphQLString}
        },
        resolve: (_,{filter}) => {return filter ? instructors.filter((instructor)=>{
              return instructor.firstName === filter || instructor.lastName ===filter || instructor.gender ===filter
        }) : instructors
      }
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
          counter = counter + delta;
          return counter;
        }
      },
      createLink: {
        type: linkType,
        args: {
          title: {type: GraphQLString},
          url: {type: GraphQLString},
        },
        resolve: (_, {title, url}) => {
          let newLink = {title, url, id: Date.now()};
          links.push(newLink);
          return newLink;
        }
      }
    })
  })
});

export default schema;
