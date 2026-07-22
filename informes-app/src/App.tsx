// src/App.tsx
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { InformeForm } from './components/InformeForm'
import { SecretariaDashboard } from './components/SecretariaDashboard'
import { DocenteDashboard } from './components/DocenteDashboard'
import { LecturaDashboard } from './components/LecturaDashboard'
import { Login } from './components/Login'

type RolPermitido = 'docente' | 'secretaria' | 'coordinador' | 'director';

function App() {
  const [rolActivo, setRolActivo] = useState<RolPermitido | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Estados de navegación por rol
  const [informeSecretariaId, setInformeSecretariaId] = useState<string | null>(null);
  const [vistaDocente, setVistaDocente] = useState<'listado' | 'formulario'>('listado');
  const [informeDocenteId, setInformeDocenteId] = useState<string | null>(null);
  const [informeCoordinadorId, setInformeCoordinadorId] = useState<string | null>(null);
  const [informeDirectorId, setInformeDirectorId] = useState<string | null>(null);

  const cargarPerfil = async (id: string) => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', id)
      .single();
    
    if (data) {
        setRolActivo(data.rol as RolPermitido);
    } else {
        console.error("No se encontró el perfil o fue bloqueado:", error);
        setRolActivo(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        cargarPerfil(session.user.id).finally(() => setCargandoSesion(false));
      } else {
        setCargandoSesion(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        cargarPerfil(session.user.id);
      } else {
        setUserId(null);
        setRolActivo(null);
        setInformeSecretariaId(null);
        setVistaDocente('listado');
        setInformeDocenteId(null);
        setInformeCoordinadorId(null);
        setInformeDirectorId(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setInformeSecretariaId(null);
    setVistaDocente('listado');
    setInformeDocenteId(null);
    setInformeCoordinadorId(null);
    setInformeDirectorId(null);
  };

  if (cargandoSesion) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando sistema...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#1a3b5c', padding: '15px 20px', borderRadius: '8px', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Sistema Integrado de Informes</h1>
        {userId && (
          <button 
            onClick={handleLogout}
            style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        )}
      </div>

      {/* LÓGICA DE RENDERIZADO */}
      {!userId ? (
        <Login onLoginExitoso={(rol) => setRolActivo(rol as RolPermitido)} />
      ) : !rolActivo ? (
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '2px solid #e74c3c', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#e74c3c', marginTop: 0 }}>⚠️ Sesión iniciada, pero falta el Rol</h2>
          <p>El sistema te reconoció correctamente, pero la base de datos <strong>no encontró tu rol</strong> en la tabla de perfiles.</p>
          <div style={{ backgroundColor: '#f4f6f8', padding: '15px', fontWeight: 'bold', textAlign: 'center', borderRadius: '4px', marginBottom: '20px', letterSpacing: '1px', fontSize: '1.1em' }}>
            {userId}
          </div>
        </div>
      ) : rolActivo === 'secretaria' ? (
        informeSecretariaId === null ? (
          <SecretariaDashboard onSeleccionarInforme={(id: string) => setInformeSecretariaId(id)} />
        ) : (
          <InformeForm 
            rolUsuario="secretaria" 
            userId={userId!} 
            informeId={informeSecretariaId} 
            onVolver={() => setInformeSecretariaId(null)} 
          />
        )
      ) : rolActivo === 'docente' ? (
        vistaDocente === 'listado' ? (
          <DocenteDashboard 
            userId={userId!} 
            onNuevoInforme={() => {
              setInformeDocenteId(null);
              setVistaDocente('formulario');
            }} 
            onEditarInforme={(id: string) => {
              setInformeDocenteId(id);
              setVistaDocente('formulario');
            }} 
          />
        ) : (
          <InformeForm 
            rolUsuario="docente" 
            userId={userId!} 
            informeId={informeDocenteId} 
            onVolver={() => {
              setInformeDocenteId(null);
              setVistaDocente('listado');
            }} 
          />
        )
      ) : rolActivo === 'coordinador' ? (
        informeCoordinadorId === null ? (
          <LecturaDashboard 
            tituloDashboard="Panel del Coordinador - Supervisión de Informes" 
            onSeleccionarInforme={(id: string) => setInformeCoordinadorId(id)} 
          />
        ) : (
          <InformeForm 
            rolUsuario="coordinador" 
            userId={userId!} 
            informeId={informeCoordinadorId} 
            onVolver={() => setInformeCoordinadorId(null)} 
          />
        )
      ) : rolActivo === 'director' ? (
        informeDirectorId === null ? (
          <LecturaDashboard 
            tituloDashboard="Panel del Director - Supervisión de Informes" 
            onSeleccionarInforme={(id: string) => setInformeDirectorId(id)} 
          />
        ) : (
          <InformeForm 
            rolUsuario="director" 
            userId={userId!} 
            informeId={informeDirectorId} 
            onVolver={() => setInformeDirectorId(null)} 
          />
        )
      ) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>Rol no reconocido en el sistema.</div>
      )}
    </div>
  )
}

export default App;