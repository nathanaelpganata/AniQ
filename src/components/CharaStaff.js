import React, { useState } from 'react';
import { useQuery } from 'react-query'
import RiseLoader from "react-spinners/RiseLoader";
import { MdOutlineExpandMore, MdExpandLess } from "react-icons/md";
import { motion } from 'framer-motion';

const CharaStaff = ({animeID, tabs}) => {

    const [moreChara, setMoreChara] = useState(false)
    const [moreStaffs, setMoreStaffs] = useState(false)
    const [lang, setLang] = useState("Japanese")

    const fetcherCharacterByID = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/characters`).then(res => res.json())
    const fetcherStaffByID = () => fetch(`https://api.jikan.moe/v4/anime/${animeID}/staff`).then(res => res.json())

    const {data: chara, refetch: refetchChara, isFetching: fetchingChara, error: errorChara} = useQuery("characterByID", fetcherCharacterByID, {
        cacheTime: 0,
    })
    
    const {data: staff, refetch: refetchStaffs, isFetching: fetchingStaff, error: errorStaff} = useQuery("staffByID", fetcherStaffByID, {
        cacheTime: 0,
    })


    let toChara = 8;
    let toStaffs = 9;

    if (moreChara == true) {
        toChara = 24
    }
    
    if (moreStaffs == true) {
        toStaffs = 27
    }

    return (<div>
        { fetchingChara || fetchingStaff ? <div className='bg-liteBlack min-h-screen flex justify-center mt-36'><RiseLoader color={"#ff6740"} loading={fetchingChara || fetchingStaff} size={30}/></div>:
        <motion.div
        initial={{y:-20}}
        animate={{y:20}}>
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
                moreChara === false ?
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
                moreStaffs === false ?
                <MdOutlineExpandMore className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreStaffs(!moreStaffs)}/>
                :
                <MdExpandLess className='flex mx-auto col-span-3 bg-liteBlack text-white rounded-3xl scale-[300%] my-6 animate-pulse cursor-pointer hover:text-liteOrange' onClick={() => setMoreStaffs(!moreStaffs)}/>
                }
                </div>
            </div>
        </motion.div>
        }
    </div>)
}

export default CharaStaff