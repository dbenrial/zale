// Mock database store with localStorage persistence

export interface ACData {
  id: string;
  location: string;
  merk: string;
  freon: 'R32' | 'R410' | 'R22';
  date: string;
  status: 'good' | 'broken';
}

export interface MaintenanceData {
  id: string;
  date: string;
  acId: string;
  location: string;
  merk: string;
  freon: string;
  damage: string;
  repair: string;
  information: string;
}

export interface FreonData {
  id: string;
  date: string;
  acId: string;
  location: string;
  freon: string;
  damage: string;
  repair: string;
  kg: number;
}

export interface ScheduleData {
  id: string;
  date: string;
  acId: string;
  location: string;
  merek: string;
  duration: 'Finished' | 'Reschedule' | 'Schedule';
}

export interface DocumentData {
  id: string;
  name: string;
  type: 'jpg' | 'png' | 'pdf';
  url: string;
  uploadDate: string;
}

// Initial mock data
const initialACData: ACData[] = [
  { id: 'AC001', location: 'Ruang Server', merk: 'Daikin', freon: 'R32', date: '2024-01-15', status: 'good' },
  { id: 'AC002', location: 'Ruang Meeting A', merk: 'Panasonic', freon: 'R410', date: '2023-06-20', status: 'good' },
  { id: 'AC003', location: 'Ruang Manager', merk: 'LG', freon: 'R22', date: '2022-03-10', status: 'broken' },
  { id: 'AC004', location: 'Lobby Utama', merk: 'Samsung', freon: 'R32', date: '2024-02-28', status: 'good' },
  { id: 'AC005', location: 'Ruang IT', merk: 'Sharp', freon: 'R410', date: '2023-11-05', status: 'good' },
  { id: 'AC006', location: 'Gudang', merk: 'Gree', freon: 'R22', date: '2021-08-12', status: 'broken' },
  { id: 'AC007', location: 'Kantin', merk: 'Daikin', freon: 'R32', date: '2024-03-01', status: 'good' },
  { id: 'AC008', location: 'Ruang HR', merk: 'Panasonic', freon: 'R410', date: '2023-09-15', status: 'good' },
];

const initialMaintenanceData: MaintenanceData[] = [
  { id: 'MT001', date: '2024-11-01', acId: 'AC003', location: 'Ruang Manager', merk: 'LG', freon: 'R22', damage: 'Kompresor bocor', repair: 'Ganti seal kompresor', information: 'Perlu pengecekan ulang dalam 1 bulan' },
  { id: 'MT002', date: '2024-10-15', acId: 'AC006', location: 'Gudang', merk: 'Gree', freon: 'R22', damage: 'Filter kotor', repair: 'Bersihkan filter', information: 'Selesai' },
  { id: 'MT003', date: '2024-10-20', acId: 'AC001', location: 'Ruang Server', merk: 'Daikin', freon: 'R32', damage: 'Pengecekan rutin', repair: 'Tidak ada kerusakan', information: 'Kondisi baik' },
];

const initialFreonData: FreonData[] = [
  { id: 'FR001', date: '2024-10-01', acId: 'AC003', location: 'Ruang Manager', freon: 'R22', damage: 'Kebocoran pipa', repair: 'Las pipa + isi ulang', kg: 2.5 },
  { id: 'FR002', date: '2024-09-15', acId: 'AC002', location: 'Ruang Meeting A', freon: 'R410', damage: 'Freon kurang', repair: 'Isi ulang', kg: 1.0 },
  { id: 'FR003', date: '2024-11-10', acId: 'AC006', location: 'Gudang', freon: 'R22', damage: 'Kebocoran katup', repair: 'Ganti katup + isi ulang', kg: 3.0 },
];

const initialScheduleData: ScheduleData[] = [
  { id: 'SC001', date: '2024-12-10', acId: 'AC001', location: 'Ruang Server', merek: 'Daikin', duration: 'Schedule' },
  { id: 'SC002', date: '2024-12-05', acId: 'AC003', location: 'Ruang Manager', merek: 'LG', duration: 'Schedule' },
  { id: 'SC003', date: '2024-11-28', acId: 'AC005', location: 'Ruang IT', merek: 'Sharp', duration: 'Finished' },
  { id: 'SC004', date: '2024-12-15', acId: 'AC004', location: 'Lobby Utama', merek: 'Samsung', duration: 'Reschedule' },
];

