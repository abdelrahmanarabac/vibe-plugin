export type StyleType = 'typography' | 'effect' | 'grid';

export interface StyleFormData {
    name: string;
    type: StyleType;
    description: string;
}

export interface NewStyleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: string; value: any }) => void;
}
