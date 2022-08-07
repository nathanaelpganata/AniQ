import React, { useState } from 'react'
import { useQuery } from 'react-query'
import RiseLoader from "react-spinners/RiseLoader";
import { motion } from 'framer-motion';

const Themes = ({animeID, tabs}) => {

    const fetcherThemes = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/themes`).then(res => res.json())

    const {data: themes, refetch: refetchThemes, isFetching: fetchingThemes, error: errorThemes} = useQuery("themes", fetcherThemes, {
        cacheTime: 0,
    })

    return (<div>
            { fetchingThemes ? <div className='bg-liteBlack min-h-screen flex justify-center mt-36'><RiseLoader color={"#ff6740"} loading={fetchingThemes} size={30}/></div>:
            <motion.div 
            initial={{y:-20}}
            animate={{y:20}}>
                <div className='text-white flex flex-col mx-auto bg-grey px-5 py-4 rounded-lg col-span-3 w-full mb-52'>
                    <h1 className='text-2xl font-bold text-white  w-max'>Themes</h1>
                    <div className='grid grid-cols-2 bg-opacity-50 h-full rounded-lg p-4 gap-20'>
                        <div className='bg-liteGrey px-6 py-3 rounded-lg'>
                            <h1 className='text-2xl font-bold mb-4 mt-2'>Openings</h1>
                            {themes?.data?.openings?.map(song => {
                                return <div>
                                    <h1 className='text-xl flex flex-wrap'>{song}</h1>
                                </div>
                            } )}
                        </div>
                        <div className='bg-liteGrey px-6 py-3 rounded-lg'>
                            <h1 className='text-2xl font-bold mb-4 mt-2'>Endings</h1>
                            {themes?.data?.endings?.map(song => {
                                return <div>
                                    <h1 className='text-xl flex flex-wrap'>{song}</h1>
                                </div>
                            } )}
                        </div>
                    </div>
                </div>
            </motion.div>
            }
        </div>
    )
}

export default Themes