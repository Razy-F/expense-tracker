type TransactionData = {
  transactions: Transaction[];
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

type CategoryType = "saving" | "expense" | "investment";
type PaymentType = "card" | "cash";
