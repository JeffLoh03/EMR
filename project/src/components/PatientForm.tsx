import React, { useState } from 'react';
import { Plus, X, User, Heart, Phone, MapPin, Calendar } from 'lucide-react';
import { Patient, Ward, Prescription } from '../types';

interface PatientFormProps {
  wards: Ward[];
  onAddPatient: (patient: Omit<Patient, 'id'>) => void;
  onAddPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  onAddToQueue: (patientId: string, prescriptions: Prescription[]) => void;
  availableMedications: Array<{ id: string; name: string; dosage: string; boxNumber: 1 | 2 | 3 }>;
  onClose: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  wards, 
  onAddPatient, 
  onAddPrescription, 
  onAddToQueue, 
  availableMedications, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodType: '',
    wardId: '',
    bedNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  });
  
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedicalCondition, setNewMedicalCondition] = useState('');
  const [selectedMedications, setSelectedMedications] = useState<Array<{ medicationId: string; frequency: string; duration: string; notes: string }>>([]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Omit<Patient, 'id'> = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      bloodType: formData.bloodType,
      allergies,
      medicalHistory,
      wardId: formData.wardId,
      bedNumber: formData.bedNumber,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship
      }
    };

    onAddPatient(newPatient);

    // Create prescriptions for selected medications
    const patientId = Date.now().toString();

    selectedMedications.forEach((selectedMed, index) => {
      const medication = availableMedications.find(m => m.id === selectedMed.medicationId);
      if (medication) {
        const prescription: Prescription = {
          id: `${patientId}-${index}`,
          patientId,
          patientName: formData.name,
          medicationId: medication.id,
          medicationName: medication.name,
          dosage: medication.dosage,
          frequency: selectedMed.frequency,
          duration: selectedMed.duration,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + parseInt(selectedMed.duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          prescribedBy: 'Dr. Current User',
          status: 'Active',
          notes: selectedMed.notes,
          boxNumber: medication.boxNumber
        };
        onAddPrescription(prescription);
      }
    });

    onClose();
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addMedicalCondition = () => {
    if (newMedicalCondition.trim() && !medicalHistory.includes(newMedicalCondition.trim())) {
      setMedicalHistory([...medicalHistory, newMedicalCondition.trim()]);
      setNewMedicalCondition('');
    }
  };

  const removeMedicalCondition = (index: number) => {
    setMedicalHistory(medicalHistory.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    setSelectedMedications([...selectedMedications, { medicationId: '', frequency: '', duration: '', notes: '' }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    setSelectedMedications(prev => prev.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    ));
  };

  const removeMedication = (index: number) => {
    setSelectedMedications(selectedMedications.filter((_, i) => i !== index));
  };

  const getBoxColor = (boxNumber: number) => {
    switch (boxNumber) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-600" />
              <span>Add New Patient</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="150"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Medical Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type *</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm flex items-center space-x-1">
                        <span>{allergy}</span>
                        <button
                          type="button"
                          onClick={() => removeAllergy(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newMedicalCondition}
                    onChange={(e) => setNewMedicalCondition(e.target.value)}
                    placeholder="Add medical condition"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalCondition())}
                  />
                  <button
                    type="button"
                    onClick={addMedicalCondition}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicalHistory.map((condition, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center space-x-1">
                      <span>{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeMedicalCondition(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-500" />
                <span>Hospital Assignment</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ward *</label>
                  <select
                    value={formData.wardId}
                    onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Ward</option>
                    {wards.map(ward => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name} - {ward.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bed Number *</label>
                  <input
                    type="text"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                    placeholder="e.g., A-101"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span>Medications</span>
                </h3>
                <button
                  type="button"
                  onClick={addMedication}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medication</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedMedications.map((selectedMed, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
                        <select
                          value={selectedMed.medicationId}
                          onChange={(e) => updateMedication(index, 'medicationId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Medication</option>
                          {availableMedications.map(medication => (
                            <option key={medication.id} value={medication.id}>
                              {medication.name} ({medication.dosage}) - Box {medication.boxNumber}
                            </option>
                          ))}
                        </select>
                        {selectedMed.medicationId && (
                          <div className="mt-1">
                            {(() => {
                              const med = availableMedications.find(m => m.id === selectedMed.medicationId);
                              return med ? (
                                <span className={`inline-block px-2 py-1 rounded text-xs ${getBoxColor(med.boxNumber)}`}>
                                  Box {med.boxNumber}
                                </span>
                              ) : null;
                            })()}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                        <select
                          value={selectedMed.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Frequency</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="As needed">As needed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                        <input
                          type="number"
                          value={selectedMed.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 30"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <input
                          type="text"
                          value={selectedMed.notes}
                          onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Special instructions..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedMedications.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No medications added. Click "Add Medication" to prescribe medications for this patient.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-purple-500" />
                <span>Emergency Contact</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    placeholder="+1-555-0123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                  <input
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                    placeholder="e.g., Spouse, Parent"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Patient</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};