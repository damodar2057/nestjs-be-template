// src/database/seeders/demo.seeder.ts


import { DemoEntity } from 'src/modules/demo/entities/demo.entity';
import { DataSource } from 'typeorm';

export async function seedDemos(dataSource: DataSource) {
  const demoRepository = dataSource.getRepository(DemoEntity);
  const demos = [
    'Demo',
    'Demo1',
    'Demo2',
    'Demo3',
    'Demo4',
    'Demo5',
  ];

  for (const demo of demos) {
    const existingCounter = await demoRepository.findOne({ where: { name: demo } });
    if (!existingCounter) {
      await demoRepository.save({ name: demo });
    }
  }
}
