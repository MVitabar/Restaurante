function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return React.createElement('div', {
        className: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 hide-scrollbar overflow-y-auto',
        onClick: onClose,
        'data-name': 'modal-overlay'
    },
        React.createElement('div', {
            className: `glassmorphism ${sizes[size]} w-full my-8`,
            style: { maxHeight: 'calc(100vh - 4rem)' },
            onClick: e => e.stopPropagation(),
            'data-name': 'modal-content'
        },
            React.createElement('div', {
                className: 'flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-inherit z-10'
            },
                React.createElement('h2', {
                    className: 'text-xl font-semibold',
                    'data-name': 'modal-title'
                }, title),
                React.createElement('button', {
                    onClick: onClose,
                    className: 'text-white/60 hover:text-white text-2xl leading-none',
                    'data-name': 'modal-close'
                }, '×')
            ),
            React.createElement('div', {
                className: 'p-4 hide-scrollbar overflow-y-auto',
                style: { maxHeight: 'calc(100vh - 8rem)' },
                'data-name': 'modal-body'
            }, children)
        )
    );
}
