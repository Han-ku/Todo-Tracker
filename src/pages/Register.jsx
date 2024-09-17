import React, {useState} from 'react'

const Register = (props) => {

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className='auth-form-container'>
            <p className='auth-form-title'>Register</p>
            <form onSubmit={handleSubmit}>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder='Full Name' id='fullName' name='fullName'/>

                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' id='email' name='email'/>

                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder='Password' id='password' name='password'/>

                <button id='register-btn'>Register</button>
            </form>

            <button className='changePageBtn' onClick={() => props.onFormSwitch('login')}>Already have an account? Login here</button>
        </div>
    )
}

export default Register