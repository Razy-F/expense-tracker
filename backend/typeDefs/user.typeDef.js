/*
essential type on each graphql schema, and its responsibility is to define the entry points to the graph and specify return types for those entry points.
for example if we want users to be able to query the Users data that we have and get back a list of Users then we need to specify that inside this query type so we make a field called users and tell graphql that we expect the return type of this entry point to be a list of Users ( users: [User])
*/
/* Type:
The type keyword is used to define GraphQL object types, which represent the shape of data that can be queried.
Object types are used to define the fields available on a GraphQL object and the types of those fields.
They are primarily used to define the structure of data that clients can query.

type User {
  id: ID!
  name: String!
  email: String!
}


Input:
The input keyword is used to define input object types in GraphQL.
Input object types are used to represent complex input arguments to GraphQL operations, such as mutations.
They are similar to object types but are used specifically for passing data into GraphQL operations, rather than for querying data.

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}
 */

const usertypeDef = `#graphql
type User {
    _id:ID!
    username:String!
    name:String!
    password:String!
    profilePicture:String
    gender:String!
}

type Query {
    users: [User!]
    authUser: User
    user(userId: ID!):User
}
type Mutation {
    signUp(input: SignUpInput!):User
    login(input: LoginInput!) :User
    logout:LogoutResponse
}
input SignUpInput {
    username: String!
    name: String!
    password: String!
    gender: String!
}
input LoginInput {
    username: String!
    password: String!
}
type LogoutResponse {
    messege: String!
}
`;

export default usertypeDef;
