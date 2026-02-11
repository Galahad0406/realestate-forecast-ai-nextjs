// components/ResultsDisplay.js
'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Paper,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  School,
  AttachMoney,
  Assessment,
  Home,
  LocationOn
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ResultsDisplay({ data, searchType }) {
  if (!data) return null;

  const isZipcode = searchType === 'zipcode';
  const property = isZipcode ? data.averageProperty : data.property;
  const schools = data.schools;
  const investment = data.investment;
  const financials = data.financials;
  const projection = data.projection;

  // Prepare chart data
  const chartData = projection.map(p => ({
    year: `Year ${p.year}`,
    value: p.estimatedValue,
    appreciation: p.appreciationPercent
  }));

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D': return 'error';
      case 'F': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header Card */}
      <Card elevation={3} sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {isZipcode ? `Zipcode ${data.zipcode} Analysis` : property.address}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {isZipcode ? (
              <>
                <Chip
                  icon={<LocationOn />}
                  label={`Median: $${data.marketSummary.medianPrice.toLocaleString()}`}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip
                  icon={<Home />}
                  label={`${data.marketSummary.totalListings} Listings`}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </>
            ) : (
              <>
                <Chip
                  icon={<AttachMoney />}
                  label={`$${property.price?.toLocaleString() || 'N/A'}`}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip
                  icon={<Home />}
                  label={`${property.beds} bed / ${property.baths} bath`}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Investment Grade Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Investment Grade
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 700, color: getGradeColor(investment.grade) + '.main' }}>
                  {investment.grade}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Score: {investment.score}/100
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Analysis:
              </Typography>
              {investment.explanation.map((exp, idx) => (
                <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                  {exp}
                </Typography>
              ))}

              <Alert severity={investment.grade === 'A' || investment.grade === 'B' ? 'success' : 'warning'} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {investment.recommendation}
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* School Grade & Net Yield Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              {/* School Grade Section */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    School Grade
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {schools.averageGrade}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    out of 10
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    School Quality
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={schools.averageGrade * 10}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Top School: {schools.topSchoolRating}/10 • {schools.schoolCount} schools nearby
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Net Yield Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Net Yield
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {financials.netYield}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Annual Return
                  </Typography>
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Monthly Rent
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ${financials.estimatedMonthlyRent || financials.estimatedRent}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Annual Net
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ${financials.netAnnualIncome.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Property Details */}
        {!isZipcode && (
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Property Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Price</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${property.price?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Price/Sqft</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${property.pricePerSqft || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Square Feet</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {property.sqft?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Lot Size</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {property.lotSize?.toLocaleString() || 'N/A'} sqft
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Type</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {property.propertyType || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Year Built</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {property.yearBuilt || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Market Summary for Zipcode */}
        {isZipcode && (
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Market Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Median Price</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${data.marketSummary.medianPrice.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Price/Sqft</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${data.marketSummary.avgPricePerSqft}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Days on Market</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.marketSummary.medianDaysOnMarket} days
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Annual Growth</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                      +{data.marketSummary.priceGrowth}%
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Chip
                      label={`Market Strength: ${data.marketSummary.marketStrength}`}
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 5-Year Projection Chart */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                5-Year Value Projection
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'value') return [`$${value.toLocaleString()}`, 'Estimated Value'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#667eea"
                    strokeWidth={3}
                    name="Estimated Value"
                    dot={{ fill: '#667eea', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {projection.slice(0, 3).map((p) => (
                  <Paper key={p.year} variant="outlined" sx={{ p: 2, flex: 1, minWidth: 150 }}>
                    <Typography variant="caption" color="text.secondary">
                      Year {p.year}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${p.estimatedValue.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      +${p.equityGained.toLocaleString()} equity
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
