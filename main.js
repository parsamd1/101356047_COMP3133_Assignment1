const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const mongo_connection=require('./mongo_connection')
const userModel = require("./userModelMongo");
const empModel = require("./employeeModelMongo");


const typeDefs = gql`
  type User {
    username: String
    email: String
    password: String
  }

  type Employee {
    _id: String
    first_name: String
    last_name: String
    email: String
    gender: String
    salary: Float
  }

  type Query {
    login(username: String!, password: String!): User
    getAllEmployees: [Employee]
    searchEmployeeById(id: String!): Employee
  }

  type Mutation {
    signup(email: String!, username: String!, password: String!): User
    addEmployee1(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      salary: Float!
    ): Employee
    updateEmployeeById(
      id: String!
      first_name: String
      last_name: String
      email: String
      gender: String
      salary: Float
    ): Employee
    deleteEmployeeById(id: String!): Employee
  }
`;


const login=async ({username, password})=>{
    let user=null
    await userModel.findOne({username: username, password: password})
        .then((userFound)=>{
            user=userFound
            console.log(userFound)
        })
        .catch((e)=>{
            console.log(e)
        })
    return user
}

const allEmployees=async ()=>{
    let emps=[]
    await empModel.find({})
        .then((employees)=>{
            emps=employees
            console.log(employees)
        })
        .catch(e=>{
            console.log(e)
        })
    return emps
}

const getEmployeeById=async({id})=>{
    let theEmployee=null
    await empModel.findById(id)
        .then((emp)=>{
            theEmployee=emp
            console.log(emp)
        })
        .catch(e=>{
            console.log(e)
        })
    return theEmployee
}

const signup=async(args)=>{
    const {username, email, password}=args
    let userSaved=null
    const newObj=new userModel({username:username, email:email, password:password})
    await newObj.save()
        .then((data)=>{
            userSaved={...args}
            console.log(data)
        })
        .catch(e=>{
            console.log(e)
        })
    return userSaved
}

const addEmployee=async (args)=>{
    let employeeSaved=null
    const newObj=new empModel({...args})
    await newObj.save()
        .then(data=>{
            console.log(data)
            employeeSaved={...args}
        })
        .catch(e=>{
            console.log(e)
        })
    return employeeSaved
}

const updateEmployeeById=async (args)=>{
    const {id}=args
    const emp={
        first_name:args.first_name,
        last_name:args.last_name,
        email:args.email,
        gender:args.gender,
        salary:args.salary
    }
    let updatedEmployee=null
    await empModel.findByIdAndUpdate(id, {...emp}, {new:true}) //{new:true} returns the updated document
        .then((data)=>{
            console.log(data)
            updatedEmployee=data
        })
        .catch(e=>{
            console.log(e)
        })
    return updatedEmployee
}

const deleteEmployeeById=async ({id})=>{
    let deletedEmployee=null
    await empModel.findByIdAndDelete(id)
        .then((data)=>{
            deletedEmployee=data
            console.log(data)
        })
        .catch(e=>{
            console.log(e)
        })
    return deletedEmployee
}



// resolver goes here
const resolvers = {
    Query: {
        login: async (parent, { username, password }) => login({ username, password }),
        getAllEmployees: async () => allEmployees(),
        searchEmployeeById: async (parent, { id }) => getEmployeeById({ id }),
    },
    Mutation: {
        signup: async (parent, args) => signup(args),
        addEmployee1: async (parent, args) => addEmployee(args),
        updateEmployeeById: async (parent, args) => updateEmployeeById(args),
        deleteEmployeeById: async (parent, { id }) => deleteEmployeeById({ id }),
    },
};

async function startServer(){
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const app = express();
    await server.start()
    server.applyMiddleware({app});

    app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
}

startServer()