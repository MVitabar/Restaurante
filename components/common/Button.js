function Button({ children, variant = 'primary', className = '', onClick, disabled = false, type = 'button', ...props }) {
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'border border-white bg-transparent hover:bg-white/10'
    };

    return React.createElement('button', {
        className: `${baseClasses} ${variantClasses[variant]} ${className}`,
        onClick,
        disabled,
        type,
        'data-name': 'button',
        ...props
    }, children);
}
