import { REDIRECT_STARTED } from '@/constants/messageTypes'

export const internalEventsMap: Record<string, string> = {
  [REDIRECT_STARTED]: '_redirect',
}
