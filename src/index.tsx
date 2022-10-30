import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';

import './index.scss';

let container = document.getElementById('root');
if (container === null) {
	container = document.createElement('div');
	container.id = 'root';
	document.append(container);
}

const root = ReactDOM.createRoot(container);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
