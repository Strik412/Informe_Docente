// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export interface AsignaturaDataPDF {
  carrera: string;
  materia: string;
  codigo: string;
  paralelo: string;
  estudiantes: string;
  asistencia: string;
  aprobados: string;
  reprobados: string;
  // 2.1
  resultados_tabla?: string;
  res_criterios?: string;
  res_instrumento?: string;
  resultados_actividades?: string;
  resultados_logro?: string;
  res_acciones?: string;
  res_propuestas?: string;
  res_cumplimiento?: string; // <--- Añadido aquí
  // 2.2
  habilidades_tabla?: string[];
  hab_criterios?: string;
  hab_instrumento?: string;
  habilidades_actividades?: string;
  habilidades_logro?: string;
  hab_acciones?: string;
  hab_propuestas?: string;
  hab_cumplimiento?: string;
  // 2.3
  tac_herramienta?: string;
  tac_tabla?: string[];
  tac_actividades?: string;
  tac_logro?: string;
  tac_acciones?: string;
  tac_propuestas?: string;
  tac_cumplimiento?: string;
}

export interface InformeData {
  docente_nombre?: string;
  periodo?: string;
  investigacion_formacion?: string;
  asignaturas?: AsignaturaDataPDF[];
  tutoria_estudiante?: string;
  tutoria_titulo?: string;
  tutoria_fecha?: string;
  tutoria_estado?: string;
  lector_estudiante?: string;
  lector_titulo?: string;
  lector_fecha?: string;
  practicas_estudiante?: string;
  practicas_empresa?: string;
  practicas_fecha?: string;
  vinc_proyecto?: string;
  vinc_institucion?: string;
  vinc_avance?: string;
  designaciones?: string;
  inv_proyecto?: string;
  inv_institucion?: string;
  inv_cargo?: string;
  inv_fecha?: string;
  pub_autor?: string;
  pub_titulo?: string;
  pub_revista?: string;
  posgrado_estudiante?: string;
  posgrado_titulo?: string;
  posgrado_fecha?: string;
  evidencias?: string;
  fecha_elaboracion?: string;
  firma_docente?: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    marginBottom: 20,
    textAlign: 'center',
  },
  universityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
  },
  facultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 3,
  },
  careerText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    textDecoration: 'underline',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 120,
  },
  value: {
    fontSize: 10,
    flex: 1,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 6,
    marginBottom: 8,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#e6e6e6',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    margin: 4,
    fontSize: 8,
    textAlign: 'center',
  },
  evalContainer: {
    marginTop: 8,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  evalTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a3b5c',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#333',
  },
  textValue: {
    fontSize: 9,
    marginLeft: 8,
    color: '#444',
    marginTop: 2,
  },
  subTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 6,
    color: '#1a3b5c',
  },
  signatureContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  signatureLine: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
  }
});

