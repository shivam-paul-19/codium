import Form from './Form'
import './Form.css';
import logo from "./assests/codium_logo.png";

const FormPage = () => {
  return (
    <div className="glass-container">
      <div className="mobile-warning">
        <h2>⚠️</h2>
        <p>This app is not compatible for mobile usage.</p>
        <p>Please use a desktop browser.</p>
      </div>
      <div className="app-content">
        <div className="logo-container">
          <img className='logo' src={logo} alt="" />
          <p>Sync the code...</p>
        </div>
        <div className="separator"></div>
        <Form />
      </div>
    </div>
  )
}

export default FormPage
