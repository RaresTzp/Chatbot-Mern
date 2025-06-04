import './loginPage.css'
import { SignIn } from '@clerk/clerk-react'

const Loginpage = () => {
    return (
        <div className='loginpage'><SignIn path="/login" signUpUrl="/register" forceRedirectUrl="/dashboard"/></div>
    )
}

export default Loginpage