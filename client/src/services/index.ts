import axios from "axios";
const api_base_url = "http://127.0.0.1:8080";

const apiClient = axios.create({
  baseURL: api_base_url,
  // withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default {
  GenerateLoginToken: async function (username:string, password:string) {
    try {
      console.warn(api_base_url)
      const response = await axios.post(
        `${api_base_url}/api/login/generateToken`, {
        username: username,
        password: password
      }
      );

      
      if (response.status === 200) {
        // cookies.set('jwtToken', JSON.stringify(response.data), { expires: 1/24 });
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      console.warn(response)
      return response;
    }
    catch (error) {
      console.log(error);
      return error;
    }
  },

  logoutUser: async function () {
    const response = await axios.post(`${api_base_url}/api/login/removeToken`);
    
    return response;
  },

  registerUser: async function (email:string, username:string, password:string): Promise<any> {
    try {
      return await apiClient.post(
        "/api/login/registeruser", {
        email: email,
        username: username,
        password: password
      });

    }
    catch (error) {
      console.log(error);
      return error;
    }
  },

  availableParticipants: async function() {
    const response = await apiClient.get("/api/chat/availableParticipants");

    // await apiClient.get()
    return response;
  },

  getChats: async function() {
    const response = await apiClient.get("/api/chat");

    // await apiClient.get()
    return response;
  },

  getMessages: async function(chatId: string) {
    return await apiClient.get(`/api/message/${chatId}`)
  },

  sendMessages: async function(chatId: string, content: string) {
    // const formData = new FormData();
    // if (content) {
    //   formData.append("content", content);
    // }
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
    const body = { content };
    return await apiClient.post(`/api/message/${chatId}`, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  createUserChat: async function(receiverId: string) {
    return await apiClient.get(`/api/chat/addChat/${receiverId}`) 
  },

  getUnreadMessages: async function() {
    return await apiClient.get('/api/message/getUnreadMessages');
  }
}