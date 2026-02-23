export async function getCensusData(zip: string) {
  const url = `https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B19013_001E&for=zip%20code%20tabulation%20area:${zip}&key=${process.env.CENSUS_API_KEY}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Census API Error")
  }

  const data = await res.json()

  return {
    population: Number(data[1][0]),
    medianIncome: Number(data[1][1])
  }
}
