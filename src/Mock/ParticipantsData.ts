import type {
  BrokerProfile,
  ParticipantProfile,
  PrimaryDealerProfile
} from '@app/Types/Participants.ts'

export const mockBrokers: BrokerProfile[] = [
  { code: '001', name: 'Securities Broker A', license: 'KEP-001/PM/2020', address: 'Jakarta' },
  { code: '002', name: 'Securities Broker B', license: 'KEP-002/PM/2020', address: 'Jakarta' },
  { code: '003', name: 'Securities Broker C', license: 'KEP-003/PM/2021', address: 'Surabaya' }
]

export const mockParticipants: ParticipantProfile[] = [
  { code: 'P001', name: 'Participant A', license: 'KEP-P001', type: 'Broker' },
  { code: 'P002', name: 'Participant B', license: 'KEP-P002', type: 'Custodian' }
]

export const mockPrimaryDealers: PrimaryDealerProfile[] = [
  { code: 'PD001', name: 'Primary Dealer A', license: 'KEP-PD001' },
  { code: 'PD002', name: 'Primary Dealer B', license: 'KEP-PD002' }
]
