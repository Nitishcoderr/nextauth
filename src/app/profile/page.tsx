'use client';

import React, {  useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfilePage = () => {

    const router = useRouter();
    // State for user data and loading
    const [data, setData] = useState("nothing");

    const getUserDetails = async () =>{
        const res = await axios.post("/api/users/me")
        console.log(res);
        setData(res.data.data._id)
    }

        const logout = async  () =>{
            try {
                await axios.get('/api/users/logout')
                toast.success("Logout success")
                router.push("/login")
            } catch (error:any) {
                console.log(error.message);
                toast.error(error.message)
                
            }
        }
        

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
       <h1>Profile Page</h1>
       <hr />
       <h2>{data === "nothing" ? "No data to display" : <Link href={`/profile/${data}`}>
       {data}
       </Link>}</h2>
       <hr />
       <button  className="p-2 border bg-blue-500 border-blur-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600" onClick={logout} >Logout</button>

       <button  className="p-2 border bg-green-500 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600" onClick={getUserDetails} >Get User Details</button>
    </div>
  )
}

export default ProfilePage
