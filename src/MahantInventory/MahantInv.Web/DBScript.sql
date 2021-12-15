--
-- File generated with SQLiteStudio v3.3.3 on Sat Dec 11 15:22:53 2021
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: __EFMigrationsHistory
DROP TABLE IF EXISTS __EFMigrationsHistory;

CREATE TABLE __EFMigrationsHistory (
    MigrationId    VARCHAR (150) NOT NULL,
    ProductVersion VARCHAR (32)  NOT NULL,
    TRIAL721       CHAR (1),
    CONSTRAINT PK___EFMigrationsHistory PRIMARY KEY (
        MigrationId
    )
);


-- Table: Addresses
DROP TABLE IF EXISTS Addresses;

CREATE TABLE Addresses (
    Id       INTEGER    CONSTRAINT PK_Addresses_Id PRIMARY KEY ASC AUTOINCREMENT,
    Line1    TEXT (255) NOT NULL,
    Line2    TEXT (255),
    Taluk    TEXT (128),
    District TEXT (128),
    State    TEXT (128),
    Country  TEXT (128) 
);


-- Table: AspNetRoleClaims
DROP TABLE IF EXISTS AspNetRoleClaims;

CREATE TABLE AspNetRoleClaims (
    Id         INTEGER       NOT NULL,
    RoleId     VARCHAR (450) NOT NULL,
    ClaimType  TEXT,
    ClaimValue TEXT,
    CONSTRAINT PK_AspNetRoleClaims PRIMARY KEY (
        Id
    ),
    CONSTRAINT FK_AspNetRoleClaims_AspNetRoles_RoleId FOREIGN KEY (
        RoleId
    )
    REFERENCES AspNetRoles (Id) ON UPDATE NO ACTION
                                ON DELETE CASCADE
);


-- Table: AspNetRoles
DROP TABLE IF EXISTS AspNetRoles;

CREATE TABLE AspNetRoles (
    Id               VARCHAR (450) NOT NULL,
    Name             VARCHAR (256),
    NormalizedName   VARCHAR (256),
    ConcurrencyStamp TEXT,
    CONSTRAINT PK_AspNetRoles PRIMARY KEY (
        Id
    )
);


-- Table: AspNetUserClaims
DROP TABLE IF EXISTS AspNetUserClaims;

