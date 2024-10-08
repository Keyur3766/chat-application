"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Userservices  from "../../services/index.js";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const router = useRouter()
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
          ...data,
          [e.target.name]: e.target.value
        });
    }
    const {login} = useAuth();
    const handleLogin = async() => {
      await login(data);
    }

    return (
        <div className="flex justify-center items-center flex-col h-screen w-screen">
      <h1 className="text-3xl font-bold">Chat App</h1>
      <div className="max-w-4xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          {/* <LockClosedIcon className="h-8 w-8 mb-2" /> Login */}
        </h1>
        {/* Input for entering the username */}
        <Input
          placeholder="Enter the username..."
          value={data.username}
          name="username"
          onChange={handleDataChange}
        />
        {/* Input for entering the password */}
        <Input
          placeholder="Enter the password..."
          type="password"
          name="password"
          value={data.password}
          onChange={handleDataChange}
        />
        {/* Button to initiate the login process */}
        <Button
          disabled={Object.values(data).some((val) => !val)}
          fullWidth
           onClick={handleLogin}
        >
          Login
        </Button>
        {/* Link to the registration page */}
        <small className="text-zinc-300">
          Don&apos;t have an account?{" "}
            <a className="text-primary hover:underline" href="/register">
                Register
            </a>
            </small>
        </div>
        </div>
    )
}