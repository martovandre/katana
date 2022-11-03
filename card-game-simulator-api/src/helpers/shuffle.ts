import {Card} from '../models/card.model';

export async function shuffle(array: Card[]) {
  let currentIndex = array.length,
    randomIndex;
  // While there are remaining elements to shuffle.
  while (currentIndex !== 0) {
    // Pick an element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // swap index
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
