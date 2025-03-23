
import React,{useContext, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../Slices/AuthSlice';

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()
    // const dispatch = useDispatch()
    // const {user} = useSelector((state)=>state.auth)
  
    // const loginHandler = async (e) => {
    //   e.preventDefault();
        
    //  const data = await dispatch(loginUser({email,password}))
      

    //   if(loginUser.fulfilled.match(data)){
    //     navigate('/home')
    //   }
      

    //   setEmail("")
    //   setPassword("")
    // };

    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-xl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <h1 className="text-4xl mt-3 font-bold text-gray-700">ParkAndRide</h1>
      </div>

      {/* Login Form */}
      <form  className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 mb-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
            required
          />
          <Link to="/forgot-password" className='text-blue-500 text-sm hover:underline mt-3' > forgot password? </Link>
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Log In
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-2 text-sm text-gray-400">OR</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      {/* Signup Redirect */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>  )
}

export default UserLogin
