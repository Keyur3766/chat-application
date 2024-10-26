"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Userservices from "../services/index";
import { useRouter } from "next/navigation";
import { deleteCookie, setCookie } from "cookies-next";
import { requestHandler } from "@/utils";



const AuthContext = createContext<{
    userId: string | null;
    user: any;
    token: string | null;
    login: any;
    register: (data: {
      email: string;
      username: string;
      password: string;
    }) => Promise<void>;
    logout: any;
}>({
    userId: null,
    user: null,
    token: null,
    login: async() => {},
    register: async() => {},
    logout: async() => {}
});

const useAuth = () => useContext(AuthContext);


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
  
    const router = useRouter();

    // Function to handle user login
    const login = async (data: { username: string; password: string }) => {
      await requestHandler(
        async () => await Userservices.GenerateLoginToken(data.username, data.password),
        null,
        (res) => {
          localStorage.setItem("user", res.data.username);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user_id", res.data._id);
          // localStorage.setItem("user", JSON.stringify(res.data));
          setCookie("token", res.data.token);
          router.push("/chat");
        },
        () => {
          alert("UserName or password is incorrect");
          router.push("/login");
        } // Display error alerts on request failure
      );
      // Userservices.GenerateLoginToken(data.username, data.password).then((res: any)=>{
      //   if(res.status===200){
      //       localStorage.setItem("user", res.data.username);
      //       localStorage.setItem("token", res.data.token);
      //       localStorage.setItem("user_id", res.data._id);

      //       setCookie("token", res.data.token);

      //       // cookieStore.setItem("user", res.data.username);
      //       // cookieStore.setItem("token", res.data.token);
      //       // cookieStore.setItem("user_id", res.data._id);
      //       // redirectPath = "/chat";
      //       router.push("/chat");
      //   }
      //   if(res.response && res.response.status===400){
      //     console.warn("UserName or password is incorrect");
      //     // setServerError('Invalid credentials');
      //     router.push("/login");
      //   }
      // })
      // .catch((error)=>{
      //   console.log(error);
      //   router.push("/login");
      //   // redirectPath = "/login";
      // });
    };

  
    // Function to handle user logout
    const logout = async () => {
      await requestHandler(
        async () => await Userservices.logoutUser(),
        () => {},
        () => {
          console.log("control reached");
          setUser(null);
          setToken(null);
          deleteCookie("token");
          localStorage.clear(); // Clear local storage on logout
          router.push("/login"); // Redirect to the login page after successful logout
        },
        alert // Display error alerts on request failure
      );
    };

    const register = async(data: {email: string; username: string; password: string;}) => {
      
      await requestHandler(
        async() => await Userservices.registerUser(data.email, data.username, data.password),
        null,
        () => {
          alert("Account created successfully! Go ahead and login.");
          router.push("/login"); // Redirect to the login page after successful registration
        },
        alert
      );
    }
  
    // Check for saved user and token in local storage during component initialization
    useEffect(() => {
      const _token = localStorage.getItem("token");
      const _user = localStorage.getItem("user");
      const _userId = localStorage.getItem("user_id");
      if (_token && _user) {
        setUser(_user);
        setToken(_token);
        setUserId(_userId);
      }
    }, []);
  
    // Provide authentication-related data and functions through the context
    return (
      <AuthContext.Provider value={{ userId, user, register, token, login, logout }}>
        { children } {/* Display a loader while loading */}
      </AuthContext.Provider>
    );
  };

  export { AuthContext, AuthProvider, useAuth };