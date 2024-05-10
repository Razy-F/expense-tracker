import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations";
import toast from "react-hot-toast";
import { GET_AUTHENTICATED_USER } from "../graphql/queries";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
  // Add more categories and corresponding color classes as needed
};

const Card = ({
  transaction: {
    _id,
    category,
    amount,
    location,
    date,
    paymentType,
    description,
  },
}: {
  transaction: Transaction;
}) => {
  description = description[0]?.toUpperCase() + description.slice(1);
  const categoryLabel = category[0]?.toUpperCase() + category.slice(1);
  const formattedDate = formatDate(date);
  const cardClass = categoryColorMap[category];

  const { data, loading: userAuthLoading } = useQuery<UserData>(
    GET_AUTHENTICATED_USER
  );
  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["GetTransactions", "GetCategoryStatistics"],
  });

  const handleDelete = async () => {
    try {
      await deleteTransaction({
        variables: {
          transactionId: _id,
        },
      });
      toast.success("Transaction deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else console.error(error);
    }
  };

  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">{categoryLabel}</h2>
          <div className="flex items-center gap-2">
            {!loading && (
              <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
            )}
            {loading && (
              <div className="size-6 border-t-2 border-b-2 rounded-full animate-spin"></div>
            )}
            <Link to={`/transaction/${_id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {description}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: ${amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          {location ? `Location:${location}` : ""}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">{formattedDate}</p>
          <div className="w-11 h-11 rounded-full border cursor-pointer shadow-md bg-black/35 flex items-center justify-center text-lg">
            {loading ? (
              <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
            ) : (
              <span className=" text-white font-bold">
                {data?.authUser.profilePicture}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
