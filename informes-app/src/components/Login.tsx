// src/components/Login.tsx
import { useState } from 'react';
import { supabase } from '../supabase';

export const Login = ({ onLoginExitoso }: { onLoginExitoso: (rol: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      // 1. Iniciamos sesión en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Buscamos el rol de este usuario en la tabla perfiles
      if (authData.user) {
        const { data: perfil, error: perfilError } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', authData.user.id)
          .single();

        if (perfilError) throw perfilError;
        
        // 3. Le avisamos a la app principal que ya entramos y le pasamos el rol
        if (perfil) {
          onLoginExitoso(perfil.rol);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Error al iniciar sesión: ' + error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#1a3b5c' }}>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            required 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={cargando}
          style={{ width: '100%', padding: '10px', backgroundColor: '#1a3b5c', color: 'white', border: 'none', borderRadius: '4px', cursor: cargando ? 'not-allowed' : 'pointer' }}
        >
          {cargando ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};