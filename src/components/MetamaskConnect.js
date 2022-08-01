// React
import React, { useState, useEffect } from 'react'

// Metamask
import { ethers } from "ethers";

// Styles
import './MetamaskConnect.css'

// Status Bar
import toast from 'react-hot-toast';

// audio effects
import AudioConnected from '../../src/audio/got-item.mp3'
import AudioDisconnected from '../../src/audio/cancel.mp3'
import PlayAudio from './PlayAudio';



export default function MetamaskConnect({ onconnect, changeBalance }) {



    /////////////   METAMASK   /////////////

    // Variables
    const provider = ethers.getDefaultProvider('mainnet')

    // useState for storing / retrieving wallet details
    const [data, setdata] = useState({ address: "", balance: null });

    // useState stored for connected or not
    const [connected, setConnected] = useState(false)






    // Button handler button for handling a request event for metamask

    const buttonConnectToMetamask = () => {

        // Asking if metamask is already present or not
        if (window.ethereum) {

            // res[0] for fetching a first wallet
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res) => accountHandler(res[0]))
        } else {
            alert("Please install Metamask extension!");
        }
    };


    // Function for handling all events

    const accountHandler = (account) => {

        setConnected(true)  // after getting the address, setConnected = true, so the balance can be requested

        // Setting an address data
        setdata({
            ...data,
            address: account
        })

    };


    // Call Balance only if connected (after getting address)

    useEffect(() => {

        if (connected) {

            ///////////////// pass back to app.js /////////////////

            onconnect(data, 'connected')


            ///////////////// Get Metamask Data  /////////////////

            provider.getBalance(data.address)
                .then((balance) => {

                    // convert currency unit from wei to ether
                    const balanceInEth = ethers.utils.formatEther(balance)
                    console.log(`💰  Balance:  ${balanceInEth} ETH`)



                    setdata({
                        ...data,
                        balance: balanceInEth
                    })



                })

            console.log('✔️  Wallet Connected: ', data.address)


            PlayAudio(AudioConnected)


            toast('Wallet connected', {
                duration: 2000,
                position: 'top-left',
                // Styling
                style: {
                    "fontSize": "14px",
                    "lineHeight": "1.4",
                    "minHeight": "40px",
                    "padding": "8px 12px",
                    "backgroundColor": "rgb(227, 252, 239)",
                    "borderRadius": "4px",
                    "boxShadow": "rgb(0 0 0 / 18%) 0px 3px 8px",
                    "color": "rgb(0, 102, 68)",
                    "marginBottom": "8px",
                    "width": "360px",
                    "textAlign": "left"
                },
                className: '',
                // Custom Icon
                icon: '✔️',
                // Aria
                ariaProps: {
                    role: 'status',
                    'aria-live': 'polite',
                },
            });
        }
        else {
            console.log('❌  No Balance available, Wallet Not Connected')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.address]);


    useEffect(() => {
        // REKT GAME
        if (changeBalance) {
            setdata({
                ...data,
                balance: 0
            })
        }
        else {

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changeBalance])





    // disconnect wallet

    function disconnectWallet() {

        setConnected(false)

        // disconnect in app.js und quit game
        onconnect(data, 'disconnected')

        setdata({
            address: "",
            balance: null,
        });


        console.log('❌  Wallet Disconnected.')

        PlayAudio(AudioDisconnected)

        toast('Wallet Disconnected', {
            duration: 2000,
            position: 'top-left',

            // Styling
            style: {
                "fontSize": "14px",
                "lineHeight": "1.4",
                "minHeight": "40px",
                "padding": "8px 12px",
                "backgroundColor": "rgb(255, 235, 230)",
                "borderRadius": "4px",
                "boxShadow": "rgb(0 0 0 / 18%) 0px 3px 8px",
                "color": "rgb(191, 38, 0)",
                "marginBottom": "8px",
                "width": "360px",
                "textAlign": "left"
            },
            className: '',

            // Custom Icon
            icon: '❌',

            // Change colors of success/error/loading icon

            // Aria
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        });

    }




    return (

        <div className='metamask-container'>


            <button
                className={connected ? "metamask-button glow-on-hover glow" : "metamask-button"} onClick={() => { buttonConnectToMetamask() }}>

                {!connected &&
                    <> 🦊  Connect</>
                }
                {connected &&
                    <small>
                        🔗   {data.address.substring(0, 6) + '...' + data.address.substring(data.address.length - 3)}
                    </small>
                }
            </button>



            {connected &&

                <div className={changeBalance ? "metamask-popup shake" : "metamask-popup"}>
                    <div>🔗 Your Wallet
                        <br /><br />
                    </div>

                    <div>
                        <strong>👛 Address: </strong> <br />
                        <small>{data.address.substring(0, 10) + '...' + data.address.substring(data.address.length - 10)}</small>
                        <br /> <br />
                        <strong>💰 Balance: </strong> <br />
                        <small>{data.balance} ETH</small>
                        <br />

                        <button onClick={() => { disconnectWallet() }}>
                            Disconnect
                        </button>

                    </div>
                </div>
            }

        </div >

    );
}
