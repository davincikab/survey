import React from 'react';

const SliderCheckbox = (props) => {
    const renderItem = (checked) =>{
        if(checked) {
            return <small className="slider slider-checked"></small>
        }

        return <small className="slider"></small>
    };

    return (
        <div className="form-group">
            <span className="label">{props.label}</span>
            <label className="switch">
               {renderItem(props.checked)}
                <input 
                    className="checkbox"
                    type="checkbox"  
                    checked={props.checked}
                    name={props.name}
                    onChange={props.onChange}
                />
            </label>
        </div>
    )
}

export default SliderCheckbox;