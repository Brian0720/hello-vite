import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import "./SignIn.scss";

const SignIn = ({ onSignInClick }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className='sign-in card'>
			<span className='p-float-label'>
				<InputText
					id='username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<label htmlFor='username'>Username</label>
			</span>
			<span className='p-float-label'>
				<Password
					id='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<label htmlFor='password'>Password</label>
			</span>
			<span className='p-button-wrapper'>
				<Button
					label='Sign In'
					onClick={() => onSignInClick(username)}
				/>
			</span>
		</div>
	);
};

export default SignIn;
