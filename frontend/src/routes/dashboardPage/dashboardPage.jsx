import './dashboardPage.css'
import {useAuth} from '@clerk/clerk-react'

const Dashboardpage = () => {

    const {userId} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;
    
        try {
          const response = await fetch("http://localhost:5001/api/chats", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, text }),
          });
    
          const data = await response.json();
          console.log("New chat created with ID:", data.chatId);
        } catch (err) {
          console.error("Error:", err);
        }
    };
    return (
        <div className='dashboardPage'>
            <div className='texts'>
                <div className='logo'>
                    <img src='/law.png' alt=''/>
                    <h1>CaseWise AI</h1>
                </div>
                <div className='options'>
                    <div className='option'>
                        <img src="/chat.png" alt=""/>
                        <span>Create a new Chat</span>
                    </div>
                    <div className='option'>
                        <img src="/image.png" alt=""/>
                        <span>Analyse Images</span>
                    </div>
                    <div className='option'>
                        <img src="/code.png" alt=""/>
                        <span>Help me with my Code</span>
                    </div>
                </div>
            </div>
            <div className='formContainer'>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" placeholder='Ask me anything...' />
                    <button>
                        <img src='/arrow.png' alt=''/>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Dashboardpage  