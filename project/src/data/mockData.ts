import { Patient, Ward, Medication, Prescription } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 34,
    gender: 'Female',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Shellfish'],
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    wardId: '1',
    bedNumber: 'A-101',
    admissionDate: '2024-01-15',
    status: 'Active',
    emergencyContact: {
      name: 'John Johnson',
      phone: '+1-555-0123',
      relationship: 'Spouse'
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 67,
    gender: 'Male',
    bloodType: 'O-',
    allergies: ['Aspirin'],
    medicalHistory: ['Cardiac Arrhythmia', 'COPD'],
    wardId: '2',
    bedNumber: 'B-205',
    admissionDate: '2024-01-18',
    status: 'Critical',
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '+1-555-0456',
      relationship: 'Daughter'
    }
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 28,
    gender: 'Female',
    bloodType: 'B+',
    allergies: [],
    medicalHistory: ['Asthma'],
    wardId: '1',
    bedNumber: 'A-103',
    admissionDate: '2024-01-20',
    status: 'Active',
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phone: '+1-555-0789',
      relationship: 'Brother'
    }
  }
];

export const mockWards: Ward[] = [
  {
    id: '1',
    name: 'General Medicine',
    department: 'Internal Medicine',
    capacity: 20,
    currentOccupancy: 15,
    beds: Array.from({ length: 20 }, (_, i) => ({
      id: `bed-1-${i + 1}`,
      number: `A-${101 + i}`,
      isOccupied: i < 15,
      patientId: i < 3 ? (i + 1).toString() : undefined,
      status: i < 15 ? 'Occupied' : 'Available'
    }))
  },
  {
    id: '2',
    name: 'Cardiology',
    department: 'Cardiology',
    capacity: 15,
    currentOccupancy: 8,
    beds: Array.from({ length: 15 }, (_, i) => ({
      id: `bed-2-${i + 1}`,
      number: `B-${201 + i}`,
      isOccupied: i < 8,
      patientId: i === 4 ? '2' : undefined,
      status: i < 8 ? 'Occupied' : 'Available'
    }))
  },
  {
    id: '3',
    name: 'Emergency',
    department: 'Emergency Medicine',
    capacity: 10,
    currentOccupancy: 6,
    beds: Array.from({ length: 10 }, (_, i) => ({
      id: `bed-3-${i + 1}`,
      number: `E-${301 + i}`,
      isOccupied: i < 6,
      status: i < 6 ? 'Occupied' : 'Available'
    }))
  }
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'Oral',
    boxNumber: 1,
    stockLevel: 150,
    expiryDate: '2024-12-31'
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'Oral',
    boxNumber: 2,
    stockLevel: 200,
    expiryDate: '2024-11-30'
  },
  {
    id: '3',
    name: 'Albuterol',
    dosage: '90mcg',
    frequency: 'As needed',
    route: 'Oral',
    boxNumber: 3,
    stockLevel: 75,
    expiryDate: '2024-10-15'
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    medicationId: '1',
    medicationName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '30 days',
    startDate: '2024-01-15',
    endDate: '2024-02-14',
    prescribedBy: 'Dr. Smith',
    status: 'Active',
    notes: 'Take with meals to reduce GI upset',
    boxNumber: 1
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Michael Chen',
    medicationId: '2',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '60 days',
    startDate: '2024-01-18',
    endDate: '2024-03-18',
    prescribedBy: 'Dr. Williams',
    status: 'Active',
    notes: 'Monitor blood pressure regularly',
    boxNumber: 2
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Emily Rodriguez',
    medicationId: '3',
    medicationName: 'Albuterol',
    dosage: '90mcg',
    frequency: 'As needed',
    duration: '90 days',
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    prescribedBy: 'Dr. Johnson',
    status: 'Active',
    notes: 'Use for asthma symptoms',
    boxNumber: 3
  }
];