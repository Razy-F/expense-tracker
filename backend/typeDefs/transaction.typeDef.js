const transactiontypeDef = `
    type Transaction {
        _id: ID!
        userId: ID!
        description: String!
        paymentType: paymentType!
        category: CategoryType!
        amount: Float!
        location: String
        date: String!
    }    

    type Query {
        transactions: [Transaction!]
        transaction(transactionId:ID):Transaction
    }

    type Mutation {
        createTransaction(input: createTransactionInput!):Transaction!
        updateTransaction(input: updateTransaction!):Transaction!
        deleteTransaction(transactionId: ID!):Transaction!
    }

    input createTransactionInput {                
        description: String!
        paymentType: paymentType!
        category: CategoryType!
        amount: Float!
        location: String
        date: String!
    }
    
    input updateTransaction {                
        transactionId:ID!
        description: String
        paymentType: paymentType
        category: CategoryType
        amount: Float
        location: String
        date: String
    }
    
    enum CategoryType {
        savings,
        expense,
        investment
    }
    
    enum paymentType {
        card,
        cash,        
    }

`;

export default transactiontypeDef;
