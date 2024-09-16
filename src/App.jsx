import React, {useState} from 'react';
import './App.css';
import Todo from './pages/Todo';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const [currentForm, setCurrentForm] = useState('login')

  const toggleForm = (formName) => {
    setCurrentForm(formName)
  }

  return (
    <>
    <div className="auth_container">
      {
        currentForm === 'login' ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
      }
    </div>
    </>
  )
}

export default App


