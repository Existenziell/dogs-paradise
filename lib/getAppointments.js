import { supabase } from "./supabase"

export default async function getAppointments(id) {
  try {
    // If id is present fetch appointments for user
    if (id) {
      let { data, error, status } = await supabase
        .from('appointments')
        .select(`*, dogs(*), pickups(*)`)
        .eq('user', id)
        .order('created_at', { ascending: true })

      if (error && status !== 406) {
        throw error
      }
      if (data) {
        return data
      }
    } else {
      // Else fetch all appointments
      let { data, error, status } = await supabase
        .from('appointments')
        .select(`*, dogs(*), pickups(*)`)
        .order('created_at', { ascending: true })

      if (error && status !== 406) {
        throw error
      }
      if (data) {
        return data
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}
