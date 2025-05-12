//

import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { IDemoRepository } from "src/modules/demo/interfaces/demo-repository.interface";


@ValidatorConstraint({ async: true}) // Marks this as an async validator
@Injectable()
export class DoesUsernameExistConstraint implements ValidatorConstraintInterface {
    constructor(
        @Inject('IDemoRepository')
         private readonly demoRepository: IDemoRepository, // Ensure DataSource is injected properly
    ){

    }
    // implement validation logic
    async validate(username: string): Promise<boolean> {
        if(!username) return true; // Allow empty username


        // const user = await this.demoRepository.findOne( {where: {username}})
        // return !user; // boolean conversion
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `Username ${validationArguments.value} already exist!!`
    }
    
}



export function DoesUsernameExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: DoesUsernameExistConstraint
        })
    }
}