// auth.js - shared helpers (needs config.js and the Supabase CDN script loaded first)
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getMyProfile() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) return null;
  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single();
  if (error) return null;
  return data;
}

// Use at the top of a protected page. Sends the user back to login if wrong role.
async function requireRole(role) {
  const profile = await getMyProfile();
  if (!profile || profile.role !== role) {
    window.location.href = 'index.html';
    return null;
  }
  return profile;
}

async function logout() {
  await db.auth.signOut();
  window.location.href = 'index.html';
}