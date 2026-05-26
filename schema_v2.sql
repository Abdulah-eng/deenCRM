-- Migration V2: Adding missing CRM/ERP tables for ProCRM

-- 1. Suppliers Table
CREATE TABLE suppliers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    contact TEXT,
    phone TEXT,
    city TEXT,
    category TEXT,
    rating INTEGER DEFAULT 5,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Materials Table
CREATE TABLE materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sku TEXT,
    name TEXT NOT NULL,
    supplier_name TEXT, -- primary supplier text for display
    category TEXT,
    unit TEXT,
    price_a NUMERIC,
    price_b NUMERIC,
    price_c NUMERIC,
    best_price TEXT, -- 'A', 'B', or 'C'
    stock TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    base_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Offers (Quotes) Table
CREATE TABLE offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    display_id TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    company_id UUID REFERENCES companies(id),
    total NUMERIC,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, SENT, ACCEPTED, REJECTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Offer Items Table
CREATE TABLE offer_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    description TEXT,
    quantity NUMERIC,
    price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Material Orders Table
CREATE TABLE material_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    supplier_id UUID REFERENCES suppliers(id),
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Actual Costs Table
CREATE TABLE actual_costs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    cost_type TEXT, -- 'MATERIAL', 'CREW', 'OTHER'
    amount NUMERIC,
    cost_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Crew Settlements Table
CREATE TABLE crew_settlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crew_id UUID REFERENCES crews(id),
    order_id UUID REFERENCES orders(id),
    amount NUMERIC,
    status TEXT DEFAULT 'UNPAID', -- UNPAID, PAID
    settlement_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE actual_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_settlements ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES (Allow all for anon & authenticated temporarily for development)
CREATE POLICY "Enable all for anon suppliers" ON suppliers FOR ALL USING (true);
CREATE POLICY "Enable all for anon materials" ON materials FOR ALL USING (true);
CREATE POLICY "Enable all for anon services" ON services FOR ALL USING (true);
CREATE POLICY "Enable all for anon offers" ON offers FOR ALL USING (true);
CREATE POLICY "Enable all for anon offer_items" ON offer_items FOR ALL USING (true);
CREATE POLICY "Enable all for anon material_orders" ON material_orders FOR ALL USING (true);
CREATE POLICY "Enable all for anon actual_costs" ON actual_costs FOR ALL USING (true);
CREATE POLICY "Enable all for anon crew_settlements" ON crew_settlements FOR ALL USING (true);
