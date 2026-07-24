import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// No StrictMode: double-mounting disposes drei's Environment cubemap and
// double-runs the GLB material/LED setup.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
