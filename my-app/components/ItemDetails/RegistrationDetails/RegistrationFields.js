import React, { Component } from 'react'
import Colors from "../../../constants/Colors"
import Input from '../../../components/Common/form/Input'

class RegistrationFields extends Component {
    constructor(props){
        super(props)
        this.state = {
            callbackUpdateForm: this.props.callbackUpdateForm,
            config: this.props.item.config,
            isParticipated: this.props.isParticipated,
            formValues: undefined,
            inputFields: [],
            isValidForm: false,
            isEditing: this.props.isEditing,
            registrationObj: this.props.registrationObj
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            isParticipated: nextProps.isParticipated,
            isEditing: nextProps.isEditing,
            registrationObj: nextProps.registrationObj
        })
    }

    componentDidMount() {
        this.extractFieldsFromConfig();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.registrationObj && !this.state.registrationObj) {
            this.extractValuesFromConfig(this.state.formValues, nextState.registrationObj);
        }
    }

    extractFieldsFromConfig = () => {
        let tmpConfig = JSON.parse(this.state.config)
        this.setState({
            inputFields: tmpConfig.inputFields && tmpConfig.inputFields.length > 0 ? tmpConfig.inputFields : undefined
        }, ()=> {
            this.initFormTemplate()
        })
    }

    initFormTemplate = () => {
        let tmpConfig = JSON.parse(this.state.config)
        let tmpFormValues = []
        for (let field of tmpConfig.inputFields) {
            tmpFormValues.push({
                'title': field.title,
                'value': '',
                'isValid': false,
                'type': field.type
            })
        }
        this.setState({ formValues: tmpFormValues }, () => {
            this.state.callbackUpdateForm(this.state.formValues, this.state.isValidForm)
        })

    }

    extractValuesFromConfig = (tmpFormValues, tmpRegistrationObj) => {
        let valueArray = JSON.parse(tmpRegistrationObj.config)
        for (let formValue of tmpFormValues) {
            for (let value of valueArray) {
                if (formValue.title === value.title) {
                    formValue.value = value.value
                }
            }
        }
        this.setState({ formValues: tmpFormValues }, () => {
            this.state.callbackUpdateForm(this.state.formValues, this.state.isValidForm)
        })
    }

    handleChange = event => {
        let { formValues } = this.state
        let _isValidForm = true;
        for (let formValue of formValues) {
            if (formValue.title === event.target.name) {
                formValue.value = event.target.value
                formValue.isValid = event.target.isValid
            }
            if (!formValue.isValid) {
                _isValidForm = false
            }
        }
        this.setState({
            formValues: formValues,
            isValidForm: _isValidForm
        }, () => {
            this.state.callbackUpdateForm(this.state.formValues, this.state.isValidForm)
        })
    }

    render(){
        const { formValues, isEditing, isParticipated } = this.state
        const errMsg = 'error!'
        const placeholder = '请输入'
        const disableForm = !isEditing && isParticipated
        if (formValues) {
            return (
                <div style={styles.formWrapper}>
                    {formValues.map((field, index) => {
                        let { type, title, value } = field
                        return ( <Input key={index}
                                        name={title}
                                        required={true}
                                        errorMessage={errMsg}
                                        placeholder={placeholder + title}
                                        fieldType={type}
                                        value={value}
                                        disabled={disableForm}
                                        onTextChange={this.handleChange} /> )
                    })}
                    <div style={Colors.style.bottomDivider}/>
                </div>
            )
        }
        else return null
    }
}

const styles = {
    formWrapper: {
        backgroundColor: Colors.formBackground
    },
    inputField: {
        fontSize: '14px'
    }
}

export default RegistrationFields


