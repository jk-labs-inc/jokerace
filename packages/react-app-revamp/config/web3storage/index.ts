import { Web3Storage } from 'web3.storage'
const WEB3STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN as string

export function getAccessToken() {
  return WEB3STORAGE_TOKEN
}

export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() })
}