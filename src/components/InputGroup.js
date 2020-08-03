import React, { Children } from 'react';

const InputGroup = (props) => {
    const {children, ...childProps} = props;

    return (
        <div className="form-group" {...childProps}>
            <label htmlFor={props.label.toLowerCase()}>{props.label}</label>
            { children }
        </div>
    )
}

export default InputGroup;