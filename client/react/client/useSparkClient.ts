import { useContext } from 'react'
import SparkClientContext from './SparkClient'

export default function useSparkClient() {
  const client = useContext(SparkClientContext)
  return client
}
