import { useState } from 'react'
import './Form.css'
import { v4 as uuidv4, validate, version } from 'uuid'
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom'
import { socket } from './socket';

const Form = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    roomId: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let user = {
      userName: e.target[0].value,
      meeting_id: e.target[1].value,
      unique_id: Date.now()
    }

    socket.emit("joined", user);
    let userList = [];
    let defContent = "";
    socket.on("allUsers", (users) => {
      userList = users;
    });

    socket.on("getContent", (content) => {
      defContent = content; 
    });

    if(!validate(e.target[1].value) || version(e.target[1].value) != 4) {
      toast.error("invalid room id!");
      return;
    }
    
    setTimeout(() => {
      navigate(`/editor/${e.target[1].value}`, {
        state: {
          users: userList,
          currentUser: user,
          defContent: defContent
        }
      });
    }, 1000);
  }

  const handleNewRoom = () => {
    // generate a unique room id
    const roomId = uuidv4()
    setFormData(prev => ({
      ...prev,
      roomId: roomId
    }))
    toast.success("New room created!")
  }

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h1 className="form-title">Join Room</h1>
      <div className="input-group">
        <label htmlFor="name" className="input-label">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="glass-input"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="off"
        />
      </div>

      <div className="input-group">
        <label htmlFor="roomId" className="input-label">Room ID</label>
        <input
          type="text"
          id="roomId"
          name="roomId"
          className="glass-input"
          placeholder="Enter room ID"
          value={formData.roomId}
          onChange={handleChange}
          required
          autoComplete="off"
        />
      </div>

      <button type="submit" className="submit-btn">
        Enter
      </button>
      <button type="button" className="new-room-btn" onClick={handleNewRoom}>
        New room
      </button>
    </form>
  )
}

export default Form
