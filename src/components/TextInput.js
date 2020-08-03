import React, { Children } from 'react';

const TextInput = (props) => {
    return (
        <input 
            className="form-control"
            type={props.type}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            required
        />
    )
}

export default TextInput;