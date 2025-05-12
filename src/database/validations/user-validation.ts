
/**
 * @methods for database trigger creation so that we cannot create more than one
 *  record in user table where role is equal to admin
 */

// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { dataSource } from '../data-source';
// @Injectable()
// export class UserValidationDbService implements OnModuleInit {
//   constructor(private connection: dataSource) {}

//   async onModuleInit() {
//     try {
//       await this.connection.query(`
//         DROP TRIGGER IF EXISTS before_user_insert;
//         DROP TRIGGER IF EXISTS before_user_update;

//         DELIMITER //

//         CREATE TRIGGER before_user_insert
//         BEFORE INSERT ON User
//         FOR EACH ROW
//         BEGIN
//             IF NEW.role = 'admin' THEN
//                 IF (SELECT COUNT(*) FROM User WHERE role = 'admin') >= 1 THEN
//                     SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only one admin is allowed';
//                 END IF;
//             END IF;
//         END;
//         //

//         CREATE TRIGGER before_user_update
//         BEFORE UPDATE ON User
//         FOR EACH ROW
//         BEGIN
//             IF NEW.role = 'admin' AND OLD.role != 'admin' THEN
//                 IF (SELECT COUNT(*) FROM User WHERE role = 'admin') >= 1 THEN
//                     SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only one admin is allowed';
//                 END IF;
//             END IF;
//         END;
//         //

//         DELIMITER ;
//       `);
//       console.log('Admin count check triggers created successfully');
//     } catch (error) {
//       console.error('Failed to create admin count check triggers:', error);
//     }
//   }
// }