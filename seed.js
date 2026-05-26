import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfyclmyaxkntzovfpsbj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required to run this script.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log("Seeding companies...");
  const { data: companies, error: cErr } = await supabase.from('companies').insert([
    { name: 'Screed Works', type: 'Screed' },
    { name: 'Heating Works', type: 'Heating' },
    { name: 'Electrical Works', type: 'Electrical' }
  ]).select();
  if (cErr) throw cErr;

  console.log("Seeding customers...");
  const { data: customers, error: cuErr } = await supabase.from('customers').insert([
    { name: 'Bauunternehmen GmbH', contact_person: 'Mr. Schmidt' },
    { name: 'Wohnbau AG', contact_person: 'Ms. Meier' },
    { name: 'Stadtbau GmbH', contact_person: 'Mr. Weber' },
    { name: 'Immobilien Keller', contact_person: 'Mr. Keller' }
  ]).select();
  if (cuErr) throw cuErr;

  console.log("Seeding crews...");
  const { data: crews, error: crErr } = await supabase.from('crews').insert([
    { name: 'Team Alpha', specialization: 'Screed', color: '#3b82f6' },
    { name: 'Team Beta', specialization: 'Screed', color: '#f59e0b' },
    { name: 'Team Gamma', specialization: 'Heating', color: '#10b981' },
    { name: 'Team Delta', specialization: 'Electrical', color: '#f1416c' }
  ]).select();
  if (crErr) throw crErr;

  console.log("Seeding orders...");
  const { data: orders, error: oErr } = await supabase.from('orders').insert([
    { display_id: 'ORD-2024-058', customer_id: customers[0].id, company_id: companies[0].id, type: 'SCREED', crew_id: crews[0].id, location: 'Munich', area: 480, revenue: 9600, plan_db: 2400, actual_db: 2100, status: 'IN PROGRESS', scheduled_date: '2024-05-15', start_hour: 7, span_hours: 1 },
    { display_id: 'ORD-2024-059', customer_id: customers[1].id, company_id: companies[1].id, type: 'HEATING', crew_id: crews[2].id, location: 'Stuttgart', area: 320, revenue: 8200, plan_db: 2050, actual_db: 1980, status: 'SCHEDULED', scheduled_date: '2024-05-17', start_hour: 9, span_hours: 1 },
    { display_id: 'ORD-2024-060', customer_id: customers[2].id, company_id: companies[0].id, type: 'SCREED', crew_id: crews[1].id, location: 'Augsburg', area: 650, revenue: 12350, plan_db: 3088, actual_db: 2870, status: 'IN PROGRESS', scheduled_date: '2024-05-16', start_hour: 8, span_hours: 1 },
    { display_id: 'ORD-2024-061', customer_id: customers[3].id, company_id: companies[2].id, type: 'ELECTRICAL', crew_id: crews[3].id, location: 'Nuremberg', area: 0, revenue: 5800, plan_db: 1450, actual_db: 1450, status: 'COMPLETED', scheduled_date: '2024-05-14', start_hour: 10, span_hours: 1 }
  ]).select();
  if (oErr) throw oErr;

  console.log("Seeding complaints...");
  await supabase.from('complaints').insert([
    { display_id: 'CMP-2024-001', order_id: orders[0].id, cause: 'Material Failure', issue_description: 'Surface defect — screed cracking after 48h', status: 'SCHEDULED', cost_impact: 1200, reported_date: '2024-04-28' },
    { display_id: 'CMP-2024-002', order_id: orders[1].id, cause: 'Installation Error', issue_description: 'Heating pipe leak under screed', status: 'IN PROGRESS', cost_impact: 2800, reported_date: '2024-04-30' }
  ]);

  console.log("Seeding invoices...");
  await supabase.from('invoices').insert([
    { display_id: 'INV-2024-058', order_id: orders[0].id, status: 'PAID', subtotal: 9600, total: 11424, issue_date: '2024-05-01', due_date: '2024-05-15' },
    { display_id: 'INV-2024-059', order_id: orders[1].id, status: 'OPEN', subtotal: 8200, total: 9758, issue_date: '2024-05-10', due_date: '2024-05-24' }
  ]);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
