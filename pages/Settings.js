function Settings() {
    const { user: currentUser, createUser, updateUser, deleteUser, listUsers } = useAuth();
    const { t } = useTranslation();
    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [settings, setSettings] = React.useState(() => {
        const savedSettings = localStorage.getItem('settings');
        return savedSettings ? JSON.parse(savedSettings) : {
            language: 'pt',
            currency: 'BRL',
            taxRate: 10,
            theme: 'dark'
        };
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

    const availablePermissions = [
        { key: 'dashboard.view', label: t('dashboard.view') },
        { key: 'tables.view', label: t('tables.view') },
        { key: 'tables.edit', label: t('tables.edit') },
        { key: 'rooms.view', label: t('rooms.view') },
        { key: 'rooms.edit', label: t('rooms.edit') },
        { key: 'orders.view', label: t('orders.view') },
        { key: 'orders.edit', label: t('orders.edit') },
        { key: 'menu.view', label: t('menu.view') },
        { key: 'menu.edit', label: t('menu.edit') },
        { key: 'reports.view', label: t('reports.view') },
        { key: 'settings.view', label: t('settings.view') },
        { key: 'settings.edit', label: t('settings.edit') }
    ];

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
            if (window.confirm(t('confirmDelete'))) {
                await deleteUser(userId);
                const updatedUsers = await listUsers();
                setUsers(updatedUsers);
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const userData = {
                username: formData.get('username'),
                password: formData.get('password'),
                role: formData.get('role'),
                permissions: Array.from(formData.getAll('permissions'))
            };

            if (selectedUser) {
                // Don't update password if not provided
                if (!userData.password) {
                    delete userData.password;
                }
                await handleUpdateUser(selectedUser.id, userData);
            } else {
                await handleCreateUser(userData);
            }
        } catch (error) {
            reportError(error);
        }
    };

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
                }, t('userManagement')),
                React.createElement(Button, {
                    onClick: () => {
                        setSelectedUser(null);
                        setIsModalOpen(true);
                    },
                    'data-name': 'add-user-button'
                }, t('addUser'))
            ),
            React.createElement('div', {
                className: 'overflow-x-auto'
            },
                React.createElement('table', {
                    className: 'table'
                },
                    React.createElement('thead', null,
                        React.createElement('tr', null,
                            React.createElement('th', null, t('username')),
                            React.createElement('th', null, t('role')),
                            React.createElement('th', null, t('permissions')),
                            React.createElement('th', null, t('actions'))
                        )
                    ),
                    React.createElement('tbody', null,
                        users.map(user =>
                            React.createElement('tr', {
                                key: user.id
                            },
                                React.createElement('td', null, user.username),
                                React.createElement('td', null, t(user.role)),
                                React.createElement('td', null, 
                                    user.permissions.map(p => t(p)).join(', ')
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
                                        }, t('edit')),
                                        user.id !== currentUser.id && React.createElement(Button, {
                                            onClick: () => handleDeleteUser(user.id),
                                            variant: 'outline',
                                            className: 'text-sm',
                                            'data-name': `delete-user-${user.id}`
                                        }, t('delete'))
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ),
        React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => {
                setIsModalOpen(false);
                setSelectedUser(null);
            },
            title: selectedUser ? t('editUser') : t('addUser')
        },
            React.createElement('form', {
                onSubmit: handleSubmit,
                className: 'space-y-4'
            },
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-1'
                    }, t('username')),
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
                    }, t('password')),
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
                    }, t('role')),
                    React.createElement('select', {
                        name: 'role',
                        defaultValue: selectedUser?.role || 'user',
                        className: 'input w-full',
                        'data-name': 'role-select'
                    },
                        React.createElement('option', { value: 'user' }, t('user')),
                        React.createElement('option', { value: 'admin' }, t('admin'))
                    )
                ),
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-1'
                    }, t('permissions')),
                    React.createElement('div', {
                        className: 'space-y-2 max-h-60 overflow-y-auto'
                    },
                        availablePermissions.map(({ key, label }) =>
                            React.createElement('div', {
                                key,
                                className: 'flex items-center'
                            },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    name: 'permissions',
                                    value: key,
                                    defaultChecked: selectedUser?.permissions.includes(key),
                                    className: 'mr-2',
                                    'data-name': `permission-${key}`
                                }),
                                React.createElement('label', null, label)
                            )
                        )
                    )
                ),
                React.createElement(Button, {
                    type: 'submit',
                    className: 'w-full',
                    'data-name': 'submit-user-button'
                }, selectedUser ? t('updateUser') : t('createUser'))
            )
        )
    );
}
