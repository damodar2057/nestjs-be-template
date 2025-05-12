//

import { Permissions } from "./permission.constants";
import { UserGroups } from "./user-groups.enum";


export const PermissionMapping = {
    [UserGroups.SUPER_ADMIN]: Permissions.COUPON_CREATE | Permissions.COUPON_READ_ALL | Permissions.COUPON_DELETE | Permissions.COUPON_UPDATE | Permissions.COUPON_READ | Permissions.UPLOAD_DOCUMENT |  Permissions.USER_CREATE | Permissions.USER_DELETE | Permissions.READ_CONSTANTS | 
    Permissions.PARKING_BOOKING_READ_ALL | Permissions.PARTNER_UPDATE,  // combines  permissions
    [UserGroups.ADMIN]: Permissions.UPLOAD_DOCUMENT | Permissions.WATCHMAN_CREATE  | Permissions.PARTNER_UPDATE |  Permissions.READ_CONSTANTS |  Permissions.WATCHMAN_DELETE | Permissions.WATCHMAN_READ | Permissions.WATCHMAN_UPDATE | Permissions.PARKING_PROPERTY_CREATE,
    [UserGroups.WATCHMAN]:  Permissions.UPLOAD_DOCUMENT | Permissions.READ_CONSTANTS  | Permissions.PARTNER_UPDATE | Permissions.WATCHMAN_GET_ASSOCIATED_PARKING_BOOKINGS  | Permissions.WATCHMAN_UPDATE_ASSOCIATED_PARKING_BOOKINGS,
    [UserGroups.CUSTOMER]: Permissions.COUPON_READ_BY_CODE |  Permissions.UPLOAD_DOCUMENT | Permissions.READ_CONSTANTS  | Permissions.PARTNER_UPDATE | Permissions.PARKING_BOOKING_CREATE | Permissions.CUSTOMER_GET_ALL_PARKING_BOOKINGS | Permissions.PARKING_BOOKING_UPDATE | Permissions.CUSTOMER_UPDATE_PARKING_BOOKINGS
        | Permissions.PARTNER_READ,
}

