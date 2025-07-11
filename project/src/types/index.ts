export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  wardId: string;
  bedNumber: string;
  admissionDate: string;
  status: 'Active' | 'Discharged' | 'Critical';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Ward {
  id: string;
  name: string;
  department: string;
  capacity: number;
  currentOccupancy: number;
  beds: Bed[];
}

export interface Bed {
  id: string;
  number: string;
  isOccupied: boolean;
  patientId?: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: 'Oral' | 'IV' | 'Injection';
  boxNumber: 1 | 2 | 3;
  stockLevel: number;
  expiryDate: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Pending';
  notes: string;
  boxNumber: 1 | 2 | 3;
}

export interface DispenseRequest {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  boxNumber: 1 | 2 | 3;
  timestamp: string;
  status: 'Pending' | 'Dispensing' | 'Completed' | 'Error';
  arduinoResponse?: string;
  queuePosition?: number;
}

export interface DispenseQueue {
  id: string;
  patientId: string;
  patientName: string;
  prescriptions: Prescription[];
  status: 'Waiting' | 'Processing' | 'Completed' | 'Error';
  timestamp: string;
  currentPrescriptionIndex: number;
}