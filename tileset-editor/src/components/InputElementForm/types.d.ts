type InputElementFormProps<T extends InputForm> = {
    form: T;
    onChange: ((key: string, value: any) => void) | ((key: string, value: any) => Promise<void>);
    includedKeys?: string[];
    spacing?: 0 | 1 | 2 | 3 | 4 | 5;
}
