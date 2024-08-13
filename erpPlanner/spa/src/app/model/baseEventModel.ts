export type BaseEventModelStatus = 'confirmed' | 'canceled' | 'rejected'

export interface BaseEventModel {
  status: BaseEventModelStatus
}
