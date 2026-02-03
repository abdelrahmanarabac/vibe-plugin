import { useState } from 'react';
import type { StyleType } from '../../domain/types';

export function useStyleCreation() {
    const [name, setName] = useState('');
    const [type, setType] = useState<StyleType>('typography');
    const [description, setDescription] = useState('');

    const handleTypeChange = (newType: string) => {
        setType(newType as StyleType);
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setType('typography');
    };

    const getSubmissionData = () => {
        return {
            name,
            type,
            value: description
        };
    };

    return {
        formState: {
            name,
            type,
            description
        },
        setters: {
            setName,
            setType: handleTypeChange,
            setDescription
        },
        actions: {
            resetForm,
            getSubmissionData
        }
    };
}