CREATE TABLE AspNetUserClaims (
    Id         INTEGER       NOT NULL,
    UserId     VARCHAR (450) NOT NULL,
    ClaimType  TEXT,
    ClaimValue TEXT,
    CONSTRAINT FK_AspNetUserClaims_AspNetUsers_UserId FOREIGN KEY (
        UserId
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE CASCADE,
    CONSTRAINT PK_AspNetUserClaims PRIMARY KEY (
        Id
    )
);


-- Table: AspNetUserLogins
DROP TABLE IF EXISTS AspNetUserLogins;

CREATE TABLE AspNetUserLogins (
    LoginProvider       VARCHAR (450) NOT NULL,
    ProviderKey         VARCHAR (450) NOT NULL,
    ProviderDisplayName TEXT,
    UserId              VARCHAR (450) NOT NULL,
    CONSTRAINT FK_AspNetUserLogins_AspNetUsers_UserId FOREIGN KEY (
        UserId
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE CASCADE,
    CONSTRAINT PK_AspNetUserLogins PRIMARY KEY (
        LoginProvider,
        ProviderKey
    )
);


-- Table: AspNetUserRoles
DROP TABLE IF EXISTS AspNetUserRoles;

CREATE TABLE AspNetUserRoles (
    UserId VARCHAR (450) NOT NULL,
    RoleId VARCHAR (450) NOT NULL,
    CONSTRAINT PK_AspNetUserRoles PRIMARY KEY (
        UserId,
        RoleId
    ),
    CONSTRAINT FK_AspNetUserRoles_AspNetRoles_RoleId FOREIGN KEY (
        RoleId
    )
    REFERENCES AspNetRoles (Id) ON UPDATE NO ACTION
                                ON DELETE CASCADE,
    CONSTRAINT FK_AspNetUserRoles_AspNetUsers_UserId FOREIGN KEY (
        UserId
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE CASCADE
);


-- Table: AspNetUsers
DROP TABLE IF EXISTS AspNetUsers;

CREATE TABLE AspNetUsers (
    Id                   VARCHAR (450) NOT NULL,
    UserName             VARCHAR (256),
    NormalizedUserName   VARCHAR (256),
    Email                VARCHAR (256),
    NormalizedEmail      VARCHAR (256),
    EmailConfirmed       BOOL          NOT NULL,
    PasswordHash         TEXT,
    SecurityStamp        TEXT,
    ConcurrencyStamp     TEXT,
    PhoneNumber          TEXT,
    PhoneNumberConfirmed BOOL          NOT NULL,
    TwoFactorEnabled     BOOL          NOT NULL,
    LockoutEnd           TIMESTAMP,
    LockoutEnabled       BOOL          NOT NULL,
    AccessFailedCount    INTEGER       NOT NULL,
    CONSTRAINT PK_AspNetUsers PRIMARY KEY (
        Id
    )
);

INSERT INTO AspNetUsers (
                            Id,
                            UserName,
                            NormalizedUserName,
                            Email,
                            NormalizedEmail,
                            EmailConfirmed,
                            PasswordHash,
                            SecurityStamp,
                            ConcurrencyStamp,
                            PhoneNumber,
                            PhoneNumberConfirmed,
                            TwoFactorEnabled,
                            LockoutEnd,
                            LockoutEnabled,
                            AccessFailedCount
                        )
                        VALUES (
                            '70643108-09df-449d-aa16-14437b3c990b',
                            'system',
                            'SYSTEM',
                            'system@mi.com',
                            'system@mi.com',
                            0,
                            'AQAAAAEAACcQAAAAECVTjeOiQf2c9CxG3k3mFFR2rw5oVW9B2Mh0jtvg41+9mwxrbaWgWQrNzCvhrMbWkw==',
                            '6Y4OGMER2NU26ZYZG7FQSEY6EE7ADDT6',
                            '65c7e7ce-7ca9-41c9-a385-9b9d7ce76ccc',
                            NULL,
                            0,
                            0,
                            NULL,
                            1,
                            0
                        );


-- Table: AspNetUserTokens
DROP TABLE IF EXISTS AspNetUserTokens;

CREATE TABLE AspNetUserTokens (
    UserId        VARCHAR (450) NOT NULL,
    LoginProvider VARCHAR (450) NOT NULL,
    Name          VARCHAR (450) NOT NULL,
    Value         TEXT,
    CONSTRAINT FK_AspNetUserTokens_AspNetUsers_UserId FOREIGN KEY (
        UserId
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE CASCADE,
    CONSTRAINT PK_AspNetUserTokens PRIMARY KEY (
        UserId,
        LoginProvider,
        Name
    )
);


-- Table: Orders
DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders (
    Id               INTEGER         NOT NULL,
    ProductId        INTEGER         NOT NULL,
    Quantity         NUMERIC (10, 2) NOT NULL,
    ReceivedQuantity NUMERIC (10, 2),
    RefNo            VARCHAR (50)    NOT NULL,
    StatusId         VARCHAR (50)    NOT NULL,
    PaymentTypeId    VARCHAR (20)    NOT NULL,
    PayerId          INTEGER         NOT NULL,
    PaidAmount       NUMERIC (10, 2),
    OrderDate        DATE            NOT NULL,
    ReceivedDate     DATE,
    Remark           TEXT (900),
    LastModifiedById VARCHAR (450)   NOT NULL,
    ModifiedAt       DATETIME        NOT NULL,
    CONSTRAINT FK_Orders_PaymentTypeId FOREIGN KEY (
        PaymentTypeId
    )
    REFERENCES PaymentTypes (Id) ON UPDATE NO ACTION
                                 ON DELETE NO ACTION,
    CONSTRAINT FK_Orders_ProductId FOREIGN KEY (
        ProductId
    )
    REFERENCES Products (Id) ON UPDATE NO ACTION
                             ON DELETE NO ACTION,
    CONSTRAINT FK_Orders_StatusId FOREIGN KEY (
        StatusId
    )
    REFERENCES OrderStatusTypes (Id) ON UPDATE NO ACTION
                                     ON DELETE NO ACTION,
    CONSTRAINT FK_Orders_PayerId FOREIGN KEY (
        PayerId
    )
    REFERENCES Payers (Id) ON UPDATE NO ACTION
                           ON DELETE NO ACTION,
    CONSTRAINT FK_Orders_LastModifiedById FOREIGN KEY (
        LastModifiedById
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE NO ACTION,
    CONSTRAINT PK_Orders_Id PRIMARY KEY (
        Id
    )
);


-- Table: OrderStatusTypes
DROP TABLE IF EXISTS OrderStatusTypes;

CREATE TABLE OrderStatusTypes (
    Id    VARCHAR (50)  NOT NULL,
    Title VARCHAR (128) NOT NULL,
    CONSTRAINT PK_OrderStatusTypes_Id PRIMARY KEY (
        Id
    )
);

INSERT INTO OrderStatusTypes (
                                 Id,
                                 Title
                             )
                             VALUES (
                                 'Ordered',
                                 'Ordered'
                             );

INSERT INTO OrderStatusTypes (
                                 Id,
                                 Title
                             )
                             VALUES (
                                 'Received',
                                 'Received'
                             );

INSERT INTO OrderStatusTypes (
                                 Id,
                                 Title
                             )
                             VALUES (
                                 'Cancelled',
                                 'Cancelled'
                             );


-- Table: Payers
DROP TABLE IF EXISTS Payers;

CREATE TABLE Payers (
    Id               INTEGER       NOT NULL,
    Name             VARCHAR (256) NOT NULL,
    PrimaryContact   VARCHAR (15)  NOT NULL,
    SecondaryContact VARCHAR (15),
    AddressId        INTEGER       CONSTRAINT FK_Payers_Addresses_AddressId REFERENCES Addresses (Id),
    LastModifiedById VARCHAR (450) NOT NULL,
    ModifiedAt       DATETIME      NOT NULL,
    CONSTRAINT FK_Payers_LastModifiedById FOREIGN KEY (
        LastModifiedById
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE NO ACTION,
    CONSTRAINT PK_Payers_Id PRIMARY KEY (
        Id
    )
);


-- Table: PaymentTypes
DROP TABLE IF EXISTS PaymentTypes;

CREATE TABLE PaymentTypes (
    Id    VARCHAR (20)  NOT NULL,
    Title VARCHAR (256),
    CONSTRAINT PK_PaymentTypes_Id PRIMARY KEY (
        Id
    )
);


-- Table: ProductInventory
DROP TABLE IF EXISTS ProductInventory;

CREATE TABLE ProductInventory (
    Id               INTEGER         NOT NULL,
    ProductId        INTEGER         NOT NULL,
    Quantity         NUMERIC (10, 2) NOT NULL,
    RefNo            VARCHAR (50)    NOT NULL,
    LastModifiedById VARCHAR (450)   NOT NULL,
    ModifiedAt       DATETIME        NOT NULL,
    CONSTRAINT PK_ProductInventory_Id PRIMARY KEY (
        Id
    ),
    CONSTRAINT FK_ProductInventory_ProductId FOREIGN KEY (
        ProductId
    )
    REFERENCES Products (Id) ON UPDATE NO ACTION
                             ON DELETE NO ACTION,
    CONSTRAINT FK_ProductInventory_LastModifiedById FOREIGN KEY (
        LastModifiedById
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE NO ACTION
);


-- Table: Products
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
    Id               INTEGER         NOT NULL,
    Name             VARCHAR (255)   NOT NULL,
    Size             INTEGER,
    Description      VARCHAR (900),
    UnitTypeCode     VARCHAR (12)    NOT NULL,
    ReorderLevel     NUMERIC (10, 2) NOT NULL,
    IsDisposable     BOOL            NOT NULL,
    Company          VARCHAR (256),
    StorageId        INTEGER,
    Enabled          BOOL            NOT NULL,
    LastModifiedById VARCHAR (450)   NOT NULL,
    ModifiedAt       DATETIME        NOT NULL,
    CONSTRAINT FK_Products_UnitTypeId FOREIGN KEY (
        UnitTypeCode
    )
    REFERENCES UnitTypes (Code) ON UPDATE NO ACTION
                                ON DELETE NO ACTION,
    CONSTRAINT FK_Products_StorageId FOREIGN KEY (
        StorageId
    )
    REFERENCES Storages (Id) ON UPDATE NO ACTION
                             ON DELETE NO ACTION,
    CONSTRAINT FK_Products_LastModifiedById FOREIGN KEY (
        LastModifiedById
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE NO ACTION,
    CONSTRAINT PK_Products_Id PRIMARY KEY (
        Id
    )
);


-- Table: ProductUsages
DROP TABLE IF EXISTS ProductUsages;

CREATE TABLE ProductUsages (
    Id               INTEGER         NOT NULL,
    ProductId        INTEGER         NOT NULL,
    Quantity         NUMERIC (10, 2) NOT NULL,
    RefNo            VARCHAR (50)    NOT NULL,
    LastModifiedById VARCHAR (450)   NOT NULL,
    ModifiedAt       DATETIME        NOT NULL,
    CONSTRAINT FK_ProductUsages_LastModifiedById FOREIGN KEY (
        LastModifiedById
    )
    REFERENCES AspNetUsers (Id) ON UPDATE NO ACTION
                                ON DELETE NO ACTION,
    CONSTRAINT PK_ProductUsages_Id PRIMARY KEY (
        Id
    ),
    CONSTRAINT FK_ProductUsages_ProductId FOREIGN KEY (
        ProductId
    )
    REFERENCES Products (Id) ON UPDATE NO ACTION
                             ON DELETE NO ACTION
);


-- Table: Storages
DROP TABLE IF EXISTS Storages;

CREATE TABLE Storages (
    Id      INTEGER       NOT NULL,
    Name    VARCHAR (128) NOT NULL,
    Enabled BOOL          NOT NULL,
    CONSTRAINT PK_Storages_Id PRIMARY KEY (
        Id
    )
);


-- Table: UnitTypes
DROP TABLE IF EXISTS UnitTypes;

CREATE TABLE UnitTypes (
    Code VARCHAR (12)  NOT NULL,
    Name VARCHAR (128) NOT NULL,
    CONSTRAINT PK_UnitTypes_Code PRIMARY KEY (
        Code
    )
);


-- Index: CUK_Name_UnitTypeCode
DROP INDEX IF EXISTS CUK_Name_UnitTypeCode;

CREATE UNIQUE INDEX CUK_Name_UnitTypeCode ON Products (
    "Name",
    "Size",
    "UnitTypeCode"
);


-- Index: EmailIndex
DROP INDEX IF EXISTS EmailIndex;

CREATE INDEX EmailIndex ON AspNetUsers (
    "NormalizedEmail"
);


-- Index: IX_AspNetRoleClaims_RoleId
DROP INDEX IF EXISTS IX_AspNetRoleClaims_RoleId;

CREATE INDEX IX_AspNetRoleClaims_RoleId ON AspNetRoleClaims (
    "RoleId"
);


-- Index: IX_AspNetUserClaims_UserId
DROP INDEX IF EXISTS IX_AspNetUserClaims_UserId;

CREATE INDEX IX_AspNetUserClaims_UserId ON AspNetUserClaims (
    "UserId"
);


-- Index: IX_AspNetUserLogins_UserId
DROP INDEX IF EXISTS IX_AspNetUserLogins_UserId;

CREATE INDEX IX_AspNetUserLogins_UserId ON AspNetUserLogins (
    "UserId"
);


-- Index: IX_AspNetUserRoles_RoleId
DROP INDEX IF EXISTS IX_AspNetUserRoles_RoleId;

CREATE INDEX IX_AspNetUserRoles_RoleId ON AspNetUserRoles (
    "RoleId"
);


-- Index: RoleNameIndex
DROP INDEX IF EXISTS RoleNameIndex;

CREATE UNIQUE INDEX RoleNameIndex ON AspNetRoles (
    "NormalizedName"
);


-- Index: UNQ_PrimaryContact
DROP INDEX IF EXISTS UNQ_PrimaryContact;

CREATE UNIQUE INDEX UNQ_PrimaryContact ON Payers (
    "PrimaryContact"
);


-- Index: UserNameIndex
DROP INDEX IF EXISTS UserNameIndex;

CREATE UNIQUE INDEX UserNameIndex ON AspNetUsers (
    "NormalizedUserName"
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;