function Input({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    className = '', 
    ...props 
}) {
    return React.createElement('div', { className: 'mb-4' },
        label && React.createElement('label', {
            className: 'block text-sm font-medium mb-2',
            'data-name': 'input-label'
        }, label),
        React.createElement('input', {
            type,
            value,
            onChange,
            className: `input ${error ? 'border-red-500' : ''} ${className}`,
            'data-name': 'input-field',
            ...props
        }),
        error && React.createElement('p', {
            className: 'text-red-500 text-sm mt-1',
            'data-name': 'input-error'
        }, error)
    );
}
