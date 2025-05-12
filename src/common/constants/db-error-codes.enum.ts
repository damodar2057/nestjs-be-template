// src/common/constants/db-error-codes.enum.ts


export   enum POSTGRES_ERROR_CODES {
    UniqueViolation = '23505',
    ForeignKeyViolation = '23503',  // referential violation
    NotNullViolation = '23502', 
    CheckViolation = '23514',
    INVALID_TEXT_REPRESENTATION='22P02'
}