import { useEffect } from 'react';
import { useForm, useFieldArray, type FieldValues, useWatch } from 'react-hook-form';
import { supabase } from '../supabase';
import { pdf } from '@react-pdf/renderer'; 
import { PlantillaPDF, type InformeData } from './PlantillaPDF'; 

type Props = {
  rolUsuario: 'docente' | 'secretaria' | 'coordinador' | 'director';
  userId: string;
  informeId?: string | null;  
  onVolver?: () => void;      
};

interface AsignaturaData {
  carrera: string; materia: string; codigo: string; paralelo: string;
  estudiantes: string; asistencia: string; aprobados: string; reprobados: string;
  // 2.1 Resultados
  resultados_tabla: string; resultados_actividades: string; res_instrumento: string; 
  resultados_logro: string; res_criterios: string;
  res_acciones: string; res_propuestas: string; 
  // 2.2 Habilidades Blandas
  habilidades_tabla: string[]; hab_criterios: string; hab_instrumento: string;
  habilidades_actividades: string; habilidades_logro: string;
  hab_acciones: string; hab_propuestas: string; hab_cumplimiento: string;
  // 2.3 TAC
  tac_herramienta: string; tac_tabla: string[]; tac_actividades: string; tac_logro: string;
  tac_acciones: string; tac_propuestas: string; tac_cumplimiento: string;
  // Evidencias
  habilidades_evidencias?: FileList; 
  tac_evidencias?: FileList;         
}

const habilidadesOpciones = [
  "Comunicación efectiva", "Trabajo en equipo", "Liderazgo", "Empatía", 
  "Resolución de problemas", "Adaptabilidad", "Gestión del tiempo", 
  "Pensamiento crítico", "Manejo del estrés", "Ética y Responsabilidad", "Puntualidad"
];

const tacOpciones = [
  "Entornos virtuales de aprendizaje (LMS)", 
  "Programas ofimáticos", 
  "Simuladores académicos", 
  "Aplicaciones de realidad virtual o aumentada", 
  "Herramientas colaborativas", 
  "Recursos multimedia interactivos"
];

