// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import config from '../../nav.config'
import http from '../utils/http'
import { encode } from 'js-base64'
import { getToken } from '../utils/user'

const { gitRepoUrl } = config

let authorName = ''
let branchName = ''
const token = getToken()

try {
  const { pathname } = new URL(gitRepoUrl)  
  const p = pathname.split('/')
  authorName = p[1]
  branchName = p[2]
} catch {}

// 获取文件信息
export function getFileContent(path: string, authToken?: string) {
  return http.get(`/repos/${authorName}/${branchName}/contents/${path}`, {
    headers: {
      Authorization: `token ${authToken ? authToken : token}`
    }
  })
}

// 更新文件内容
type Iupdate = {
  message: string
  content: string
  path: string
}
export async function updateFileContent(
  { message, content, path }: Iupdate,
  authToken?: string
) {
  const fileInfo = await getFileContent(path, authToken)

  return http.put(`/repos/${authorName}/${branchName}/contents/${path}`, {
    message: `rebot: ${message}`,
    content: encode(content),
    sha: fileInfo.data.sha
  }, {
    headers: {
      Authorization: `token ${authToken ? authToken : token}`
    }
  })
}
