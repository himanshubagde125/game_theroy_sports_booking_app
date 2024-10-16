import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import CenterSelector from './components/CenterSelector';
import SportSelector from './components/SportSelector';
import BookingView from './components/BookingView';
import CreateBooking from './components/CreateBooking';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/footer';
import { AuthContext, AuthProvider } from './context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  TextField,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme for the application
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5', // Customize primary color
    },
    secondary: {
      main: '#ff8a65', // Customize secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a237e', // Darker shade for AppBar
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Soft shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners
          padding: '10px 20px',
          textTransform: 'none', // No uppercase
        },
      },
    },
  },
});

const AppContent = () => {
  const { auth, logout } = useContext(AuthContext);

  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshBookings, setRefreshBookings] = useState(false);

  const handleBookingCreated = () => {
    setRefreshBookings(!refreshBookings);
  };

  return (
    <Router>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <SportsSoccerIcon sx={{ marginRight: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                Recreational Facility Booking App
              </Link>
            </Typography>
            {auth.user ? (
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {auth.user.username}
                </Typography>
                <Tooltip title="Logout">
                  <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
                    Logout
                  </Button>
                </Tooltip>
              </Box>
            ) : (
              <Box>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          marginTop: 4,
          padding: 4,
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          backgroundImage: 'url("/images.jpg")', // Pointing to the image in the public folder
          backgroundSize: 'cover', // Ensures the image covers the entire container
          backgroundPosition: 'center', // Centers the image
          minHeight: '100vh', // Ensures the container takes full height
        }}
      >
        <Routes>
          <Route path="/login" element={!auth.user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!auth.user ? <Register /> : <Navigate to="/" />} />

          <Route
            path="/"
            element={auth.user ? (
              <Box>
                <Box sx={{ marginBottom: 4 }}>
                  <CenterSelector onSelect={setSelectedCenter} />
                </Box>

                {selectedCenter && (
                  <Box sx={{ marginBottom: 4 }}>
                    <SportSelector centerId={selectedCenter} onSelect={setSelectedSport} />
                  </Box>
                )}

                {selectedSport && (
                  <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Select Date
                    </Typography>
                    <TextField
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Box>
                )}

                {selectedCenter && selectedSport && selectedDate && (
                  <Box>
                    <Box sx={{ marginBottom: 4 }}>
                      <BookingView
                        centerId={selectedCenter}
                        sportId={selectedSport}
                        selectedDate={selectedDate}
                        refresh={refreshBookings}
                      />
                    </Box>
                    <Box sx={{ marginBottom: 4 }}>
                      <CreateBooking
                        centerId={selectedCenter}
                        sportId={selectedSport}
                        selectedDate={selectedDate}
                        onBookingCreated={handleBookingCreated}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Navigate to="/login" />
            )}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
