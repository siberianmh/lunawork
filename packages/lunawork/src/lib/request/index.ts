import type { URL } from 'url'

import { Bucket } from './bucket'

interface IBucketClassifier {
  readonly route: string
  readonly identifier: string
}

export class Client {
  private buckets: Map<
    IBucketClassifier['route'],
    Map<IBucketClassifier['identifier'], Bucket>
  >

  public globalResetAfter: number

  public constructor() {
    this.buckets = new Map()
    this.globalResetAfter = 0
  }

  public async checkGlobalRateLimit() {
    return new Promise((resolve) => {
      if (this.globalResetAfter === 0) {
        resolve(true)
      }

      setTimeout(() => {
        this.globalResetAfter = 0
        resolve(true)
      }, this.globalResetAfter)
    })
  }

  public setGlobalReset(timestamp: number) {
    this.globalResetAfter = timestamp
  }

  private async queue(
    url: URL,
    options: RequestInit,
    bucket: IBucketClassifier,
  ) {
    if (bucket.route == null || bucket.identifier == null) {
      throw new Error('You must define a bucket oute and identifier')
    }

    let routeMap = this.buckets.get(bucket.route)

    if (routeMap == null) {
      routeMap = new Map([
        [
          bucket.identifier,
          new Bucket(this.checkGlobalRateLimit, this.setGlobalReset),
        ],
      ])
      this.buckets.set(bucket.route, routeMap)
    }

    let targetBucket = routeMap.get(bucket.identifier)

    if (targetBucket == null) {
      targetBucket = new Bucket(this.checkGlobalRateLimit, this.setGlobalReset)
      routeMap.set(bucket.identifier, targetBucket)
    }

    return targetBucket.request(url, options)
  }

  public async get(
    url: URL,
    options: RequestInit,
    bucket: IBucketClassifier,
  ): Promise<Response> {
    return this.queue(url, { method: 'GET', ...options }, bucket)
  }

  public async post(
    url: URL,
    options: RequestInit,
    bucket: IBucketClassifier,
  ): Promise<Response> {
    return this.queue(url, { method: 'POST', ...options }, bucket)
  }

  public async patch(
    url: URL,
    options: RequestInit,
    bucket: IBucketClassifier,
  ): Promise<Response> {
    return this.queue(url, { method: 'PATCH', ...options }, bucket)
  }

  public async put(
    url: URL,
    options: RequestInit,
    bucket: IBucketClassifier,
  ): Promise<Response> {
    return this.queue(url, { method: 'PUT', ...options }, bucket)
  }

  public async delete(
    url: URL,
    options: RequestInit,
    bucket: IBucketClassifier,
  ): Promise<Response> {
    return this.queue(url, { method: 'DELETE', ...options }, bucket)
  }
}
