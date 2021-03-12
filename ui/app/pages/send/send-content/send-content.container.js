import { connect } from 'react-redux'
import {
  getSendTo,
  accountsWithSendEtherInfoSelector,
  getAddressBookEntry,
  getSendPrivateTx,
  getBloxrouteAuthorized,
  getSendPrivateTxTimeout,
} from '../../../selectors'

import * as actions from '../../../store/actions'
import SendContent from './send-content.component'
import { updateSendPrivateTx } from '../../../store/actions'

function mapStateToProps(state) {
  const ownedAccounts = accountsWithSendEtherInfoSelector(state)
  const to = getSendTo(state)
  return {
    isOwnedAccount: Boolean(
      ownedAccounts.find(
        ({ address }) => address.toLowerCase() === to.toLowerCase(),
      ),
    ),
    contact: getAddressBookEntry(state, to),
    to,
    showPrivateTx: Boolean(getBloxrouteAuthorized(state)),
    privateTx: getSendPrivateTx(state),
    privateTxTimeout: getSendPrivateTxTimeout(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showAddToAddressBookModal: (recipient) =>
      dispatch(
        actions.showModal({
          name: 'ADD_TO_ADDRESSBOOK',
          recipient,
        }),
      ),
    updateSendPrivateTx: (privateTx, privateTxTimeout) =>
      dispatch(updateSendPrivateTx(privateTx, privateTxTimeout)),
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { to, ...restStateProps } = stateProps
  return {
    ...ownProps,
    ...restStateProps,
    showAddToAddressBookModal: () =>
      dispatchProps.showAddToAddressBookModal(to),
    updateSendPrivateTx: dispatchProps.updateSendPrivateTx,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(SendContent)
