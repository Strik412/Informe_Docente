import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

type Informe = {
  id: string;
  docente_nombre: string;
  periodo: string;
  fecha_elaboracion: string;
};

type Props = {
  tituloDashboard: string;
  onSeleccionarInforme: (id: string) => void;
};

export const LecturaDashboard = ({ tituloDashboard, onSeleccionarInforme }: Props) => {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('informes')
        .select('id, docente_nombre, periodo, fecha_elaboracion')
        .order('periodo', { ascending: false });

      if (error) throw error;
      setInformes(data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error al cargar informes:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '15px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' as const };
  const thStyle = { ...thTdStyle, backgroundColor: '#1a3b5c', color: 'white', fontWeight: 'bold' };
  const btnStyle = { backgroundColor: '#2980b9', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando informes...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#1a3b5c', borderBottom: '2px solid #1a3b5c', paddingBottom: '10px', textTransform: 'uppercase' }}>
        {tituloDashboard}
      </h2>
      <p style={{ color: '#555', marginTop: '10px' }}>
        Lista general de informes académicos registrados en el sistema (Modo de lectura y supervisión).
      </p>

      {informes.length === 0 ? (
        <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#777' }}>No hay informes registrados en la base de datos todavía.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Docente</th>
              <th style={thStyle}>Período Académico</th>
              <th style={thStyle}>Fecha</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((informe) => (
              <tr key={informe.id}>
                <td style={thTdStyle}>{informe.docente_nombre || 'Sin nombre'}</td>
                <td style={thTdStyle}>{informe.periodo || 'N/A'}</td>
                <td style={thTdStyle}>{informe.fecha_elaboracion || 'N/A'}</td>
                <td style={{ ...thTdStyle, textAlign: 'center' }}>
                  <button 
                    onClick={() => onSeleccionarInforme(informe.id)} 
                    style={btnStyle}
                  >
                    Ver Informe / PDF
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