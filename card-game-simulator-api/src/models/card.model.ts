import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: 'db', table: 'card'},
  },
})
export class Card extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'value',
      dataType: 'VARCHAR',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  value: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'code',
      dataType: 'VARCHAR',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  code: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'deckId',
      dataType: 'VARCHAR',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  deckId: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'isDrawn',
      dataType: 'boolean',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  isDrawn: boolean;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'suit',
      dataType: 'VARCHAR',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  suit: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'order',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  order: number;

  constructor(data?: Partial<Card>) {
    super(data);
  }
}

export interface CardRelations {
  // describe navigational properties here
}

export type CardWithRelations = Card & CardRelations;
