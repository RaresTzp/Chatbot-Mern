import { Link, Outlet } from 'react-router-dom'
import './rootLayout.css'
import { ClerkProvider, SignedIn, UserButton, useAuth } from "@clerk/clerk-react"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()


const RootContent = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <div style={{ color: 'white' }}>Loading authentication...</div>
  }

  return (
    <div className='rootLayout'>
      <header>
        <Link to='/' className='image'>
          <img src="/law.png" alt="" />
          <span>CaseWise</span>
        </Link>
        <div className='user'>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
      <RootContent />
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout
