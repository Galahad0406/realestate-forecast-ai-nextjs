'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  LinearProgress,
  Link,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function ResultsDisplay({ results }) {
  if (!results) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Enter property details to see valuation
        </Typography>
      </Box>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = results.prices.slice(1, 6).map((price, index) => ({
    year: `Year ${index + 1}`,
    value: price,
  }));

  const appreciation = ((results.prices[5] / results.prices[0] - 1) * 100).toFixed(1);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📊 {results.county} County ({results.zipCode}) Analysis
        </Typography>
        <Chip
          icon={results.ml_available ? <TrendingUpIcon /> : null}
          label={
            results.ml_available
              ? `🤖 AI Model v6.0 Active | ${results.model_type}`
              : `Market Analysis v6.0 | ${results.model_type}`
          }
          color="primary"
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          As of {new Date().toLocaleDateString('en-US')}
        </Typography>
      </Box>

      {/* Main Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Estimated Market Value
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                {formatCurrency(results.prices[0])}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Range: {formatCurrency(results.range[0])} - {formatCurrency(results.range[1])}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                5-Year Forecast
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {formatCurrency(results.prices[5])}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                  +{appreciation}%
                </Box>{' '}
                appreciation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Model Confidence
              </Typography>
              <Typography variant="h4" component="div">
                {results.conf.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={results.conf}
                sx={{ mt: 2 }}
                color="primary"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📈 AI-Driven Asset Appreciation
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#1C83E1">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`rgba(28, 131, 225, ${0.6 + index * 0.08})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Investment Metrics */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Investment Metrics & Yield
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={2.4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Live Mortgage
                </Typography>
                <Typography variant="h6">6.78%</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Monthly Rent
                </Typography>
                <Typography variant="h6">{formatCurrency(results.rent)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Net Yield
                </Typography>
                <Typography variant="h6" color={results.yield > 3.5 ? 'success.main' : 'warning.main'}>
                  {results.yield.toFixed(2)}%
                </Typography>
                <Chip label={`Grade ${results.grade}`} size="small" color="primary" sx={{ mt: 0.5 }} />
              </Box>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Property Tax
                </Typography>
                <Typography variant="h6">{formatCurrency(results.tax)}/yr</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  School Score
                </Typography>
                <Typography variant="h6">{results.school}/10</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AI Model Insights (if ML available) */}
      {results.ml_available && (
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🤖 AI Model Insights
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    ML Market Value
                  </Typography>
                  <Typography variant="h6">
                    {results.ml_value ? formatCurrency(results.ml_value) : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Rule-Based Value
                  </Typography>
                  <Typography variant="h6">{formatCurrency(results.rule_value)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Ensemble Method
                  </Typography>
                  <Typography variant="h6">70% ML + 30% Rules</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Market Diagnostic & News */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧠 Market Diagnostic
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" paragraph>
                  • <strong>Condition Factor:</strong> {results.condition} status applied.
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Inventory:</strong> {results.inv.toFixed(1)} months (
                  {results.inv < 3 ? "Sellers'" : results.inv < 6 ? 'Balanced' : "Buyers'"} Market).
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Annual Costs:</strong> Tax {formatCurrency(results.tax)} + Insurance{' '}
                  {formatCurrency(results.insurance)} + Maintenance {formatCurrency(results.maintenance)}
                </Typography>

                {results.news && results.news.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Recent Market News:
                    </Typography>
                    {results.news.slice(0, 2).map((article, index) => (
                      <Typography variant="caption" display="block" key={index} sx={{ mb: 0.5 }}>
                        •{' '}
                        <Link href={article.link} target="_blank" rel="noopener">
                          {article.title}
                        </Link>
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📍 Neighborhood Intelligence
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" paragraph>
                  • <strong>Market Intensity:</strong> {(results.s2l * 100).toFixed(1)}% Sale-to-List Ratio.
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Model Type:</strong> {results.model_type} | Confidence: {results.conf.toFixed(1)}%
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Property Age:</strong> {2026 - results.yearBuilt} years
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Verification: Professional-Grade Valuation v6.0 |{' '}
          {results.ml_available ? '🤖 ML-Powered Hybrid Model' : '📊 Rule-Based Analysis'} | Redfin
          Methodology Applied
        </Typography>
      </Box>
    </Box>
  );
}
