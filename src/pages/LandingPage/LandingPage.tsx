import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  Link,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff5722',
    },
  },
});

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Box display="flex" flexGrow={1} alignItems="center">
          <img
            src="src/images/logo/logo-trans.svg"
            alt="Ag-Desk logo"
            style={{ marginRight: '10px', width: '120px', height: 'auto' }}
          />
        </Box>
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate('/signup')}
          style={{ marginRight: '10px' }}
        >
          Register
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => navigate('/signin')}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '80vh',
        backgroundImage: `url(https://cdn.builder.io/api/v1/image/assets/TEMP/416cc44217f18b8477449d2958a497217f75fad17232cc5cc76d0b7b4abcfe8e?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Simplify your farm management with Ag-Desk
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Ag-Desk is the all-in-one solution for farmers and ranchers, providing
          tools to streamline operations, managing inventory and task management
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ m: 1 }}
            onClick={() => navigate('/signin')}
          >
            Already have an account? Sign in
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const Section: React.FC<{
  heading: string;
  text: string;
  image: string;
  altText: string;
}> = ({ heading, text, image, altText }) => (
  <Box
    sx={{ py: 8, borderBottom: '1px solid #e0e0e0', backgroundColor: 'white' }}
  >
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        {heading}
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="p" gutterBottom>
            {text}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={image}
            alt={altText}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const FeaturesSection: React.FC = () => {
  const featuresData = [
    {
      heading: 'Simplify Farm Management',
      text: "Take full control of your farm with Ag-Desk's intuitive management system. Our platform includes a fully-fledged calendar for adding events and tracking upcoming tasks with their severity. The dashboard provides real-time weather information and displays key insights through various cards, offering a comprehensive overview of all farm activities. Streamline your farm operations and make informed decisions with ease.",
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/7705998af14bcc158e1a97529ffe9f2421dcb90775347519a1afb5c27a6e2ec2?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&',
      altText: 'Farm Management Simplified',
    },
    {
      heading: 'Centralized Management',
      text: 'Ag-Desk provides a centralized management system for all your farm needs. From Employee management, Weather Tracking to Task management. Manage everything in one place with ease and efficiency.',
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/e919329ee2618d661454d7584c9824b63fb9d1f77f14a8670bf8d0b91f42264e?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&',
      altText: 'Centralised management',
    },
    {
      heading: 'Manage your Inventory',
      text: 'Seamless Inventory Management with the ability to add and manage inventory, add image and location and quantity of the inventory. Notification when the quantity is less.',
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/2eaac807e41b507a934c1df447590759482911262a25f00f0026ca54fdd467be?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&',
      altText: 'Inventory Management',
    },
    {
      heading: 'Task Management',
      text: "Efficient Task Management with the Inbuilt Task Manager. Ag-Desk's task manager allows you to add tasks with status like on hold, completed, in progress, severity, image, and description. This enables you to add tasks with clarity and manage them instantly.",
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/ee5bdbc32bbc53684deecb2f9d63712884517174ee790d5d45a4eae8116d726d?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&',
      altText: 'Task Management',
    },
    {
      heading: 'Employee Management',
      text: 'Easily add and manage your employees with our comprehensive employee management tools. Keep track of employee details, assign tasks, and monitor performance, all from one central location. Ensure efficient farm operations with our intuitive management features.',
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/79f2275a3b6db3236cefdeac813f453268d5f43820a5344c0f518f0fdd096699?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&',
      altText: 'Employee Management',
    },
  ];

  return (
    <>
      {featuresData.map((feature, index) => (
        <Section
          key={index}
          heading={feature.heading}
          text={feature.text}
          image={feature.image}
          altText={feature.altText}
        />
      ))}
    </>
  );
};

const Footer: React.FC = () => (
  <Box sx={{ py: 4, backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" component="h2" gutterBottom>
            Follow us
          </Typography>
          <Box>
            <Link
              href="#"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/301c43466d4ef0fff8f5463620a74627d13d0bc11c843dcd2b99c1bd21fb9b72?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&"
                alt="Facebook"
                style={{ width: '24px', marginRight: '10px' }}
              />
              Facebook
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c23e4d39e71b8d11736fff2d26010a690f6bf360952ebede6fb529b9e16a693?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&"
                alt="Instagram"
                style={{ width: '24px', marginRight: '10px' }}
              />
              Instagram
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/88d1f4c5dfdc05b2ab5bc68f92649063154995a6bb8f743171a449a4895c07c3?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&"
                alt="Twitter"
                style={{ width: '24px', marginRight: '10px' }}
              />
              Twitter
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/57ccfbbb639a4645ed1bc81642a55e95f3713285bf581d2425efb21b2030ad65?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&"
                alt="LinkedIn"
                style={{ width: '24px', marginRight: '10px' }}
              />
              LinkedIn
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/be19ad60fb8ee481f4aabbae67dfb21560a99bc02969828efd842fc0404c9777?apiKey=2f0e63fbe6a6462c97e7fe8c57803ed2&"
                alt="YouTube"
                style={{ width: '24px', marginRight: '10px' }}
              />
              YouTube
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" component="h2" gutterBottom>
            Resources
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Cookies Settings
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" component="h2" gutterBottom>
            Company
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
              About Us
            </Link>
            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Contact
            </Link>
            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Careers
            </Link>
          </Box>
        </Grid>
      </Grid>
      <Box mt={4} textAlign="center">
        <img
          src="src/images/logo/logo-trans.svg"
          alt="Ag-Desk logo"
          style={{ marginRight: '10px', width: '120px', height: 'auto' }}
        />
        <Typography variant="body2" color="textSecondary">
          © 2024 Ag-Desk. All rights reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

const LandingPage: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Header />
    <Hero />
    <FeaturesSection />
    <Footer />
  </ThemeProvider>
);

export default LandingPage;
