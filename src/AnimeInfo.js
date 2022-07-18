import React, { useState } from 'react'
import { useQuery } from 'react-query'
import YouTube from 'react-youtube';
import RingLoader from "react-spinners/RingLoader";
import RiseLoader from "react-spinners/RiseLoader";
import { GiReturnArrow, GiFallingLeaf } from "react-icons/gi";
import { AiOutlineStar } from "react-icons/ai";
import { SiSpring } from "react-icons/si";
import { FaSun } from "react-icons/fa";
import { BsSnow2 } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { MdOutlineExpandMore, MdExpandLess } from "react-icons/md";
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title} from 'chart.js';
import { Bar } from 'react-chartjs-2';


export const AnimeInfo = ({goBack, animeID}) => {

    const [tabs, setTabs] = useState(1)
    const [moreChara, setMoreChara] = useState(false)
    const [moreStaffs, setMoreStaffs] = useState(false)
    const [moreRecs, setMoreRecs] = useState(false)
    const [chartData, setChartData] = useState([])
    const [lang, setLang] = useState("Japanese")

    const fetcherAnimeByID = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}`).then(res => res.json())
    const fetcherCharacterByID = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/characters`).then(res => res.json())
    const fetcherStaffByID = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/staff`).then(res => res.json())
    const fetcherRecommendations = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/recommendations`).then(res => res.json())
    const fetcherRelations = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/relations`).then(res => res.json())
    const fetcherStatistics = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/statistics`).then(res => res.json()).then(res => setChartData(res))
    
    const {data: anime, isLoading, isFetching} = useQuery("animeByID", fetcherAnimeByID, {
        refetchOnWindowFocus: false
    })

    const {data: chara, refetch: refetchChara, isFetching: fetchingChara, error: errorChara} = useQuery("characterByID", fetcherCharacterByID, {
        enabled: false,
        cacheTime: Infinity,
        staleTime: Infinity
    })
    
    const {data: staff, refetch: refetchStaffs, isFetching: fetchingStaff, error: errorStaff} = useQuery("staffByID", fetcherStaffByID, {
        enabled: false,
        cacheTime: Infinity,
        staleTime: Infinity
    })
    
    const {data: recommendations, refetch: refetchRecs, isFetching: fetchingRecs, error: errorRecs} = useQuery("recommendations", fetcherRecommendations, {
        enabled: false,
        cacheTime: Infinity,
        staleTime: Infinity
    })
    
    const {data: relations} = useQuery("relations", fetcherRelations, {
        refetchOnWindowFocus: false
    })
    
    const {data: statistics} = useQuery("statistics", fetcherStatistics, {
        refetchOnWindowFocus: false
    })

    if(isLoading || isFetching) {
        return(
            <div className='bg-black h-screen'>
                <h1 className='text-black'>Please Wait</h1>
                <RingLoader color={"#ff6740"} loading={isLoading || isFetching} size={150} className="flex mx-auto mt-[460px]" />
            </div>
        )
    }

    const opts = {
        height: '420',
        width: '852',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        },
      };

    let toChara = 8;
    let toStaffs = 9;
    let toRecs = 15;

    if (moreChara == true) {
        toChara = 24
    }
    
    if (moreStaffs == true) {
        toStaffs = 27
    }
    
    if (moreRecs == true) {
        toRecs = 45
    }

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
    <div className=' '>
        { anime || chara || staff || recommendations || relations || statistics ? (
            <div>
                <img src={anime.data.images.jpg.large_image_url} alt={anime.data.title} className="object-cover max-h-[600px] w-full blur-sm items-center absolute -z-30 -mt-3 scale-100 brightness-75 backdrop-contrast-0 border-x-[3px] border-black backdrop-blur-none backdrop-grayscale-0 backdrop-hue-rotate-0 backdrop-opacity-100 backdrop-saturate-100 backdrop-filter" />
                <div className='mx-52'>
                {/* nav */}
                    <div className='flex flex-row pt-6'>
                    <p onClick={goBack} className="text-white font-bold text-3xl hover:text-liteOrange transition duration-200 cursor-pointer flex flex-1"><GiReturnArrow className="text-liteOrange"/>&nbsp;Go back</p>
                    </div>
                    {/* start header */}
                    <div className='flex flex-row py-8 -mt-4 select-none'>
                        <div className='flex flex-col pt-3'>
                            <img className='rounded-lg min-w-[225px] max-w-[226px] h-[335px] flex flex-none' src={anime.data.images.jpg.image_url} alt={anime.data.title}/>
                        </div>
                        <div className='text-white font-poppins flex flex-col pl-4 gap-2 text-sm mt-2'>
                            <h1 className='text-7xl font-extrabold flex flex-wrap'>{anime.data.title ? <h1>{anime.data.title}</h1> : <h1>N/A</h1>}</h1>
                            <h1 className='text-3xl mt-3 font-bold flex flex-wrap'>{anime.data.title_japanese ? <h1>{anime.data.title_japanese}</h1> : <h1>N/A</h1>}</h1>
                            <div className='flex flex-1'></div>
                                <h1 className='font-semibold flex flex-inline text-2xl font-poppins select-none'>{anime.data.studios.length >= 1 ? <h1>{anime.data.studios.slice(0,1).map(produce => (<span>{produce.name} </span>))}</h1> : <h1>N/A</h1>}</h1>
                            <div className='flex flex-row gap-2'>
                                <h1 className='text-2xl mt-2 font-semibold flex flex-inline w-max h-min bg-liteOrange px-2 shadow-md shadow-orange-800 py-2 rounded-md items-center'>Ranked #{anime.data.rank ? <h1>{anime.data.rank}</h1> : <h1>N/a</h1>}</h1>
                                <h1 className='text-2xl mt-2 font-semibold flex flex-inline w-max h-min bg-liteOrange px-2 shadow-md shadow-orange-800 py-2 rounded-md items-center'>Popularity #{anime.data.popularity ? <h1>{anime.data.popularity}</h1> : <h1>N/a</h1>}</h1>
                                <div className='flex flex-row w-min h-min bg-liteOrange px-2 shadow-md shadow-orange-800 py-2 rounded-lg mt-2'>
                                    <h1 className='text-2xl font-semibold flex flex-inline items-center'><AiOutlineStar className='scale-150 mr-2'/>{anime.data.score ? <h1>{anime.data.score}</h1> : <h1>N/A</h1>}</h1>
                                    <div className='h-8 w-[3px] bg-white ml-1.5'></div>
                                    <div className='flex flex-col ml-1.5 w-max flex-wrap  justify-start'>
                                        <h1 className='text-xs font-semibold'>by&nbsp;{anime.data.scored_by ? <h1>{anime.data.scored_by} users</h1> : <h1></h1>}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Genre, status, etc. */}
                <div className='font-poppins text-white bg-liteBlack -mt-24 absolute h-min -z-20 w-[100%]'>
                    <div className='mx-52 mt-[77px] select-none'>
                        <div className='flex flex-row gap-2 items-center font-poppins text-sm'>
                            <div className='w-[234px]'></div>
                            <h1 className={anime.data.season == "spring" ? "flex flex-inline items-center bg-[#dcfe0091] rounded-lg px-3 py-1": anime.data.season == "fall" ? "flex flex-inline items-center bg-amber-700 rounded-lg px-3 py-1": anime.data.season == "summer" ? "flex flex-inline items-center bg-orange-400 rounded-lg px-3 py-1" : "flex flex-inline items-center bg-blue-400 rounded-lg px-3 py-1" }>{anime.data.season == "spring" ? <SiSpring className='mr-1'/> : <h1></h1>}{anime.data.season == "fall" ? <GiFallingLeaf className='mr-1'/> : <h1></h1>}{anime.data.season == "summer" ? <FaSun className='mr-1'/> : <h1></h1>}{anime.data.season == "winter" ? <BsSnow2 className='mr-1'/> : <h1></h1>}{anime.data.season ? <h1 className='capitalize'>{anime.data.season}</h1> : <h1></h1>}&nbsp;{anime.data.year ? <h1>{anime.data.year}</h1> : <h1>N/A</h1>}</h1>
                            <h1 className='flex flex-inline w-max  bg-grey rounded-lg px-3 py-1'>{anime.data?.rating ? <h1 className={anime.data?.rating.includes("Hentai") ? "text-red-600 font-semibold" : ""}>{anime.data?.rating}</h1> : <h1>N/A</h1>}</h1>
                            <h1 className='flex flex-inline w-max  bg-grey rounded-lg px-3 py-1'>Type:&nbsp; {anime.data.type ? <h1>{anime.data.type}</h1> : <h1>N/A</h1>}</h1> 
                            <h1 className='flex flex-inline w-max  bg-grey rounded-lg px-3 py-1'>Eps:&nbsp; {anime.data.episodes ? <h1>{anime.data.episodes}</h1> : <h1>N/A</h1>}</h1> 
                            {anime.data?.genres.length > 0 ? anime.data?.genres.slice(0,3).map(genre => (<span className=' bg-grey rounded-lg px-3 py-1 flex flex-inline'>{genre.name}</span>)) : <h1></h1>}
                            <h1 className='flex flex-inline items-center'><GoPrimitiveDot className={anime.data.status == "Finished Airing" ? 'scale-125 mr-1 text-blue-500': anime.data.status == "Currently Airing" ? 'scale-125 mr-1 text-green-500' : 'scale-125 mr-1 text-yellow-500'}/>{anime.data.status ? <h1>{anime.data.status}</h1> : <h1>N/A</h1>}</h1>
                        </div>

                        {/* Synopsis */}
                        <div className='flex flex-col bg-liteBlack rounded-b-lg text-white mt-8'>
                            <h1 className='text-lg pt-3 text-justify'>{anime.data?.synopsis}</h1>
                        </div>

                        {/* Tabs Selection */}
                        <div className='flex flex-row text-white text-lg my-10 w-[570px] h-14 justify-center items-center bg-grey font-poppins cursor-pointer'>
                            <h1 className={tabs === 1 ? 'block bg-liteGrey w-max h-max px-4 py-2 font-bold':'bg-grey w-max h-max px-4 py-2 font-bold hover:opacity-80'} onClick={() => setTabs(1)}>Info</h1>
                            <h1 className={tabs === 2 ? 'block bg-liteGrey w-max h-max px-4 py-2 font-bold':'bg-grey w-max h-max px-4 py-2 font-bold hover:opacity-80'} onClick={() => {setTabs(2); refetchChara(); refetchStaffs()}}>Characters & Staffs</h1>
                            <h1 className={tabs === 3 ? 'block bg-liteGrey w-max h-max px-4 py-2 font-bold':'bg-grey w-max h-max px-4 py-2 font-bold hover:opacity-80'} onClick={() => {setTabs(3); refetchRecs()}}>Reccomendations</h1>
                            <h1 className={tabs === 4 ? 'block bg-liteGrey w-max h-max px-4 py-2 font-bold':'bg-grey w-max h-max px-4 py-2 font-bold hover:opacity-80'} onClick={() => setTabs(4)}>Trailer</h1>
                        </div>

                        {/* Info */}
                        <div className={tabs === 1 ? 'flex flex-row text-white font-poppins mb-32 gap-4 justify-center' : 'hidden'}>
                            <div className='flex flex-col'>
                                <div className=" text-white bg-grey px-5 py-4 rounded-2xl w-max-[700px] h-min text-start">
                                    <h1  className='text-3xl font-bold'>General</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap mt-6 items-center'>Title:&nbsp; {anime.data.title ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.title}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Japanese Title:&nbsp; {anime.data.title_japanese ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.title_japanese}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Type:&nbsp; {anime.data.type ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.type}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Episodes:&nbsp; {anime.data.episodes ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.episodes}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Status:&nbsp; {anime.data.status ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.status}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Source:&nbsp; {anime.data.source ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.source}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Air Time:&nbsp; {anime.data.aired ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.aired.string}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Aired From:&nbsp; {anime.data.aired.from ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.aired.from.slice(0,10)}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Aired To:&nbsp; {anime.data.aired.to ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.aired.to.slice(0,10)}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Duration:&nbsp; {anime.data.duration ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.duration}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Rating:&nbsp; {anime.data.rating ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.rating}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Score:&nbsp; {anime.data.score ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.score}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Rank:&nbsp; {anime.data.rank ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.rank}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Popularity:&nbsp; {anime.data.popularity ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.popularity}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Members:&nbsp; {anime.data.members ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.members}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Favorites:&nbsp; {anime.data.favorites ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.favorites}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Season:&nbsp; {anime.data.season ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.season}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Year:&nbsp; {anime.data.year ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.year}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2'>Broadcast:&nbsp; {anime.data.broadcast ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.broadcast.string}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2 gap-2'>Genre:&nbsp; {anime.data?.genres.length > 0 ? anime.data?.genres.slice(0,5).map(genre => (<span className='bg-liteGrey px-2 rounded-lg font-normal text-lg '>{genre.name}</span>)) : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2 gap-2'>Themes:&nbsp; {anime.data.themes ? <h1>{anime.data.themes.map(theme => (<span className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{theme.name}</span>))}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    <h1 className='text-xl font-semibold flex flex-wrap items-center mt-2 gap-2'>Demographic:&nbsp; {anime.data.demographics ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{anime.data.demographics.map(demographic => (<h1>{demographic.name}</h1>))}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                </div>
                                <div className='flex flex-col mt-6'>
                                    <div className='text-white bg-grey px-5 py-3 rounded-2xl h-min'>
                                        <h1 className='text-3xl font-bold'>Production</h1>
                                        <h1 className='text-2xl font-bold mt-4 '>Producers</h1>
                                        <h1 className='mb-5 flex flex-col'>{anime.data.producers.length >= 1 ? <h1>{anime.data.producers.map(produce => (<span className='bg-liteGrey px-2 rounded-lg font-normal text-lg w-max ml-4 flex flex-wrap my-2 py-1 '>{produce.name}</span>))}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                        <h1 className='text-2xl font-bold '>Studios</h1>
                                        <h1 className='mb-5 flex flex-col'>{anime.data.studios.length >= 1 ? <h1>{anime.data.studios.map(produce => (<span className='bg-liteGrey px-2 rounded-lg font-normal text-lg w-max ml-4 flex flex-wrap my-2 py-1'>{produce.name}</span>))}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                        <h1 className='text-2xl font-bold '>Licensors</h1>
                                        <h1 className='mb-5 flex flex-col'>{anime.data.licensors.length >= 1 ? <h1>{anime.data.licensors.map(produce => (<span className='bg-liteGrey px-2 rounded-lg font-normal text-lg w-max ml-4 flex flex-wrap my-2 py-1'>{produce.name}</span>))}</h1> : <h1 className='text-md font-normal'>N/A</h1>}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-6'>
                                {relations?.data?.length >= 1 ? 
                                <div className='flex flex-col text-white bg-grey px-5 py-4 rounded-2xl h-min w-max-[800px]'>
                                    <h1 className='text-3xl font-bold'>Relations</h1>
                                    <h1 className='mt-1 flex flex-wrap'>{relations?.data?.length >= 1 ? <h1 className='mt-3'>{relations?.data?.map(rels => (<div><h1 className='text-2xl font-bold'>{rels.relation}</h1><p className='ml-4'>{rels?.entry?.map(entries => <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg my-2 flex flex-wrap w-max py-1'>{entries?.name} ({entries?.type})</h1>)}</p></div>))}</h1> : <h1>N/A</h1>}</h1>
                                </div>
                                :<></>
                                }
                                <div className='flex flex-col text-white bg-grey px-5 py-4 rounded-2xl h-min gap-1'>
                                    <h1 className='text-3xl font-bold'>Statistics</h1>
                                    <h1 className='mt-4 flex flex-inline font-semibold items-center text-xl'>Watching:&nbsp; {chartData.data?.watching ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.watching}</h1> : <h1>N/A</h1>}</h1>
                                    <h1 className='flex flex-inline font-semibold items-center text-xl'>Completed:&nbsp; {chartData.data?.completed ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.completed}</h1> : <h1>N/A</h1>}</h1>
                                    <h1 className='flex flex-inline font-semibold items-center text-xl'>On Hold:&nbsp; {chartData.data?.on_hold ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.on_hold}</h1> : <h1>N/A</h1>}</h1>
                                    <h1 className='flex flex-inline font-semibold items-center text-xl'>Dropped:&nbsp; {chartData.data?.dropped ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.dropped}</h1> : <h1>N/A</h1>}</h1>
                                    <h1 className='flex flex-inline font-semibold items-center text-xl'>Plan To Watch:&nbsp; {chartData?.data?.plan_to_watch ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.plan_to_watch}</h1> : <h1>N/A</h1>}</h1>
                                    <h1 className='flex flex-inline font-semibold items-center text-xl'>Total:&nbsp; {chartData.data?.total ? <h1 className='bg-liteGrey px-2 rounded-lg font-normal text-lg'>{chartData.data.total}</h1> : <h1>N/A</h1>}</h1>
                                    <h1 className='flex justify-center font-semibold items-center text-2xl mt-8 mb-4 flex-wrap'>{anime.data?.title} Score [{anime.data?.score}] of {anime.data?.scored_by} Votes</h1>
                                    <Bar data={barData} options={options} className="min-w-[600px]" />
                                </div>
                            </div>



                        </div>

                        {/* Characters & Staffs */}
                        { fetchingChara || fetchingStaff ? <div className='bg-liteBlack h-screen flex justify-center mt-36'><RiseLoader color={"#ff6740"} loading={fetchingChara || fetchingStaff} size={30}/></div>:
                        <div className={tabs === 2 ? 'block' : 'hidden'}>
                            <div className='text-white flex flex-col mx-auto bg-grey px-5 py-4 rounded-lg col-span-3 font-poppins'>
                                <div className='flex flex-row'>
                                <h1 className='text-2xl font-bold'>Characters</h1>
                                <div className='flex flex-1'></div>
                                <h1 className='text-xl font-semibold'>Select Language</h1>
                                </div>
                                <div className='grid grid-cols-2 gap-2 mt-8'>
                                {chara?.data ? chara.data.slice(0, toChara).map((characters) => {
                                    return <div>
                                        <div className='flex flex-row bg-liteGrey h-full'>
                                            <img src={characters.character.images.jpg.image_url} alt="" className="w-1/6 mr-2" />
                                            <div className='flex flex-1 flex-col'>
                                            <h1 className='font-semibold text-lg mt-1'>{characters.character.name}</h1>
                                            <h1 className='mt-1'>{characters.role}</h1>
                                            </div>
                                            {characters.voice_actors.filter(languages => languages.language == lang).slice(0,1).map(filteredVa => (<>
                                                <div className='flex flex-col text-end'>
                                                <h1 className='font-semibold text-lg mt-1'>{filteredVa.person.name}</h1>
                                                <h1 className='mt-1'>{filteredVa.language}</h1>
                                                </div>
                                                <img src={filteredVa.person.images.jpg.image_url} alt="" className="w-1/6 ml-2" />
                                                </>))}
                                        </div>
                                    </div>})

                                    :<h1>N/A</h1>
                                }
                                {
                                moreChara == false ?
                                <MdOutlineExpandMore className='flex mx-auto col-span-2 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreChara(!moreChara)}/>
                                :
                                <MdExpandLess className='flex mx-auto col-span-2 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreChara(!moreChara)}/>
                                }
                                </div>
                            </div>
                            <div className='text-white flex flex-col mx-auto bg-grey px-5 py-4 rounded-lg col-span-3 font-poppins mt-6 mb-32'>
                                <h1 className='text-2xl font-bold w-max'>Staffs</h1>
                                <div className='grid grid-cols-3 gap-2 mt-8'>
                                {staff?.data ? staff.data.slice(0, toStaffs).map((staffs) => {
                                    return <div>
                                        <div className='flex flex-row bg-liteGrey h-full rounded-lg'>
                                            <img src={staffs.person.images.jpg.image_url} alt="" className="w-[20%] mr-2" />
                                            <div className='flex flex-1 flex-col'>
                                            <h1 className='font-semibold text-lg mt-1'>{staffs.person.name}</h1>
                                            <h1 className='mt-1'>{staffs.positions.slice(0,4).map(position => <div className='flex flex-col'>{position}</div>)}</h1>
                                            </div>
                                        </div>
                                    </div>})
                                    :<h1>N/A</h1>
                                }
                                {
                                moreStaffs == false ?
                                <MdOutlineExpandMore className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreStaffs(!moreStaffs)}/>
                                :
                                <MdExpandLess className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreStaffs(!moreStaffs)}/>
                                }
                                </div>
                            </div>
                        </div>
                        }

                        {/* Reccomendations */}
                        { fetchingRecs ? <div className='bg-liteBlack h-screen flex justify-center mt-36'><RiseLoader color={"#ff6740"} loading={fetchingRecs} size={30}/></div>:
                        <div className={tabs === 3 ? 'block' : 'hidden'}>
                            <div className='text-white flex flex-col mx-auto bg-grey px-5 py-4 rounded-lg col-span-3 w-full mb-52'>
                                <h1 className='text-2xl font-bold text-white  w-max'>Recommendations</h1>
                                <div className='grid grid-cols-3 gap-2 mt-8'>
                                {recommendations?.data ? recommendations.data.slice(0, toRecs).map((recs) => {
                                    return <div>
                                        <div className='flex flex-row bg-opacity-50 h-full bg-liteGrey rounded-lg'>
                                            <img src={recs.entry.images.jpg.image_url} alt="" className="w-[30%] mr-2" />
                                            <div className='flex flex-1 flex-col'>
                                                <h1 className='font-semibold text-2xl'>{recs.entry.title}</h1>
                                                <h1 className='text-xl'>Votes: {recs.votes}</h1>
                                            </div>
                                        </div>
                                    </div>})
                                    :<h1>N/A</h1>
                                }
                                {
                                moreRecs == false ?
                                <MdOutlineExpandMore className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreRecs(!moreRecs)}/>
                                :
                                <MdExpandLess className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreRecs(!moreRecs)}/>
                                }
                                </div>
                            </div>
                        </div>
                        }

                        {/* Trailer */}
                        <div className={tabs === 4 ? 'flex mb-32 flex-col' : 'hidden'}>
                            <h1 className='text-2xl mx-auto font-bold mt-2 bg-liteGrey px-3 py-1 rounded-lg w-max'>{anime.data.title}&nbsp;Trailer</h1>
                            <YouTube videoId={anime.data?.trailer.youtube_id} opts={opts} className="mr-4 mt-10 flex justify-center" />
                        </div>
    
                    </div>
                </div>
            </div>

            
        )
        : <h1>Loading...</h1>
        }
    </div>
  )
}
