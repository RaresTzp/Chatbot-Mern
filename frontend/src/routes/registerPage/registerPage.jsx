import './registerPage.css'
import { SignUp } from '@clerk/clerk-react'

const Registerpage = () => {
    return (
        <div className='registerpage'><SignUp path="/register" signInUrl='/login'/></div>
    )
}

export default Registerpage