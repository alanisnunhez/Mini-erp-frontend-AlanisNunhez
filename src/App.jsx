import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // reemplazamos la URL que estaba con la URL real de login del Mini ERP
      const response = await fetch('https://API_DEL_MINI_ERP/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Credenciales invalidas');

      const data = await response.json();
      setToken(data.token); 
      fetchProducts(data.token);
    } catch (err) {
      setError(err.message);
    }
  };


  const fetchProducts = async (authToken) => {
    try {
      const response = await fetch('https://API_DEL_MINI_ERP/products', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error al obtener la lista de productos');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Mini ERP - Gestión de Productos</h1>

      {!token ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <h2>Iniciar Sesión</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="email"
            placeholder="Correo electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contrasenha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      ) : (
        <div>
          <h2>Lista de Productos</h2>
          <ul>
            {products.map((prod, index) => (
              <li key={prod.id || index}>
                <strong>{prod.name || prod.nombre}</strong> - ${prod.price || prod.precio}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;