import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";

function AddApp() {

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [genre,setGenre] = useState("");
  const [version,setVersion] = useState("");

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/apps",
        {
          name,
          description,
          genre,
          version
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      navigate("/owner/dashboard");

    } catch(err){

      console.log(err);

    }

  };

  return (

    <div style={{padding:"30px"}}>
      <BackButton />

      <h2>Add New App</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="App Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <br/><br/>

        <input
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <br/><br/>

        <select
          value={genre}
          onChange={(e)=>setGenre(e.target.value)}
          style={{ padding: "8px", width: "177px" }}
        >
          <option value="" disabled>Select Genre</option>
          <option value="games">Games</option>
          <option value="beauty">Beauty</option>
          <option value="fashion">Fashion</option>
          <option value="women">Women</option>
          <option value="health">Health</option>
          <option value="food">Food</option>
          <option value="social">Social</option>
          <option value="education">Education</option>
        </select>

        <br/><br/>

        <input
          placeholder="Version"
          value={version}
          onChange={(e)=>setVersion(e.target.value)}
        />

        <br/><br/>

        <button type="submit">
          Create App
        </button>

      </form>

    </div>

  );

}

export default AddApp;