export const PlantillaPDF = ({ datos }: { datos: InformeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer} fixed>
        <Text style={styles.universityText}>UNIVERSIDAD CENTRAL DEL ECUADOR</Text>
        <Text style={styles.facultyText}>FACULTAD DE INGENIERÍA Y CIENCIAS APLICADAS</Text>
        <Text style={styles.careerText}>CARRERA DE SISTEMAS DE INFORMACIÓN</Text>
        <Text style={styles.reportTitle}>INFORME DE ACTIVIDADES DOCENTES</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Docente:</Text>
        <Text style={styles.value}>{datos?.docente_nombre || 'No especificado'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Período Académico:</Text>
        <Text style={styles.value}>{datos?.periodo || 'No especificado'}</Text>
      </View>

      {/* --- 1. ACTIVIDADES DE DOCENCIA --- */}
      <Text style={styles.sectionTitle}>1. Actividades de Docencia</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={{...styles.tableColHeader, width: '5%'}}><Text style={styles.tableCellHeader}>No.</Text></View>
          <View style={{...styles.tableColHeader, width: '25%'}}><Text style={styles.tableCellHeader}>Carrera</Text></View>
          <View style={{...styles.tableColHeader, width: '30%'}}><Text style={styles.tableCellHeader}>Materia</Text></View>
          <View style={{...styles.tableColHeader, width: '10%'}}><Text style={styles.tableCellHeader}>N° Est.</Text></View>
          <View style={{...styles.tableColHeader, width: '10%'}}><Text style={styles.tableCellHeader}>% Asist.</Text></View>
          <View style={{...styles.tableColHeader, width: '10%'}}><Text style={styles.tableCellHeader}>% Aprob.</Text></View>
          <View style={{...styles.tableColHeader, width: '10%'}}><Text style={styles.tableCellHeader}>% Reprob.</Text></View>
        </View>
        
        {datos?.asignaturas?.map((asignatura: AsignaturaDataPDF, index: number) => (
          <View style={styles.tableRow} key={index}>
            <View style={{...styles.tableCol, width: '5%'}}><Text style={styles.tableCell}>{index + 1}</Text></View>
            <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableCell}>{asignatura?.carrera}</Text></View>
            <View style={{...styles.tableCol, width: '30%'}}><Text style={styles.tableCell}>{asignatura?.materia}</Text></View>
            <View style={{...styles.tableCol, width: '10%'}}><Text style={styles.tableCell}>{asignatura?.estudiantes}</Text></View>
            <View style={{...styles.tableCol, width: '10%'}}><Text style={styles.tableCell}>{asignatura?.asistencia}</Text></View>
            <View style={{...styles.tableCol, width: '10%'}}><Text style={styles.tableCell}>{asignatura?.aprobados}</Text></View>
            <View style={{...styles.tableCol, width: '10%'}}><Text style={styles.tableCell}>{asignatura?.reprobados}</Text></View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>2. Formación pedagógica y disciplinar</Text>
      <Text style={{ fontSize: 9, marginBottom: 8 }}>{datos?.investigacion_formacion || 'N/A'}</Text>

      {/* --- EVALUACIÓN ESPECÍFICA POR ASIGNATURA --- */}
      <Text style={styles.sectionTitle}>Evaluación Específica por Asignatura</Text>
      {datos?.asignaturas?.map((asignatura: AsignaturaDataPDF, index: number) => (
        <View key={index} style={styles.evalContainer}>
          <Text style={styles.evalTitle}>
            Asignatura {index + 1}: {asignatura?.materia || 'Sin nombre'} (Paralelo: {asignatura?.paralelo || 'N/A'})
          </Text>

          {/* 2.1 */}
          <Text style={styles.subLabel}>2.1. Resultados de Aprendizaje Evaluados:</Text>
          <Text style={styles.textValue}>• Resultado: {asignatura?.resultados_tabla || 'N/A'}</Text>
          <Text style={styles.textValue}>• Criterios evaluados: {asignatura?.res_criterios || 'N/A'}</Text>
          <Text style={styles.textValue}>• Instrumento de evaluación: {asignatura?.res_instrumento || 'N/A'}</Text>
          <Text style={styles.textValue}>• Actividades aplicadas: {asignatura?.resultados_actividades || 'N/A'}</Text>
          <Text style={styles.textValue}>• Resultados obtenidos: {asignatura?.resultados_logro || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Acciones): {asignatura?.res_acciones || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Propuestas): {asignatura?.res_propuestas || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Cumplimiento): {asignatura?.res_cumplimiento || 'N/A'}</Text>

          {/* 2.2 */}
          <Text style={styles.subLabel}>2.2. Habilidades Blandas Implementadas:</Text>
          <Text style={styles.textValue}>• Habilidades seleccionadas: {asignatura?.habilidades_tabla?.join(', ') || 'Ninguna'}</Text>
          <Text style={styles.textValue}>• Criterios: {asignatura?.hab_criterios || 'N/A'}</Text>
          <Text style={styles.textValue}>• Instrumento: {asignatura?.hab_instrumento || 'N/A'}</Text>
          <Text style={styles.textValue}>• Actividades: {asignatura?.habilidades_actividades || 'N/A'}</Text>
          <Text style={styles.textValue}>• Resultados: {asignatura?.habilidades_logro || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Acciones): {asignatura?.hab_acciones || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Propuestas): {asignatura?.hab_propuestas || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Cumplimiento): {asignatura?.hab_cumplimiento || 'N/A'}</Text>

          {/* 2.3 */}
          <Text style={styles.subLabel}>2.3. Tecnologías de Aprendizaje y Conocimiento (TAC):</Text>
          <Text style={styles.textValue}>• Herramienta TAC: {asignatura?.tac_herramienta || 'N/A'}</Text>
          <Text style={styles.textValue}>• Tipo: {asignatura?.tac_tabla?.join(', ') || 'Ninguna'}</Text>
          <Text style={styles.textValue}>• Actividades: {asignatura?.tac_actividades || 'N/A'}</Text>
          <Text style={styles.textValue}>• Resultados: {asignatura?.tac_logro || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Acciones): {asignatura?.tac_acciones || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Propuestas): {asignatura?.tac_propuestas || 'N/A'}</Text>
          <Text style={styles.textValue}>• Mejora Continua (Cumplimiento): {asignatura?.tac_cumplimiento || 'N/A'}</Text>
        </View>
      ))}

      {/* --- 3. GESTIÓN ACADÉMICA --- */}
      <Text style={styles.sectionTitle}>3. Gestión Académica</Text>
      <Text style={styles.subTitle}>Trabajos de titulación (Tutor)</Text>
      <Text style={styles.textValue}>• Estudiante(s): {datos?.tutoria_estudiante || 'N/A'} | Título: {datos?.tutoria_titulo || 'N/A'} | Estado: {datos?.tutoria_estado || 'N/A'}</Text>

      <Text style={styles.subTitle}>Trabajos de titulación (Lector)</Text>
      <Text style={styles.textValue}>• Estudiante(s): {datos?.lector_estudiante || 'N/A'} | Título: {datos?.lector_titulo || 'N/A'}</Text>

      <Text style={styles.subTitle}>Prácticas Preprofesionales (Tutor)</Text>
      <Text style={styles.textValue}>• Estudiante: {datos?.practicas_estudiante || 'N/A'} | Empresa: {datos?.practicas_empresa || 'N/A'}</Text>

      {/* --- 4. VINCULACIÓN --- */}
      <Text style={styles.sectionTitle}>4. Vinculación con la Sociedad y Designaciones</Text>
      <Text style={styles.textValue}>• Proyecto: {datos?.vinc_proyecto || 'N/A'} | Institución: {datos?.vinc_institucion || 'N/A'} | Avance: {datos?.vinc_avance || 'N/A'}%</Text>
      <Text style={styles.textValue}>• Designaciones: {datos?.designaciones || 'N/A'}</Text>

      {/* --- 5. INVESTIGACIÓN --- */}
      <Text style={styles.sectionTitle}>5. Investigación</Text>
      <Text style={styles.textValue}>• Proyecto: {datos?.inv_proyecto || 'N/A'} | Institución: {datos?.inv_institucion || 'N/A'} | Cargo: {datos?.inv_cargo || 'N/A'}</Text>
      <Text style={styles.textValue}>• Publicación/Ponencia: {datos?.pub_titulo || 'N/A'} ({datos?.pub_revista || 'N/A'}) - Autor(es): {datos?.pub_autor || 'N/A'}</Text>
      <Text style={styles.textValue}>• Dirección de Tesis: {datos?.posgrado_titulo || 'N/A'} - Estudiante: {datos?.posgrado_estudiante || 'N/A'}</Text>

      {/* --- 6. EVIDENCIAS Y CIERRE --- */}
      <Text style={styles.sectionTitle}>6. Evidencias Generales y Cierre</Text>
      <Text style={styles.textValue}>{datos?.evidencias || 'N/A'}</Text>
      
      <View style={styles.signatureContainer} wrap={false}>
        <Text style={{ fontSize: 9, marginBottom: 25 }}>Fecha de elaboración: {datos?.fecha_elaboracion || 'N/A'}</Text>
        <View style={styles.signatureLine} />
        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{datos?.firma_docente || 'FIRMA Y NOMBRE DEL DOCENTE'}</Text>
      </View>
    </Page>
  </Document>
);