import * as API from '@app/API/index.ts'
import * as Data from '@app/Hooks/API/Data/index.ts'
import type * as Types from '@app/Types/index.ts'

export function useDividends(params: Types.DividendsParams | null) {
  return Data.useDataList(API.dataDividendPath(), params)
}
