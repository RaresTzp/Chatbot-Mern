import { Outlet, useNavigate } from 'react-router'
import './dashboardLayout.css'
import { useAuth } from '@clerk/clerk-react'
import { use, useEffect } from 'react'
import ChatList from '../../components/chatList/chatList'

const DashboardLayout = () => {

const {userId, isLoaded} = useAuth()
const navigate = useNavigate();

useEffect(() => {
    if(isLoaded && !userId) {
        navigate("/login")
    }
}, [isLoaded, userId, navigate])

if(!isLoaded) return "Loading..."

    return (
        <div className='dashboardLayout'>
            <div className='menu'><ChatList/></div>
            <div className='content'><Outlet/></div>
        </div>
    )
}

export default DashboardLayout