const initialDocumentData: DocumentData[] = [
  { id: 'DOC001', name: 'Manual AC Daikin', type: 'pdf', url: '#', uploadDate: '2024-01-10' },
  { id: 'DOC002', name: 'Foto Instalasi Lobby', type: 'jpg', url: '#', uploadDate: '2024-02-15' },
  { id: 'DOC003', name: 'Diagram Wiring AC', type: 'png', url: '#', uploadDate: '2024-03-20' },
];

// Helper functions
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Initialize data if not exists
export const initializeData = () => {
  if (!localStorage.getItem('acData')) {
    setStorageItem('acData', initialACData);
  }
  if (!localStorage.getItem('maintenanceData')) {
    setStorageItem('maintenanceData', initialMaintenanceData);
  }
  if (!localStorage.getItem('freonData')) {
    setStorageItem('freonData', initialFreonData);
  }
  if (!localStorage.getItem('scheduleData')) {
    setStorageItem('scheduleData', initialScheduleData);
  }
  if (!localStorage.getItem('documentData')) {
    setStorageItem('documentData', initialDocumentData);
  }
};

// CRUD operations for AC Data
export const getACData = (): ACData[] => getStorageItem('acData', initialACData);
export const setACData = (data: ACData[]) => setStorageItem('acData', data);
export const addACData = (item: ACData) => {
  const data = getACData();
  data.push(item);
  setACData(data);
};
export const updateACData = (id: string, item: Partial<ACData>) => {
  const data = getACData();
  const index = data.findIndex(d => d.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...item };
    setACData(data);
  }
};
export const deleteACData = (id: string) => {
  const data = getACData().filter(d => d.id !== id);
  setACData(data);
};

// CRUD operations for Maintenance
export const getMaintenanceData = (): MaintenanceData[] => getStorageItem('maintenanceData', initialMaintenanceData);
export const setMaintenanceData = (data: MaintenanceData[]) => setStorageItem('maintenanceData', data);
export const addMaintenanceData = (item: MaintenanceData) => {
  const data = getMaintenanceData();
  data.push(item);
  setMaintenanceData(data);
};
export const updateMaintenanceData = (id: string, item: Partial<MaintenanceData>) => {
  const data = getMaintenanceData();
  const index = data.findIndex(d => d.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...item };
    setMaintenanceData(data);
  }
};
export const deleteMaintenanceData = (id: string) => {
  const data = getMaintenanceData().filter(d => d.id !== id);
  setMaintenanceData(data);
};

// CRUD operations for Freon
export const getFreonData = (): FreonData[] => getStorageItem('freonData', initialFreonData);
export const setFreonData = (data: FreonData[]) => setStorageItem('freonData', data);
export const addFreonData = (item: FreonData) => {
  const data = getFreonData();
  data.push(item);
  setFreonData(data);
};
export const updateFreonData = (id: string, item: Partial<FreonData>) => {
  const data = getFreonData();
  const index = data.findIndex(d => d.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...item };
    setFreonData(data);
  }
};
export const deleteFreonData = (id: string) => {
  const data = getFreonData().filter(d => d.id !== id);
  setFreonData(data);
};

// CRUD operations for Schedule
export const getScheduleData = (): ScheduleData[] => getStorageItem('scheduleData', initialScheduleData);
export const setScheduleData = (data: ScheduleData[]) => setStorageItem('scheduleData', data);
export const addScheduleData = (item: ScheduleData) => {
  const data = getScheduleData();
  data.push(item);
  setScheduleData(data);
};
export const updateScheduleData = (id: string, item: Partial<ScheduleData>) => {
  const data = getScheduleData();
  const index = data.findIndex(d => d.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...item };
    setScheduleData(data);
  }
};
export const deleteScheduleData = (id: string) => {
  const data = getScheduleData().filter(d => d.id !== id);
  setScheduleData(data);
};

// CRUD operations for Documents
export const getDocumentData = (): DocumentData[] => getStorageItem('documentData', initialDocumentData);
export const setDocumentData = (data: DocumentData[]) => setStorageItem('documentData', data);
export const addDocumentData = (item: DocumentData) => {
  const data = getDocumentData();
  data.push(item);
  setDocumentData(data);
};
export const deleteDocumentData = (id: string) => {
  const data = getDocumentData().filter(d => d.id !== id);
  setDocumentData(data);
};

// Auth
export const checkAuth = (username: string, password: string): boolean => {
  return username === 'rizal' && password === '123456';
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const setAuthenticated = (value: boolean) => {
  localStorage.setItem('isAuthenticated', String(value));
};
