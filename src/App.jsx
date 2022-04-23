import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "./App.css";

import { Button } from "primereact/button";
import Navbar from "./components/Navbar";

function App() {
	const [count, setCount] = useState(0);
	const [userData, setUserData] = useState(null);

	const fetchUserData = (userName) => {
		const dataPath = userName
			? "../src/data/authenticated.json"
			: "../src/data/visitor.json";

		fetch(dataPath)
			.then((resp) => resp.json())
			.then((data) => setUserData(data))
			.catch((err) => console.log(err));
	};

	const signIn = (username) => {
		localStorage.setItem("helloVite", username);
		fetchUserData(username);
	};

	const signOut = () => {
		localStorage.removeItem("helloVite");
		fetchUserData(null);
	};

	useEffect(() => {
		// check localStorage for authentication state
		const helloViteUsr = localStorage.getItem("helloVite");

		fetchUserData(helloViteUsr);
	}, []);

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<p>Hello Vite + React!</p>
				<p>
					<Button
						label={`count is ${count}`}
						onClick={() => setCount((count) => count + 1)}
					/>
				</p>
				<p>
					Edit <code>App.jsx</code> and save to test HMR updates.
				</p>
				<p>
					<a
						className='App-link'
						href='https://reactjs.org'
						target='_blank'
						rel='noopener noreferrer'>
						Learn React
					</a>
					{" | "}
					<a
						className='App-link'
						href='https://vitejs.dev/guide/features.html'
						target='_blank'
						rel='noopener noreferrer'>
						Vite Docs
					</a>
				</p>
			</header>

			<Navbar userData={userData} signIn={signIn} signOut={signOut} />
		</div>
	);
}

export default App;
