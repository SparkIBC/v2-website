import React from 'react'
import { SparkClient } from 'client/core'

const SparkClientContext = React.createContext<{
  client: SparkClient | null
}>({
  client: null,
})

export default SparkClientContext
