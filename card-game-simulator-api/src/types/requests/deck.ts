import {Card} from '../../models';

export interface DeckRequest {
  deckId?: string;
  type?: string;
  deckShuffled?: boolean;
  cardRemaining?: number;
  Cards: Card[];
}
