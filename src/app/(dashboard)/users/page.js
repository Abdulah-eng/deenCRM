"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Shield, Plus, Search, Filter, Edit3, Eye, Trash2, Users } from 'lucide-react';
import styles from './page.module.css';

export default function UsersPage() {
  const users = [
    { id: 'USR-0001', name: 'Admin User', email: 'admin@procrm.de', role: 'ADMINISTRATOR', company: 'All Companies', status: 'ACTIVE', lastLogin: 'Today 07:30', initials: 'A', color: '#7239ea' },
    { id: 'USR-0002', name: 'Max Mueller', email: 'max.mueller@procrm.de', role: 'MANAGER', company: 'Screed Works', status: 'ACTIVE', lastLogin: 'Today 08:15', initials: 'M', color: '#009ef7' },
    { id: 'USR-0003', name: 'Hans Schmidt', email: 'hans.schmidt@procrm.de', role: 'SALES', company: 'Heating Works', status: 'ACTIVE', lastLogin: 'Today 07:55', initials: 'H', color: '#50cd89' },
    { id: 'USR-0004', name: 'Klaus Weber', email: 'klaus.weber@procrm.de', role: 'CREW', company: 'Screed Works', status: 'ACTIVE', lastLogin: 'Yesterday', initials: 'K', color: '#ffc700' },
    { id: 'USR-0005', name: 'Anna Fischer', email: 'anna.fischer@procrm.de', role: 'ACCOUNTANT', company: 'Electrical Works', status: 'ACTIVE', lastLogin: 'Today 06:45', initials: 'A', color: '#f1416c' },
    { id: 'USR-0006', name: 'Peter Bauer', email: 'peter.bauer@procrm.de', role: 'SALES', company: 'Heating Works', status: 'ACTIVE', lastLogin: 'Today 08:00', initials: 'P', color: '#50cd89' },
    { id: 'USR-0007', name: 'Maria Hofmann', email: 'maria.hofmann@procrm.de', role: 'MANAGER', company: 'Electrical Works', status: 'INACTIVE', lastLogin: '3 days ago', initials: 'M', color: '#009ef7' },
  ];

  return (
    <>
      <Header title="Users & Roles" subtitle="Users & Roles" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Manage system users, assign roles, and control access permissions.</p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.filterBtn}>
              <Filter size={16} /> Filter applied
            </button>
            <button className="btn btn-primary">
              <Plus size={16} style={{ marginRight: '8px' }} /> Add New User
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#7239ea', backgroundColor: 'rgba(114, 57, 234, 0.1)' }}>
              <Shield size={20} />
            </div>
            <h3>1</h3>
            <p>Administrator</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#009ef7', backgroundColor: 'rgba(0, 158, 247, 0.1)' }}>
              <Users size={20} />
            </div>
            <h3>2</h3>
            <p>Manager</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#50cd89', backgroundColor: 'rgba(80, 205, 137, 0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3>2</h3>
            <p>Sales Staff</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#ffc700', backgroundColor: 'rgba(255, 199, 0, 0.1)' }}>
              <Users size={20} />
            </div>
            <h3>2</h3>
            <p>Crew / Worker</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#f1416c', backgroundColor: 'rgba(241, 65, 108, 0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <h3>1</h3>
            <p>Accountant</p>
          </div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <Users size={16} /> All System Users (8)
            </div>
            <div className={styles.tableControls}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input type="text" placeholder="Search users..." />
              </div>
            </div>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>COMPANY</th>
                  <th>STATUS</th>
                  <th>LAST LOGIN</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar} style={{ backgroundColor: user.color }}>
                          {user.initials}
                        </div>
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>{user.name}</span>
                          <span className={styles.userId}>ID: {user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.emailText}>{user.email}</span></td>
                    <td>
                      <span className={styles.roleBadge} style={{ 
                        color: user.color, 
                        backgroundColor: `${user.color}15` 
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td><span className={styles.companyText}>{user.company}</span></td>
                    <td>
                      <span className={`badge ${user.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td><span className={styles.lastLoginText}>{user.lastLogin}</span></td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn}><Edit3 size={14} color="#009ef7" /></button>
                        <button className={styles.actionBtn}><Eye size={14} color="#50cd89" /></button>
                        <button className={styles.actionBtn}><Trash2 size={14} color="#f1416c" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
