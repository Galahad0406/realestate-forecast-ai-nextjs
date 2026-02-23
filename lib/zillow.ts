import fs from "fs"
import path from "path"
import Papa from "papaparse"

export function getZillowData(region: string) {
  const filePath = path.join(process.cwd(), "data/zillow.csv")
  const file = fs.readFileSync(filePath, "utf8")

  const parsed = Papa.parse(file, { header: true })

  return parsed.data.filter((row: any) =>
    row.RegionName?.toLowerCase().includes(region.toLowerCase())
  )
}
