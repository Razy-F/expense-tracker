import { gql } from "@apollo/client";

/* GetTransaction => is the query name and the id is the variable that we pass in the frontend via gql const {data, loading} = useQuery(GET_TRANSACTION,{
    variables:{
        id
      }
    }) */
export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(transactionId: $id) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      _id
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;
