// //
// Note health check should be placed in dedicated module as it will raise scalability issue

// import { Injectable } from '@nestjs/common';
// import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { MyEntity } from 'src/modules/my-module/entities/my.entity';

// @Injectable()
// export class HealthCheckService {
//   constructor(
//     private health: HealthCheckService,
//     private http: HttpHealthIndicator,
//     private db: TypeOrmHealthIndicator,
//   ) {}

//   @HealthCheck()
//   async checkHealth() {
//     return this.health.check([
//       () => this.http.pingCheck('example', 'https://example.com'),
//       () => this.db.pingCheck('database'),
//     ]);
//   }
// }
