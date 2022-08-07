import React, { useState } from 'react'
import { useQuery } from 'react-query'
import RiseLoader from "react-spinners/RiseLoader";
import { MdOutlineExpandMore, MdExpandLess } from "react-icons/md";
import { motion } from 'framer-motion';

const Reccomendations = ({animeID}) => {
    const [moreRecs, setMoreRecs] = useState(false)

    const fetcherRecommendations = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/recommendations`).then(res => res.json())

    const {data: recommendations, refetch: refetchRecs, isFetching: fetchingRecs, error: errorRecs} = useQuery("recommendations", fetcherRecommendations, {
        cacheTime: 0,
    })
    
    let toRecs = 15;

    if (moreRecs == true) {
        toRecs = 45
    }

    return (<div>
        { fetchingRecs ? <div className='bg-liteBlack min-h-screen flex justify-center mt-36'><RiseLoader color={"#ff6740"} loading={fetchingRecs} size={30}/></div>:
        <motion.div 
        initial={{y:-20}} 
        animate={{y:20}}>
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
                moreRecs === false ?
                <MdOutlineExpandMore className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreRecs(!moreRecs)}/>
                :
                <MdExpandLess className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreRecs(!moreRecs)}/>
                }
                </div>
            </div>
        </motion.div>
        }
    </div>
    )
}

export default Reccomendations