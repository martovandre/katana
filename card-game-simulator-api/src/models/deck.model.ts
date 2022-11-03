import {Entity, hasMany, model, property} from '@loopback/repository';
import {Card} from './card.model';

@model({
  settings: {
    postgresql: {schema: 'db', table: 'deck'},
  },
})
export class Deck extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    postgresql: {
      columnName: 'id',
      dataType: 'uuid',
      nullable: 'NO',
    },
  })
  id?: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'deckShuffled',
      dataType: 'boolean',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  deckShuffled: boolean;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'type',
      dataType: 'VARCHAR',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  type: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'cardRemaining',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  cardRemaining: number;

  @hasMany(() => Card, {name: 'cards', keyFrom: 'id', keyTo: 'deckId'})
  cards: Card[];

  constructor(data?: Partial<Deck>) {
    super(data);
  }
}

export interface DeckRelations {}

export type DeckWithRelations = Deck & DeckRelations;
