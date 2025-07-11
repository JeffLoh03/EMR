import React from 'react';
import { Building, Users, Bed, AlertTriangle } from 'lucide-react';
import { Ward } from '../types';

interface WardOverviewProps {
  wards: Ward[];
  onWardSelect: (ward: Ward) => void;
}

export const WardOverview: React.FC<WardOverviewProps> = ({ wards, onWardSelect }) => {
  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOccupancyBg = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 75) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wards.map((ward) => (
        <div
          key={ward.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onWardSelect(ward)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getOccupancyBg(ward.currentOccupancy, ward.capacity)}`}>
                <Building className={`w-6 h-6 ${getOccupancyColor(ward.currentOccupancy, ward.capacity)}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{ward.name}</h3>
                <p className="text-sm text-gray-500">{ward.department}</p>
              </div>
            </div>
            {ward.currentOccupancy / ward.capacity >= 0.9 && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Occupancy</span>
              </div>
              <span className={`text-sm font-medium ${getOccupancyColor(ward.currentOccupancy, ward.capacity)}`}>
                {ward.currentOccupancy}/{ward.capacity}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  ward.currentOccupancy / ward.capacity >= 0.9 ? 'bg-red-500' :
                  ward.currentOccupancy / ward.capacity >= 0.75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(ward.currentOccupancy / ward.capacity) * 100}%` }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Bed className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {ward.capacity - ward.currentOccupancy} beds available
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};