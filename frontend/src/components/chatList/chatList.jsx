import './chatList.css'
import { Link, Outlet } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query"

const ChatList = () => {
    //REACT QUERY TO UPDATE THE MENU CHAT LIST
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
          fetch('http://localhost:5001/api/userchats',{credentials: "include"}).then((res) =>
            res.json(),
          ),
      })

    return (
        <div className='chatlist'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore Lama AI</Link>
            <Link to="/">Contact</Link>
            <hr/>
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
            {isPending? "Loading..." : error ? console.log(error): data?.map((chat) => (
                <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>My chat title</Link>
            ))}
            
            </div>
            <hr/>
            <div className='upgrade'>
                <img src='/law.png' alt='' />
                <div className='texts'>
                    <span>Upgrade to CaseWise Pro</span>
                    <span>Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList