import React, { useState } from 'react';
import { Send, Pill, CheckCircle, XCircle, Clock, AlertTriangle, Users, Plus } from 'lucide-react';
import { Prescription, DispenseRequest, DispenseQueue as DispenseQueueType } from '../types';
import { DispenseQueue } from './DispenseQueue';

interface MedicationDispenserProps {
  prescriptions: Prescription[];
  onAddToQueue: (patientId: string, prescriptions: Prescription[]) => void;
  onStartDispensing: (queueItem: DispenseQueueType) => void;
  onPauseDispensing: () => void;
  dispenseHistory: DispenseRequest[];
  dispenseQueue: DispenseQueueType[];
  isProcessing: boolean;
  currentProcessingId?: string;
}

export const MedicationDispenser: React.FC<MedicationDispenserProps> = ({
  prescriptions,
  onAddToQueue,
  onStartDispensing,
  onPauseDispensing,
  dispenseHistory,
  dispenseQueue,
  isProcessing,
  currentProcessingId
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  
  // Group prescriptions by patient
  const patientGroups = activePrescriptions.reduce((groups, prescription) => {
    if (!groups[prescription.patientId]) {
      groups[prescription.patientId] = [];
    }
    groups[prescription.patientId].push(prescription);
    return groups;
  }, {} as Record<string, Prescription[]>);

  const handleAddToQueue = (patientId: string) => {
    const patientPrescriptions = patientGroups[patientId];
    if (patientPrescriptions && patientPrescriptions.length > 0) {
      onAddToQueue(patientId, patientPrescriptions);
      setSelectedPatientId('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Dispensing': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getBoxColor = (boxNumber: number) => {
    switch (boxNumber) {
      case 1: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 2: return 'bg-green-100 text-green-800 border-green-200';
      case 3: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Medication Dispenser</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">
              {Object.keys(patientGroups).length} patients with prescriptions
            </span>
          </div>
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600">3 boxes available</span>
        </div>
      </div>

      {/* Medication Box Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(boxNumber => {
          const boxPrescriptions = activePrescriptions.filter(p => p.boxNumber === boxNumber);
          const boxMedication = boxPrescriptions[0];
          
          return (
            <div key={boxNumber} className={`border-2 rounded-lg p-4 ${getBoxColor(boxNumber)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Box {boxNumber}</h3>
                <Pill className="w-5 h-5" />
              </div>
              {boxMedication ? (
                <div>
                  <p className="font-medium">{boxMedication.medicationName}</p>
                  <p className="text-sm opacity-75">{boxMedication.dosage}</p>
                  <p className="text-sm opacity-75">{boxPrescriptions.length} prescriptions</p>
                </div>
              ) : (
                <p className="text-sm opacity-75">Empty</p>
              )}
            </div>
          );
        })}
      </div>
      {/* Add Patient to Queue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Plus className="w-5 h-5 text-green-600" />
          <span>Add Patient to Dispensing Queue</span>
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Patient</option>
              {Object.entries(patientGroups).map(([patientId, prescriptions]) => (
                <option key={patientId} value={patientId}>
                  {prescriptions[0].patientName} ({prescriptions.length} medications)
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => handleAddToQueue(selectedPatientId)}
            disabled={!selectedPatientId || isProcessing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Queue</span>
          </button>
        </div>
      </div>

      {/* Dispensing Queue */}
      <DispenseQueue
        queue={dispenseQueue}
        onStartDispensing={onStartDispensing}
        onPauseDispensing={onPauseDispensing}
        isProcessing={isProcessing}
        currentProcessingId={currentProcessingId}
      />

      {/* Patient Prescriptions Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Patients with Active Prescriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(patientGroups).map(([patientId, prescriptions]) => (
            <div key={patientId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{prescriptions[0].patientName}</h4>
                  <p className="text-sm text-gray-500">{prescriptions.length} medications</p>
                </div>
                <button
                  onClick={() => handleAddToQueue(patientId)}
                  disabled={isProcessing || dispenseQueue.some(q => q.patientId === patientId && q.status !== 'Completed')}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Add to Queue
                </button>
              </div>
              <div className="space-y-2">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm font-medium">{prescription.medicationName}</span>
                      <p className="text-xs text-gray-500">{prescription.dosage}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getBoxColor(prescription.boxNumber)}`}>
                      {prescription.boxNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispense History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Dispense History</h3>
        <div className="space-y-3">
          {dispenseHistory.slice(-5).reverse().map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{request.patientName}</h4>
                  <p className="text-sm text-gray-500">
                    {request.medicationName} - {request.dosage} (Box {request.boxNumber})
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(request.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(request.status)}
                  <span className="text-sm font-medium">{request.status}</span>
                </div>
              </div>
              {request.arduinoResponse && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  Arduino Response: {request.arduinoResponse}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};