import './homePage.css'
import { Link, Outlet } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'

const Homepage = () => {

    const [typingStatus, setTypingStatus] = useState("human1")



    return (
        <div className='homepage'>
            <img src="/orbital.png" alt="" className='orbital' />
            <div className='left'>
                <h1>
                    CaseWise AI
                </h1>
                <h2>
                    Find the most similar precedent case
                </h2>
                <h3>
                    AI powered information retrieval
                </h3>
                <Link to="/dashboard" className='started'>Get Started</Link>
            </div>
            <div className='right'>
                <div className='imgContainer'>
                    <div className='bgContainer'>
                        <div className='bg'></div>
                    </div>
                    <img src="/bot.png" alt="" className='bot'/>
                    <div className='chat'>
                        <img src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "/human2.jpeg" : "/bot.png"} alt=''/>
                    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'Human: We produce food for Mice',
        2000, 
        () => {
            setTypingStatus("bot");
        }, // wait 1s before replacing "Mice" with "Hamsters"
        'Bot: We produce food for Hamsters',
        2000,
        () => {
            setTypingStatus("human2");
        },
        'Human2: We produce food for Guinea Pigs',
        2000,
        () => {
            setTypingStatus("bot");
        },
        'Bot: We produce food for Chinchillas',
        2000,
        () => {
            setTypingStatus("human");
        }
      ]}
      wrapper="span"
      //speed={50}
      //style={{ fontSize: '2em', display: 'inline-block' }}
      repeat={Infinity}
      cursor={true}
      omitDeletionAnimation={true}
    />
                    </div>
                </div>
            </div>
            <div className='terms'>
                <img src="/law.png" alt=""/>
                <div className='links'>
                <Link to='/'>Terms of Service</Link>
               <span>|</span>
                <Link to='/'>Privacy Policy</Link>
                </div> 
            </div>
        </div>
    )
}

export default Homepage