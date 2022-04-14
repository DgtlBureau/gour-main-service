import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { Product } from './Product';
import { Client } from './Client';

@Entity()
export class ProductGrade extends AppEntity {
  @ManyToOne(() => Client)
  client: Client;

  @Column()
  value: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column({
    nullable: true,
  })
  isApproved: boolean;
}
