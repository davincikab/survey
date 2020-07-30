import React, { Children } from 'react';

const InputGroup = (props) => {
    const {children, ...childProps} = props;

    return (
        <div className="form-group" {...childProps}>
            { children }
        </div>
    )
}

export default InputGroup;