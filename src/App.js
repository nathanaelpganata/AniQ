import React, { useState, useRef , useEffect} from 'react'
import './App.css';
import { useQuery } from 'react-query'
import { AnimeInfo } from './AnimeInfo';
import { MdOutlineClear } from "react-icons/md";
import RingLoader from "react-spinners/RingLoader";
import { motion } from 'framer-motion';

let API = ""
const API_AIRING = "https://api.jikan.moe/v4/top/anime?filter=airing"


const fetcher = (title) => {
  return fetch(API).then(res => res.json())
}
const fetcherHome = () => {
  return fetch(API_AIRING).then(res => res.json())
}


function App() {

  const [title, setTitle] = useState("")
  const [animeID, setAnimeID] = useState(0)
  const [isNull, setIsNull] = useState(null)
  const [sfw, setSfw] = useState(true)
  const [isHome, setIsHome] = useState(true)

  if(sfw === true) {
    API = `https://api.jikan.moe/v4/anime?q=${title}&sfw`
  } else {
    API = `https://api.jikan.moe/v4/anime?q=${title}`
  }

  const {data: airHome, refetch: fetchHome, isLoading: isLoadingHome} = useQuery("airHome", fetcherHome, {
    refetchOnWindowFocus: false,
    staleTime: 100000
  })

  const {data: animes, error, isLoading, refetch, isFetching} = useQuery("jikanAPI", () => fetcher(title), {

    
  })

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  if(error) {
    return error
  }

  if(isNull !== null) {
    return <AnimeInfo isNull={isNull} goBack={() => setIsNull(null)} animeID={animeID} title={title} setTitle={setTitle}/>
  }

  return (
    <div className="App bg-liteBlack h-max">
      <div className='flex flex-col'>
        <h1 onClick={() => {fetchHome();setIsHome(true)}} className="cursor-pointer">
        <motion.h1
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration:1}}
        className='md:text-7xl text-5xl flex justify-center pt-10 font-poppins text-white font-semibold'>Ani<p className='text-liteOrange'>`</p>Q</motion.h1>
        <p className='md:text-md text-sm font-light italic flex justify-center pt-1 font-poppins text-white'>A Brok💔n&nbsp;<p className='text-liteOrange'>Anime</p>&nbsp;Index</p>
        </h1>
        <div className='md:w-80 w-64 h-1 bg-liteOrange mx-auto opacity-70 m-2 rounded-lg'></div>
          <form className='flex justify-center pt-5 text-white items-center font-poppins' onSubmit={(e) => handleSubmit(e)}>
            <input type='input' value={title} onChange={(e) => setTitle(e.target.value)} className="border-liteOrange rounded-3xl border-2 md:w-[450px] sm:w-[300px] w-[225px] px-4 py-2.5 bg-transparent font-poppins outline-none text-white" placeholder='Title...'></input>
            {title.length >= 1 ? <MdOutlineClear className='text-xl text-liteOrange absolute ml-[105px] cursor-pointer scale-150' onClick={() => setTitle("")} /> : <h1></h1>}
            <motion.button
            initial={{scale: 1}}
            whileHover={{scale: 1.1}}
            onClick={() => {refetch(); setIsHome(false)}} className=" absolute md:ml-80 sm:ml-44 ml-24 border-2 rounded-3xl px-4 py-2 border-liteOrange bg-liteOrange hover:bg-orange-700 transition duration-200 text-xl" type='submit'>Go</motion.button>
            <button className='text-red-800 border-2 border-red-800 px-2 sm:w-[63px]  md:ml-5 sm:ml-6 ml-4 flex flex-inline rounded-lg hover:scale-95 duration-300 transition font-semibold sm:text-base text-sm' onClick={() => setSfw(!sfw)}>{sfw === true ? <h1>~SFW</h1> : <h1>NSFW</h1>}</button>
          </form>
          <RingLoader color={"#ff6740"} loading={isLoading || isFetching } size={200} className="flex mx-auto mt-56" />
      </div>
      <div className='grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 2xl:mx-72 xl:mx-40 lg:mx-40 md:mx-36 sm:mx-24 mx-10 gap-4 pt-10'>
        {
          isLoading || isFetching || animes.data.length < 1 ? <h1 className='text-red-700 flex justify-center text-4xl pt-72 col-span-4'>Not Found</h1>
          : isHome === true ? airHome?.data?.map((animeAir) => {
            return(
            <div className='grid font-poppins hover:scale-110 transition duration-200 hover:z-10 mb-4 text-white'>
              <p className="cursor-pointer" onClick={() => {setIsNull(!isNull); setAnimeID(animeAir.mal_id)}}>
                <img src={animeAir.images.jpg.image_url} alt={animeAir.title} className="lg:w-[225px] lg:h-[320px] rounded-lg"></img>
                <h1 className='pt-1 px-2 lg:text-lg font-medium flex flex-wrap'>{animeAir.title}&nbsp;{animeAir.year? <h1>({animeAir.year})</h1>: <h1></h1>}</h1>
              </p>
            </div>
            )
          })
          : animes?.data?.map((anime) => {
            return(
            <motion.div
            initial={{scale:1}}
            whileHover={{scale:1.2}}
            className='grid font-poppins transition duration-200 hover:z-10 mb-4 text-white'>
              <p className="cursor-pointer" onClick={() => {setIsNull(!isNull); setAnimeID(anime.mal_id)}}>
                <img src={anime.images.jpg.image_url} alt={anime.title} className="lg:w-[225px] lg:h-[320px] rounded-lg"></img>
                <h1 className='pt-1 px-2 lg:text-lg font-medium flex flex-wrap'>{anime.title}&nbsp;{anime.year? <h1>({anime.year})</h1>: <h1></h1>}</h1>
              </p>
            </motion.div>
            )
          })
        }

      </div>
      <footer className='mt-[1080px] text-white text-lg'>
        Powered by JIKAN API
      </footer>
    </div>
  );
}

export default App;
