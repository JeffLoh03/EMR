import React from 'react';
import { Clock, User, Pill, CheckCircle, XCircle, Play, Pause } from 'lucide-react';
import { DispenseQueue as DispenseQueueType, Prescription } from '../types';

interface DispenseQueueProps {
  queue: DispenseQueueType[];
  onStartDispensing: (queueItem: DispenseQueueType) => void;
  onPauseDispensing: () => void;
  isProcessing: boolean;
  currentProcessingId?: string;
}

export const DispenseQueue: React.FC<DispenseQueueProps> = ({
  queue,
  onStartDispensing,
  onPauseDispensing,
  isProcessing,
  currentProcessingId
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Waiting': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Pill className="w-4 h-4 animate-pulse" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Error': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getBoxColor = (boxNumber: number) => {
    switch (boxNumber) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-green-500';
      case 3: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Dispensing Queue</span>
        </h3>
        <div className="flex items-center space-x-2">
          {isProcessing ? (
            <button
              onClick={onPauseDispensing}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          ) : (
            <span className="text-sm text-gray-500">
              {queue.filter(q => q.status === 'Waiting').length} patients waiting
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No patients in dispensing queue</p>
          </div>
        ) : (
          queue.map((queueItem, index) => (
            <div
              key={queueItem.id}
              className={`border rounded-lg p-4 transition-all ${
                queueItem.id === currentProcessingId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{queueItem.patientName}</h4>
                    <p className="text-sm text-gray-500">
                      {queueItem.prescriptions.length} medications
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(queueItem.status)}`}>
                    {getStatusIcon(queueItem.status)}
                    <span className="ml-1">{queueItem.status}</span>
                  </span>
                  {queueItem.status === 'Waiting' && !isProcessing && (
                    <button
                      onClick={() => onStartDispensing(queueItem)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {queueItem.prescriptions.map((prescription, prescIndex) => (
                  <div
                    key={prescription.id}
                    className={`p-3 rounded-lg border ${
                      queueItem.status === 'Processing' && prescIndex === queueItem.currentPrescriptionIndex
                        ? 'border-blue-500 bg-blue-50'
                        : prescIndex < queueItem.currentPrescriptionIndex
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{prescription.medicationName}</span>
                      <div className={`w-4 h-4 rounded-full ${getBoxColor(prescription.boxNumber)}`} />
                    </div>
                    <p className="text-xs text-gray-600">{prescription.dosage}</p>
                    <p className="text-xs text-gray-500">Box {prescription.boxNumber}</p>
                    {queueItem.status === 'Processing' && prescIndex === queueItem.currentPrescriptionIndex && (
                      <div className="mt-2">
                        <div className="w-full bg-blue-200 rounded-full h-1">
                          <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                      </div>
                    )}
                    {prescIndex < queueItem.currentPrescriptionIndex && (
                      <div className="mt-2 flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Dispensed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Queue position: #{index + 1} • Added: {new Date(queueItem.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};