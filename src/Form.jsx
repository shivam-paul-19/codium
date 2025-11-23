import { useState } from 'react'
import './Form.css'

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    roomId: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
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
    </form>
  )
}

export default Form
