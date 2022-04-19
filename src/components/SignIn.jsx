import React from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import "./SignIn.scss";

const SignIn = ({ password, username, onChange, onSignInClick }) => {
	return (
		<div className='sign-in card'>
			<span className='p-float-label'>
				<InputText id='username' value={username} onChange={onChange} />
				<label htmlFor='username'>Username</label>
			</span>
			<span className='p-float-label'>
				<Password id='password' value={password} onChange={onChange} />
				<label htmlFor='password'>Password</label>
			</span>
			<span className='p-button-wrapper'>
				<Button label='Sign In' onClick={onSignInClick} />
			</span>
		</div>
	);
};

export default SignIn;
