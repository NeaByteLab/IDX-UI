import * as API from '@app/API/index.ts'
import * as Data from '@app/Hooks/API/Data/index.ts'
import type * as Types from '@app/Types/index.ts'

export function useDelistings(params: Types.DelistingsParams | null) {
  return Data.useDataList(API.dataDelistingPath(), params)
}
