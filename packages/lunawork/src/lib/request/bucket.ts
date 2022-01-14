import { URL } from 'url'
import type { RequestInit, Response } from 'node-fetch'
import fetch from 'node-fetch'

function parseBoolean(
  bool: string | number | boolean | undefined | null,
): boolean {
  if (bool === null) {
    return false
  }

  switch (bool) {
    case false:
    case 'false':
    case 'False':
    case 0:
    case '0':
      return false
    case true:
    case 'true':
    case 'True':
    case 1:
    case '1':
    default:
      return true
  }
}

function parseRateLimit(json: Record<string, unknown>): {
  global: boolean
  retryAfter: number
} {
  return {
    global: Boolean(json?.global) ?? false,
    retryAfter: Number(json?.retryAfter) || 0,
  }
}

export class Bucket {
  private checkGlobalRateLimit: () => unknown
  private setGlobalRateLimit: (timestamp: number) => unknown
  private queue: Promise<void>
  private resetAfter: number
  private identifier: string | null

  public constructor(
    globalRateLimit: () => unknown,
    setGlobalRateLimit: (timestamp: number) => unknown,
  ) {
    this.checkGlobalRateLimit = globalRateLimit
    this.setGlobalRateLimit = setGlobalRateLimit
    this.queue = Promise.resolve()
    this.resetAfter = -1
    this.identifier = null
  }

  private async checkRateLimit() {
    await this.checkGlobalRateLimit()

    if (this.resetAfter > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.resetAfter = 0
          resolve(true)
        }, this.resetAfter)
      })
    }

    return Promise.resolve()
  }

  public setResetAfter(remaining: number, resetAfter: number, global = false) {
    if (remaining <= 0 && resetAfter > 0) {
      if (global) {
        this.setGlobalRateLimit(resetAfter)
      } else {
        this.resetAfter = resetAfter
      }
    }
  }

  // private retry(callback, times = 3) {}

  public async request(url: URL, options: RequestInit): Promise<Response> {
    return this.queue.then(async () => {
      await this.checkRateLimit()

      // execute request
      try {
        const response = await fetch(url, options)

        if (response.headers != null) {
          const id = response.headers.get('x-ratelimit-bucket')

          const remaining = parseInt(
            response.headers.get('x-ratelimit-remaining') ?? '1',
            10,
          )
          const resetAfter =
            1000 *
            parseFloat(response.headers.get('x-ratelimit-reset-after') ?? '0')
          const isGlobal = parseBoolean(
            response.headers.get('x-ratelimit-global'),
          )

          // Validate our bucket assigment is correct
          if (this.identifier == null) {
            this.identifier = id
          }

          if (this.identifier !== id) {
            console.warn(
              `[BUCKET ERROR]: The url ${url.toString()} has an incorrect bucket assigment.`,
            )
          }

          // Assign reset variables
          this.setResetAfter(remaining, resetAfter, isGlobal)
        }

        if (!response.ok) {
          // Special handling for rate limits
          if (response.status === 429) {
            const json = parseRateLimit(
              (await response.json()) as Record<string, unknown>,
            )
            this.setResetAfter(-1, 1000 * json.retryAfter, json.global)
          } else {
            switch (response.status) {
              case 500:
              default:
                console.warn(
                  `[BUCKET ERROR]: The url [${
                    options?.method ?? 'GET'
                  }] ${url.toString()} returned a status code ${
                    response.status
                  }\n\n${await response.text()}`,
                )
            }
          }
        }

        return response
      } catch (error: unknown) {
        console.error(error)
        throw error
      }
    })
  }
}
