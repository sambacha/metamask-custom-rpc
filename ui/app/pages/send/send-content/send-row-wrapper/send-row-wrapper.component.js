import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../../../../components/ui/tooltip'
import SendRowErrorMessage from './send-row-error-message'

export default class SendRowWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    errorType: PropTypes.string,
    label: PropTypes.string,
    showError: PropTypes.bool,
    tooltip: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  renderAmountFormRow() {
    const { children, errorType = '', label, showError = false } = this.props
    const formField = Array.isArray(children)
      ? children[1] || children[0]
      : children
    const customLabelContent = children.length > 1 ? children[0] : null

    return (
      <div className="send-v2__form-row">
        <div className="send-v2__form-label">
          {label}
          {customLabelContent}
        </div>
        <div className="send-v2__form-field-container">
          <div className="send-v2__form-field">{formField}</div>
          <div>
            {showError && <SendRowErrorMessage errorType={errorType} />}
          </div>
        </div>
      </div>
    )
  }

  renderFormRow() {
    const { children, errorType = '', showError = false } = this.props

    const formField = Array.isArray(children)
      ? children[1] || children[0]
      : children
    const customLabelContent =
      (Array.isArray(children) && children.length) > 1 ? children[0] : null

    return (
      <div className="send-v2__form-row">
        <div className="send-v2__form-label">
          {this.renderLabel()}
          {showError && <SendRowErrorMessage errorType={errorType} />}
          {customLabelContent}
        </div>
        <div className="send-v2__form-field">{formField}</div>
      </div>
    )
  }

  renderLabel() {
    const { label, tooltip } = this.props

    if (tooltip) {
      return (
        <>
          {label}
          <Tooltip title={tooltip} position="top" arrow>
            <i className="fa fa-info-circle" />
          </Tooltip>
        </>
      )
    } else {
      return label
    }
  }

  render() {
    const { errorType = '' } = this.props

    return errorType === 'amount'
      ? this.renderAmountFormRow()
      : this.renderFormRow()
  }
}
