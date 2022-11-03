import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, Request, RestBindings} from '@loopback/rest';
import {Deck} from '../models';
import {CardRepository, DeckRepository} from '../repositories';

export class CardController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(DeckRepository) protected deckRepository: DeckRepository,
    @repository(CardRepository) protected cardRepository: CardRepository,
  ) {}

  @get('/cards/{deckId}')
  async shuffleDeck(
    @param.path.string('deckId') id: typeof Deck.prototype.id,
  ): Promise<Object> {
    return this.cardRepository.find({where: {deckId: id}});
  }
}
