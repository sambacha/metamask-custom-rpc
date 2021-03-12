import ethAbi from 'ethereumjs-abi'
import { TOKEN_TRANSFER_FUNCTION_SIGNATURE } from '../send.constants'
import { addHexPrefix } from '../../../../../app/scripts/lib/util'
import { addHexPrefixToObjectValues } from '../../../helpers/utils/util'

export function constructTxParams({
  sendToken,
  data,
  to,
  amount,
  from,
  gas,
  gasPrice,
  privateTx,
  privateTxTimeout,
}) {
  let txParams = {
    data,
    from,
    value: '0',
    gas,
    gasPrice,
    privateTx,
  }

  if (!sendToken) {
    txParams.value = amount
    txParams.to = to
  }

  txParams = addHexPrefixToObjectValues(txParams)
  // skip adding hex prefix to timeout
  txParams.privateTxTimeout = privateTxTimeout
  return txParams
}

export function constructUpdatedTx({
  amount,
  data,
  editingTransactionId,
  from,
  gas,
  gasPrice,
  sendToken,
  to,
  unapprovedTxs,
  privateTx,
  privateTxTimeout,
}) {
  const unapprovedTx = unapprovedTxs[editingTransactionId]
  const txParamsData = unapprovedTx.txParams.data
    ? unapprovedTx.txParams.data
    : data

  const editingTx = {
    ...unapprovedTx,
    txParams: Object.assign(unapprovedTx.txParams, {
      privateTx,
      privateTxTimeout,
      ...addHexPrefixToObjectValues({
        data: txParamsData,
        to,
        from,
        gas,
        gasPrice,
        value: amount,
      }),
    }),
  }

  if (sendToken) {
    Object.assign(
      editingTx.txParams,
      addHexPrefixToObjectValues({
        value: '0',
        to: sendToken.address,
        data:
          TOKEN_TRANSFER_FUNCTION_SIGNATURE +
          Array.prototype.map
            .call(
              ethAbi.rawEncode(
                ['address', 'uint256'],
                [to, addHexPrefix(amount)],
              ),
              (x) => `00${x.toString(16)}`.slice(-2),
            )
            .join(''),
      }),
    )
  }

  if (typeof editingTx.txParams.data === 'undefined') {
    delete editingTx.txParams.data
  }

  return editingTx
}

export function addressIsNew(toAccounts, newAddress) {
  const newAddressNormalized = newAddress.toLowerCase()
  const foundMatching = toAccounts.some(
    ({ address }) => address.toLowerCase() === newAddressNormalized,
  )
  return !foundMatching
}
