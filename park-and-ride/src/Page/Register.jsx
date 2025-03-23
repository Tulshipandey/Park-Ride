import React, {  useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'



const UserRegister = () => {

    const [username, setusername] = useState("")
    const [email, setemail] = useState("")
    const [password,setpasword] = useState("");
    const navigate = useNavigate()
    // const dispatch = useDispatch()

    // const {user,error} = useSelector(state => state.auth)

    // const submitHandler = async (e)=>{
    //     e.preventDefault();
    
    // await Axios.post('/users/register',{email,password,username}).then(response =>{
    //   if(response.status === 201){
    //     navigate('/')
    //   }
    // }).catch(err =>{
    //   console.log(err);
      
    // })
    
    // setemail('')
    // setpasword("")
    // setusername("")

    // }
   

  return (
    <div>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <form className="space-y-4">
          {/* Username Input */}
          <div>
            <input
              onChange={(e)=>{
                setusername(e.target.value)
              }}
              value={username}
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Email Input */}
          <div>
            <input
              onChange={(e) => setemail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Password Input */}
          <div>
            <input
              onChange={(e) => setpasword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} YourApp. All rights reserved.
      </footer>
    </div>
    </div>
  )
}

export default UserRegister