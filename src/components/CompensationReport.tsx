// src/pages/HR/CompensationReport.tsx
import React from 'react';
import { CompensationReportEntry } from '../types/reviewTypes';

const mockData: CompensationReportEntry[] = [
  {
    employeeId: 1,
    employeeName: 'John Doe',
    department: 'Engineering',
    previousSalary: 70000,
    hikePercent: 10,
    newSalary: 77000
  },
  {
    employeeId: 2,
    employeeName: 'Jane Smith',
    department: 'Marketing',
    previousSalary: 60000,
    hikePercent: 8,
    newSalary: 64800
  }
];

const CompensationReport: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Compensation Report</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Employee</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Old Salary</th>
            <th className="p-2 text-left">Hike %</th>
            <th className="p-2 text-left">New Salary</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((entry) => (
            <tr key={entry.employeeId} className="border-b">
              <td className="p-2">{entry.employeeName}</td>
              <td className="p-2">{entry.department}</td>
              <td className="p-2">₹{entry.previousSalary.toLocaleString()}</td>
              <td className="p-2">{entry.hikePercent}%</td>
              <td className="p-2 font-semibold text-green-600">₹{entry.newSalary.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompensationReport;
