import './SingleCard.css'


export default function SingleCard({ card, handlechoice, flipped, disabled }) {

    const handleClick = () => {

        if (!disabled) {
            handlechoice(card)
        }


    }


    return (
        <div className='card'>
            <div className={flipped ? "flipped" : ""}>

                <img
                    className='front'
                    src={card.src}
                    alt='card front'
                    disabled={disabled}
                />
                <div style={{ visibility: "hidden", position: "absolute" }}>
                    # PHIL!!! ... no cheating! :D</div>
                <img
                    className='back'
                    src='img/cover1.png'
                    alt='card back'
                    onClick={handleClick}
                    disabled={disabled}
                />

            </div>
        </div>
    )
}
