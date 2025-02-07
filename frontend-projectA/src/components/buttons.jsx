import Proptypes from 'prop-types';


export const Button = ({ textButton, funtionButton,className}) => {
    return (
        <button 
            onClick={funtionButton}
            className={className}>
            {textButton}
        </button>
    )
}

Button.propTypes = {
    textButton: Proptypes.string.isRequired,
    funtionButton: Proptypes.func.isRequired,
    className: Proptypes.string.isRequired,
}