import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from './mutations';

function LoginForm(props) {
    const [formState, setFormState] = useState({
        email: '',
        password: ''
    });

    const [login, { error }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            // Handle what you want to do once login is successful. 
            // For example: save token, redirect to a different page, etc.
            console.log("User logged in:", data);
        }
    });

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            const { data } = await login({
                variables: { ...formState }
            });
            
            // Assuming your server returns a token upon successful login
            const { token } = data.login;
            localStorage.setItem('jwtToken', token);
            // Reset the form fields (optional)
            setFormState({
                email: '',
                password: ''
            });

            // Redirect user or do something upon successful login
            // e.g., props.history.push("/dashboard");
        } catch (e) {
            console.error("Error logging in:", e);
        }
    };

    const handleChange = event => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="email">Email:</label>
                <input 
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>Error logging in!</p>}
        </div>
    );
}

export default LoginForm;
