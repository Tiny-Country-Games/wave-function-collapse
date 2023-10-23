import React, {useRef} from "react";
import {ButtonVariant} from "react-bootstrap/types";
import {Button} from "react-bootstrap";

type ReadPlainTextFileButtonProps = {
    variant: ButtonVariant;
    children: React.ReactNode;
    onReadFile: ((fileContent: string) => void) | ((fileContent: string) => Promise<void>);
    disabled?: boolean;
    className?: string;
    accept?: string;
};

const ReadPlainTextFileButton = (props: ReadPlainTextFileButtonProps) => {
    const {
        accept,
        children,
        onReadFile,
        variant,
        disabled,
        className,
    } = props;

    const fileSelectRef = useRef<HTMLInputElement>(null);

    const onSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (!event.target.files || event.target.files.length === 0) return;
        try {
            const file = event.target.files[0];
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(`${reader.result}`);
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            });
            if (fileSelectRef.current) fileSelectRef.current.value = "";
            onReadFile(fileContent);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <input
                type={'file'}
                onChange={onSelectFile}
                accept={accept}
                className={'d-none'}
                ref={fileSelectRef}
            />
            <Button
                type={'button'}
                variant={variant}
                disabled={disabled}
                className={className}
                onClick={() => fileSelectRef.current?.click()}
            >{children}</Button>
        </>
    );
};

export default ReadPlainTextFileButton
