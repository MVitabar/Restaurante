function Reports() {
    const [reportType, setReportType] = React.useState('daily-sales');
    const [reportData, setReportData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [dateRange, setDateRange] = React.useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const fetchReport = async () => {
        try {
            setLoading(true);
            const data = await generateReport(reportType, { dateRange });
            setReportData(data);
        } catch (error) {
            reportError(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchReport();
    }, [reportType, dateRange]);

    const renderReportContent = () => {
        if (!reportData) return null;

        switch (reportType) {
            case 'daily-sales':
                return React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('div', {
                        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
                    },
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Total de Ventas'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, `$${reportData.totalSales.toFixed(2)}`)
                        ),
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Items Vendidos'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, reportData.itemsSold)
                        ),
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Cantidad de Pedidos'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, reportData.orderCount)
                        )
                    ),
                    React.createElement('div', {
                        className: 'card'
                    },
                        React.createElement('h3', {
                            className: 'text-lg font-semibold mb-4'
                        }, 'Pedidos'),
                        React.createElement('div', {
                            className: 'space-y-2'
                        },
                            reportData.orders.map((order, index) =>
                                React.createElement('div', {
                                    key: index,
                                    className: 'flex justify-between items-center p-2 hover:bg-white/5'
                                },
                                    React.createElement('div', null,
                                        React.createElement('span', {
                                            className: 'mr-4'
                                        }, `Pedido #${order.id}`),
                                        React.createElement('span', {
                                            className: 'text-sm opacity-75'
                                        }, `por ${order.createdBy}`)
                                    ),
                                    React.createElement('div', null,
                                        React.createElement('span', {
                                            className: 'mr-4'
                                        }, `$${order.total.toFixed(2)}`),
                                        React.createElement('span', {
                                            className: 'text-sm opacity-75'
                                        }, new Date(order.date).toLocaleString())
                                    )
                                )
                            )
                        )
                    )
                );

            case 'room-occupancy':
                return React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('div', {
                        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
                    },
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Total de Habitaciones'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, reportData.totalRooms)
                        ),
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Habitaciones Ocupadas'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, reportData.occupied)
                        ),
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Tasa de Ocupación'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, `${reportData.occupancyRate.toFixed(1)}%`)
                        )
                    ),
                    React.createElement('div', {
                        className: 'card'
                    },
                        React.createElement('h3', {
                            className: 'text-lg font-semibold mb-4'
                        }, 'Estado de Habitaciones'),
                        React.createElement('div', {
                            className: 'grid grid-cols-2 md:grid-cols-4 gap-4'
                        },
                            reportData.rooms.map((room, index) =>
                                React.createElement('div', {
                                    key: index,
                                    className: `p-4 rounded ${room.status === 'occupied' ? 'bg-red-500/20' : 'bg-green-500/20'}`
                                },
                                    React.createElement('div', {
                                        className: 'font-semibold'
                                    }, `Habitación ${room.number}`),
                                    React.createElement('div', {
                                        className: 'text-sm opacity-75'
                                    }, room.status === 'occupied' ? 'Ocupada' : 'Disponible'),
                                    React.createElement('div', {
                                        className: 'text-sm'
                                    }, `Tipo: ${room.type}`),
                                    room.history && room.history.length > 0 && React.createElement('div', {
                                        className: 'mt-2 text-sm opacity-75'
                                    }, `${room.history.length} ocupaciones en el período`)
                                )
                            )
                        )
                    )
                );

            case 'table-usage':
                return React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('div', {
                        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
                    },
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Total de Mesas'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, reportData.totalTables)
                        ),
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Mesas Ocupadas'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, reportData.occupied)
                        ),
                        React.createElement('div', {
                            className: 'card'
                        },
                            React.createElement('h3', {
                                className: 'text-lg font-semibold mb-2'
                            }, 'Tasa de Utilización'),
                            React.createElement('p', {
                                className: 'text-2xl'
                            }, `${reportData.utilizationRate.toFixed(1)}%`)
                        )
                    ),
                    React.createElement('div', {
                        className: 'card'
                    },
                        React.createElement('h3', {
                            className: 'text-lg font-semibold mb-4'
                        }, 'Estado de Mesas'),
                        React.createElement('div', {
                            className: 'grid grid-cols-2 md:grid-cols-4 gap-4'
                        },
                            reportData.tables.map((table, index) =>
                                React.createElement('div', {
                                    key: index,
                                    className: `p-4 rounded ${table.status === 'occupied' ? 'bg-red-500/20' : 'bg-green-500/20'}`
                                },
                                    React.createElement('div', {
                                        className: 'font-semibold'
                                    }, `Mesa ${table.id}`),
                                    React.createElement('div', {
                                        className: 'text-sm opacity-75'
                                    }, table.status === 'occupied' ? 'Ocupada' : 'Disponible'),
                                    table.history && table.history.length > 0 && React.createElement('div', {
                                        className: 'mt-2 text-sm opacity-75'
                                    }, 
                                        `${table.history.length} usos en el período`,
                                        React.createElement('div', null,
                                            `Total: $${table.history.reduce((sum, h) => sum + h.total, 0).toFixed(2)}`
                                        )
                                    )
                                )
                            )
                        )
                    )
                );

            default:
                return null;
        }
    };

    return React.createElement('div', {
        className: 'space-y-6',
        'data-name': 'reports-page'
    },
        React.createElement('div', {
            className: 'flex gap-4 mb-6'
        },
            ['daily-sales', 'room-occupancy', 'table-usage'].map(type =>
                React.createElement(Button, {
                    key: type,
                    onClick: () => setReportType(type),
                    variant: reportType === type ? 'primary' : 'outline',
                    className: 'flex-1',
                    'data-name': `report-type-${type}`
                }, 
                    type === 'daily-sales' ? 'Ventas Diarias' :
                    type === 'room-occupancy' ? 'Ocupación de Habitaciones' :
                    'Uso de Mesas'
                )
            )
        ),
        React.createElement('div', {
            className: 'grid grid-cols-2 gap-4 mb-6'
        },
            React.createElement(Input, {
                type: 'date',
                value: dateRange.start,
                onChange: (e) => setDateRange({ ...dateRange, start: e.target.value }),
                label: 'Fecha Inicio'
            }),
            React.createElement(Input, {
                type: 'date',
                value: dateRange.end,
                onChange: (e) => setDateRange({ ...dateRange, end: e.target.value }),
                label: 'Fecha Fin'
            })
        ),
        loading ? React.createElement('div', {
            className: 'text-center'
        }, 'Cargando...') :
        React.createElement('div', {
            className: 'space-y-4',
            'data-name': 'report-content'
        }, renderReportContent())
    );
}
