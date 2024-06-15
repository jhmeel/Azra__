import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { User, CheckCircle, Calendar, Search, Download, MoreVertical } from 'lucide-react';
import Footer from '../components/Footer';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Ping {
  assignedPhysician: string;
  patientName: string;
  date: string;
  complaint: string;
  status: string;
}

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f7fafc;
`;

const ContentContainer = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const WelcomeText = styled.div`
  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  p {
    color: #718096;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 16rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

const ExportButton = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2b6cb0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div<{ bgColor: string, textColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.textColor};

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }

  p {
    font-size: 1rem;
  }
`;

const ChartContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;

  div {
    width: 100%;
    max-width: 40rem;
  }
`;

const TableContainer = styled.div`
  margin-bottom: 2rem;

  table {
    width: 100%;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  thead {
    background-color: #edf2f7;
    color: #4a5568;

    th {
      padding: 0.75rem;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 600;
      border-bottom: 1px solid #e2e8f0;
    }
  }

  tbody {
    tr {
      &:hover {
        background-color: #f7fafc;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        color: #1a202c;
      }

      .actions {
        position: relative;
      }
    }
  }
`;

const UpdateFormModal = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;

  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .form-container {
    position: relative;
    background-color: white;
    border-radius: 0.5rem;
    padding: 2rem;
    max-width: 30rem;
    width: 100%;

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    form {
      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        input, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #cbd5e0;
          border-radius: 0.5rem;
          color: #4a5568;

          &:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
          }
        }
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;

        button {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;

          &.cancel {
            background-color: #a0aec0;
            color: white;

            &:hover {
              background-color: #718096;
            }
          }

          &.update {
            background-color: #3182ce;
            color: white;

            &:hover {
              background-color: #2b6cb0;
            }
          }
        }
      }
    }
  }
`;

const RecommendationsList = styled.ul`
  margin-bottom: 2rem;

  li {
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 0, 0.2);
    color: #d69e2e;

    &.bg-red-500 {
      background-color: rgba(239, 68, 68, 0.2);
      color: #e53e3e;
    }

    h3 {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1rem;

      span {
        font-weight: 700;
      }
    }
  }
`;

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
    <DashboardContainer>
      <ContentContainer>
        <Header>
          <WelcomeText>
            <h1>Welcome Back Jhmeel</h1>
            <p>Patient reports are always updated in real time</p>
          </WelcomeText>
          <SearchContainer>
            <div style={{ position: 'relative' }}>
              <SearchInput
                type="text"
                placeholder="Search anything here..."
              />
              <Search style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} size={16} />
            </div>
            <ExportButton>
              <Download size={16} /> Export
            </ExportButton>
          </SearchContainer>
        </Header>
        <StatsGrid>
          <StatCard bgColor="rgba(56, 178, 172, 0.2)" textColor="#2c7a7b">
            <div>
              <h2>Total Pings</h2>
              <p>0</p>
            </div>
            <User size={32} />
          </StatCard>
          <StatCard bgColor="rgba(66, 153, 225, 0.2)" textColor="#2b6cb0">
            <div>
              <h2>Consultancy</h2>
              <p>0</p>
            </div>
            <CheckCircle size={32} />
          </StatCard>
          <StatCard bgColor="rgba(90, 103, 216, 0.2)" textColor="#4c51bf">
            <div>
              <h2>Patient Statistics</h2>
              <p>0</p>
            </div>
            <Calendar size={32} />
          </StatCard>
        </StatsGrid>
        <ChartContainer>
          <div>
            <Bar data={data} options={options} />
          </div>
        </ChartContainer>
        <TableContainer>
          <h2>All Pings</h2>
          <table>
            <thead>
              <tr>
                <th>Assigned Physician</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Complaint</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pings.map((ping, index) => (
                <tr key={index}>
                  <td>{ping.assignedPhysician}</td>
                  <td>{ping.patientName}</td>
                  <td>{ping.date}</td>
                  <td>{ping.complaint}</td>
                  <td>{ping.status}</td>
                  <td className="actions">
                    <MoreVertical size={16} className="cursor-pointer" onClick={() => handleActionsClick(index)} />
                    {activeIndex === index && (
                      <div style={{ position: 'absolute', right: 0, marginTop: '0.5rem', width: '12rem', backgroundColor: '#2d3748', color: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 50 }}>
                        <button style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', color: 'white' }} onClick={() => handleUpdate(index)}>Update</button>
                        <button style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', color: 'white' }} onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
        <h2>Your Recent Recommendations</h2>
        <RecommendationsList>
          {recommendations.map((rec, index) => (
            <li key={index} className={rec.color}>
              <h3>{rec.title}</h3>
              <p><span>Recommended for:</span> {rec.patient}</p>
              <p>{rec.details}</p>
            </li>
          ))}
        </RecommendationsList>
      </ContentContainer>
      {showUpdateForm && (
        <UpdateFormModal>
          <div className="overlay"></div>
          <div className="form-container">
            <h2>Update Ping Details</h2>
            <form onSubmit={handleUpdateFormSubmit}>
              <div className="form-group">
                <label htmlFor="assignedPhysician">Assigned Physician</label>
                <input
                  type="text"
                  id="assignedPhysician"
                  name="assignedPhysician"
                  value={updateFormData.assignedPhysician}
                  onChange={handleUpdateFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientName">Patient Name</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={updateFormData.patientName}
                  onChange={handleUpdateFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={updateFormData.date}
                  onChange={handleUpdateFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="complaint">Complaint</label>
                <input
                  type="text"
                  id="complaint"
                  name="complaint"
                  value={updateFormData.complaint}
                  onChange={handleUpdateFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateFormChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="actions">
                <button type="button" className="cancel" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                <button type="submit" className="update">Update</button>
              </div>
            </form>
          </div>
        </UpdateFormModal>
      )}
      <Footer />
    </DashboardContainer>
  );
};

export default Dashboard;
