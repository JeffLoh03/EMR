import React, { useState } from 'react';
import { Users, Building, Clipboard, Pill, Search, Bell, Settings, Plus } from 'lucide-react';
import { PatientCard } from './components/PatientCard';
import { PatientForm } from './components/PatientForm';
import { WardOverview } from './components/WardOverview';
import { PrescriptionManager } from './components/PrescriptionManager';
import { MedicationDispenser } from './components/MedicationDispenser';
import { useArduinoSimulator } from './hooks/useArduinoSimulator';
import { Patient, Ward, Prescription } from './types';
import { mockPatients, mockWards, mockMedications, mockPrescriptions } from './data/mockData';

type ActiveTab = 'patients' | 'wards' | 'prescriptions' | 'dispenser';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('patients');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [wards, setWards] = useState<Ward[]>(mockWards);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  
  const { 
    dispenseHistory, 
    dispenseQueue, 
    isProcessing, 
    currentProcessingId,
    addToQueue, 
    startDispensing, 
    pauseDispensing 
  } = useArduinoSimulator();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.bedNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const handleAddPrescription = (prescription: Omit<Prescription, 'id'>) => {
    const newPrescription: Prescription = {
      ...prescription,
      id: Date.now().toString()
    };
    setPrescriptions(prev => [...prev, newPrescription]);
  };

  const handleUpdatePrescription = (updatedPrescription: Prescription) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === updatedPrescription.id ? updatedPrescription : p
    ));
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleWardSelect = (ward: Ward) => {
    console.log('Selected ward:', ward);
    // Could implement ward detail view here
  };

  const getTabIcon = (tab: ActiveTab) => {
    switch (tab) {
      case 'patients': return <Users className="w-5 h-5" />;
      case 'wards': return <Building className="w-5 h-5" />;
      case 'prescriptions': return <Clipboard className="w-5 h-5" />;
      case 'dispenser': return <Pill className="w-5 h-5" />;
    }
  };

  const getTabLabel = (tab: ActiveTab) => {
    switch (tab) {
      case 'patients': return 'Patients';
      case 'wards': return 'Wards';
      case 'prescriptions': return 'Prescriptions';
      case 'dispenser': return 'Dispenser';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MediCare EMR</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['patients', 'wards', 'prescriptions', 'dispenser'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getTabIcon(tab)}
                <span>{getTabLabel(tab)}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Patient Management</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {filteredPatients.length} patients found
                </div>
                <button
                  onClick={() => setShowPatientForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Patient</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onSelect={handlePatientSelect}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Ward Overview</h2>
              <div className="text-sm text-gray-500">
                {wards.length} wards total
              </div>
            </div>
            
            <WardOverview wards={wards} onWardSelect={handleWardSelect} />
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionManager
            prescriptions={prescriptions}
            patients={patients}
            medications={mockMedications}
            onAddPrescription={handleAddPrescription}
            onUpdatePrescription={handleUpdatePrescription}
          />
        )}

        {activeTab === 'dispenser' && (
          <MedicationDispenser
            prescriptions={prescriptions}
            onAddToQueue={addToQueue}
            onStartDispensing={startDispensing}
            onPauseDispensing={pauseDispensing}
            dispenseHistory={dispenseHistory}
            dispenseQueue={dispenseQueue}
            isProcessing={isProcessing}
            currentProcessingId={currentProcessingId}
          />
        )}
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedPatient.name}</p>
                      <p><strong>Age:</strong> {selectedPatient.age}</p>
                      <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                      <p><strong>Blood Type:</strong> {selectedPatient.bloodType}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hospital Information</h3>
                    <div className="space-y-2">
                      <p><strong>Ward:</strong> {wards.find(w => w.id === selectedPatient.wardId)?.name}</p>
                      <p><strong>Bed:</strong> {selectedPatient.bedNumber}</p>
                      <p><strong>Admission:</strong> {new Date(selectedPatient.admissionDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {selectedPatient.status}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Medical History</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedPatient.medicalHistory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Allergies</h3>
                  {selectedPatient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No known allergies</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                  <div className="space-y-1">
                    <p><strong>Name:</strong> {selectedPatient.emergencyContact.name}</p>
                    <p><strong>Phone:</strong> {selectedPatient.emergencyContact.phone}</p>
                    <p><strong>Relationship:</strong> {selectedPatient.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Form Modal */}
      {showPatientForm && (
        <PatientForm
          wards={wards}
          availableMedications={mockMedications}
          onAddPatient={handleAddPatient}
          onAddPrescription={handleAddPrescription}
          onClose={() => setShowPatientForm(false)}
        />
      )}
    </div>
  );
}

export default App;