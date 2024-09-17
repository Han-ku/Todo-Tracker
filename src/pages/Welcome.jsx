import React, {useState} from 'react'
import Register from './Register';
import Login from './Login';

const Welcome = () => {
    const [currentForm, setCurrentForm] = useState('login')

    const toggleForm = (formName) => {
      setCurrentForm(formName)
    }

    return (
        <>
            <div className="welcome-wrapper">
                <div className="welcome-container">
                    <h1>Welcome to <br /> Task Tracker</h1>

                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam officiis placeat odio dolore dignissimos velit, recusandae voluptate vitae debitis nesciunt esse quo, excepturi ipsam ad, non perferendis nostrum earum alias.</p>
                </div>
                <div className="auth-container">
                    {
                        currentForm === 'login' ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
                    }
                </div>
            </div>
        </>
    )
}

export default Welcome