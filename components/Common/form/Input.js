import React from 'react'
import Colors from '../../../constants/Colors'
import { validateEmail, validateNum, validateDefaultInput } from '../../Helpers/FormValidation/InputValidation'

class Input extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value ? this.props.value : '',
            isValid: !!this.props.value,
            fieldType: this.props.fieldType,
            required: this.props.required ? this.props.required : false,
            errorMessage: this.props.errorMessage,
            disabled: this.props.disabled,
            placeholder: this.props.placeholder ? this.props.placeholder : null,
            onTextChange: this.props.onTextChange,
            name: this.props.name,
            numberLength: this.props.numberLength,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            disabled: nextProps.disabled,
            value: nextProps.value
        })
    }

    componentDidMount() {
        this.state.onTextChange(this.getEvent())
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.value && !this.state.value) {
            this.handleChange({
                target: { value: nextState.value, name: this.state.name }
            });
        }
    }


    onBlur = () => {
        this.handleChange({
            target: { value: this.state.value, name: this.state.name }
        })
    }

    handleChange = ( event ) => {
        this.setState({ value: event.target.value }, ()=>{
            switch(this.state.type){
                case 'email':
                    this.setState({
                        isValid: validateEmail(this.state.value),
                    }, () => {
                        this.state.onTextChange(this.getEvent())
                    })
                    break

                case 'number':
                    this.setState({
                        isValid: validateNum(this.state.value, this.state.numberLength),
                    }, () => {
                        this.state.onTextChange(this.getEvent())
                    })
                    break

                default:
                    this.setState({
                        isValid: this.state.required ? validateDefaultInput(this.state.value) : true
                    }, () => {
                        this.state.onTextChange(this.getEvent())
                    })
                    break
            }
        })
    }

    getEvent = () => {
        let tmpEvent = {};
        tmpEvent.target = { isValid: this.state.isValid, name: this.state.name, value: this.state.value }
        return tmpEvent ;
    }

    render(){
        const { value, isValid, fieldType, required, errorMessage, disabled, placeholder, name } = this.state
        // const err = isValid ? null : <p style={styles.error}>{errorMessage}</p>
        return (
            <div style={styles.inputWrapper}>
                <p style={styles.label}>{ name }</p>
                <div style={styles.inputContainer}>
                    {
                        fieldType === 'input' ?
                            <input
                                onBlur={this.onBlur}
                                value={value}
                                required={required}
                                placeholder={placeholder}
                                disabled={disabled}
                                style={ disabled ? styles.disabledInputField : styles.inputField}
                                onChange={this.handleChange}
                                name={name} />
                                :
                            <textarea
                                onBlur={this.onBlur}
                                value={value}
                                required={required}
                                placeholder={placeholder}
                                disabled={disabled}
                                style={styles.inputField}
                                onChange={this.handleChange}
                                name={name}
                                rows="5"/>
                    }
                </div>
                {/*{ err }*/}
            </div>
        )
    }
}

const styles = {
    inputWrapper: {
      fontSize: '13px'
    },
    inputContainer: {
        backgroundColor: "#FFF",
        padding: '8px'
    },
    disabledInputField: {
        width:'100%',
        backgroundColor:'#FFF',
        padding: '0',
        border:'0',
        margin: '0',
        outline:'none',
        fontSize: '13px',
    },
    inputField: {
        width:'100%',
        backgroundColor:'#FFF',
        padding: '0',
        border:'0',
        margin: '0',
        outline:'none',
        fontSize: '13px'
    },
    label: {
        color:'#999999',
        padding:'8px'
    },
    error: {
        color:'red',
        padding:'2vw'
    },
}

export default Input
