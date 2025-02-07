
import Proptypes from 'prop-types';
import '../App.css';

export const  Navbar = ({children}) => {
    const LogoPage = '/logopage2.png'

    return(
        <nav className='flex items-center justify-between flex-wrap bg-[#6498c1] p-1'>
            <div className='flex items-center flex-shrink-0 text-white mr-6'>
            <img className='w-100px h-80px' src={LogoPage} alt="Logo"/>
            <a href="#">que es vev?</a>
            </div>
            <div>
                {children}
            </div>
        </nav>
    )   
}

Navbar.propTypes = {
    children: Proptypes.node.isRequired
}