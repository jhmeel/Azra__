// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { User, CheckCircle, Calendar, Search, Download, MoreVertical } from 'lucide-react';
import Footer from '../components/Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Ping {
  assignedPhysician: string;
  patientName: string;
  date: string;
  complaint: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Patient Visits',
        backgroundColor: 'rgba(75,192,192,0.5)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Patient Visits Over the Week',
      },
    },
  };

  const recommendations = [
    {
      title: 'Healthy Diet Tips',
      patient: 'Steve Maynard',
      details: 'Maintain a balanced diet with a variety of nutrients...',
      color: 'bg-yellow-500',
    },
    {
      title: 'Exercise Regularly',
      patient: 'John Doe',
      details: 'Incorporate at least 30 minutes of exercise into your daily routine...',
      color: 'bg-red-500',
    },
  ];

  const [pings, setPings] = useState<Ping[]>([
    {
      assignedPhysician: 'Dr. Affana Malik',
      patientName: 'Steve Maynard',
      date: '16/04/2023',
      complaint: 'Fever',
      status: 'Closed',
    },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatePingIndex, setUpdatePingIndex] = useState<number | null>(null);
  const [updateFormData, setUpdateFormData] = useState<Ping>({
    assignedPhysician: '',
    patientName: '',
    date: '',
    complaint: '',
    status: '',
  });

  const handleActionsClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleUpdate = (index: number) => {
    setActiveIndex(null);
    setShowUpdateForm(true);
    setUpdatePingIndex(index);
    setUpdateFormData(pings[index]);
  };

  const handleDelete = (index: number) => {
    const updatedPings = [...pings];
    updatedPings.splice(index, 1);
    setPings(updatedPings);
    setActiveIndex(null);
  };

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updatePingIndex !== null) {
      const updatedPings = [...pings];
      updatedPings[updatePingIndex] = updateFormData;
      setPings(updatedPings);
      setShowUpdateForm(false);
      setUpdatePingIndex(null);
      setUpdateFormData({
        assignedPhysician: '',
        patientName: '',
        date: '',
        complaint: '',
        status: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back Jhmeel</h1>
              <p className="text-gray-600">Patient reports are always updated in real time</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anything here..."
                  className="px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg pr-10 w-full sm:w-64"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
              <div>
                <button className="bg-blue-600 hover:bg-blue-700 text-12 text-white px-4 py-2 rounded-lg flex items-center">
                  <Download className="mr-2" size={16} /> Export
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-lg shadow flex items-center justify-between text-green-800">
              <div>
                <h2 className="text-xl font-bold">Total Pings</h2>
                <p>0</p>
              </div>
              <User size={32} />
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg shadow flex items-center justify-between text-blue-800">
              <div>
                <h2 className="text-xl font-bold">Consultancy</h2>
                <p>0</p>
              </div>
              <CheckCircle size={32} />
            </div>
            <div className="bg-indigo-500 bg-opacity-20 p-4 rounded-lg shadow flex items-center justify-between text-indigo-800">
              <div>
                <h2 className="text-xl font-bold">Patient Statistics</h2>
                <p>0</p>
              </div>
              <Calendar size={32} />
            </div>
          </div>
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="w-full lg:w-3/4 xl:w-2/3">
                <Bar data={data} options={options} />
              </div>
            </div>
          </div>
          <div className="mb-8">
  <h2 className="text-2xl font-bold mb-4 text-gray-800">All Pings</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr className="bg-gray-50 text-gray-700">
          <th className="py-3 px-4 uppercase font-semibold text-sm border-b">Assigned Physician</th>
          <th className="py-3 px-4 uppercase font-semibold text-sm border-b">Patient Name</th>
          <th className="py-3 px-4 uppercase font-semibold text-sm border-b">Date</th>
          <th className="py-3 px-4 uppercase font-semibold text-sm border-b">Complaint</th>
          <th className="py-3 px-4 uppercase font-semibold text-sm border-b">Status</th>
          <th className="py-3 px-4 uppercase font-semibold text-sm border-b"></th>
        </tr>
      </thead>
      <tbody>
        {pings.map((ping, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="py-4 px-6 border-b border-gray-200 text-gray-900">{ping.assignedPhysician}</td>
            <td className="py-4 px-6 border-b border-gray-200 text-gray-900">{ping.patientName}</td>
            <td className="py-4 px-6 border-b border-gray-200 text-gray-900">{ping.date}</td>
            <td className="py-4 px-6 border-b border-gray-200 text-gray-900">{ping.complaint}</td>
            <td className="py-4 px-6 border-b border-gray-200 text-green-600 font-semibold">{ping.status}</td>
            <td className="py-4 px-6 border-b border-gray-200 text-gray-900">
              <div className="inline-block">
                <MoreVertical
                size={16}
                  className="cursor-pointer"
                  onClick={() => handleActionsClick(index)}
                />
                {activeIndex === index && (
                  <div className="absolute right-0 mt-2 w-48 text-white bg-gray-700 rounded-md shadow-lg z-50">
                    <button
                      className="block w-full  text-white text-left px-4 py-2 hover:bg-gray-600"
                      onClick={() => handleUpdate(index)}
                    >
                      Update
                    </button>
                    <button
                      className="block w-full  text-white text-left px-4 py-2 hover:bg-gray-600"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
          
<h2 className="text-2xl font-bold mb-4 text-gray-800">Your Recent Recommendations</h2>
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <li key={index} className={`${rec.color} bg-opacity-20 p-6 rounded-lg shadow text-${rec.color.split('-')[1]}-800`}>
                  <h3 className="text-lg font-bold mb-2">{rec.title}</h3>
                  <p className="mb-1"><span className="font-semibold">Recommended for:</span> {rec.patient}</p>
                  <p>{rec.details}</p>
                </li>
              ))}
            </ul>
        </div>
      </div>
      {showUpdateForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg p-8 w-full max-w-md glassmorphism">
            <h2 className="text-2xl font-bold mb-4">Update Ping Details</h2>
            <form onSubmit={handleUpdateFormSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-bold text-gray-700" htmlFor="assignedPhysician">
                  Assigned Physician
                </label>
                <input
                  type="text"
                  id="assignedPhysician"
                  name="assignedPhysician"
                  value={updateFormData.assignedPhysician}
                  onChange={handleUpdateFormChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-bold text-gray-700" htmlFor="patientName">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={updateFormData.patientName}
                  onChange={handleUpdateFormChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-bold text-gray-700" htmlFor="date">
                  Date
                </label>
                <input
                  type='datetime-local'
                  id="date"
                  name="date"
                  value={updateFormData.date}
                  onChange={handleUpdateFormChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-bold text-gray-700" htmlFor="complaint">
                  Complaint
                </label>
                <input
                  type="text"
                  id="complaint"
                  name="complaint"
                  value={updateFormData.complaint}
                  onChange={handleUpdateFormChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-bold text-gray-700" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateFormChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  required
                >
                  <option value="">Select status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 text-14 px-4 py-2 font-bold text-white bg-gray-400 rounded-lg hover:bg-gray-500 focus:outline-none focus:shadow-outline"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-14 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default Dashboard;