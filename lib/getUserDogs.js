import { supabase } from "./supabase"

export default async function getUserDogs() {
  try {
    const user = supabase.auth.user()

    let { data, error, status } = await supabase
      .from('dogs')
      .select(`*`)
      .eq('user', user.id)

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
