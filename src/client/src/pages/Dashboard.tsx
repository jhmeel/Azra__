import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  User,
  CheckCircle,
  Calendar,
  Search,
  Download,
  MoreVertical,
  ArrowLeft,
  Activity,
  Users,
} from "lucide-react";
import Footer from "../components/Footer";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { toast } from "sonner";
import { CLEAR_ERRORS } from "../constants";
import { fetchDashboard } from "../actions";
import { Ping } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    background-color: #f7fafc;
    color: #2d3748;
  }
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow-x:hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4299e1;
`;

const WelcomeText = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  p {
    color: #718096;
    font-size: 0.875rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-grow: 1;
  justify-content: flex-end;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 100%;
  max-width: 300px;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

const Button = styled.button`
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3182ce;
  }
`;

const StatsGrid = styled.div`
display:flex;
flex-direction:row;
overflow-x:scroll;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom:3px;

  &::-webkit-scrollbar{
    display:none;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  min-width:200px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: 700;
    color: #4299e1;
  }
`;

const ChartContainer = styled.div`
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    font-weight: 600;
    color: #4a5568;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ActionsMenu = styled.div`
  position: relative;
`;

const ActionsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #edf2f7;
  }
`;

const ActionsDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
`;

const ActionItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #edf2f7;
  }
`;

const RecommendationsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const RecommendationCard = styled.li`
  background-color: #fffbeb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border-left: 4px solid #d69e2e;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #d69e2e;
  }

  p {
    font-size: 0.875rem;
    color: #744210;
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

        input,
        select {
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
        .action-menu {
          cursor: pointer;
        }

        button {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 14px;

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

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatePingIndex, setUpdatePingIndex] = useState<number | null>(null);
  const [updateFormData, setUpdateFormData] = useState<Ping>({
    assignedPhysician: "",
    patientName: "",
    date: "",
    complaint: "",
    status: "",
  });

  const [pings, setPings] = useState<Ping[]>([
    {
      assignedPhysician: "Dr. Smith",
      patientName: "John Doe",
      date: "2023-06-24",
      complaint: "Fever",
      status: "Open",
    },
    {
      assignedPhysician: "Dr. Johnson",
      patientName: "Jane Smith",
      date: "2023-06-23",
      complaint: "Headache",
      status: "Closed",
    },
    {
      assignedPhysician: "Dr. Williams",
      patientName: "Bob Brown",
      date: "2023-06-22",
      complaint: "Back pain",
      status: "Open",
    },
  ]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user: admin,
    loading,
    error,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }

    dispatch<any>(fetchDashboard(admin?.session?.secret, "HOSPITAL"));
  }, [error, dispatch, admin]);

  const statsData = [
    {
      title: "Total Patients",
      value: 1234,
      icon: <Users size={24} color="#4299e1" />,
    },
    {
      title: "Consultations Today",
      value: 42,
      icon: <CheckCircle size={24} color="#48bb78" />,
    },
    {
      title: "Upcoming Appointments",
      value: 15,
      icon: <Calendar size={24} color="#ed8936" />,
    },
    {
      title: "Active Treatments",
      value: 89,
      icon: <Activity size={24} color="#ed64a6" />,
    },
  ];

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Patient Visits",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(66, 153, 225, 0.5)",
        borderColor: "rgba(66, 153, 225, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Patient Visits Over the Week",
      },
    },
  };

  const recommendations = [
    {
      title: "Healthy Diet Tips",
      patient: "John Doe",
      details:
        "Increase intake of fruits and vegetables. Reduce processed foods.",
    },
    {
      title: "Exercise Routine",
      patient: "Jane Smith",
      details: "30 minutes of moderate exercise 5 times a week.",
    },
    {
      title: "Stress Management",
      patient: "Bob Brown",
      details: "Practice daily meditation and deep breathing exercises.",
    },
  ];

  const handleActionClick = (index: number) => {
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

  const handleUpdateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        assignedPhysician: "",
        patientName: "",
        date: "",
        complaint: "",
        status: "",
      });
    }
  };
  const handleMessage = (patientId?: string) => {
    setActiveIndex(null);
  };
  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <Header>
          <WelcomeSection>
            <Avatar src="/path-to-avatar.jpg" alt="Hospital Avatar" />
            <WelcomeText>
              <h1>Welcome back, Central Hospital</h1>
              <p>Here's what's happening today</p>
            </WelcomeText>
          </WelcomeSection>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search patients, doctors, or records"
              aria-label="Search"
            />
            <Button onClick={() => {}}>
              <Download size={16} /> Export Data
            </Button>
          </SearchContainer>
        </Header>

        <StatsGrid>
          {statsData.map((stat, index) => (
            <StatCard key={index}>
              <div>
                <h2>{stat.title}</h2>
                <p>{stat.value}</p>
              </div>
              {stat.icon}
            </StatCard>
          ))}
        </StatsGrid>

        <ChartContainer>
          <Bar data={chartData} options={chartOptions} />
        </ChartContainer>

        <TableContainer>
          <h2>Recent Pings</h2>
          <Table>
            <thead>
              <tr>
                <th>Assigned Physician</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Complaint</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
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
                  <td>
                    <ActionsMenu>
                      <ActionsButton
                        onClick={() => handleActionClick(index)}
                        aria-label="Actions"
                      >
                        <MoreVertical size={16} />
                      </ActionsButton>
                      {activeIndex === index && (
                        <ActionsDropdown>
                          <ActionItem
                            onClick={() => handleMessage(ping.patientId)}
                          >
                            Message
                          </ActionItem>
                          <ActionItem onClick={() => handleUpdate(index)}>
                            Update
                          </ActionItem>
                          <ActionItem onClick={() => handleDelete(index)}>
                            Delete
                          </ActionItem>
                        </ActionsDropdown>
                      )}
                    </ActionsMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        <h2>Recent Recommendations</h2>
        <RecommendationsList>
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index}>
              <h3>{rec.title}</h3>
              <p>
                <strong>Patient:</strong> {rec.patient}
              </p>
              <p>{rec.details}</p>
            </RecommendationCard>
          ))}
        </RecommendationsList>
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
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="update">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </UpdateFormModal>
        )}
      </DashboardContainer>
      <Footer />
    </>
  );
};

export default Dashboard;
