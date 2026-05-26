'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Header from '@/components/layout/Header';
import { Plus, Search, Edit3, Trash2, X, Users, Phone, Wrench } from 'lucide-react';
import styles from './page.module.css';

export default function CrewManagementPage() {
  const [crews, setCrews] = useState([]);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrew, setEditingCrew] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    lead_name: '',
    phone: '',
    specialty: 'Screed',
    size: 1,
    status: 'ACTIVE',
    color: '#000000'
  });

  useEffect(() => {
    fetchCrews();
  }, []);

  const fetchCrews = async () => {
    const { data, error } = await supabase
      .from('crews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching crews:', error);
    } else {
      setCrews(data || []);
    }
  };

  const handleOpenModal = (crew = null) => {
    if (crew) {
      setEditingCrew(crew);
      setFormData({
        name: crew.name,
        lead_name: crew.lead_name,
        phone: crew.phone,
        specialty: crew.specialty,
        size: crew.size,
        status: crew.status,
        color: crew.color
      });
    } else {
      setEditingCrew(null);
      setFormData({
        name: '',
        lead_name: '',
        phone: '',
        specialty: 'Screed',
        size: 1,
        status: 'ACTIVE',
        color: '#000000'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCrew(null);
  };

  const handleSave = async () => {
    if (editingCrew) {
      const { error } = await supabase
        .from('crews')
        .update(formData)
        .eq('id', editingCrew.id);
      
      if (error) console.error('Error updating crew:', error);
    } else {
      const { error } = await supabase
        .from('crews')
        .insert([formData]);
        
      if (error) console.error('Error adding crew:', error);
    }
    handleCloseModal();
    fetchCrews();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crew?')) {
      const { error } = await supabase
        .from('crews')
        .delete()
        .eq('id', id);
        
      if (error) console.error('Error deleting crew:', error);
      else fetchCrews();
    }
  };

  const filteredCrews = crews.filter(c => {
    const matchesSearch = (c.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (c.lead_name?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesSpecialty = specialtyFilter ? c.specialty === specialtyFilter : true;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Header title={`Crew Management (${crews.length})`} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: '#666' }} />
            <input 
              type="text" 
              placeholder="Search by name or lead..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #ccc', width: '250px' }}
            />
          </div>
          <select 
            value={specialtyFilter} 
            onChange={e => setSpecialtyFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="">All Specialties</option>
            <option value="Screed">Screed</option>
            <option value="Heating">Heating</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0f172a', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={20} /> Add Crew
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '16px' }}>Crew Name</th>
              <th style={{ padding: '16px' }}>Lead</th>
              <th style={{ padding: '16px' }}>Specialty</th>
              <th style={{ padding: '16px' }}>Size</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrews.map(crew => (
              <tr key={crew.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: crew.color || '#ccc' }} />
                  <span style={{ fontWeight: '500' }}>{crew.name}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#64748b" />
                    <span>{crew.lead_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    <Phone size={12} />
                    <span>{crew.phone}</span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wrench size={16} color="#64748b" />
                    {crew.specialty}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>{crew.size}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    backgroundColor: crew.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                    color: crew.status === 'ACTIVE' ? '#166534' : '#475569',
                    fontWeight: '500'
                  }}>
                    {crew.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(crew)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '16px' }}>
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(crew.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCrews.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No crews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '520px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{editingCrew ? 'Edit Crew' : 'Add Crew'}</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Team Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Lead Name</label>
                <input type="text" value={formData.lead_name} onChange={e => setFormData({...formData, lead_name: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Phone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Specialty</label>
                <select value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="Screed">Screed</option>
                  <option value="Heating">Heating</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Team Size</label>
                <input type="number" min="1" value={formData.size} onChange={e => setFormData({...formData, size: parseInt(e.target.value) || 1})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Color</label>
                <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} style={{ padding: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '40px', width: '100%' }} />
              </div>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={handleCloseModal} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#334155', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: '500', cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
