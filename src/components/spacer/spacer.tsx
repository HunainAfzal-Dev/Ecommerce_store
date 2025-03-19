import React from "react";

interface SpacerProps {
    height?: string | number;
    width?: string | number;
}

const Spacer: React.FC<SpacerProps> = ({ height = "1rem", width = "100%" }) => {
    return <div style={{ height, width }} />;
};

export default Spacer;
