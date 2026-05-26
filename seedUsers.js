import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfyclmyaxkntzovfpsbj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required to run this script.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedUsers() {
  console.log("Fetching company for users...");
  const { data: companies } = await supabase.from('companies').select('id').limit(1);
  const companyId = companies[0]?.id;

  const usersToCreate = [
    { email: 'admin@procrm.com', password: 'password123', full_name: 'Admin User', role: 'admin', avatar: 'A' },
    { email: 'manager@procrm.com', password: 'password123', full_name: 'Max Mueller', role: 'manager', avatar: 'M' },
    { email: 'finance@procrm.com', password: 'password123', full_name: 'Anna Fischer', role: 'finance', avatar: 'A' },
    { email: 'sales@procrm.com', password: 'password123', full_name: 'Hans Schmidt', role: 'sales', avatar: 'H' },
    { email: 'crew@procrm.com', password: 'password123', full_name: 'Klaus Weber', role: 'crew', avatar: 'K' },
  ];

  for (const u of usersToCreate) {
    console.log(`Creating user: ${u.email}`);
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true
    });

    if (authErr) {
      console.error(`Failed to create ${u.email}:`, authErr.message);
      continue;
    }

    console.log(`Inserting profile for: ${u.email}`);
    await supabase.from('profiles').insert({
      id: authUser.user.id,
      full_name: u.full_name,
      role: u.role,
      company_id: companyId,
      avatar_url: u.avatar
    });
  }
  console.log("User seeding complete!");
}

seedUsers().catch(console.error);