export const InformeForm = ({ rolUsuario, userId, informeId, onVolver }: Props) => {
  const esSoloLectura = rolUsuario === 'coordinador' || rolUsuario === 'director';

  const { register, handleSubmit, control, reset } = useForm<FieldValues>({
    defaultValues: {
      asignaturas: [{
        carrera: '', materia: '', codigo: '', paralelo: '',
        estudiantes: '', asistencia: '', aprobados: '', reprobados: '',
        resultados_tabla: '', resultados_actividades: '', res_instrumento: '', 
        resultados_logro: '', res_criterios: '', res_acciones: '', res_propuestas: '',
        habilidades_tabla: [], hab_criterios: '', hab_instrumento: '', habilidades_actividades: '', habilidades_logro: '',
        hab_acciones: '', hab_propuestas: '', hab_cumplimiento: '',
        tac_herramienta: '', tac_tabla: [], tac_actividades: '', tac_logro: '',
        tac_acciones: '', tac_propuestas: '', tac_cumplimiento: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "asignaturas" });
  const watchAsignaturas = useWatch({ control, name: "asignaturas", defaultValue: [] });
  const datosFormulario = useWatch({ control }); 

  useEffect(() => {
    if (informeId) {
      cargarDatosInforme();
    }
  }, [informeId]);

  const cargarDatosInforme = async () => {
    try {
      const { data, error } = await supabase.from('informes').select('*').eq('id', informeId).single();
      if (error) throw error;
      
      if (data) {
        const asignaturasCargadas = data.actividades_docencia?.map((act: any, index: number) => {
          const evalAsig = data.evaluaciones_asignaturas?.[index] || {};
          return { ...act, ...evalAsig };
        }) || [];

        reset({
          docente_nombre: data.docente_nombre || '',
          periodo: data.periodo || '',
          asignaturas: asignaturasCargadas,
          investigacion_formacion: data.investigacion?.formacion || '',
          inv_proyecto: data.investigacion?.proyecto || '',
          inv_institucion: data.investigacion?.institucion || '',
          inv_cargo: data.investigacion?.cargo || '',
          inv_fecha: data.investigacion?.fecha || '',
          pub_autor: data.investigacion?.publicacion_autor || '',
          pub_titulo: data.investigacion?.publicacion_titulo || '',
          pub_revista: data.investigacion?.publicacion_revista || '',
          posgrado_estudiante: data.investigacion?.posgrado_estudiante || '',
          posgrado_titulo: data.investigacion?.posgrado_titulo || '',
          posgrado_fecha: data.investigacion?.posgrado_fecha || '',
          vinc_proyecto: data.vinculacion?.proyecto || '',
          vinc_institucion: data.vinculacion?.institucion || '',
          vinc_avance: data.vinculacion?.avance || '',
          designaciones: data.vinculacion?.designaciones || '',
          tutoria_estudiante: data.gestion_academica?.tutoria_estudiante || '',
          tutoria_titulo: data.gestion_academica?.tutoria_titulo || '',
          tutoria_fecha: data.gestion_academica?.tutoria_fecha || '',
          tutoria_estado: data.gestion_academica?.tutoria_estado || '',
          lector_estudiante: data.gestion_academica?.lector_estudiante || '',
          lector_titulo: data.gestion_academica?.lector_titulo || '',
          lector_fecha: data.gestion_academica?.lector_fecha || '',
          practicas_estudiante: data.gestion_academica?.practicas_estudiante || '',
          practicas_empresa: data.gestion_academica?.practicas_empresa || '',
          practicas_fecha: data.gestion_academica?.practicas_fecha || '',
          evidencias: data.evidencias || '',
          fecha_elaboracion: data.fecha_elaboracion || '',
          firma_docente: data.firma_docente || ''
        });
      }
    } catch (err) {
      console.error("Error al cargar informe:", err);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const actividades_docencia = data.asignaturas.map((a: AsignaturaData) => ({
        carrera: a.carrera, materia: a.materia, codigo: a.codigo, paralelo: a.paralelo,
        estudiantes: a.estudiantes, asistencia: a.asistencia, aprobados: a.aprobados, reprobados: a.reprobados
      }));

      const evaluaciones_asignaturas = data.asignaturas.map((a: AsignaturaData) => ({
        materia: a.materia, 
        paralelo: a.paralelo, 
        resultados_tabla: a.resultados_tabla,
        resultados_actividades: a.resultados_actividades, 
        res_instrumento: a.res_instrumento,
        resultados_logro: a.resultados_logro,
        res_criterios: a.res_criterios,
        res_acciones: a.res_acciones, 
        res_propuestas: a.res_propuestas, 
        habilidades_tabla: a.habilidades_tabla, 
        hab_criterios: a.hab_criterios,
        hab_instrumento: a.hab_instrumento,
        habilidades_actividades: a.habilidades_actividades,
        habilidades_logro: a.habilidades_logro, 
        hab_acciones: a.hab_acciones,
        hab_propuestas: a.hab_propuestas,
        hab_cumplimiento: a.hab_cumplimiento,
        tac_herramienta: a.tac_herramienta,
        tac_tabla: a.tac_tabla,
        tac_actividades: a.tac_actividades, 
        tac_logro: a.tac_logro,
        tac_acciones: a.tac_acciones,
        tac_propuestas: a.tac_propuestas,
        tac_cumplimiento: a.tac_cumplimiento
      }));

      const informePreparado = {
        docente_id: userId,
        docente_nombre: data.docente_nombre,
        periodo: data.periodo,
        actividades_docencia: actividades_docencia,
        evaluaciones_asignaturas: evaluaciones_asignaturas, 
        gestion_academica: {
          tutoria_estudiante: data.tutoria_estudiante, tutoria_titulo: data.tutoria_titulo,
          tutoria_fecha: data.tutoria_fecha, tutoria_estado: data.tutoria_estado,
          lector_estudiante: data.lector_estudiante, lector_titulo: data.lector_titulo, lector_fecha: data.lector_fecha,
          practicas_estudiante: data.practicas_estudiante, practicas_empresa: data.practicas_empresa, practicas_fecha: data.practicas_fecha
        },
        investigacion: {
          formacion: data.investigacion_formacion, proyecto: data.inv_proyecto, institucion: data.inv_institucion,
          cargo: data.inv_cargo, fecha: data.inv_fecha, publicacion_autor: data.pub_autor,
          publicacion_titulo: data.pub_titulo, publicacion_revista: data.pub_revista,
          posgrado_estudiante: data.posgrado_estudiante, posgrado_titulo: data.posgrado_titulo, posgrado_fecha: data.posgrado_fecha
        },
        vinculacion: { proyecto: data.vinc_proyecto, institucion: data.vinc_institucion, avance: data.vinc_avance, designaciones: data.designaciones },
        evidencias: data.evidencias, 
        fecha_elaboracion: data.fecha_elaboracion, 
        firma_docente: data.firma_docente
      };

      if (informeId) {
        const { error } = await supabase.from('informes').update(informePreparado).eq('id', informeId);
        if (error) throw error;
        alert("¡Informe actualizado correctamente!");
        if (onVolver) onVolver(); 
      } else {
        const { error } = await supabase.from('informes').insert([informePreparado]);
        if (error) throw error;
        alert("¡Informe guardado con éxito en la base de datos!");
        if (onVolver) onVolver(); 
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Error al guardar: " + error.message);
      } else {
        alert("Ocurrió un error desconocido al guardar.");
      }
    }
  };

  const generarYDescargarPDF = async () => {
    try {
      const blob = await pdf(<PlantillaPDF datos={(datosFormulario || {}) as unknown as InformeData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Informe_Docente_${datosFormulario?.docente_nombre || 'UCE'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Hubo un error al generar el documento PDF.");
    }
  };

  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' as const };
  const fieldsetStyle = { marginBottom: '25px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fafafa', boxSizing: 'border-box' as const };
  const legendStyle = { fontWeight: 'bold', color: '#1a3b5c', padding: '0 10px', fontSize: '1.1em' };
  const subTitleStyle = { fontWeight: 'bold', marginTop: '15px', marginBottom: '10px', color: '#333', borderBottom: '1px solid #ddd' };
  const checkboxGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' };
  const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95em' };
  const fileInputStyle = { ...inputStyle, padding: '5px', backgroundColor: '#fff', border: '1px dashed #3498db', cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
      {onVolver && (
        <button type="button" onClick={onVolver} style={{ marginBottom: '20px', backgroundColor: '#7f8c8d', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Volver al Listado
        </button>
      )}

      <h2 style={{ textAlign: 'center', borderBottom: '2px solid #1a3b5c', paddingBottom: '10px', color: '#1a3b5c', textTransform: 'uppercase' }}>
        {informeId ? 'Revisión y Edición de Informe' : 'Informe Unificado de Actividades y Evaluación Docente'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* ================= SECCIÓN 1 ================= */}
        <fieldset disabled={esSoloLectura || rolUsuario !== 'docente'} style={fieldsetStyle}>
          <legend style={legendStyle}>1. DATOS GENERALES Y ACTIVIDADES DE DOCENCIA</legend>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', minWidth: 0 }}>
            <div style={{ flex: 2, minWidth: 0 }}>
              <label>Docente:</label>
              <input {...register('docente_nombre')} type="text" style={{...inputStyle, marginBottom: '10px'}} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label>Período académico:</label>
              <input {...register('periodo')} type="text" style={{...inputStyle, marginBottom: '10px'}} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Formación pedagógica y disciplinar (congresos, seminarios, maestrías, doctorados, etc.):</label>
            <textarea {...register('investigacion_formacion')} rows={2} style={{...inputStyle, marginBottom: '10px'}}></textarea>
          </div>
          
          <div style={subTitleStyle}>Tabla de Actividades de Docencia</div>
          
          <div style={{ width: '100%', overflowX: 'auto', marginBottom: '10px' }}>
            <div style={{ minWidth: '850px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 2.5fr 80px 70px 70px 70px 70px 70px 60px', gap: '5px', fontSize: '0.85em', textAlign: 'center', fontWeight: 'bold', alignItems: 'center', marginBottom: '10px' }}>
                <div>Nº</div><div>Carrera</div><div>Asignatura / Materia</div><div>Código</div><div>Paralelo</div><div>N° Est.</div><div>% Asist.</div><div>% Aprob.</div><div>% Reprob.</div><div>Acción</div>
              </div>
              
              {fields.map((item, index) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 2.5fr 80px 70px 70px 70px 70px 70px 60px', gap: '5px', marginBottom: '8px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</div>
                  <div><input {...register(`asignaturas.${index}.carrera`)} type="text" style={inputStyle} /></div>
                  <div><input {...register(`asignaturas.${index}.materia`)} type="text" style={inputStyle} /></div>
                  <div><input {...register(`asignaturas.${index}.codigo`)} type="text" style={inputStyle} /></div>
                  <div><input {...register(`asignaturas.${index}.paralelo`)} type="text" style={inputStyle} /></div>
                  <div><input {...register(`asignaturas.${index}.estudiantes`)} type="number" style={inputStyle} /></div>
                  <div><input {...register(`asignaturas.${index}.asistencia`)} type="number" style={inputStyle} /></div>
                  <div><input {...register(`asignaturas.${index}.aprobados`)} type="number" style={inputStyle} /></div>
                  <div><input {...register(`asignaturas.${index}.reprobados`)} type="number" style={inputStyle} /></div>
                  <div style={{ textAlign: 'center' }}>
                    {index > 0 && !esSoloLectura && (
                      <button type="button" onClick={() => remove(index)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} title="Eliminar fila">X</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!esSoloLectura && rolUsuario === 'docente' && (
            <button type="button" onClick={() => append({ carrera: '', materia: '', codigo: '', paralelo: '', estudiantes: '', asistencia: '', aprobados: '', reprobados: '', resultados_tabla: '', resultados_actividades: '', res_instrumento: '', resultados_logro: '', res_criterios: '', res_acciones: '', res_propuestas: '', habilidades_tabla: [], hab_criterios: '', hab_instrumento: '', habilidades_actividades: '', habilidades_logro: '', hab_acciones: '', hab_propuestas: '', hab_cumplimiento: '', tac_herramienta: '', tac_tabla: [], tac_actividades: '', tac_logro: '', tac_acciones: '', tac_propuestas: '', tac_cumplimiento: '' })} style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginTop: '10px' }}>
              + Añadir Materia
            </button>
          )}
        </fieldset>

        {/* ================= SECCIÓN 2 ================= */}
        {fields.map((item, index) => (
          <fieldset key={`eval-${item.id}`} disabled={esSoloLectura || rolUsuario !== 'docente'} style={{...fieldsetStyle, borderColor: '#3498db'}}>
            <legend style={{...legendStyle, color: '#3498db', textTransform: 'uppercase'}}>
              2. EVALUACIÓN ESPECÍFICA: {watchAsignaturas[index]?.materia || `Materia ${index + 1}`}
            </legend>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', minWidth: 0 }}>
              <div style={{ flex: 2, minWidth: 0 }}>
                <label>Asignatura:</label>
                <input value={watchAsignaturas[index]?.materia || ''} readOnly style={{...inputStyle, backgroundColor: '#e9ecef', color: '#555', cursor: 'not-allowed'}} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label>Paralelo:</label>
                <input value={watchAsignaturas[index]?.paralelo || ''} readOnly style={{...inputStyle, backgroundColor: '#e9ecef', color: '#555', cursor: 'not-allowed'}} />
              </div>
            </div>

            {/* 2.1 Resultados de Aprendizaje */}
            <div style={subTitleStyle}>2.1. Resultados de Aprendizaje Evaluados</div>
            <label>Resultado de aprendizaje (perfil de egreso / sílabo):</label>
            <textarea {...register(`asignaturas.${index}.resultados_tabla`)} rows={3} style={{...inputStyle, marginBottom: '10px'}} placeholder="Aplica conceptos de Arquitectura de Computadores en la resolución de problemas." ></textarea>
            
            <label>Criterios evaluados:</label>
            <textarea {...register(`asignaturas.${index}.res_criterios`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="- Aplicación práctica - Comprensión conceptual - Análisis de resultados"></textarea>

            <label>Instrumento de evaluación:</label>
            <textarea {...register(`asignaturas.${index}.res_instrumento`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ej. Rúbrica, examen escrito, guía de observación..."></textarea>
            
            <label>Actividades aplicadas (enfoque general):</label>
            <textarea {...register(`asignaturas.${index}.resultados_actividades`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Desarrollo de prácticas en simuladores.. / Evaluaciones en aula virtual / Uso de herramientas colaborativas.. / Implementación de recursos multimedia, etc."></textarea>              
            
            <label>Resultados obtenidos (Logro de aprendizaje):</label>
            <textarea {...register(`asignaturas.${index}.resultados_logro`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Desarrollo de proyectos integradores / Evaluaciones prácticas y teóricas / Uso de simuladores y herramientas digitales (TAC) / Resolución de problemas en clase / Actividades en aula virtual, etc."></textarea>
            
            
            <label style={{fontWeight: 'bold', color: '#555'}}>Mejora Continua (Resultados de Aprendizaje):</label>
            <div style={{ marginTop: '5px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #3498db' }}>
              <label>Acciones:</label>
              <textarea {...register(`asignaturas.${index}.res_acciones`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Reforzar contenidos críticos detectados / Incrementar actividades prácticas, etc."></textarea>
              <label>Propuestas:</label>
              <textarea {...register(`asignaturas.${index}.res_propuestas`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Desarrollo de nuevos recursos / Implementación de estrategias de enseñanza, etc."></textarea>
              <label>Cumplimiento:</label>
              <textarea {...register(`asignaturas.${index}.res_cumplimiento`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Se cumplió el 100% de los resultados de aprendizaje planificados en el sílabo / Se cumplió la mayoría de los resultados, con ajustes en ciertas actividades por tiempo / No se logró cubrir completamente algunos resultados, requiriendo refuerzo en el siguiente período, etc"></textarea>
            </div>

            <label style={{fontWeight: 'bold', color: '#3498db'}}>Adjuntar evidencias:</label>
            <input type="file" multiple {...register(`asignaturas.${index}.habilidades_evidencias`)} style={{...fileInputStyle, marginBottom: '15px'}} />

            {/* 2.2 Habilidades Blandas */}
            <div style={subTitleStyle}>2.2. Habilidades Blandas Implementadas</div>
            <label>Seleccione las habilidades aplicadas:</label>
            <div style={checkboxGridStyle}>
              {habilidadesOpciones.map(opcion => (
                <label key={opcion} style={checkboxLabelStyle}>
                  <input type="checkbox" value={opcion} {...register(`asignaturas.${index}.habilidades_tabla`)} style={{ transform: 'scale(1.2)' }} />
                  {opcion}
                </label>
              ))}
            </div>

            <label>Criterios Evaluados:</label>
            <textarea {...register(`asignaturas.${index}.hab_criterios`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Criterios de evaluación definidos / Indicadores de logro establecidos, etc."></textarea>
            
            <label>Instrumento:</label>
            <textarea {...register(`asignaturas.${index}.hab_instrumento`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Exámenes / Trabajos prácticos / Evaluaciones por pares, etc."></textarea>
            
            <label>Actividades aplicadas (enfoque general):</label>
            <textarea {...register(`asignaturas.${index}.habilidades_actividades`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Actividades de aprendizaje / Talleres / Proyectos, etc."></textarea>
            
            <label>Resultados evidenciados:</label>
            <textarea {...register(`asignaturas.${index}.habilidades_logro`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Resultados de aprendizaje alcanzados / Logros obtenidos en las actividades, etc."></textarea>
            
            <label style={{fontWeight: 'bold', color: '#555'}}>Mejora Continua (Habilidades Blandas):</label>
            <div style={{ marginTop: '5px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #3498db' }}>
              <label>Acciones:</label>
              <textarea {...register(`asignaturas.${index}.hab_acciones`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Acciones tomadas para mejorar el desempeño / Mejoras implementadas, etc."></textarea>
              <label>Propuestas:</label>
              <textarea {...register(`asignaturas.${index}.hab_propuestas`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Propuestas de mejora / Ideas para optimizar el proceso, etc."></textarea>
              <label>Cumplimiento:</label>
              <textarea {...register(`asignaturas.${index}.hab_cumplimiento`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Se cumplió el 100% de los resultados de aprendizaje planificados en el sílabo / Se cumplió la mayoría de los resultados, con ajustes en ciertas actividades por tiempo / No se logró cubrir completamente algunos resultados, requiriendo refuerzo en el siguiente período, etc."></textarea>
            </div>

            <label style={{fontWeight: 'bold', color: '#3498db'}}>Adjuntar evidencias de Habilidades Blandas:</label>
            <input type="file" multiple {...register(`asignaturas.${index}.habilidades_evidencias`)} style={{...fileInputStyle, marginBottom: '15px'}} />

            {/* 2.3 TAC */}
            <div style={subTitleStyle}>2.3. TAC Implementadas</div>
            <label>Herramienta TAC:</label>
            <textarea {...register(`asignaturas.${index}.tac_herramienta`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Herramienta utilizada para implementar las TAC, como software, plataformas, etc."></textarea>
            
            <label>Seleccione el tipo de Herramienta:</label>
            <div style={checkboxGridStyle}>
              {tacOpciones.map(opcion => (
                <label key={opcion} style={checkboxLabelStyle}>
                  <input type="checkbox" value={opcion} {...register(`asignaturas.${index}.tac_tabla`)} style={{ transform: 'scale(1.2)' }} />
                  {opcion}
                </label>
              ))}
            </div>

            <label>Actividades desarrolladas con TAC:</label>
            <textarea {...register(`asignaturas.${index}.tac_actividades`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Actividades de aprendizaje / Talleres / Proyectos, etc."></textarea>
            
            <label>Resultados obtenidos:</label>
            <textarea {...register(`asignaturas.${index}.tac_logro`)} rows={2} style={{...inputStyle, marginBottom: '10px'}} placeholder="Ejemplo: Resultados de aprendizaje alcanzados / Logros obtenidos en las actividades, etc."></textarea>
            
            <label style={{fontWeight: 'bold', color: '#555'}}>Mejora Continua (TAC):</label>
            <div style={{ marginTop: '5px', marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #3498db' }}>
              <label>Acciones:</label>
              <textarea {...register(`asignaturas.${index}.tac_acciones`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Acciones tomadas para mejorar el desempeño / Mejoras implementadas, etc."></textarea>
              <label>Propuestas:</label>
              <textarea {...register(`asignaturas.${index}.tac_propuestas`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Propuestas de mejora / Ideas para optimizar el proceso, etc."></textarea>
              <label>Cumplimiento:</label>
              <textarea {...register(`asignaturas.${index}.tac_cumplimiento`)} rows={2} style={{...inputStyle, marginBottom: '8px'}} placeholder="Ejemplo: Se cumplió el 100% de los resultados de aprendizaje planificados en el sílabo / Se cumplió la mayoría de los resultados, con ajustes en ciertas actividades por tiempo / No se logró cubrir completamente algunos resultados, requiriendo refuerzo en el siguiente período, etc."></textarea>
            </div>

            <label style={{fontWeight: 'bold', color: '#3498db'}}>Adjuntar evidencias TAC:</label>
            <input type="file" multiple {...register(`asignaturas.${index}.tac_evidencias`)} style={{...fileInputStyle, marginBottom: '10px'}} />
          </fieldset>
        ))}

        {/* ================= SECCIÓN 3 ================= */}
        <fieldset disabled={esSoloLectura || rolUsuario === 'docente'} style={{ ...fieldsetStyle, borderColor: '#e67e22' }}>
          <legend style={{ ...legendStyle, color: '#e67e22' }}>3. GESTIÓN ACADÉMICA</legend>
          
          <div style={subTitleStyle}>Trabajos de titulación (Tutor)</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', minWidth: 0, flexWrap: 'wrap' }}>
            <input {...register('tutoria_estudiante')} type="text" placeholder="Estudiante(s)" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
            <input {...register('tutoria_titulo')} type="text" placeholder="Título" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
            <input {...register('tutoria_fecha')} type="date" title="Fecha designación" style={{...inputStyle, flex: 1, minWidth: '120px'}} />
            <input {...register('tutoria_estado')} type="text" placeholder="Estado" style={{...inputStyle, flex: 1, minWidth: '100px'}} />
          </div>

          <div style={subTitleStyle}>Trabajos de titulación (Lector)</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', minWidth: 0, flexWrap: 'wrap' }}>
            <input {...register('lector_estudiante')} type="text" placeholder="Estudiante(s)" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
            <input {...register('lector_titulo')} type="text" placeholder="Título" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
            <input {...register('lector_fecha')} type="date" title="Fecha designación" style={{...inputStyle, flex: 1, minWidth: '120px'}} />
          </div>

          <div style={subTitleStyle}>Prácticas Preprofesionales (Tutor)</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', minWidth: 0, flexWrap: 'wrap' }}>
            <input {...register('practicas_estudiante')} type="text" placeholder="Estudiante(s)" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
            <input {...register('practicas_empresa')} type="text" placeholder="Empresa" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
            <input {...register('practicas_fecha')} type="date" title="Fecha designación" style={{...inputStyle, flex: 1, minWidth: '120px'}} />
          </div>
        </fieldset>

        {/* ================= SECCIÓN 4 ================= */}
        <fieldset disabled={esSoloLectura || rolUsuario === 'docente'} style={{ ...fieldsetStyle, borderColor: '#e67e22' }}>
          <legend style={{ ...legendStyle, color: '#e67e22' }}>4. VINCULACIÓN CON LA SOCIEDAD Y DESIGNACIONES</legend>
          <div style={subTitleStyle}>Proyectos de vinculación</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', minWidth: 0, flexWrap: 'wrap' }}>
             <input {...register('vinc_proyecto')} type="text" placeholder="Proyecto" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('vinc_institucion')} type="text" placeholder="Institución" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('vinc_avance')} type="text" placeholder="Avance (%)" style={{...inputStyle, flex: 1, minWidth: '100px'}} />
          </div>
          
          <div style={subTitleStyle}>Designaciones</div>
          <textarea {...register('designaciones')} rows={2} style={{...inputStyle, marginBottom: '10px'}}></textarea>
        </fieldset>

        {/* ================= SECCIÓN 5 ================= */}
        <fieldset disabled={esSoloLectura || rolUsuario === 'docente'} style={{ ...fieldsetStyle, borderColor: '#e67e22' }}>
          <legend style={{ ...legendStyle, color: '#e67e22' }}>5. INVESTIGACIÓN</legend>

          <div style={subTitleStyle}>Proyectos de investigación</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', minWidth: 0, flexWrap: 'wrap' }}>
             <input {...register('inv_proyecto')} type="text" placeholder="Proyecto" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('inv_institucion')} type="text" placeholder="Institución" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('inv_cargo')} type="text" placeholder="Cargo" style={{...inputStyle, flex: 1, minWidth: '120px'}} />
             <input {...register('inv_fecha')} type="text" placeholder="Fecha" style={{...inputStyle, flex: 1, minWidth: '100px'}} />
          </div>

          <div style={subTitleStyle}>Publicaciones y ponencias</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', minWidth: 0, flexWrap: 'wrap' }}>
             <input {...register('pub_autor')} type="text" placeholder="Autor(es)" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('pub_titulo')} type="text" placeholder="Título" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('pub_revista')} type="text" placeholder="Revista/congreso..." style={{...inputStyle, flex: 1, minWidth: '120px'}} />
          </div>

          <div style={subTitleStyle}>Dirección de tesis de maestría y/o doctorado</div>
           <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', minWidth: 0, flexWrap: 'wrap' }}>
             <input {...register('posgrado_estudiante')} type="text" placeholder="Estudiante(s)" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('posgrado_titulo')} type="text" placeholder="Título" style={{...inputStyle, flex: 2, minWidth: '150px'}} />
             <input {...register('posgrado_fecha')} type="date" title="Fecha designación" style={{...inputStyle, flex: 1, minWidth: '120px'}} />
          </div>
        </fieldset>

        {/* ================= SECCIÓN 6 ================= */}
        <fieldset disabled={esSoloLectura || rolUsuario !== 'docente'} style={fieldsetStyle}>
          <legend style={legendStyle}>6. EVIDENCIAS GENERALES Y CIERRE</legend>
          <label>Evidencias generales:</label>
          <textarea {...register('evidencias')} rows={3} style={{...inputStyle, marginBottom: '10px'}}></textarea>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '15px', minWidth: 0, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label>Fecha de elaboración:</label>
              <input {...register('fecha_elaboracion')} type="date" style={inputStyle} />
            </div>
            <div style={{ flex: 2, minWidth: '200px' }}>
              <label>Firma y Nombre del Docente:</label>
              <input {...register('firma_docente')} type="text" style={inputStyle} placeholder="Nombre completo para firma digital" />
            </div>
          </div>
        </fieldset>

        {/* ================= BOTONES FINALES ================= */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          {!esSoloLectura && (
            <button type="submit" style={{ flex: 1, backgroundColor: '#1a3b5c', color: '#fff', padding: '15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
              {informeId ? 'Actualizar Informe' : 'Guardar Informe'}
            </button>
          )}
          
          <button 
            type="button" 
            onClick={generarYDescargarPDF} 
            style={{ flex: 1, backgroundColor: '#c0392b', color: '#fff', padding: '15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
          >
            Descargar PDF
          </button>
        </div>
      </form>
    </div>
  );
};