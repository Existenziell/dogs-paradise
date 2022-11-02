import { supabase } from "./supabase"

export default async function getPickups() {
  try {
    const user = supabase.auth.user()

    const { data, error, status } = await supabase
      .from('pickups')
      .select(`*`)
      .eq('user_id', user.id)

    if (error && status !== 406) {
      throw error
    }
    if (data) {
      return data
    }
  } catch (error) {
    // console.log(error.message)
  }
}
