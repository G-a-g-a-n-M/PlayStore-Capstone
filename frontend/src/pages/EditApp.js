import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";

function EditApp(){

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [genre,setGenre] = useState("");
  const [version,setVersion] = useState("");

  useEffect(() => {

    const fetchApp = async () => {

      const res = await axios.get(
        `https://playstore-capstone.onrender.com/api/apps/${id}`
      );

      setName(res.data.name);
      setDescription(res.data.description);
      setGenre(res.data.genre);
      setVersion(res.data.version);

    };

    fetchApp();

  }, [id]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    await axios.put(
      `https://playstore-capstone.onrender.com/api/apps/${id}`,
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

  };

  return (

    <div style={{padding:"30px"}}>
      <BackButton />

      <h2>Edit App</h2>

      <form onSubmit={handleSubmit}>

        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <br/><br/>

        <input
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
          value={version}
          onChange={(e)=>setVersion(e.target.value)}
        />

        <br/><br/>

        <button type="submit">
          Update App
        </button>

      </form>

    </div>

  );

}

export default EditApp;
