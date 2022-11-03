import {Card} from '../models';

export async function generateCards(
  deckId: string,
  full?: boolean,
): Promise<Card[]> {
  const suits = ['SPADES', 'CLUBS', 'DIAMONDS', 'HEARTS'];
  const partialRanks = ['7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];
  const fullRanks = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'JACK',
    'QUEEN',
    'KING',
    'ACE',
  ];

  const cards: Card[] = [];
  let index = 1;
  const ranks = full ? fullRanks : partialRanks;
  for (const s in suits) {
    for (const r in ranks) {
      const value = ranks[r];
      const suit = suits[s];
      const code = value.charAt(0) + suit.charAt(0);
      cards.push({
        value,
        suit,
        deckId,
        code,
        order: index++,
        isDrawn: false,
      } as Card);
    }
  }

  return cards;
}
