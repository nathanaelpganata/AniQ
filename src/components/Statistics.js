import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const Statistics = ({animeID, anime}) => {
    const [chartData, setChartData] = useState([])

    const fetcherStatistics = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/statistics`).then(res => res.json()).then(res => setChartData(res))

    const {data: statistics} = useQuery("statistics", fetcherStatistics, {
        refetchOnWindowFocus: false,
        cacheTime: 0
    })

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const scorePercentage = chartData?.data?.scores?.map(score => score.votes)

    const options = {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false,
            text: 'Score Stats',
          },
        },
      };

    const barData = {
        labels: ["1", "2" ,"3" ,"4" ,"5", "6", "7", "8" ,"9" ,"10"],
        datasets: [
          {
            label: '# of Scores',
            data: scorePercentage,
            borderColor: 'rgba(255,130,80,155)',
            backgroundColor: 'rgba(255,103,64,255)',
          },
        ],
      };

    return (
        <div>
            <h1 className='text-3xl font-bold'>Statistics</h1> 
            <h1 className='mt-4 flex  font-semibold items-center text-xl'>Watching:&nbsp; {chartData.data?.watching ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.watching}</h1> : <h1>N/A</h1>}</h1>
            <h1 className='flex  font-semibold items-center text-xl'>Completed:&nbsp; {chartData.data?.completed ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.completed}</h1> : <h1>N/A</h1>}</h1>
            <h1 className='flex  font-semibold items-center text-xl'>On Hold:&nbsp; {chartData.data?.on_hold ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.on_hold}</h1> : <h1>N/A</h1>}</h1>
            <h1 className='flex  font-semibold items-center text-xl'>Dropped:&nbsp; {chartData.data?.dropped ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.dropped}</h1> : <h1>N/A</h1>}</h1>
            <h1 className='flex  font-semibold items-center text-xl'>Plan To Watch:&nbsp; {chartData?.data?.plan_to_watch ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.plan_to_watch}</h1> : <h1>N/A</h1>}</h1>
            <h1 className='flex  font-semibold items-center text-xl'>Total:&nbsp; {chartData.data?.total ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.total}</h1> : <h1>N/A</h1>}</h1>
            <h1 className='flex justify-center font-semibold items-center text-2xl mt-8 mb-4 flex-wrap'>{anime.data?.title} Score [{anime.data?.score}] of {anime.data?.scored_by} Votes</h1>
            <Bar data={barData} options={options} className="min-w-[600px]" />
        </div>
    )
}

export default Statistics