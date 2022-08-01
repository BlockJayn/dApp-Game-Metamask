// styles
import './App.css';
import './components/GameWon.css';

// components
import { useEffect, useState } from 'react';
import SingleCard from './components/SingleCard';

// metamask
import MetamaskConnect from './components/MetamaskConnect';
import { Toaster } from 'react-hot-toast';

// audio effects
import Blockbuster from '../src/audio/blockbuster.mp3'
import ShuffleCards from '../src/audio/shuffle-cards.mp3'
import PlayAudio from './components/PlayAudio';

// Status Bar
import toast from 'react-hot-toast';



// Code here will NOT get rerendered every time the component is rerevaluated

const cardImages = [
  { "src": "/img/lock.png", matched: false },
  { "src": "/img/balloon.png", matched: false },
  { "src": "/img/alarm.png", matched: false },
  { "src": "/img/tv.png", matched: false },
  { "src": "/img/bomb.png", matched: false },
  { "src": "/img/parcel.png", matched: false }
]


export default function App() {

  // states

  const [gameStarted, setGameStarted] = useState(false)
  const [giveCards, setGiveCards] = useState([])

  const [firstChoice, setFirstChoice] = useState(null)
  const [secondChoice, setSecondChoice] = useState(null)

  const [trys, setTrys] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const [metamaskConnected, setMetamaskConnected] = useState(false)

  const [changeBalance, setChangeBalance] = useState(false) // REKT GAME

  // new game

  const newGame = () => {

    // shuffle cards

    PlayAudio(ShuffleCards)

    const cardstack = [...cardImages, ...cardImages]
    const shuffledcards = cardstack
      .sort(() => (Math.random() > .5) ? 1 : -1)
      .map(cardObject => ({ ...cardObject, id: Math.random() }))

    setGiveCards(shuffledcards)

    setFirstChoice(null)
    setSecondChoice(null)
    setTrys(0)

    setGameWon(false)
    setGameStarted(true)
    setChangeBalance(false)

    //console.log(shuffledcards)
  }


  // handle choices

  const handleChoice = (card) => {
    console.log(card.src)

    if (firstChoice === null) {
      // Play Audio
      PlayAudio("/audio/slash.mp3")
      setFirstChoice(card)

      // SIDEGAME: Bomb - CARD
      if (card.src === '/img/bomb.png') {

        toast('Your Metamask wallet got bombed to zero! Have fun staying poor!', {
          duration: 5500,
          position: 'top-right',
          // Styling
          style: {
            "fontSize": "18px",
            "fontWeight": "bold",

            "lineHeight": "1.4",
            "minHeight": "40px",
            "padding": "8px 12px",
            "backgroundColor": "#ffb300",
            "borderRadius": "4px",
            "borderColor": "#fff",
            "boxShadow": "rgb(0 0 0 / 18%) 0px 3px 8px",
            "color": "#000",
            "marginBottom": "8px",
            "marginTop": "350px",
            "textAlign": "left"
          },
          className: '',
          // Custom Icon
          icon: '💵',
          // Aria
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
        setChangeBalance(true)

      }


    }
    else {
      PlayAudio("/audio/slash.mp3")
      setSecondChoice(card)

    }

  }


  // check choices

  useEffect(() => {

    console.log(firstChoice ? '✔️ 1st: ' + firstChoice.src : '✖️ 1st: ' + firstChoice)
    console.log(secondChoice ? '✔️ 2nd: ' + secondChoice.src : '✖️ 2nd: ' + secondChoice)

    if (firstChoice && secondChoice) {

      //disable cards for a while
      setDisabled(true);



      if (firstChoice.src === secondChoice.src) {

        console.log('🏆🏆🏆 TWO SIMILAR CARDS 🏆🏆🏆', trys)


        // Play Audio
        PlayAudio("/audio/ding.mp3")

        // if cards match, loop through cards-object 
        // and if the correctly chosen card(s) match with the object "src", set "matched" = true

        setGiveCards(prevCards => {
          return prevCards.map(card => {

            if (card.src === firstChoice.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })


        setTimeout(() => {
          resetTurn()

        }, 1000);

      }
      else if (firstChoice && secondChoice) {

        console.log('❌❌❌ NO SIMILAR CARDS ❌❌❌', trys)

        setTimeout(() => {
          resetTurn()
        }, 1000);

      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstChoice, secondChoice, trys])



  // check if user won the game, if "giveCards" changes

  useEffect(() => {

    const allCardsAreMatched = giveCards.find(item => item.matched === false)
    console.log('###allCardsAreMatched### ', allCardsAreMatched)

    // if giveCards-Array has Items AND if all cards are TRUE (we cannot find any FALSE matched)
    if (giveCards.length !== 0 && !allCardsAreMatched) {


      console.log('🏆🏆🏆🏆🏆🏆 you won the game')
      // Play Audio
      PlayAudio(Blockbuster)
      setGameWon(true)  // == fireworks
    }

  }, [giveCards])


  // reset turn

  const resetTurn = () => {
    setFirstChoice(null)
    setSecondChoice(null)
    setTrys(trys + 1)
    setDisabled(false)
  }


  // quit game

  const quitGame = () => {
    setGiveCards([])
    setFirstChoice(null)
    setSecondChoice(null)
    setTrys(0)
    setGameStarted(false)
    setGameWon(false)
  }


  // on connect to metamask get data from metamask in app.js
  const onconnect = (getDataFromMetamask, status) => {

    if (getDataFromMetamask.address !== "") {
      setMetamaskConnected(true)
    }

    if (status === "disconnected") {
      quitGame()
      setMetamaskConnected(false)
    }

    console.log('connected', getDataFromMetamask)
  }





  ////  RENDER THE APP

  return (
    <div className="App">


      {/** Needed for Status Messages to work */}
      <Toaster />


      {/** Metamask pass prop function to return data to app.js */}
      <MetamaskConnect changeBalance={changeBalance} onconnect={onconnect} />


      {/** Firework if game won */}
      {gameWon &&
        <div className="pyro">
          <div className="before"></div>
          <div className="after"></div>
        </div>}


      {/** Start Game */}
      <h1 className='headtext'>dApp-Game</h1>
      <small className='byblockjayn'>by BlockJayn</small>

      <br />
      {!metamaskConnected && <div >
        Please connect your wallet to play.
      </div>}



      {metamaskConnected && !gameStarted && <button onClick={newGame}>Start Game</button>}

      {metamaskConnected && gameStarted && <button onClick={newGame}>Restart</button>}
      {metamaskConnected && gameStarted && <button onClick={quitGame}>Quit Game</button>}



      {metamaskConnected && gameStarted && <div>{trys} trys</div>}



      <div className='playgrid'>


        {metamaskConnected && gameStarted &&

          giveCards.map(
            (card =>
              <SingleCard
                key={card.id}
                card={card}
                handlechoice={handleChoice}
                flipped={card === firstChoice || card === secondChoice || card.matched}
                disabled={disabled}
              />
            )
          )}

      </div>




    </div>
  );
}
