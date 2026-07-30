export const initialElectricians = [
  {
    id: 1,
    firstName: 'Carlos',
    lastName: 'Ramirez',
    documentId: '1094123456',
    username: 'c.ramirez',
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Andrea',
    lastName: 'Lopez',
    documentId: '41908765',
    username: 'a.lopez',
    status: 'active',
  },
  {
    id: 3,
    firstName: 'Miguel',
    lastName: 'Torres',
    documentId: '1002456789',
    username: 'm.torres',
    status: 'inactive',
  },
]

export const allUsers = [
  ...initialElectricians.map((user) => ({
    ...user,
    role: 'Electrico',
  })),
  {
    id: 10,
    firstName: 'Sandra',
    lastName: 'Suarez',
    documentId: '42111222',
    username: 's.suarez',
    role: 'Administrador electrico',
    status: 'active',
  },
  {
    id: 11,
    firstName: 'Sistemas',
    lastName: 'Parque',
    documentId: '800009651',
    username: 'sistemas',
    role: 'Administrador',
    status: 'active',
  },
]

export const serviceConfig = {
  energy: {
    label: 'Energia',
    unit: 'kWh',
    rate: 325,
  },
  water: {
    label: 'Agua',
    unit: 'm3',
    rate: 4600,
  },
  gas: {
    label: 'Gas',
    unit: 'm3',
    rate: 2850,
  },
}

export const baseServiceRows = [
  {
    id: 1,
    nit: 'C901909460',
    client: 'Helados Kame SAS',
    location: 'Heladeria Flor del Cafe',
    previous: 210053,
    current: 211284,
  },
  {
    id: 2,
    nit: 'C860007538',
    client: 'Fed. Nacional Cafeteros',
    location: 'Juan Valdez',
    previous: 5154527,
    current: 5666873,
  },
  {
    id: 3,
    nit: 'C41962348',
    client: 'Doralba Bautista Motato',
    location: 'Territorio Paisaje',
    previous: 0,
    current: 0,
  },
  {
    id: 4,
    nit: 'C41886525',
    client: 'Baena Arango Luz Stella',
    location: 'Tienda Cafes',
    previous: 23406,
    current: 23450,
  },
  {
    id: 5,
    nit: 'C900581497',
    client: 'Gallo Campuzano SAS',
    location: 'Mecatos 1',
    previous: 50735,
    current: 50990,
  },
]

export const currentPeriod = 'Mayo 2026'

export const publicServiceDocuments = [
  {
    id: 'SP-2026-05',
    period: 'Mayo 2026',
    createdBy: 'Carlos Ramirez',
    status: 'Publicado',
    totalConsumption: 589864,
    totalAmount: 191705800,
    services: ['Energia', 'Agua', 'Gas'],
  },
  {
    id: 'SP-2026-04',
    period: 'Abril 2026',
    createdBy: 'Andrea Lopez',
    status: 'Exportado',
    totalConsumption: 562410,
    totalAmount: 182602300,
    services: ['Energia', 'Agua', 'Gas'],
  },
  {
    id: 'SP-2026-03',
    period: 'Marzo 2026',
    createdBy: 'Carlos Ramirez',
    status: 'Exportado',
    totalConsumption: 541932,
    totalAmount: 176127900,
    services: ['Energia', 'Agua', 'Gas'],
  },
]
