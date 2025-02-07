import { NavBarInicio } from "./navbarInicio.jsx"
import  LiveChat  from "./LiveChat.jsx"
import { useState } from "react";
import { Profile } from "./profile.jsx";

export const Inicio = () =>{
    const [activeComponent, setActiveComponent] = useState(null);

    const handleChatClick = () => {
        setActiveComponent('chat');
    };

    const handleAuctionClick = () => {
        setActiveComponent('auction');
    };
    
    const handleProfilClick = () => {
        setActiveComponent('profile');
    };
    const senderID = parseInt(window.localStorage.getItem('id'))

    return(
        <div className="w-[100vw] h-screen bg-[#fdfdfd] flex  justify-between">
            <NavBarInicio onChatClick={handleChatClick} onAuctionClick={handleAuctionClick} onProfilClick={handleProfilClick}/>
            <div className="w-[100%] h-[100vh]">
            {activeComponent === 'chat' && <LiveChat sender_id={senderID} receiver_id={2} />}
            {activeComponent === 'auction' && <div>Auction Component</div>}
            {activeComponent === 'profile' && <Profile />}
            </div> 
        </div>
    )
}