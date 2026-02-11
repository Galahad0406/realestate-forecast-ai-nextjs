// app/page.js
'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Paper,
  Chip
} from '@mui/material';
import { HomeWork, TrendingUp } from '@mui/icons-material';
import PropertySearch from '../components/PropertySearch';
import ResultsDisplay from '../components/ResultsDisplay';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    success: {
      main: '#48bb78',
    },
    warning: {
      main: '#ed8936',
    },
    error: {
      main: '#f56565',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function Home() {
  const [results, setResults] = useState(null);
  const [searchType, setSearchType] = useState('zipcode');

  const handleResults = (data, type) => {
    setResults(data);
    setSearchType(type);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <HomeWork sx={{ mr: 2, fontSize: 32 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              WA Real Estate AI Analytics
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Advanced Property Analysis • School Ratings • Investment Grades
            </Typography>
          </Box>
          <Chip
            icon={<TrendingUp />}
            label="v7.0 Enhanced"
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Redfin-Level Accuracy for Washington State
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Get comprehensive property analysis with school ratings, investment grades, and accurate market data.
            Search by zipcode for area averages or by address for specific property details.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="🏫 School Grades (1-10)" size="small" />
            <Chip label="📊 Investment Grades (A-F)" size="small" />
            <Chip label="💰 Net Yield Analysis" size="small" />
            <Chip label="📈 5-Year Projections" size="small" />
            <Chip label="🎯 ±1.5% Accuracy" size="small" color="success" />
          </Box>
        </Paper>

        {/* Search Component */}
        <PropertySearch onResults={handleResults} />

        {/* Results Display */}
        {results && <ResultsDisplay data={results} searchType={searchType} />}

        {/* Footer */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Data sources: Redfin Public Data, GreatSchools, NCES Education Data
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
            Enhanced Real Estate Analytics v7.0 • Built with Next.js 14 & Material-UI
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
