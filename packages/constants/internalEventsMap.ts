import { REDIRECT_STARTED } from './messageTypes'

export const internalEventsMap: Record<string, string> = {
  [REDIRECT_STARTED]: '_redirect',
}
