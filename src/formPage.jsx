import Form from './Form'
import './Form.css';
import logo from "./assests/codium_logo.png";

const FormPage = () => {
  return (
    <div className="glass-container">
      <div className="logo-container">
      <img className='logo' src={logo} alt="" />
      <p>Sync the code...</p>
      </div>
      <div className="separator"></div>
      <Form />
    </div>
  )
}

export default FormPage
