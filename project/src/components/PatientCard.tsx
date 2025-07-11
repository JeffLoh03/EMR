import React from 'react';
import { User, MapPin, Calendar, AlertCircle, Heart } from 'lucide-react';
import { Patient } from '../types';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(patient)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
          {patient.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Bed {patient.bedNumber}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(patient.admissionDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <Heart className="w-4 h-4 text-red-500" />
        <span className="text-sm text-gray-600">Blood Type: {patient.bloodType}</span>
      </div>

      {patient.allergies.length > 0 && (
        <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">
            Allergies: {patient.allergies.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};