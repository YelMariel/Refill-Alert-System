import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Dashboard from '../../components/dashboard/admin';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <Navbar />
      <Dashboard user={{ role: 'admin' }} />
      <h1>Welcome to the Admin Dashboard</h1>
    </div>
  );
};


export default AdminDashboard;
