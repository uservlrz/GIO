// src/data/users.js
export const users = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      name: 'Administrador',
      email: 'admin@topconstrutora.com',
      role: 'admin',
      department: 'TI',
      position: 'Diretor de TI',
      phone: '(11) 99999-9999',
      avatarUrl: '/api/placeholder/80/80',
      createdAt: '2023-01-01T00:00:00.000Z',
      lastLogin: null
    },
    {
      id: 2,
      username: 'maria',
      password: 'maria123',
      name: 'Maria Silva',
      email: 'maria@topconstrutora.com',
      role: 'manager',
      department: 'RH',
      position: 'Gerente de RH',
      phone: '(11) 98888-8888',
      avatarUrl: '/api/placeholder/80/80',
      createdAt: '2023-01-15T00:00:00.000Z',
      lastLogin: null
    },
    {
      id: 3,
      username: 'joao',
      password: 'joao123',
      name: 'João Oliveira',
      email: 'joao@topconstrutora.com',
      role: 'engineer',
      department: 'Engenharia',
      position: 'Engenheiro Civil',
      phone: '(11) 97777-7777',
      avatarUrl: '/api/placeholder/80/80',
      createdAt: '2023-02-01T00:00:00.000Z',
      lastLogin: null
    },
    {
      id: 4,
      username: 'ana',
      password: 'ana123',
      name: 'Ana Pereira',
      email: 'ana@topconstrutora.com',
      role: 'analyst',
      department: 'Financeiro',
      position: 'Analista Financeira',
      phone: '(11) 96666-6666',
      avatarUrl: '/api/placeholder/80/80',
      createdAt: '2023-03-10T00:00:00.000Z',
      lastLogin: null
    },
    {
        id: 5,
        username: 'jao',
        password: 'jaozin',
        name: 'Ana Pereira',
        email: 'ana@topconstrutora.com',
        role: 'analyst',
        department: 'Financeiro',
        position: 'Analista Financeira',
        phone: '(11) 96666-6666',
        avatarUrl: '/api/placeholder/80/80',
        createdAt: '2023-03-10T00:00:00.000Z',
        lastLogin: null
      }
  ];
  
  // Definições de roles e suas permissões
  export const roles = {
    admin: {
      name: 'Administrador',
      permissions: ['all']
    },
    manager: {
      name: 'Gerente',
      permissions: ['view_reports', 'manage_users', 'manage_projects']
    },
    engineer: {
      name: 'Engenheiro',
      permissions: ['view_projects', 'update_projects']
    },
    analyst: {
      name: 'Analista',
      permissions: ['view_reports']
    }
  };