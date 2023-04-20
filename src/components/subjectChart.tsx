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

interface Props {
  subjectId: string;
  startDate: Date;
  endDate: Date;
  subjectName: string;
}

interface ResultItem {
  date: string;
  workedTime: number;
}

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day}-${month}-${year}`;
};

function groupByDate(map: { map: any }): ResultItem[] {
  const result: { [date: string]: number } = {};

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  map.map.forEach((item: { Subjects: { Times: any[] }[] }) => {
    item.Subjects.forEach((subject: { Times: any[] }) => {
      subject.Times.forEach(
        (time: { date: string | number; workedTime: number }) => {
          if (result[time.date]) {
            result[time.date] += time.workedTime;
          } else {
            result[time.date] = time.workedTime;
          }
        }
      );
    });
  });
  return Object.entries(result).map(([date, workedTime]) => ({
    date,
    workedTime,
  }));
}

function rellenarArray(
  inputArray: { date: string; workedTime: number }[],
  startDate: Date,
  lastDate: Date
): { date: string; workedTime: number }[] {
  const sortedInputArray = inputArray.sort((a, b) =>
    a.date.localeCompare(b.date)
  ); // sort the array by date

  const firstDate = new Date(startDate);
  //lastDate.setDate(lastDate.getDate() + 1);

  const outputArray: { date: string; workedTime: number }[] = [];

  const currentDate = new Date(firstDate.getTime()); // start with the first date
  while (currentDate <= lastDate) {
    // loop through all dates between the first and last date
    const dateString = currentDate.toISOString().substr(0, 10); // format the date as yyyy-mm-dd
    const workedTime =
      sortedInputArray.find((entry) => entry.date === dateString)?.workedTime ??
      0; // find the entry in the input array for the current date, or default to 0 if not found
    outputArray.push({ date: dateString, workedTime }); // add the entry to the output array
    currentDate.setDate(currentDate.getDate() + 1); // move to the next day
  }

  //outputArray.push({ date: lastDate.toISOString().substr(0, 10), workedTime: sortedInputArray[sortedInputArray.length - 1].workedTime }); // add the last date to the output array

  return outputArray;
}

export default function SubjectChart({
  subjectId,
  startDate,
  endDate,
  subjectName,
}: Props) {
  const data = api.asignaturas.getUserSubjetTimes.useQuery({
    subjectId: subjectId,
    startDate: startDate,
    endDate: endDate,
  });

  if (data.data === undefined) {
    return (
      <div>
        <div className="container mx-auto -mt-20 flex min-h-screen flex-col items-center justify-center p-4">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  console.log(groupByDate(data.data));
  console.log(rellenarArray(groupByDate(data.data), startDate, endDate));

  return (
    <div className="col">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={500}
          height={300}
          data={rellenarArray(groupByDate(data.data), startDate, endDate)}
          className="text-black"
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

          <Bar dataKey="workedTime" fill="#8884d8" />
          <Area
            type="monotone"
            dataKey="workedTime"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-center text-xs text-gray-500">{subjectName}</div>
    </div>
  );
}
