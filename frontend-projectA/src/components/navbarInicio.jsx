
import '../App.css'
import { FaLandmark } from "react-icons/fa";
import { FcAdvertising,FcVoicePresentation, FcSms } from "react-icons/fc";
import { BiBell } from "react-icons/bi";
import PropTypes from 'prop-types'


export const NavBarInicio = ({ onChatClick, onAuctionClick, onProfilClick }) => {
    
    const profilePhoto = '/default-profile.png'
    const userLocalStorage = window.localStorage.getItem('userLocalStorage')

    return(
        <nav className="h-[100%] w-70 flex flex-col bg-[#f5f5f6] border border-solid border-[#1111]">
            <div className=" h-12 w-[80%] m-auto mt-3 bg-[#1111] ">
                
            </div>
            <div className='h-[2px] bg-[#1111] mt-2'></div>
            <div className='flex flex-col '>
                <div
                    className="text-[#7b8290] m-auto w-[80%] flex m-auto mt-10 items-center"
                    onClick={onAuctionClick}
                >
                    <FcAdvertising className="mr-2 size-6"/>Auctions
                </div>
                <div
                    className="text-[#7b8290] m-auto w-[80%] flex m-auto mt-10 items-center"
                    onClick={onAuctionClick}
                >
                    <FcVoicePresentation  className='mr-2 size-6' />my auction
                </div>
                <div
                    className="text-[#7b8290] m-auto w-[80%] flex m-auto mt-10 items-center"
                    onClick={onChatClick}
                >
                    <FcSms className='mr-2 size-6' /> Chat
                </div>
                <div
                    className="text-[#7b8290] m-auto w-[80%] flex m-auto mt-10 items-center"
                    onClick={onAuctionClick}
                >
                    <FaLandmark className='mr-2 size-6' />Auction
                </div>
                <div
                    className="text-[#7b8290] m-auto w-[80%] flex m-auto mt-60 items-center"
                    onClick={onAuctionClick}
                >
                    <BiBell className='mr-2' /> notification
                </div>
                <div 
                className='flex flex-row items-center m-auto ml-6 mt-5 mb-2'
                onClick={onProfilClick}
                >
                    <img src= {profilePhoto} alt="" className='h-[34px] w-[36px] rounded-[50px] border border-solid border-[green]'/>
                    <h3 className='text-[#89909c] ml-3'>{userLocalStorage}</h3>
                </div>
            </div>
        </nav>  
    )
}

NavBarInicio.propTypes = {
    onChatClick: PropTypes.func.isRequired,
    onAuctionClick: PropTypes.func.isRequired,
    onProfilClick: PropTypes.func.isRequired
}

