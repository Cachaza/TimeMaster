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
  {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  }
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
    return <div>Cargando...</div>;
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
