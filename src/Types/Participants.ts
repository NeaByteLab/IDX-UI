export interface BrokerProfile {
  code: string
  name: string
  license?: string
  address?: string
}

export interface ParticipantProfile {
  code: string
  name: string
  license?: string
  type?: string
}

export interface PrimaryDealerProfile {
  code: string
  name: string
  license?: string
}
