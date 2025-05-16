import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="bg-green-800 text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to My React App</h1>
        <p className="text-lg mb-4">
          This is a simple React application styled with Tailwind CSS.  
          </p>
       
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
