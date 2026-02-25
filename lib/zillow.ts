export async function getZillowData(region: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/zillow.csv`
  )

  const text = await res.text()
  const Papa = (await import("papaparse")).default
  const parsed = Papa.parse(text, { header: true })

  return parsed.data.filter((row: any) =>
    row.RegionName?.toLowerCase().includes(region.toLowerCase())
  )
}
