import { neon } from "@neondatabase/serverless"

// Create a SQL client with the Neon database URL
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to execute SQL queries
export async function query(sqlQuery: string, params: any[] = []) {
  try {
    // Log the query and params for debugging (remove in production)
    console.log("Executing query:", sqlQuery)
    console.log("With params:", params)

    // Ensure numeric parameters are properly converted
    const processedParams = params.map((param) => {
      // If the parameter is supposed to be an ID (numeric), ensure it's a number
      if (typeof param === "string" && /^\d+$/.test(param)) {
        return Number.parseInt(param, 10)
      }
      return param
    })

    // Use sql.query for parameterized queries
    const result = await sql.query(sqlQuery, processedParams)
    return { rows: result }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
