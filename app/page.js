'use client';

import { useState, useEffect } from 'react';

// County mapping
const COUNTY_MAP: { [key: string]: string } = {
  '98275': 'Snohomish', '98012': 'Snohomish', '98208': 'Snohomish',
  '98052': 'King', '98103': 'King', '98004': 'King', '98033': 'King',
  '98402': 'Pierce', '98391': 'Pierce', '98682': 'Clark',
};

const GEO_DATA: { [key: string]: any } = {
  King: { tax: 0.0094, growth: 0.045, lot_pps: 75, premium: 1.15 },
  Snohomish: { tax: 0.0089, growth: 0.042, lot_pps: 40, premium: 1.08 },
  Pierce: { tax: 0.0102, growth: 0.038, lot_pps: 25, premium: 1.00 },
  Clark: { tax: 0.0091, growth: 0.040, lot_pps: 28, premium: 1.03 },
  Default: { tax: 0.0092, growth: 0.040, lot_pps: 35, premium: 1.00 },
};

function calculateValue(inputs: any) {
  const { zipCode, sqft, lotSize, bedrooms, bathrooms, yearBuilt, propertyType, condition } = inputs;
  const county = COUNTY_MAP[zipCode] || 'King';
  const gd = GEO_DATA[county] || GEO_DATA.Default;
  const basePPSF = county === 'King' ? 520 : county === 'Snohomish' ? 465 : county === 'Pierce' ? 380 : 450;
  
  let ppsf = basePPSF;
  if (sqft < 1000) ppsf *= 1.18;
  else if (sqft < 1500) ppsf *= 1.10;
  else if (sqft < 2000) ppsf *= 1.05;
  else if (sqft < 3500) ppsf *= 0.96;
  else ppsf *= 0.88;
  
  const age = 2026 - yearBuilt;
  let ageFactor = 1.0;
  if (age <= 5) ageFactor = 1.10 - (age * 0.015);
  else if (age <= 15) ageFactor = 1.05 - (age * 0.003);
  else if (age <= 30) ageFactor = 0.95 - ((age - 15) * 0.010);
  else ageFactor = 0.75 - ((age - 30) * 0.008);
  
  const condFactors: { [key: string]: number } = { 'New/Luxury': 1.15, 'Renovated': 1.08, 'Well Maintained': 1.00, 'Original': 0.91, 'Fixer-upper': 0.79 };
  const condFactor = condFactors[condition] || 1.0;
  
  const bedValue = bedrooms * (county === 'King' ? 35000 : county === 'Snohomish' ? 28000 : 22000);
  const bathValue = bathrooms * (county === 'King' ? 25000 : county === 'Snohomish' ? 20000 : 16000);
  
  let lotPremium = 0;
  if (lotSize > 4000) {
    if (lotSize <= 8000) lotPremium = (lotSize - 4000) * gd.lot_pps * 0.85;
    else lotPremium = (4000 * gd.lot_pps * 0.85) + ((lotSize - 8000) * gd.lot_pps * 0.65);
  }
  
  const baseValue = (sqft * ppsf) + bedValue + bathValue + lotPremium;
  let finalValue = baseValue * ageFactor * condFactor * gd.premium;
  if (propertyType === 'Townhome') finalValue *= 0.91;
  
  const rentMultiplier: { [key: number]: number } = { 1: 1.28, 2: 1.18, 3: 1.00, 4: 1.15, 5: 1.35 };
  const rentEst = sqft * 2.45 * (rentMultiplier[bedrooms] || 1.0) * Math.sqrt(condFactor);
  
  const propertyTax = finalValue * gd.tax;
  const insurance = finalValue * 0.003;
  const maintenance = finalValue * 0.01;
  const netYield = ((rentEst * 12 - propertyTax - insurance - maintenance) / finalValue) * 100;
  
  const prices = [];
  for (let i = 0; i <= 5; i++) { prices.push(finalValue * Math.pow(1 + gd.growth, i)); }
  
  return { value: finalValue, low: finalValue * 0.97, high: finalValue * 1.03, rent: rentEst, tax: propertyTax, netYield, prices, county };
}

export default function Home() {
  const [inputs, setInputs] = useState({
    zipCode: '98275', sqft: 1406, lotSize: 5000, bedrooms: 3, bathrooms: 2.5, yearBuilt: 2006, propertyType: 'Single Family House', condition: 'Well Maintained'
  });
  const [result, setResult] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // window 에러 해결을 위한 효과
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleCalculate = () => setResult(calculateValue(inputs));
  const fmt = (val: number) => '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>🏠 WA Real Estate AI</h1>
        <p style={{ color: '#94a3b8' }}>Next.js 15 Professional Valuation</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '30px' }}>
        <section style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '20px' }}>Inputs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Input fields */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>ZIP Code</label>
              <input style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' }} 
                value={inputs.zipCode} onChange={(e) => setInputs({...inputs, zipCode: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>Living Area (Sqft)</label>
              <input type="number" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' }} 
                value={inputs.sqft} onChange={(e) => setInputs({...inputs, sqft: Number(e.target.value)})} />
            </div>
            {/* ... 기타 입력창들 ... */}
            <button onClick={handleCalculate} style={{ width: '100%', padding: '15px', backgroundColor: '#3b82f6', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
              Calculate Now
            </button>
          </div>
        </section>

        <section>
          {!result ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '12px', border: '2px dashed #334155' }}>
              Enter data and click calculate
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Estimated Value</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{fmt(result.value)}</div>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Monthly Rent</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{fmt(result.rent)}</div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
