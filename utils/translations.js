const translations = {
    pt: {
        // Application Name
        hotelAndRestaurant: 'Hotel & Restaurante',

        // Common
        save: 'Salvar',
        edit: 'Editar',
        delete: 'Excluir',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        close: 'Fechar',
        add: 'Adicionar',
        status: 'Status',
        total: 'Total',
        items: 'Itens',
        actions: 'Ações',
        search: 'Pesquisar',
        filter: 'Filtrar',
        submit: 'Enviar',
        view: 'Visualizar',

        // Navigation
        dashboard: 'Painel',
        tables: 'Mesas',
        rooms: 'Quartos',
        orders: 'Pedidos',
        menu: 'Cardápio',
        reports: 'Relatórios',
        settings: 'Configurações',

        // Client Types
        walkInGuest: 'Passante',
        hotelGuest: 'Hóspede do Hotel',
        clientType: 'Tipo de Cliente',
        selectRoom: 'Selecionar Quarto',
        room: 'Quarto',
        updateTableStatus: 'Atualizar Status da Mesa',

        // Auth
        login: 'Entrar',
        logout: 'Sair',
        username: 'Usuário',
        password: 'Senha',
        invalidCredentials: 'Credenciais inválidas',
        forgotPassword: 'Esqueceu a senha?',
        rememberMe: 'Lembrar-me',

        // Tables
        restaurantTables: 'Mesas do Restaurante',
        addTable: 'Adicionar Mesa',
        tableNumber: 'Mesa',
        seats: 'Lugares',
        available: 'Disponível',
        occupied: 'Ocupada',
        reserved: 'Reservada',
        changeStatus: 'Alterar Status',
        currentOrder: 'Pedido Atual',
        viewOrder: 'Ver Pedido',
        tableStatus: 'Status da Mesa',
        tableCapacity: 'Capacidade',

        // Orders
        newOrder: 'Novo Pedido',
        orderDetails: 'Detalhes do Pedido',
        editOrder: 'Editar Pedido',
        completeOrder: 'Concluir Pedido',
        orderID: 'ID do Pedido',
        quantity: 'Quantidade',
        selectItem: 'Selecionar Item',
        selectTable: 'Selecionar Mesa',
        addItem: 'Adicionar Item',
        removeItem: 'Remover Item',
        confirmCompletion: 'Confirmar & Concluir',
        pleaseConfirm: 'Por favor confirme os detalhes do pedido:',
        orderTime: 'Hora do Pedido',
        orderDate: 'Data do Pedido',
        orderTotal: 'Total do Pedido',

        // Messages
        confirmDelete: 'Tem certeza que deseja excluir?',
        saved: 'Salvo com sucesso',
        error: 'Ocorreu um erro',
        loading: 'Carregando...',
        noResults: 'Nenhum resultado encontrado',
        successfullyCreated: 'Criado com sucesso',
        successfullyUpdated: 'Atualizado com sucesso',
        successfullyDeleted: 'Excluído com sucesso',
        confirmAction: 'Tem certeza que deseja realizar esta ação?'
    },
    en: {
        // English translations (same structure as Portuguese)
        hotelAndRestaurant: 'Hotel & Restaurant',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        // ... add all other English translations
    }
};

const TranslationContext = React.createContext(null);

function TranslationProvider({ children }) {
    const [language, setLanguage] = React.useState(() => {
        return localStorage.getItem('language') || 'pt';
    });

    React.useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = React.useCallback((key) => {
        try {
            return translations[language]?.[key] || key;
        } catch (error) {
            reportError(error);
            return key;
        }
    }, [language]);

    const contextValue = React.useMemo(() => ({
        language,
        setLanguage,
        t
    }), [language, t]);

    return React.createElement(TranslationContext.Provider, {
        value: contextValue
    }, children);
}

function useTranslation() {
    const context = React.useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}
