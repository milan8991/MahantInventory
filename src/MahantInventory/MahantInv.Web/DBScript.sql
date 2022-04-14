--
-- File generated with SQLiteStudio v3.3.3 on Thu Apr 14 16:22:32 2022
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
                            'SYSTEM@MI.COM',
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


-- Table: Buyers
DROP TABLE IF EXISTS Buyers;

CREATE TABLE Buyers (
    Id      INTEGER       CONSTRAINT PK_Buyers_Id PRIMARY KEY ASC AUTOINCREMENT
                          NOT NULL,
    Name    VARCHAR (255) NOT NULL,
    Contact VARCHAR (15) 
);


-- Table: Notifications
DROP TABLE IF EXISTS Notifications;

CREATE TABLE Notifications (
    Id         INTEGER    CONSTRAINT PK_Notifications_Id PRIMARY KEY ASC AUTOINCREMENT
                          NOT NULL,
    Title      TEXT (100) NOT NULL,
    Message    TEXT (900) NOT NULL,
    Status     TEXT (10)  NOT NULL,
    ModifiedAt DATETIME   NOT NULL,
    CreatedAt  DATETIME   NOT NULL
);


-- Table: Orders
DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders (
    Id               INTEGER         NOT NULL,
    ProductId        INTEGER         NOT NULL,
    Quantity         NUMERIC (10, 2) NOT NULL,
    RefNo            VARCHAR (50)    NOT NULL,
    StatusId         VARCHAR (50)    NOT NULL,
    SellerId         INTEGER         CONSTRAINT FK_Orders_SellerId_Parties_Id REFERENCES Parties (Id),
    OrderDate        DATE            NOT NULL,
    PricePerItem     NUMERIC (10, 2),
    Discount         NUMERIC (7, 2),
    Tax              NUMERIC (7, 2),
    DiscountAmount   NUMERIC (10, 2),
    NetAmount        NUMERIC (10, 2),
    Remark           TEXT (900),
    LastModifiedById VARCHAR (450)   NOT NULL,
    ModifiedAt       DATETIME        NOT NULL,
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


-- Table: OrderTransactions
DROP TABLE IF EXISTS OrderTransactions;

CREATE TABLE OrderTransactions (
    Id            INTEGER         CONSTRAINT PK_OrderTransactions_Id PRIMARY KEY ASC AUTOINCREMENT
                                  NOT NULL,
    OrderId       INTEGER         CONSTRAINT FK_OrderTransactions_OrderId_Orders_Id REFERENCES Orders (Id) 
                                  NOT NULL,
    PartyId       INTEGER         CONSTRAINT FK_OrderTransactions_PartyId_Parties_Id REFERENCES Parties (Id) 
                                  NOT NULL,
    PaymentTypeId VARCHAR (20)    CONSTRAINT FK_OrderTransactions_PaymentTypeId_PaymentTypes_Id REFERENCES PaymentTypes (Id) 
                                  NOT NULL,
    Amount        NUMERIC (10, 2) NOT NULL,
    PaymentDate   DATE
);


-- Table: Parties
DROP TABLE IF EXISTS Parties;

CREATE TABLE Parties (
    Id               INTEGER       NOT NULL,
    Name             VARCHAR (256) NOT NULL,
    CategoryId       INTEGER       NOT NULL
                                   CONSTRAINT FK_Parties_CategoryId_PartyCategories_Id REFERENCES PartyCategories (Id),
    PrimaryContact   VARCHAR (15),
    SecondaryContact VARCHAR (15),
    Line1            TEXT (255),
    Line2            TEXT (255),
    Taluk            TEXT (255),
    District         TEXT (128),
    State            TEXT (128),
    Country          TEXT (128),
    Type             VARCHAR (7)   NOT NULL,
    LastModifiedById VARCHAR (450) NOT NULL,
    ModifiedAt       DATETIME      NOT NULL,
    CONSTRAINT FK_Parties_LastModifiedById FOREIGN KEY (
        LastModifiedById
    )
    REFERENCES AspNetUsers (Id) ON DELETE NO ACTION
                                ON UPDATE NO ACTION,
    CONSTRAINT PK_Partiers_Id PRIMARY KEY (
        Id
    )
);


-- Table: PartyCategories
DROP TABLE IF EXISTS PartyCategories;

CREATE TABLE PartyCategories (
    Id   INTEGER      CONSTRAINT PK_PartyCategories_Id PRIMARY KEY ASC AUTOINCREMENT
                      NOT NULL,
    Name VARCHAR (50) NOT NULL
                      CONSTRAINT UNQ_PartyCategories_Name UNIQUE
);

INSERT INTO PartyCategories (
                                Id,
                                Name
                            )
                            VALUES (
                                1,
                                'Mandir'
                            );

INSERT INTO PartyCategories (
                                Id,
                                Name
                            )
                            VALUES (
                                2,
                                'Merchant'
                            );

INSERT INTO PartyCategories (
                                Id,
                                Name
                            )
                            VALUES (
                                3,
                                'HariBhakt'
                            );

INSERT INTO PartyCategories (
                                Id,
                                Name
                            )
                            VALUES (
                                4,
                                'Trust'
                            );

INSERT INTO PartyCategories (
                                Id,
                                Name
                            )
                            VALUES (
                                5,
                                'Saint'
                            );

INSERT INTO PartyCategories (
                                Id,
                                Name
                            )
                            VALUES (
                                6,
                                'Unknown'
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

INSERT INTO PaymentTypes (
                             Id,
                             Title
                         )
                         VALUES (
                             'Seva',
                             'Seva'
                         );

INSERT INTO PaymentTypes (
                             Id,
                             Title
                         )
                         VALUES (
                             'Cash',
                             'Cash'
                         );

INSERT INTO PaymentTypes (
                             Id,
                             Title
                         )
                         VALUES (
                             'Check',
                             'Check'
                         );

INSERT INTO PaymentTypes (
                             Id,
                             Title
                         )
                         VALUES (
                             'Online',
                             'Online'
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


-- Table: ProductInventoryHistory
DROP TABLE IF EXISTS ProductInventoryHistory;

CREATE TABLE ProductInventoryHistory (
    Id               INTEGER         NOT NULL,
    ProductId        INTEGER         NOT NULL,
    Quantity         NUMERIC (10, 2) NOT NULL,
    RefNo            VARCHAR (50)    NOT NULL,
    LastModifiedById VARCHAR (450)   NOT NULL,
    ModifiedAt       DATETIME        NOT NULL,
    CONSTRAINT PK_ProductInventoryHistory_Id PRIMARY KEY (
        Id
    ),
    CONSTRAINT FK_ProductInventoryHistory_ProductId FOREIGN KEY (
        ProductId
    )
    REFERENCES Products (Id) ON DELETE NO ACTION
                             ON UPDATE NO ACTION,
    CONSTRAINT FK_ProductInventoryHistory_LastModifiedById FOREIGN KEY (
        LastModifiedById
    )
    REFERENCES AspNetUsers (Id) ON DELETE NO ACTION
                                ON UPDATE NO ACTION
);


-- Table: Products
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
    Id               INTEGER         NOT NULL,
    Name             VARCHAR (255)   NOT NULL,
    Size             NUMERIC (10, 2),
    Description      VARCHAR (900),
    UnitTypeCode     VARCHAR (12),
    ReorderLevel     NUMERIC (10, 2) NOT NULL,
    IsDisposable     BOOL            NOT NULL,
    Company          VARCHAR (256),
    Enabled          BOOL            NOT NULL,
    LastModifiedById VARCHAR (450)   NOT NULL,
    ModifiedAt       DATETIME        NOT NULL,
    CONSTRAINT FK_Products_UnitTypeId FOREIGN KEY (
        UnitTypeCode
    )
    REFERENCES UnitTypes (Code) ON UPDATE NO ACTION
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


-- Table: ProductStorages
DROP TABLE IF EXISTS ProductStorages;

CREATE TABLE ProductStorages (
    ProductId INTEGER CONSTRAINT FK_ProductStorages_ProductId REFERENCES Products (Id) 
                      NOT NULL,
    StorageId INTEGER CONSTRAINT FK_ProductStorages_StorageId REFERENCES Storages (Id) 
                      NOT NULL
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
    Buyer            VARCHAR (255),
    UsageDate        DATE,
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

INSERT INTO UnitTypes (
                          Code,
                          Name
                      )
                      VALUES (
                          'kgs',
                          'Kilograms'
                      );

INSERT INTO UnitTypes (
                          Code,
                          Name
                      )
                      VALUES (
                          'gms',
                          'Grams'
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


-- Index: UserNameIndex
DROP INDEX IF EXISTS UserNameIndex;

CREATE UNIQUE INDEX UserNameIndex ON AspNetUsers (
    "NormalizedUserName"
);


-- View: vOrders
DROP VIEW IF EXISTS vOrders;
CREATE VIEW vOrders AS
WITH ords AS (
        SELECT o.Id,
               o.ProductId,
               CAST (o.Quantity AS REAL) AS Quantity,
               o.RefNo,
               o.StatusId,
               o.SellerId,
               o.OrderDate,
               CAST (o.PricePerItem AS REAL) AS PricePerItem,
               CAST (o.Discount AS REAL) AS Discount,
               CAST (o.Tax AS REAL) AS Tax,
               CAST (o.DiscountAmount AS REAL) AS DiscountAmount,
               CAST (o.NetAmount AS REAL) AS NetAmount,
               o.Remark,
               o.LastModifiedById,
               o.ModifiedAt,
               p.Name AS ProductName,
               p.Company,
               ost.Title AS Status,
               u.UserName AS LastModifiedBy,
               pi.Quantity AS CurrentStock,
               p.ReorderLevel,
               s.Name AS Seller
          FROM Orders o
               INNER JOIN
               Products p ON o.ProductId = p.Id
               INNER JOIN
               OrderStatusTypes ost ON o.StatusId = ost.Id
               INNER JOIN
               AspNetUsers u ON o.LastModifiedById = u.Id
               LEFT OUTER JOIN
               ProductInventory pi ON p.Id = pi.ProductId
               LEFT OUTER JOIN
               Parties s ON o.SellerId = s.Id
    ),
    trans AS (
        SELECT OrderId,
               CAST (CAST (sum(Amount) AS DECIMAL (10, 2) ) AS REAL) PaidAmount
          FROM OrderTransactions
         GROUP BY OrderId
    )
    SELECT o.*,
           t.PaidAmount
      FROM ords o
           LEFT OUTER JOIN
           trans t ON o.Id = t.OrderId;


-- View: vOrderTransactions
DROP VIEW IF EXISTS vOrderTransactions;
CREATE VIEW vOrderTransactions AS
    SELECT ot.Id,
           ot.OrderId,
           ot.PartyId,
           ot.PaymentTypeId,
           CAST (ot.Amount AS REAL) AS Amount,
           p.Name AS Party,
           pt.Title AS PaymentType,
           ot.PaymentDate
      FROM OrderTransactions ot
           INNER JOIN
           Parties p ON ot.PartyId = p.Id
           INNER JOIN
           PaymentTypes pt ON ot.PaymentTypeId = pt.Id;


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
