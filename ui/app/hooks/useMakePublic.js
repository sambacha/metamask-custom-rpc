import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { makePublicTx } from '../store/actions'

export function useMakePublic(transactionGroup) {
  const { primaryTransaction } = transactionGroup
  const dispatch = useDispatch()
  const makePublic = useCallback(
    async (event) => {
      event.stopPropagation()
      await dispatch(makePublicTx(primaryTransaction.id))
    },
    [dispatch, primaryTransaction],
  )
  return makePublic
}
