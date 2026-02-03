import React from 'react';

export const AmbientBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[150px] rounded-full mix-blend-screen" />
        </div>
    );
};
