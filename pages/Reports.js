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
    }, [reportType]);

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
                }, type.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '))
            )
        ),
        React.createElement('div', {
            className: 'grid grid-cols-2 gap-4 mb-6'
        },
            React.createElement(Input, {
                type: 'date',
                value: dateRange.start,
                onChange: (e) => setDateRange({ ...dateRange, start: e.target.value }),
                label: 'Start Date'
            }),
            React.createElement(Input, {
                type: 'date',
                value: dateRange.end,
                onChange: (e) => setDateRange({ ...dateRange, end: e.target.value }),
                label: 'End Date'
            })
        ),
        loading ? React.createElement('div', {
            className: 'text-center'
        }, 'Loading...') :
        reportData && React.createElement('div', {
            className: 'card',
            'data-name': 'report-content'
        },
            React.createElement('pre', {
                className: 'whitespace-pre-wrap'
            }, JSON.stringify(reportData, null, 2))
        )
    );
}
