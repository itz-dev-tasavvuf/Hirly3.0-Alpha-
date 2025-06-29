import { supabase } from '../supabaseClient';

/**
 * Save or update the current user's profile in Supabase after onboarding.
 * @param {Object} profileData - The onboarding profile data to save.
 * @returns {Promise<{error: any}>}
 */
export async function saveProfileToSupabase(profileData) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    return { error: userError || new Error('No logged-in user found') };
  }

  const { id, email } = user;
  
  // 1. Update user metadata in Supabase Auth
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { 
      userType: profileData.userType?.toLowerCase().includes('candidate') ? 'candidate' : 'employer'
    }
  });
  
  if (metadataError) {
    console.error('Error updating user metadata:', metadataError);
    return { error: metadataError };
  }
  
  // 2. Prepare data to match your Supabase table columns
  const data = {
    id,
    email,
    name: profileData.name,
    user_type: profileData.userType,
    roles: Array.isArray(profileData.roles) ? profileData.roles : [profileData.roles],
    experience: profileData.experience,
    work_location: profileData.workLocation,
    salary_range: profileData.salaryRange,
    profile_pic: profileData.profilePicUrl || null,
    resume: profileData.resumeUrl || null,
  };

  // 3. Save to profiles table
  const { error } = await supabase.from('profiles').upsert(data);
  return { error };
}
