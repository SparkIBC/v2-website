import useSparkClient from '../client/useSparkClient'

export default function useContract() {
  const { client } = useSparkClient()
  return {
    queryClient: client?.fundingClient,
  }
}
