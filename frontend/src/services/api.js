import axios from "axios";
const API = axios.create({
  baseURL: "https://playstore-capstone.onrender.com/api", 
});

export default API;