import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Navbar from "../components/navbar";
import { api } from "../utils/api";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface ResultItem {
  date: string;
  workedTime: number;
  subjectName: string;
}

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day}-${month}-${year}`;
};

function groupByDate(subject: { Times: any }, name: string): ResultItem[] {
  const result: { [date: string]: number } = {};
  {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  }

  subject.Times.forEach(
    (time: { date: string | number; workedTime: number }) => {
      if (result[time.date]) {
        result[time.date] += time.workedTime;
      } else {
        result[time.date] = time.workedTime;
      }
    }
  );
  return Object.entries(result).map(([date, workedTime]) => ({
    date,
    workedTime,
    subjectName: name,
  }));
}

function createBigArrat(data: string | any[] | undefined) {
  if (data == undefined) {
    return [];
  }

  const bigArray = [];
  for (let i = 0; i < data.length; i++) {
    bigArray.push(groupByDate(data[i], data[i].name));
  }
  return bigArray;
}

function returnNames(data: string | any[] | undefined) {
  if (data == undefined) {
    return [];
  }
  const names = [];
  for (let i = 0; i < data.length; i++) {
    names.push(data[i].name);
  }
  return names;
}

type WorkedTimeByDate = {
  [date: string]: {
    [subjectName: string]: number;
  };
};

function groupWorkedTimeByDate(data: any[]): WorkedTimeByDate[] {
  const groupedData: WorkedTimeByDate = {};

  // Iterate over each subject data array
  for (const subjectData of data) {
    // Iterate over each object in the subject data array
    for (const { date, workedTime, subjectName } of subjectData) {
      // If the date is not yet in the grouped data object, add it
      if (!groupedData[date]) {
        groupedData[date] = {};
      }

      // Add or update the worked time for the current subject and date
      if (groupedData[date][subjectName]) {
        groupedData[date][subjectName] += workedTime;
      } else {
        groupedData[date][subjectName] = workedTime;
      }
    }
  }

  // Convert the grouped data object to an array of objects
  return Object.entries(groupedData).map(([date, values]) => ({
    date,
    ...values,
  }));
}

const Dashboard: NextPage = () => {
  const { data } = api.asignaturas.getUserTimes.useQuery();

  if (data == undefined) {
    return (
      <>
        <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="container mx-auto mt-4 flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="mb-4 pt-2 text-center text-4xl font-bold">
            No hay datos
          </h1>
        </main>
      </>
    );
  }

  const dd = data.map[0]?.Subjects;

  const bigArray = createBigArrat(dd);

  const groupedData = groupWorkedTimeByDate(bigArray);

  console.log(groupedData);

  const names = returnNames(dd);

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto mt-4 flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-4 pt-2 text-center text-4xl font-bold">Dashboard</h1>
        <h2 className="mb-4 pt-2 text-center text-2xl font-bold">
          Tiempo total:
        </h2>

        <ResponsiveContainer width="100%" height={400} className="text-black">
          <BarChart
            width={500}
            height={300}
            data={groupedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis
              tickFormatter={(value: string) => {
                let minutes = parseInt(value);
                const hours = Math.floor(minutes / 60);
                minutes %= 60;
                return `${hours}h ${minutes}m`;
              }}
            />

            <Tooltip
              formatter={(value) => {
                let minutes = parseInt(value.toString());
                const hours = Math.floor(minutes / 60);
                minutes %= 60;
                return `${hours}h ${minutes}m`;
              }}
              labelFormatter={formatDate}
            />
            <Legend />
            {names.map((name, index) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="a"
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </main>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/unauth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
