// demo.subscriber.ts

import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { Injectable, Scope } from '@nestjs/common';
import { DemoEntity } from 'src/modules/demo/entities/demo.entity';

@Injectable()
@EventSubscriber()
export class DemoSubscriber implements EntitySubscriberInterface<DemoEntity> {
  constructor(private datasource: DataSource) {
    this.datasource.subscribers.push(this);
  }

  listenTo() {
    return DemoEntity;
  }

  async beforeInsert(event: InsertEvent<DemoEntity>) {
    // await this.checkAdminConstraint(event.entity, event.manager);
  }

  async beforeUpdate(event: UpdateEvent<DemoEntity>) {
    if (event.entity) {
      // await this.checkAdminConstraint(event.entity as UserEntity, event.manager);
    }
  }
// before remove block it cause we don't want to do it
  async beforeRemove(event: RemoveEvent<DemoEntity>): Promise<any> {
    return
  }

}
