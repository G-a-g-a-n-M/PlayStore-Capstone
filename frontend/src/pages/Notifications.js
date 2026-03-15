import {useEffect,useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";

function Notifications(){

 const [notifications,setNotifications] = useState([]);
 const { token } = useSelector((state) => state.auth);

 const fetchNotifications = async ()=>{

  try {
    const res = await axios.get(
     "https://playstore-capstone.onrender.com/api/notifications",
     {
      headers:{
       Authorization:`Bearer ${token}`
      }
     }
    );

    setNotifications(res.data);
  } catch (err) {
    console.log(err);
  }

 };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`https://playstore-capstone.onrender.com/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

 useEffect(()=>{
  fetchNotifications();
 },[]);

 return(

  <div style={{padding:"30px"}}>
    <BackButton />

   <h2>Notifications</h2>

   {notifications.length > 0 ? (
     notifications.map(n=>(
      <div key={n._id} style={{
        padding: "15px",
        margin: "10px 0",
        border: "1px solid #ccc",
        backgroundColor: n.isRead ? "#f9f9f9" : "#e6f7ff"
      }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         <p style={{ margin: 0, flexGrow: 1 }}>
           {n.appId ? (
             <Link to={`/app/${n.appId}`} style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
               {n.message}
             </Link>
           ) : (
             n.message
           )}
         </p>
         <button 
           onClick={() => deleteNotification(n._id)}
           style={{
             marginLeft: "15px",
             backgroundColor: "#ff4d4d",
             color: "white",
             border: "none",
             padding: "5px 10px",
             borderRadius: "3px",
             cursor: "pointer"
           }}
         >
           Delete
         </button>
       </div>
      </div>
     ))
   ) : (
     <p>No new notifications.</p>
   )}

  </div>

 );

}

export default Notifications;
