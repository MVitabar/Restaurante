function Settings() {
    const { user: currentUser, createUser, updateUser, deleteUser, listUsers } = useAuth();
    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [settings, setSettings] = React.useState({
        language: 'en',
        currency: 'USD',
        taxRate: 10,
        theme: 'dark'
    });

    React.useEffect(() => {
        try {
            const loadUsers = async () => {
                const userList = await listUsers();
                setUsers(userList);
            };
            loadUsers();
        } catch (error) {
            reportError(error);
        }
    }, []);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            localStorage.setItem('settings', JSON.stringify(settings));
        } catch (error) {
            reportError(error);
        }
    };

    const handleCreateUser = async (userData) => {
        try {
            await createUser(userData);
            const updatedUsers = await listUsers();
            setUsers(updatedUsers);
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleUpdateUser = async (userId, userData) => {
        try {
            await updateUser(userId, userData);
            const updatedUsers = await listUsers();
            setUsers(updatedUsers);
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            const updatedUsers = await listUsers();
            setUsers(updatedUsers);
        } catch (error) {
            reportError(error);
        }
    };

    const availablePermissions = [
        'tables.view',
        'tables.edit',
        'rooms.view',
        'rooms.edit',
        'orders.view',
        'orders.edit',
        'menu.view',
        'menu.edit',
        'reports.view'
    ];

    return React.createElement('div', {
        className: 'space-y-6',
        'data-name': 'settings-page'
    },
        currentUser.role === 'admin' && React.createElement('div', {
            className: 'card'
        },
            React.createElement('div', {
                className: 'flex justify-between items-center mb-4'
            },
                React.createElement('h3', {
                    className: 'text-xl font-semibold'
                }, 'User Management'),
                React.createElement(Button, {
                    onClick: () => {
                        setSelectedUser(null);
                        setIsModalOpen(true);
                    },
                    'data-name': 'add-user-button'
                }, 'Add User')
            ),
            React.createElement('div', {
                className: 'overflow-x-auto'
            },
                React.createElement('table', {
                    className: 'table'
                },
                    React.createElement('thead', null,
                        React.createElement('tr', null,
                            React.createElement('th', null, 'Username'),
                            React.createElement('th', null, 'Role'),
                            React.createElement('th', null, 'Permissions'),
                            React.createElement('th', null, 'Actions')
                        )
                    ),
                    React.createElement('tbody', null,
                        users.map(user =>
                            React.createElement('tr', {
                                key: user.id
                            },
                                React.createElement('td', null, user.username),
                                React.createElement('td', null, user.role),
                                React.createElement('td', null, 
                                    user.permissions.join(', ')
                                ),
                                React.createElement('td', null,
                                    React.createElement('div', {
                                        className: 'flex gap-2'
                                    },
                                        React.createElement(Button, {
                                            onClick: () => {
                                                setSelectedUser(user);
                                                setIsModalOpen(true);
                                            },
                                            variant: 'secondary',
                                            className: 'text-sm',
                                            'data-name': `edit-user-${user.id}`
                                        }, 'Edit'),
                                        user.id !== currentUser.id && React.createElement(Button, {
                                            onClick: () => handleDeleteUser(user.id),
                                            variant: 'outline',
                                            className: 'text-sm',
                                            'data-name': `delete-user-${user.id}`
                                        }, 'Delete')
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ),
        React.createElement('div', {
            className: 'card space-y-4'
        },
            React.createElement('h3', {
                className: 'text-xl font-semibold'
            }, 'General Settings'),
            React.createElement('form', {
                onSubmit: handleSaveSettings,
                className: 'space-y-4'
            },
                React.createElement('div', {
                    className: 'grid grid-cols-2 gap-4'
                },
                    React.createElement('div', null,
                        React.createElement('label', {
                            className: 'block text-sm font-medium mb-1'
                        }, 'Language'),
                        React.createElement('select', {
                            value: settings.language,
                            onChange: (e) => setSettings({ ...settings, language: e.target.value }),
                            className: 'input w-full',
                            'data-name': 'language-select'
                        },
                            React.createElement('option', { value: 'en' }, 'English'),
                            React.createElement('option', { value: 'es' }, 'Spanish'),
                            React.createElement('option', { value: 'pt' }, 'Portuguese')
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', {
                            className: 'block text-sm font-medium mb-1'
                        }, 'Currency'),
                        React.createElement('select', {
                            value: settings.currency,
                            onChange: (e) => setSettings({ ...settings, currency: e.target.value }),
                            className: 'input w-full',
                            'data-name': 'currency-select'
                        },
                            React.createElement('option', { value: 'USD' }, 'USD'),
                            React.createElement('option', { value: 'EUR' }, 'EUR'),
                            React.createElement('option', { value: 'GBP' }, 'GBP')
                        )
                    )
                ),
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-1'
                    }, 'Tax Rate (%)'),
                    React.createElement('input', {
                        type: 'number',
                        value: settings.taxRate,
                        onChange: (e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) }),
                        className: 'input w-full',
                        min: 0,
                        max: 100,
                        'data-name': 'tax-rate-input'
                    })
                ),
                React.createElement(Button, {
                    type: 'submit',
                    className: 'w-full mt-4',
                    'data-name': 'save-settings-button'
                }, 'Save Settings')
            )
        ),
        React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => {
                setIsModalOpen(false);
                setSelectedUser(null);
            },
            title: selectedUser ? 'Edit User' : 'Add User'
        },
            React.createElement('form', {
                onSubmit: async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const userData = {
                        username: formData.get('username'),
                        password: formData.get('password'),
                        role: formData.get('role'),
                        permissions: Array.from(formData.getAll('permissions'))
                    };
                    
                    if (selectedUser) {
                        await handleUpdateUser(selectedUser.id, userData);
                    } else {
                        await handleCreateUser(userData);
                    }
                },
                className: 'space-y-4'
            },
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-1'
                    }, 'Username'),
                    React.createElement('input', {
                        name: 'username',
                        type: 'text',
                        defaultValue: selectedUser?.username || '',
                        className: 'input w-full',
                        required: true,
                        'data-name': 'username-input'
                    })
                ),
                !selectedUser && React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-1'
                    }, 'Password'),
                    React.createElement('input', {
                        name: 'password',
                        type: 'password',
                        className: 'input w-full',
                        required: !selectedUser,
                        'data-name': 'password-input'
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-1'
                    }, 'Role'),
                    React.createElement('select', {
                        name: 'role',
                        defaultValue: selectedUser?.role || 'user',
                        className: 'input w-full',
                        'data-name': 'role-select'
                    },
                        React.createElement('option', { value: 'user' }, 'User'),
                        React.createElement('option', { value: 'admin' }, 'Admin')
                    )
                ),
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-1'
                    }, 'Permissions'),
                    React.createElement('div', {
                        className: 'space-y-2'
                    },
                        availablePermissions.map(permission =>
                            React.createElement('div', {
                                key: permission,
                                className: 'flex items-center'
                            },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    name: 'permissions',
                                    value: permission,
                                    defaultChecked: selectedUser?.permissions.includes(permission),
                                    className: 'mr-2',
                                    'data-name': `permission-${permission}`
                                }),
                                React.createElement('label', null, permission)
                            )
                        )
                    )
                ),
                React.createElement(Button, {
                    type: 'submit',
                    className: 'w-full',
                    'data-name': 'submit-user-button'
                }, selectedUser ? 'Update User' : 'Create User')
            )
        )
    );
}
