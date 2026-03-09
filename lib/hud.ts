export async function getHUDData(zip: string = "10001") {
  const res = await fetch(
    `https://www.huduser.gov/hudapi/public/il/data?zip=${zip}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HUD_API_KEY}`
      }
    }
  )

  if (!res.ok) {
    throw new Error("HUD API Error")
  }

  return res.json()
}
