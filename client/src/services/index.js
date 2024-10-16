import axios from "axios";
const api_base_url = "http://127.0.0.1:8080";


export default {
  GenerateLoginToken: async function (username, password) {
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


  availableParticipants: async function() {
    const response = await axios.get(`${api_base_url}/api/chat/availableParticipants`)

    return response;
  }
}