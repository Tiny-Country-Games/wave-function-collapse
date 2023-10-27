import React from "react";

type ConditionalComponentProps = {
    show?: boolean;
    children: React.ReactNode;
};

const ConditionalComponent = ({children, show}: ConditionalComponentProps) => {
    return show ? <>{children}</> : null;
};

export default ConditionalComponent;
