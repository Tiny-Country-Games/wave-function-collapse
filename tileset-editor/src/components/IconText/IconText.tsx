import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type IconTextProps = {
    children: React.ReactNode;
    icon: IconProp;
    fixedWidth?: boolean
};

const IconText = ({icon, children, fixedWidth}: IconTextProps) => {
    return (
        <>
            <FontAwesomeIcon icon={icon} fixedWidth={fixedWidth}/>&nbsp;{children}
        </>
    );
};

export default IconText;
