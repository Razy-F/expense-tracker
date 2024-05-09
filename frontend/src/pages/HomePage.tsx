import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { MdLogout } from "react-icons/md";
import { Cards, TransactionForm } from "../components";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations";
import {
  GET_AUTHENTICATED_USER,
  GET_CATEGORY_STATISTICS,
} from "../graphql/queries";
import { useEffect, useState } from "react";

/* const chartData = {
  labels: ["Saving", "Expense", "Investment"],
  datasets: [
    {
      label: "%",
      data: [13, 8, 3],
      backgroundColor: [
        "rgba(75, 192, 192)",
        "rgba(255, 99, 132)",
        "rgba(54, 162, 235)",
      ],
      borderColor: [
        "rgba(75, 192, 192)",
        "rgba(255, 99, 132)",
        "rgba(54, 162, 235, 1)",
      ],
      borderWidth: 1,
      borderRadius: 30,
      spacing: 10,
      cutout: 130,
    },
  ],
}; */

ChartJS.register(ArcElement, Tooltip, Legend);

interface IDataSet {
  label: string;
  data: number[] | never[];
  backgroundColor: string[] | never[];
  borderColor: string[] | never[];
  borderWidth: number;
  borderRadius: number;
  spacing: number;
  cutout: number;
}
interface ChartState {
  labels: CategoryType[] | never[];
  datasets: IDataSet[];
}
const HomePage = () => {
  const { data } = useQuery<CategoryStatisticsData>(GET_CATEGORY_STATISTICS);
  const { data: authUser } = useQuery<UserData>(GET_AUTHENTICATED_USER);

  console.log("authUser:", authUser);
  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [chartData, setChartData] = useState<ChartState>({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmount = data.categoryStatistics.map(
        (stat) => stat.totalAmount
      );

      const backgroundsColors: string[] = [];
      const borderColors: string[] = [];
      categories.forEach((category) => {
        if (category === "saving") {
          backgroundsColors.push("rgba(75, 192, 192)");
          borderColors.push("rgba(75, 192, 192)");
        } else if (category === "expense") {
          backgroundsColors.push("rgba(255, 99, 132)");
          borderColors.push("rgba(255, 99, 132)");
        } else {
          backgroundsColors.push("rgba(54, 162, 235)");
          borderColors.push("rgba(54, 162, 235)");
        }
      });
      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmount,
            backgroundColor: backgroundsColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [data]);
  const handleLogout = async () => {
    try {
      const { data } = await logout();
      console.log("this the data from the logout() function", data);
      toast.success(data.logout.messege);
      client.resetStore();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error logging out:", error);
        toast.error(error.message);
      } else console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <div className="w-11 h-11 rounded-full border cursor-pointer bg-purple-600 flex items-center justify-center text-lg">
            <span className=" text-white font-extrabold">
              {authUser?.authUser.profilePicture}
            </span>
          </div>

          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {data?.categoryStatistics.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;
