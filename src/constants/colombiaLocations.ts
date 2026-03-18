export interface DepartmentOption {
  department: string;
  cities: string[];
}

export const COLOMBIA_LOCATIONS: DepartmentOption[] = [
  { department: 'Antioquia', cities: ['Medellin', 'Envigado', 'Bello', 'Itagui', 'Rionegro'] },
  { department: 'Atlantico', cities: ['Barranquilla', 'Soledad', 'Puerto Colombia'] },
  { department: 'Bogota D.C.', cities: ['Bogota'] },
  { department: 'Bolivar', cities: ['Cartagena', 'Turbaco', 'Arjona'] },
  { department: 'Caldas', cities: ['Manizales', 'Chinchina', 'Villamaria'] },
  { department: 'Cauca', cities: ['Popayan', 'Santander de Quilichao'] },
  { department: 'Cesar', cities: ['Valledupar', 'Aguachica'] },
  { department: 'Cordoba', cities: ['Monteria', 'Cereté'] },
  { department: 'Cundinamarca', cities: ['Soacha', 'Chia', 'Zipaquira', 'Facatativa'] },
  { department: 'Huila', cities: ['Neiva', 'Pitalito'] },
  { department: 'Magdalena', cities: ['Santa Marta', 'Cienaga'] },
  { department: 'Meta', cities: ['Villavicencio', 'Acacias'] },
  { department: 'Narino', cities: ['Pasto', 'Tumaco'] },
  { department: 'Norte de Santander', cities: ['Cucuta', 'Villa del Rosario'] },
  { department: 'Quindio', cities: ['Armenia', 'Calarca'] },
  { department: 'Risaralda', cities: ['Pereira', 'Dosquebradas'] },
  { department: 'Santander', cities: ['Bucaramanga', 'Floridablanca', 'Giron'] },
  { department: 'Sucre', cities: ['Sincelejo'] },
  { department: 'Tolima', cities: ['Ibague', 'Espinal'] },
  { department: 'Valle del Cauca', cities: ['Cali', 'Palmira', 'Buenaventura', 'Tulua'] },
];

export const COLOMBIA_DEPARTMENTS = COLOMBIA_LOCATIONS.map((entry) => entry.department);

export function getCitiesByDepartment(department: string): string[] {
  const normalized = department.trim().toLowerCase();
  const found = COLOMBIA_LOCATIONS.find((entry) => entry.department.toLowerCase() === normalized);
  return found ? found.cities : [];
}
