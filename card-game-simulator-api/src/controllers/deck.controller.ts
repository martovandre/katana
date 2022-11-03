import {inject, intercept, Interceptor} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {randomUUID} from 'crypto';
import {generateCards} from '../helpers/createDeck';
import {asyncForEach, parallelForEach} from '../helpers/forEachHelper';
import {shuffle} from '../helpers/shuffle';
import {isUuid} from '../helpers/uuid';
import {Card, Deck} from '../models';
import {CardRepository, DeckRepository} from '../repositories';
import {DeckRequest} from '../types/requests/deck';

const validateDeck: Interceptor = async (invocationCtx, next) => {
  if (
    invocationCtx.methodName === 'openDeck' &&
    !isUuidValid(invocationCtx.args[0])
  )
    throw new HttpErrors.InternalServerError('Invalid deck id');
  else if (invocationCtx.methodName === 'drawCards')
    if (!isUuidValid(invocationCtx.args[0]) && !invocationCtx.args[1])
      throw new HttpErrors.InternalServerError(
        'Invalid deck id and card count',
      );
    else if (!isUuidValid(invocationCtx.args[0]) && invocationCtx.args[1])
      throw new HttpErrors.InternalServerError('Invalid deck id');
    else if (isUuidValid(invocationCtx.args[0]) && !invocationCtx.args[1])
      throw new HttpErrors.InternalServerError('Invalid card count');

  const result = await next();
  return result;
};

const isUuidValid = (uuid: string) => {
  return uuid && isUuid(uuid);
};

export class DeckController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(DeckRepository) protected deckRepository: DeckRepository,
    @repository(CardRepository) protected cardRepository: CardRepository,
  ) {}

  @post('/decks')
  async createDeck(@requestBody() deckRequest: DeckRequest): Promise<Deck> {
    const deckData: object = {
      deckShuffled: !!deckRequest?.deckShuffled,
      type: deckRequest?.type ?? 'full',
      cardRemaining: deckRequest?.cardRemaining ?? 52,
    };

    const newDeck = await this.deckRepository.create(deckData);
    const generatedCards = await generateCards(newDeck?.id ?? randomUUID());
    await this.saveCards(generatedCards);
    return newDeck;
  }

  @intercept(validateDeck)
  @get('/decks/{id}/open')
  async openDeck(
    @param.path.string('id') id: typeof Deck.prototype.id,
  ): Promise<Object> {
    const deckExists = await this.deckRepository.findById(id);
    if (!deckExists)
      throw new HttpErrors.InternalServerError(
        `Deck with id: ${id} doesn't exist`,
      );
    const deck = await this.deckRepository.find({
      where: {id: id},
      include: [
        {
          relation: 'cards',
          scope: {
            where: {isDrawn: false},
          },
        },
      ],
    });
    return deck;
  }

  @intercept(validateDeck)
  @get('/decks/{id}/draw-cards/{count}')
  async drawCards(
    @param.path.string('id') id: typeof Deck.prototype.id,
    @param.path.number('count') count: number,
  ): Promise<Object> {
    const deckExists = await this.deckRepository.exists(id);
    if (!deckExists)
      throw new HttpErrors.InternalServerError(
        `Deck with id: ${id} doesn't exist`,
      );

    const cards: Card[] = await this.cardRepository.find({
      where: {deckId: id, isDrawn: false},
      order: ['order ASC'],
      limit: count,
    });

    // restrict this request to only return remaining - less data transferred
    const deck: Deck = await this.deckRepository.findById(id);

    await parallelForEach(cards, async (card: Card) => {
      await this.cardRepository.updateById(card.id, {isDrawn: true});
    });

    await this.deckRepository.updateById(id, {
      cardRemaining: deck.cardRemaining - count,
    });

    return {
      cards: cards.map(card => {
        return {value: card.value, suit: card.suit, code: card.value};
      }),
    };
  }

  private async saveCards(cards: object[]) {
    return asyncForEach(cards, async (card: object) => {
      await this.cardRepository.create(card);
    });
  }

  @intercept(validateDeck)
  @get('/decks/{id}/shuffle')
  async shuffleDeck(
    @param.path.string('id') id: typeof Deck.prototype.id,
  ): Promise<Object> {
    const deckCards: Card[] = await this.cardRepository.find({
      where: {deckId: id},
      order: ['id ASC'],
    });
    const shuffledCards: Card[] = await shuffle(deckCards);
    await asyncForEach(shuffledCards, async (card: Card, index: number) => {
      await this.cardRepository.updateById(card.id, {order: index + 1});
    });
    return shuffledCards;
  }
}
