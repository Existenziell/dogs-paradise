import { supabase } from "./supabase"

export default async function getAppointments() {
  try {
    let { data, error, status } = await supabase
      .from('appointments')
      .select(`*`)
      .order('created_at', { ascending: true })

    if (error && status !== 406) {
      throw error
    }
    if (data) {
      return data
    }
  } catch (error) {
    console.log(error.message)
  }
}