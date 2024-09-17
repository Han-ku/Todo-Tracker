import React, {useState} from 'react'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className='auth-form-container'>
            <p className='auth-form-title'>Login</p>
            <form onSubmit={handleSubmit}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' id='email' name='email'/>

                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder='Password' id='password' name='password'/>

                <button>Log In</button>
            </form>

            <div className='auth-error-container hidden'>
                <p>ERROR</p>
            </div>

            <button className='changePageBtn' onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here</button>
        </div>
    )
}

export default Login