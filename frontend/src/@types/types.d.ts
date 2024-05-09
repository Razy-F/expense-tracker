type TransactionData = {
  transactions: Transaction;
};
type Transaction = {
  _id: string;
  userId?: string;
  description: string;
  paymentType: PaymentType;
  category: CategoryType!;
  amount: number;
  location?: string;
  date: string;
};
type CategoryStatisticsData = {
  categoryStatistics: {
    category: CategoryType;
    totalAmount: number;
  }[];
};
type CategoryType = "saving" | "expense" | "investment";
type PaymentType = "card" | "cash";

type UserData = {
  authUser: User;
};

type User = {
  _id: string;
  username: string;
  name: string;
  password: string;
  profilePicture: string;
  gender: "female" | "male";
};
