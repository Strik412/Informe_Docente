import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

type Informe = {
  id: string;
  periodo: string;
  fecha_elaboracion: string;
};

type Props = {
  userId: string;
  onNuevoInforme: () => void;
  onEditarInforme: (id: string) => void;
};

export const DocenteDashboard = ({ userId, onNuevoInforme, onEditarInforme }: Props) => {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMisInformes();
  }, [userId]);

  const cargarMisInformes = async () => {
    try {
      setLoading(true);
      // Filtramos estrictamente por el ID del docente autenticado
      const { data, error } = await supabase
        .from('informes')
        .select('id, periodo, fecha_elaboracion')
        .eq('docente_id', userId)
        .order('fecha_elaboracion', { ascending: false });

      if (error) throw error;
      setInformes(data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error al cargar tus informes:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '15px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' as const };
  const thStyle = { ...thTdStyle, backgroundColor: '#1a3b5c', color: 'white', fontWeight: 'bold' };
  const btnNuevoStyle = { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginBottom: '15px' };
  const btnAccionStyle = { backgroundColor: '#2980b9', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando tus informes...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#1a3b5c', borderBottom: '2px solid #1a3b5c', paddingBottom: '10px', textTransform: 'uppercase' }}>
        Panel del Docente - Mis Informes
      </h2>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={onNuevoInforme} style={btnNuevoStyle}>
          + Crear Nuevo Informe Académico
        </button>
      </div>

      <p style={{ color: '#555', marginTop: '10px' }}>
        Aquí puedes visualizar el historial de los informes que has elaborado y editarlos si necesitas corregir alguna información.
      </p>

      {informes.length === 0 ? (
        <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#777' }}>Aún no has registrado ningún informe. Haz clic en el botón verde para empezar.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Período Académico</th>
              <th style={thStyle}>Fecha de Elaboración</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((informe) => (
              <tr key={informe.id}>
                <td style={thTdStyle}>{informe.periodo || 'N/A'}</td>
                <td style={thTdStyle}>{informe.fecha_elaboracion || 'N/A'}</td>
                <td style={{ ...thTdStyle, textAlign: 'center' }}>
                  <button 
                    onClick={() => onEditarInforme(informe.id)} 
                    style={btnAccionStyle}
                  >
                    Ver / Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};