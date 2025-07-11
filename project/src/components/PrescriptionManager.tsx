import React, { useState } from 'react';
import { Plus, Edit, Calendar, User, Pill, Clock, AlertCircle } from 'lucide-react';
import { Prescription, Patient, Medication } from '../types';

interface PrescriptionManagerProps {
  prescriptions: Prescription[];
  patients: Patient[];
  medications: Medication[];
  onAddPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  onUpdatePrescription: (prescription: Prescription) => void;
}

export const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  prescriptions,
  patients,
  medications,
  onAddPrescription,
  onUpdatePrescription
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedMedication, setSelectedMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !selectedMedication) return;

    const patient = patients.find(p => p.id === selectedPatient);
    const medication = medications.find(m => m.id === selectedMedication);
    
    if (!patient || !medication) return;

    const newPrescription: Omit<Prescription, 'id'> = {
      patientId: patient.id,
      patientName: patient.name,
      medicationId: medication.id,
      medicationName: medication.name,
      dosage,
      frequency,
      duration,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      prescribedBy: 'Dr. Current User',
      status: 'Active',
      notes,
      boxNumber: medication.boxNumber
    };

    onAddPrescription(newPrescription);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedPatient('');
    setSelectedMedication('');
    setDosage('');
    setFrequency('');
    setDuration('');
    setNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Prescription Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Prescription</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Prescription</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - Bed {patient.bedNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
                <select
                  value={selectedMedication}
                  onChange={(e) => setSelectedMedication(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Medication</option>
                  {medications.map(medication => (
                    <option key={medication.id} value={medication.id}>
                      {medication.name} - Box {medication.boxNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 500mg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 30"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional instructions or notes..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Prescription
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Pill className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{prescription.medicationName}</h4>
                  <p className="text-sm text-gray-500">Box {prescription.boxNumber}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                {prescription.status}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{prescription.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{prescription.dosage}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{prescription.frequency}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {new Date(prescription.startDate).toLocaleDateString()} - 
                  {new Date(prescription.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {prescription.notes && (
              <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-md">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                <span className="text-sm text-blue-700">{prescription.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};