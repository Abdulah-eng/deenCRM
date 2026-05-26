const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [key, ...rest] = line.split('=');
    envVars[key.trim()] = rest.join('=').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function seed() {
  console.log("Seeding V2 Data...");

  // Seed Suppliers
  console.log("Seeding suppliers...");
  const { data: suppliers, error: supErr } = await supabase.from('suppliers').insert([
    { name: 'Baustoffe Weber GmbH', email: 'g.weber@bauweber.de', contact: 'Georg Weber', phone: '+49 89 111222', city: 'Munich', category: 'MATERIALS', rating: 5, status: 'ACTIVE' },
    { name: 'Estrich Profi AG', email: 'h.braun@estrichprofi.de', contact: 'Hilde Braun', phone: '+49 711 333444', city: 'Stuttgart', category: 'SCREED', rating: 4, status: 'ACTIVE' },
    { name: 'Elektro Teile GmbH', email: 'f.huber@elektroteile.de', contact: 'Franz Huber', phone: '+49 821 555666', city: 'Augsburg', category: 'ELECTRICAL', rating: 5, status: 'ACTIVE' },
    { name: 'Heizung Direkt KG', email: 'r.klein@heizungdirekt.de', contact: 'Renate Klein', phone: '+49 89 777888', city: 'Munich', category: 'HEATING', rating: 4, status: 'ACTIVE' },
    { name: 'Bau & Zubehör', email: 'l.vogel@bauzubehor.de', contact: 'Lars Vogel', phone: '+49 911 999000', city: 'Nuremberg', category: 'GENERAL', rating: 3, status: 'INACTIVE' }
  ]).select();
  if (supErr) console.error(supErr);

  // Seed Materials
  console.log("Seeding materials...");
  const { error: matErr } = await supabase.from('materials').insert([
    { sku: 'MAT-001', name: 'Anhydrite Screed CA-F5', supplier_name: 'Estrich Profi AG', category: 'SCREED', unit: 'm²', price_a: 12.50, price_b: 11.80, price_c: 13.20, best_price: 'B', stock: '1,200 m²' },
    { sku: 'MAT-002', name: 'Cement Screed CT-C20', supplier_name: 'Baustoffe Weber GmbH', category: 'SCREED', unit: 'm²', price_a: 9.80, price_b: 10.20, price_c: 9.50, best_price: 'C', stock: '850 m²' },
    { sku: 'MAT-003', name: 'Underfloor Heating Pipe 16mm', supplier_name: 'Heizung Direkt KG', category: 'HEATING', unit: 'm', price_a: 2.40, price_b: 2.20, price_c: 2.60, best_price: 'B', stock: '5,000 m' },
    { sku: 'MAT-004', name: 'Insulation Board EPS 35', supplier_name: 'Baustoffe Weber GmbH', category: 'GENERAL', unit: 'm²', price_a: 4.80, price_b: 5.10, price_c: 4.60, best_price: 'C', stock: '600 m²' },
    { sku: 'MAT-005', name: 'Electric Cable NYM-J 3x1.5', supplier_name: 'Elektro Teile GmbH', category: 'ELECTRICAL', unit: 'm', price_a: 1.80, price_b: 1.65, price_c: 1.95, best_price: 'B', stock: '3,000 m' }
  ]);
  if (matErr) console.error(matErr);

  // Seed Services
  console.log("Seeding services...");
  const { error: servErr } = await supabase.from('services').insert([
    { name: 'Standard Screed Installation', category: 'Screed Works', base_price: 25.00 },
    { name: 'Underfloor Heating Setup', category: 'Heating Works', base_price: 45.00 },
    { name: 'Main Electrical Panel Installation', category: 'Electrical Works', base_price: 1200.00 },
    { name: 'Acoustic Insulation Layer', category: 'Screed Works', base_price: 15.00 }
  ]);
  if (servErr) console.error(servErr);

  console.log("Seeding V2 Data Complete!");
}

seed();
